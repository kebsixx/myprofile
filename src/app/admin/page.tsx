"use client";

import React, { useEffect, useState } from "react";
import AdminClient from "./AdminClient";
import supabase from "../../utils/supabase/browserClient";
import { useAuthStub } from "../components/auth/AuthStubProvider";

export default function AdminPage() {
  const { user, isAuthed } = useAuthStub();
  const [isAdmin, setIsAdmin] = useState(null);
  const [loading, setLoading] = useState(false);
  // use shared browser client

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      if (!isAuthed || !user) {
        setIsAdmin(false);
        return;
      }
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();
        if (!mounted) return;
        if (error) {
          console.error("Admin check error:", error);
          setIsAdmin(false);
        } else {
          setIsAdmin(Boolean(data?.is_admin));
        }
      } catch (e) {
        console.error(e);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    }
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, [isAuthed, user]);

  if (!isAuthed) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p>You must be logged in to access the admin dashboard.</p>
      </main>
    );
  }

  if (loading || isAdmin === null) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Admin</h1>
        <p>Checking permissions…</p>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main style={{ padding: 24 }}>
        <h1>Not authorized</h1>
        <p>Your account is not an admin.</p>
        <p>User ID: {user?.id}</p>
      </main>
    );
  }

  return (
    <main style={{ padding: 24 }}>
      <h1>Admin Dashboard</h1>
      <p>Welcome, {user?.email}</p>
      <p>User ID: {user?.id}</p>
      <AdminClient />
    </main>
  );
}
