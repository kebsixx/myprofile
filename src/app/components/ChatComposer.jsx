"use client";

import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";

export default function ChatComposer({
  onSend,
  placeholder = "Type a message...",
  position = "fixed", // fixed | sticky | none
  maxWidthClassName = "max-w-283.75",
  inputClassName = "",
  wrapClassName = "",
  disabled = false,
  onDisabledAttempt,
}) {
  const [text, setText] = useState("");

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      const trimmed = text.trim();
      if (!trimmed) return;

      onSend?.(trimmed);
      setText("");
    },
    [onSend, text],
  );

  const positionClassName =
    position === "fixed"
      ? "shrink-0 fixed inset-x-0 bottom-0 z-50"
      : position === "sticky"
        ? "shrink-0 sticky bottom-0 z-10"
        : "shrink-0";

  const paddingClassName =
    position === "fixed"
      ? "pb-[calc(env(safe-area-inset-bottom)+12px)]"
      : "pb-3";

  return (
    <div className={`${positionClassName} ${wrapClassName}`.trim()}>
      <div className="relative">
        <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 from-20% via-black/40 via-55% to-black/0" />
        <div className="pointer-events-none absolute inset-0 backdrop-blur-xl fade-to-t" />

        <div
          className={`relative z-10 mx-auto w-full ${maxWidthClassName} px-4 pt-3 ${paddingClassName}`.trim()}>
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <input
              type="text"
              value={text}
              onChange={disabled ? undefined : (e) => setText(e.target.value)}
              placeholder={placeholder}
              readOnly={disabled}
              onFocus={disabled ? onDisabledAttempt : undefined}
              onClick={disabled ? onDisabledAttempt : undefined}
              className={
                "flex-1 rounded-full bg-white/10 backdrop-blur-xs px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/30 " +
                inputClassName
              }
            />
            <button
              type="submit"
              onClick={disabled ? onDisabledAttempt : undefined}
              disabled={disabled}
              className="rounded-full bg-indigo-500/90 p-2.5 font-semibold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-indigo-500"
              aria-label="Send">
              <Icon icon="solar:plain-3-linear" width="24" height="24" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
