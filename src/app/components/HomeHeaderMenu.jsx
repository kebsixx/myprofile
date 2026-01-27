"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";

export default function HomeHeaderMenu({ githubUrl }) {
  const [open, setOpen] = useState(false);
  const [themeLabel, setThemeLabel] = useState("Dark mode");
  const panelRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);
  const toggle = useCallback(() => setOpen((v) => !v), []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close, open]);

  useEffect(() => {
    if (!open) return;
    // focus first interactive element for keyboard users
    requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector("a,button");
      el?.focus?.();
    });
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={toggle}
        className="bg-white/10 p-2 backdrop-blur-md rounded-full hover:bg-white/15"
        aria-label="Open menu"
        aria-expanded={open}>
        <Icon icon="solar:menu-dots-bold" width="24" height="24" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={close}
          />

          <div className="absolute right-4 top-16 mt-2 w-48">
            <div
              ref={panelRef}
              className="overflow-hidden rounded-2xl bg-black/10 backdrop-blur-md"
              role="dialog"
              aria-label="Menu">
              <div className="pointer-events-none absolute inset-0 bg-white/10" />

              <div className="relative p-1.5">
                <div className="grid gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setThemeLabel((v) =>
                        v === "Dark mode" ? "Light mode" : "Dark mode",
                      );
                      close();
                    }}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                    <Icon
                      icon={
                        themeLabel === "Dark mode"
                          ? "solar:moon-linear"
                          : "solar:sun-2-linear"
                      }
                      width="18"
                      height="18"
                    />
                    {themeLabel}
                  </button>

                  <a
                    href={githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    onClick={close}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="mdi:github" width="20" height="20" />
                      GitHub profile
                    </span>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      width="20"
                      height="18"
                    />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
