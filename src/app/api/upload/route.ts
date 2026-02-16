import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";

async function isAdmin() {
  const supabase = createServerClient(cookies());
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
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    return NextResponse.json(
      { error: "Cloudinary env vars not configured" },
      { status: 500 },
    );
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Build Cloudinary upload form
    const cloudinaryForm = new FormData();
    cloudinaryForm.append("file", file);
    cloudinaryForm.append("upload_preset", "ml_default"); // or your preset
    cloudinaryForm.append("api_key", apiKey);

    // Generate signature for signed upload
    const timestamp = Math.round(Date.now() / 1000).toString();
    cloudinaryForm.append("timestamp", timestamp);

    // Create signature
    const { createHash } = await import("node:crypto");
    const paramsToSign = `timestamp=${timestamp}&upload_preset=ml_default${apiSecret}`;
    const signature = createHash("sha1").update(paramsToSign).digest("hex");
    cloudinaryForm.append("signature", signature);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: cloudinaryForm,
      },
    );

    if (!res.ok) {
      const errText = await res.text();
      console.error("Cloudinary upload error:", errText);
      return NextResponse.json(
        { error: "Upload to Cloudinary failed", details: errText },
        { status: 500 },
      );
    }

    const result = await res.json();
    return NextResponse.json({
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (e: any) {
    console.error("Upload error:", e);
    return NextResponse.json(
      { error: e?.message || "Upload failed" },
      { status: 500 },
    );
  }
}
