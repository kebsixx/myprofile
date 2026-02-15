import { NextRequest, NextResponse } from "next/server";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

export async function POST(req: NextRequest) {
  try {
    // Check if using unsigned upload (with preset) or signed upload
    const useUnsigned = Boolean(CLOUDINARY_UPLOAD_PRESET);

    if (!CLOUDINARY_CLOUD_NAME) {
      return NextResponse.json(
        { error: "Cloudinary cloud name not configured" },
        { status: 500 },
      );
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json(
        {
          error:
            "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.",
        },
        { status: 400 },
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 },
      );
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload to Cloudinary
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;

    let uploadFormData: FormData;

    // Image transformation for optimization (resize + quality)
    // Max 1200px width, auto quality, auto format (webp/avif)
    const transformation = "c_limit,w_1200,q_auto,f_auto";

    if (useUnsigned) {
      // Unsigned upload with preset (simpler setup)
      // Note: transformation is applied via URL, not upload param (not allowed in unsigned)
      uploadFormData = new FormData();
      uploadFormData.append("file", dataUri);
      uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
      uploadFormData.append("folder", "projects");
    } else {
      // Signed upload (requires API key and secret)
      if (!CLOUDINARY_API_KEY || !CLOUDINARY_API_SECRET) {
        return NextResponse.json(
          {
            error:
              "Cloudinary API credentials not configured. Set CLOUDINARY_UPLOAD_PRESET for unsigned uploads or CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET for signed uploads.",
          },
          { status: 500 },
        );
      }

      const timestamp = Math.round(Date.now() / 1000);
      const folder = "projects";

      // Create signature
      const crypto = await import("crypto");
      const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
      const signature = crypto
        .createHash("sha1")
        .update(signatureString)
        .digest("hex");

      uploadFormData = new FormData();
      uploadFormData.append("file", dataUri);
      uploadFormData.append("api_key", CLOUDINARY_API_KEY);
      uploadFormData.append("timestamp", timestamp.toString());
      uploadFormData.append("signature", signature);
      uploadFormData.append("folder", folder);
    }

    const uploadResponse = await fetch(cloudinaryUrl, {
      method: "POST",
      body: uploadFormData,
    });

    if (!uploadResponse.ok) {
      const errorData = await uploadResponse.json();
      console.error("Cloudinary upload error:", errorData);
      return NextResponse.json(
        { error: errorData.error?.message || "Upload failed" },
        { status: 500 },
      );
    }

    const result = await uploadResponse.json();

    // Apply transformation via URL (works for both signed and unsigned uploads)
    // Transform: https://res.cloudinary.com/{cloud}/image/upload/{transformation}/v{version}/{public_id}.{ext}
    const originalUrl = result.secure_url as string;
    const transformedUrl = originalUrl.replace(
      "/image/upload/",
      `/image/upload/${transformation}/`,
    );

    return NextResponse.json({
      url: transformedUrl,
      originalUrl: originalUrl,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
