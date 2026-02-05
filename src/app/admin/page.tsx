import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { createClient } from "../../utils/supabase/server";
import AdminClient from "./AdminClient";
import React from "react";

export default async function AdminPage() {
  const supabase = createClient(cookies());
  const { data: sessionData } = await supabase.auth.getSession();
  const session = sessionData?.session;

  console.log("User session:", session);

  if (!session) {
    // not logged in
    redirect("/");
  }

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", session.user.id)
    .single();

  if (error || !profile?.is_admin) {
    // not authorized
    redirect("/");
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {session.user.email}</p>
      <p>User ID: {session.user.id}</p>
      <AdminClient />
    </main>
  );
}
