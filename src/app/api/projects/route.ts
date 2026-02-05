import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient as createServerClient } from "@/utils/supabase/server";
import {
  Database,
  TablesInsert,
  TablesUpdate,
} from "@/utils/supabase/database.types";

const serverClient = (cookieStore = cookies()) =>
  createServerClient(cookieStore) as ReturnType<typeof createServerClient>;

async function isAdmin(cookieStore = cookies()) {
  const supabase = serverClient(cookieStore);
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

// GET: List all projects (public)
export async function GET() {
  const supabase = serverClient();
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
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body: TablesInsert<"projects"> = await req.json();
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(body)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// PUT: Update a project by id (admin only)
export async function PUT(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id, ...update }: TablesUpdate<"projects"> & { id: string } =
    await req.json();
  const supabase = serverClient();
  const { data, error } = await supabase
    .from("projects")
    .update(update)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json(data);
}

// DELETE: Delete a project by id (admin only)
export async function DELETE(req: NextRequest) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await req.json();
  const supabase = serverClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
  return NextResponse.json({ success: true });
}
