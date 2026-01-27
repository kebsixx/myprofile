"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

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

export function AuthStubProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_AUTH_USER);
      if (!saved) return;
      setUser(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  const setAndPersist = useCallback((nextUser) => {
    setUser(nextUser);
    try {
      if (nextUser) {
        localStorage.setItem(STORAGE_KEY_AUTH_USER, JSON.stringify(nextUser));
      } else {
        localStorage.removeItem(STORAGE_KEY_AUTH_USER);
      }
    } catch {
      // ignore
    }
  }, []);

  const signInEmail = useCallback(
    (email) => {
      const next = {
        provider: "email",
        email: (email || "").trim(),
      };
      setAndPersist(next);
      return next;
    },
    [setAndPersist],
  );

  const signInGoogle = useCallback(
    (email) => {
      const next = {
        provider: "google",
        email: (email || "").trim(),
      };
      setAndPersist(next);
      return next;
    },
    [setAndPersist],
  );

  const signInGithub = useCallback(
    (username) => {
      const next = {
        provider: "github",
        username: (username || "").trim(),
      };
      setAndPersist(next);
      return next;
    },
    [setAndPersist],
  );

  const signOut = useCallback(() => {
    setAndPersist(null);
  }, [setAndPersist]);

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
