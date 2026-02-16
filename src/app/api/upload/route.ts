import { NextRequest, NextResponse } from "next/server";
import { createClient as createServerClient } from "@/utils/supabase/server";

const CLOUDINARY_CLOUD_NAME = process.env.CLOUDINARY_CLOUD_NAME;
const CLOUDINARY_API_KEY = process.env.CLOUDINARY_API_KEY;
const CLOUDINARY_API_SECRET = process.env.CLOUDINARY_API_SECRET;
const CLOUDINARY_UPLOAD_PRESET = process.env.CLOUDINARY_UPLOAD_PRESET;

async function isAdmin() {
  try {
    const supabase = await createServerClient();
    const { data: sessionData } = await supabase.auth.getSession();
    const session = sessionData?.session;
    if (!session) return false;
    const { data: profile, error } = await supabase
      .from("profiles")
      .select("is_admin")
      .eq("id", session.user.id)
      .single();
    if (error) return false;
    return !!profile?.is_admin;
  } catch (e) {
    return false;
  }
}

export async function POST(req: NextRequest) {
  // Only admins may upload
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!CLOUDINARY_CLOUD_NAME) {
    return NextResponse.json(
      { error: "Cloudinary cloud name not configured" },
      { status: 500 },
    );
  }

  try {
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

    // Convert file to base64 data URI
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64 = buffer.toString("base64");
    const dataUri = `data:${file.type};base64,${base64}`;

    // Upload URL and transformation
    const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
    const transformation = "c_limit,w_1200,q_auto,f_auto";

    const useUnsigned = Boolean(CLOUDINARY_UPLOAD_PRESET);
    let uploadFormData = new FormData();

    if (useUnsigned) {
      uploadFormData.append("file", dataUri);
      uploadFormData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET!);
      uploadFormData.append("folder", "projects");
    } else {
      // Signed upload
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

      const crypto = await import("crypto");
      const signatureString = `folder=${folder}&timestamp=${timestamp}${CLOUDINARY_API_SECRET}`;
      const signature = crypto
        .createHash("sha1")
        .update(signatureString)
        .digest("hex");

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
      const errorData = await uploadResponse.text();
      console.error("Cloudinary upload error:", errorData);
      return NextResponse.json(
        { error: "Upload failed", details: errorData },
        { status: 500 },
      );
    }

    const result = await uploadResponse.json();
    const originalUrl = result.secure_url as string;
    const transformedUrl = originalUrl.replace(
      "/image/upload/",
      `/image/upload/${transformation}/`,
    );

    return NextResponse.json({
      url: transformedUrl,
      originalUrl,
      public_id: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
