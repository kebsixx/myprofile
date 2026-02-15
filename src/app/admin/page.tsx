"use client";

import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase/browserClient";
import { useAuthStub } from "../components/auth/AuthStubProvider";
import AdminClient from "./AdminClient";

export default function AdminPage() {
  const router = useRouter();
  const { user, isAuthed } = useAuthStub();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    async function checkAdmin() {
      // If not authenticated, set as not admin (will show unauthorized page)
      if (!isAuthed || !user) {
        if (mounted) {
          setIsAdmin(false);
          setLoading(false);
        }
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
        console.error("Exception during admin check:", e);
        setIsAdmin(false);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    checkAdmin();
    return () => {
      mounted = false;
    };
  }, [isAuthed, user]);

  // Loading state
  if (loading || isAdmin === null) {
    return (
      <div className="dark">
        <div className="flex min-h-screen items-center justify-center bg-background">
          <div className="text-center space-y-4">
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">Checking permissions...</p>
          </div>
        </div>
      </div>
    );
  }

  // Not admin - show unauthorized page
  if (!isAdmin) {
    return (
      <div className="dark">
        <div className="flex min-h-screen items-center justify-center p-4 bg-background">
          <div className="text-center space-y-6 max-w-md">
            <div className="space-y-2">
              <h1 className="text-4xl font-bold">
                {!isAuthed || !user ? "401" : "403"}
              </h1>
              <h2 className="text-2xl font-semibold">
                {!isAuthed || !user
                  ? "Authentication Required"
                  : "Access Denied"}
              </h2>
              <p className="text-muted-foreground">
                {!isAuthed || !user
                  ? "You must be logged in to access this page."
                  : "You don't have permission to access this page. Admin privileges are required."}
              </p>
              {user && (
                <p className="text-xs text-muted-foreground mt-2">
                  Logged in as: {user.email}
                </p>
              )}
            </div>
            <Button onClick={() => router.push("/")} size="lg">
              Go to Home
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // Admin user - show dashboard
  return (
    <div className="dark">
      <div className="min-h-screen bg-background">
        <div className="border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h1 className="text-3xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">
                  Welcome back, {user?.email}
                </p>
              </div>
              <Button variant="outline" onClick={() => router.push("/")}>
                Back to Home
              </Button>
            </div>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          <AdminClient />
        </div>
      </div>
    </div>
  );
}
