"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { createClient } from "@supabase/supabase-js";

const STORAGE_KEY_AUTH_USER = "myinsta:auth:user";

function deriveHandle(user) {
  if (!user) return "";

  if (user.provider === "github") {
    return (user.username || "").trim();
  }

  const email = (user.email || "").trim();
  if (!email) return "";

  const at = email.indexOf("@");
  return (at > 0 ? email.slice(0, at) : email).trim();
}

const AuthStubContext = createContext(null);

// Inisialisasi Supabase client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

export function AuthStubProvider({ children }) {
  const [user, setUser] = useState(null);

  // Listen ke Supabase auth state changes
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supabaseUser = session.user;

        // Prioritaskan username GitHub jika ada (dari user_name atau preferred_username)
        // Bahkan jika provider tercatat sebagai Google
        const githubUsername =
          supabaseUser.user_metadata?.user_name ||
          supabaseUser.user_metadata?.preferred_username;

        const username =
          githubUsername ||
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email;

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          provider: supabaseUser.app_metadata?.provider || "email",
          username: username,
        });
      }
    });

    // Listen for auth changes (login/logout/token refresh)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const supabaseUser = session.user;

        // Prioritaskan username GitHub jika ada (dari user_name atau preferred_username)
        // Bahkan jika provider tercatat sebagai Google
        const githubUsername =
          supabaseUser.user_metadata?.user_name ||
          supabaseUser.user_metadata?.preferred_username;

        const username =
          githubUsername ||
          supabaseUser.user_metadata?.full_name ||
          supabaseUser.user_metadata?.name ||
          supabaseUser.email;

        setUser({
          id: supabaseUser.id,
          email: supabaseUser.email,
          provider: supabaseUser.app_metadata?.provider || "email",
          username: username,
        });
      } else {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  // Login dengan email (magic link)
  const signInEmail = useCallback(async (email) => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      alert(`Error: ${error.message}`);
      return null;
    }
    alert("Check your email for the login link!");
    return { provider: "email", email };
  }, []);

  // Login dengan Google
  const signInGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    });
    if (error) {
      alert(`Error: ${error.message}`);
      return null;
    }
    return { provider: "google" };
  }, []);

  // Login dengan GitHub
  const signInGithub = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "github",
      options: {
        redirectTo: `${window.location.origin}/`,
        skipBrowserRedirect: false,
      },
    });
    if (error) {
      alert(`Error: ${error.message}`);
      return null;
    }
    return { provider: "github" };
  }, []);

  const signOut = useCallback(async () => {
    const confirmed = window.confirm("Are you sure you want to log out?");
    if (!confirmed) return;

    await supabase.auth.signOut();
    setUser(null);
  }, []);

  const value = useMemo(() => {
    const handle = deriveHandle(user);
    return {
      user,
      handle,
      isAuthed: Boolean(handle),
      signInEmail,
      signInGoogle,
      signInGithub,
      signOut,
    };
  }, [user, signInEmail, signInGoogle, signInGithub, signOut]);

  return (
    <AuthStubContext.Provider value={value}>
      {children}
    </AuthStubContext.Provider>
  );
}

export function useAuthStub() {
  const ctx = useContext(AuthStubContext);
  if (!ctx) {
    throw new Error("useAuthStub must be used within <AuthStubProvider>");
  }
  return ctx;
}
