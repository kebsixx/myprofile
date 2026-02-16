import { TablesInsert, TablesUpdate } from "@/utils/supabase/database.types";
import { createClient as createServerClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

async function getSupabase() {
  return createServerClient();
}

async function isAdmin() {
  const supabase = await getSupabase();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError) {
    console.error("Auth error:", userError.message);
    return false;
  }

  if (!user) {
    console.log("No authenticated user found");
    return false;
  }

  console.log("User found:", user.id);

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .single();

  console.log("Profile check - profile:", profile, "error:", error);

  if (error) return false;
  return !!profile?.is_admin;
}

// GET: List all projects (public)
export async function GET() {
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json(data);
}

// POST: Create a new project (admin only)
export async function POST(req: NextRequest) {
  try {
    const adminCheck = await isAdmin();
    console.log("Admin check result:", adminCheck);

    if (!adminCheck) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: TablesInsert<"projects"> = await req.json();
    console.log("Creating project with body:", body);

    const supabase = await getSupabase();
    const { data, error } = await supabase
      .from("projects")
      .insert(body)
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", JSON.stringify(error));
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(data);
  } catch (err) {
    console.error("POST /api/projects error:", err);
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Internal server error" },
      { status: 500 },
    );
  }
}

// PUT: Update a project by id (admin only)
export async function PUT(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...update }: TablesUpdate<"projects"> & { id: string } =
    await req.json();
  const supabase = await getSupabase();
  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error("Supabase update error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// DELETE: Delete a project by id (admin only)
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const supabase = await getSupabase();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    console.error("Supabase delete error:", error);
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
