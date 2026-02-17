"use client";

import { useRouter } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import supabase from "../../../utils/supabase/browserClient";

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
// using shared browser Supabase client from utils

export function AuthStubProvider({ children }) {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const isInitialEventRef = useRef(true);

  // Listen ke Supabase auth state changes
  useEffect(() => {
    // Get initial session (do not auto-redirect here). We only set local user state.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const supabaseUser = session.user;

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
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const supabaseUser = session.user;

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

        // Redirect to home only when OAuth callback params are present.
        // This prevents unexpected navigation (e.g. leaving tab and coming back).
        if (event === "SIGNED_IN") {
          const hasOAuthParams =
            typeof window !== "undefined" &&
            (window.location.hash.includes("access_token") ||
              window.location.search.includes("code"));
          if (hasOAuthParams) {
            try {
              if (typeof window !== "undefined") router.replace("/");
            } catch (e) {
              /* ignore router errors */
            }
          }
        }

        // Mark initial event as handled
        if (isInitialEventRef.current) {
          isInitialEventRef.current = false;
        }
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

    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.error("Error signing out:", e);
    }
    setUser(null);
    try {
      // after sign out, send user to home to avoid exposing admin URL
      if (typeof window !== "undefined") router.replace("/");
    } catch (e) {
      /* ignore */
    }
  }, [router]);

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
