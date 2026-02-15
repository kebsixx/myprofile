"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Copy } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import supabase from "../../utils/supabase/browserClient";
import { useAuthStub } from "../components/auth/AuthStubProvider";

export default function DebugPage() {
  const router = useRouter();
  const { user, isAuthed } = useAuthStub();
  const [profileData, setProfileData] = useState<any>(null);
  const [profileError, setProfileError] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isAuthed && user) {
      checkProfile();
    }
  }, [isAuthed, user]);

  async function checkProfile() {
    if (!user) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        setProfileError(error);
        setProfileData(null);
      } else {
        setProfileData(data);
        setProfileError(null);
      }
    } catch (e) {
      console.error(e);
      setProfileError(e);
    } finally {
      setLoading(false);
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function getSQLCommand() {
    if (!user) return "";
    return `-- Insert or update profile with admin access
INSERT INTO profiles (id, email, is_admin, created_at)
VALUES (
  '${user.id}',
  '${user.email}',
  true,
  NOW()
)
ON CONFLICT (id) DO UPDATE SET is_admin = true;`;
  }

  if (!isAuthed || !user) {
    return (
      <div className="dark">
        <div className="min-h-screen bg-background p-4 md:p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <div>
              <h1 className="text-3xl font-bold">Debug Info</h1>
              <p className="text-muted-foreground">
                Authentication and profile diagnostics
              </p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Not Authenticated</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  You must be logged in to see debug information.
                </p>
                <Button onClick={() => router.push("/")}>Go to Home</Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dark">
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Debug Info</h1>
              <p className="text-muted-foreground">
                Authentication and profile diagnostics
              </p>
            </div>
            <Button variant="outline" onClick={() => router.push("/")}>
              Back to Home
            </Button>
          </div>

          {/* Auth Status */}
          <Card>
            <CardHeader>
              <CardTitle>Authentication Status</CardTitle>
              <CardDescription>
                Current user session information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-medium">Status:</span>
                <Badge variant={isAuthed ? "default" : "destructive"}>
                  {isAuthed ? "Authenticated" : "Not Authenticated"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Email:</span>
                <span className="text-muted-foreground font-mono text-sm">
                  {user.email}
                </span>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium">User ID:</span>
                <div className="flex items-center gap-2">
                  <span className="text-muted-foreground font-mono text-xs break-all">
                    {user.id}
                  </span>
                  <Button
                    variant="outline"
                    size="icon-xs"
                    onClick={() => copyToClipboard(user.id)}>
                    <Copy className="h-3 w-3" />
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-medium">Provider:</span>
                <span className="text-muted-foreground">
                  {user.provider || "unknown"}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Profile Data */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Profile Data</CardTitle>
                  <CardDescription>
                    Data from profiles table in Supabase
                  </CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={checkProfile}
                  disabled={loading}>
                  {loading ? "Checking..." : "Refresh"}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {loading ? (
                <p className="text-muted-foreground">Loading profile data...</p>
              ) : profileError ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Badge variant="destructive">Error</Badge>
                    <span className="text-sm text-muted-foreground">
                      {profileError.code === "PGRST116"
                        ? "Profile not found"
                        : profileError.message}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    This means you don't have a row in the profiles table yet.
                  </p>
                </div>
              ) : profileData ? (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Admin Status:</span>
                    <Badge
                      variant={profileData.is_admin ? "default" : "outline"}>
                      {profileData.is_admin ? "✓ Admin" : "✗ Not Admin"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Full Name:</span>
                    <span className="text-muted-foreground">
                      {profileData.full_name || <em>Not set</em>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Role:</span>
                    <span className="text-muted-foreground">
                      {profileData.role || <em>Not set</em>}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Created:</span>
                    <span className="text-muted-foreground text-sm">
                      {profileData.created_at
                        ? new Date(profileData.created_at).toLocaleString()
                        : "Unknown"}
                    </span>
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>

          {/* Setup Instructions */}
          {(!profileData || !profileData.is_admin) && (
            <Card>
              <CardHeader>
                <CardTitle>Setup Admin Access</CardTitle>
                <CardDescription>
                  Follow these steps to grant admin access to this account
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    Step 1: Open Supabase SQL Editor
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Go to your{" "}
                    <a
                      href="https://supabase.com/dashboard"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary underline">
                      Supabase Dashboard
                    </a>{" "}
                    → Select your project → Open SQL Editor
                  </p>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Step 2: Run this SQL</h3>
                  <div className="relative">
                    <pre className="bg-muted p-4 rounded-lg text-xs overflow-x-auto">
                      <code>{getSQLCommand()}</code>
                    </pre>
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => copyToClipboard(getSQLCommand())}>
                      {copied ? "Copied!" : "Copy SQL"}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <h3 className="font-semibold">Step 3: Refresh this page</h3>
                  <p className="text-sm text-muted-foreground">
                    After running the SQL, click the "Refresh" button above to
                    verify admin access.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Admin Access */}
          {profileData?.is_admin && (
            <Card className="border-green-500/50 bg-green-500/5">
              <CardHeader>
                <CardTitle className="text-green-600">
                  ✓ Admin Access Granted
                </CardTitle>
                <CardDescription>You have admin privileges</CardDescription>
              </CardHeader>
              <CardContent>
                <Button onClick={() => router.push("/admin")}>
                  Go to Admin Dashboard
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
