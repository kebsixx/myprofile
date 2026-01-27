"use client";

import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import { useAuthStub } from "./AuthStubProvider";

export default function AuthStubInline({ onAuthed }) {
  const { signInEmail, signInGoogle, signInGithub } = useAuthStub();

  const [email, setEmail] = useState("");
  const [githubUsername, setGithubUsername] = useState("");

  const doEmail = useCallback(
    (e) => {
      e.preventDefault();
      const next = signInEmail(email);
      onAuthed?.(next);
    },
    [email, onAuthed, signInEmail],
  );

  const doGoogle = useCallback(
    (e) => {
      e.preventDefault();
      const next = signInGoogle(email);
      onAuthed?.(next);
    },
    [email, onAuthed, signInGoogle],
  );

  const doGithub = useCallback(() => {
    const username = (githubUsername || "").trim();
    const picked =
      username || (window.prompt("GitHub username:", "") || "").trim();

    if (!picked) return;
    setGithubUsername(picked);
    const next = signInGithub(picked);
    onAuthed?.(next);
  }, [githubUsername, onAuthed, signInGithub]);

  return (
    <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-white/10">
      <p className="text-sm font-semibold text-white">Sign in (UI stub)</p>
      <p className="mt-1 text-xs text-white/45">
        Untuk sekarang ini cuma UI. Nanti bisa diganti ke NextAuth/Auth.js.
      </p>

      <div className="mt-3 grid gap-3">
        <div>
          <label className="text-xs text-white/50">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            className="mt-1 w-full rounded-xl bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/25"
          />
        </div>

        <div className="grid gap-2">
          <form onSubmit={doEmail}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-white/15">
              <Icon icon="solar:letter-linear" width="18" height="18" />
              Continue with Email
            </button>
          </form>

          <p className="text-center text-xs text-white/40">or continue with</p>

          <div className="grid grid-cols-2 gap-2">
            <form onSubmit={doGoogle}>
              <button
                type="submit"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-white/15">
                <Icon icon="logos:google-icon" width="18" height="18" />
                Google
              </button>
            </form>

            <button
              type="button"
              onClick={doGithub}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/80 px-3 py-2 text-xs font-semibold text-white ring-1 ring-white/10 hover:bg-indigo-500">
              <Icon icon="mdi:github" width="18" height="18" />
              GitHub
            </button>
          </div>

          <p className="text-[11px] text-white/40">
            GitHub akan minta username (stub).
          </p>
        </div>
      </div>
    </div>
  );
}
