"use client";

import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";
import { useAuthStub } from "./AuthStubProvider";

export default function AuthStubInline({ onAuthed }) {
  const { signInEmail, signInGoogle, signInGithub } = useAuthStub();

  const [email, setEmail] = useState("");

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
      const next = signInGoogle();
      onAuthed?.(next);
    },
    [onAuthed, signInGoogle],
  );

  const doGithub = useCallback(() => {
    const next = signInGithub();
    onAuthed?.(next);
  }, [onAuthed, signInGithub]);

  return (
    <div className="rounded-2xl p-6 max-w-md mx-auto">
      <div className="grid gap-5">
        <form onSubmit={doEmail} className="grid gap-2">
          <label className="text-xs text-white/50" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="name@email.com"
            className="w-full rounded-xl bg-white/10 px-4 py-2 text-sm text-white placeholder-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/25"
          />
          <button
            type="submit"
            className="mt-2 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15">
            <Icon icon="solar:letter-linear" width="18" height="18" />
            Continue with Email
          </button>
        </form>

        <div className="flex items-center gap-2 my-2">
          <div className="flex-1 h-px bg-white/15" />
          <span className="text-xs text-white/40">or</span>
          <div className="flex-1 h-px bg-white/15" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <form onSubmit={doGoogle}>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15">
              <Icon icon="logos:google-icon" width="18" height="18" />
              Google
            </button>
          </form>
          <button
            type="button"
            onClick={doGithub}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-500/80 px-3 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-indigo-500">
            <Icon icon="mdi:github" width="18" height="18" />
            GitHub
          </button>
        </div>
      </div>
    </div>
  );
}
