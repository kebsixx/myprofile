"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ProjectPostMenu({
  githubUrl,
  demoUrl,
  projectAnchorId,
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const [toast, setToast] = useState(null);
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const hasGithub = Boolean(githubUrl);
  const hasDemo = Boolean(demoUrl);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(null), 1100);
    return () => clearTimeout(t);
  }, [toast]);

  const place = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const menuWidth = 192; // w-48
    const gap = 8;

    const left = clamp(
      rect.right - menuWidth,
      8,
      window.innerWidth - menuWidth - 8,
    );
    const top = clamp(rect.bottom + gap, 56, window.innerHeight - 16);

    setCoords({ left, top });
  }, []);

  const toggle = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next) {
        requestAnimationFrame(place);
      }
      return next;
    });
  }, [place]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };

    const onReflow = () => place();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [close, open, place]);

  useEffect(() => {
    if (!open) return;
    requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector("a,button");
      el?.focus?.();
    });
  }, [open]);

  const copyText = async (value, message) => {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setToast(message ?? "Copied");
      close();
    } catch {
      // Ignore; clipboard may be blocked by browser permissions.
      setToast(message ?? "Copied");
      close();
    }
  };

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label="More options"
        onClick={toggle}
        className="rounded-full bg-white/10 backdrop-blur-md p-2 transition hover:bg-white/10 hover:ring-white/15">
        <Icon icon="solar:menu-dots-bold" width="20" height="20" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-60">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={close}
          />

          <div
            className="absolute"
            style={{ left: coords.left, top: coords.top }}>
            <div
              ref={panelRef}
              className="w-48 overflow-hidden rounded-2xl bg-black/10 backdrop-blur-md"
              role="dialog"
              aria-label="Post menu">
              <div className="pointer-events-none absolute inset-0 bg-white/10" />

              <div className="relative p-1.5">
                <div className="grid gap-2">
                  <a
                    href={hasGithub ? githubUrl : undefined}
                    target={hasGithub ? "_blank" : undefined}
                    rel={hasGithub ? "noreferrer" : undefined}
                    onClick={hasGithub ? close : (e) => e.preventDefault()}
                    className={
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10 " +
                      (hasGithub ? "" : "opacity-50 cursor-not-allowed")
                    }>
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="mdi:github" width="20" height="20" />
                      Open GitHub
                    </span>
                    <Icon
                      icon="solar:arrow-right-up-linear"
                      width="20"
                      height="18"
                    />
                  </a>

                  <button
                    type="button"
                    disabled={!hasGithub}
                    onClick={() => copyText(githubUrl, "Copied repo link")}
                    className={
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10 " +
                      (!hasGithub ? "opacity-50 cursor-not-allowed" : "")
                    }>
                    <span className="inline-flex items-center gap-2">
                      <Icon icon="solar:copy-linear" width="20" height="20" />
                      Copy repo link
                    </span>
                    <Icon icon="solar:copy-linear" width="20" height="18" />
                  </button>

                  <a
                    href={hasDemo ? demoUrl : undefined}
                    target={hasDemo ? "_blank" : undefined}
                    rel={hasDemo ? "noreferrer" : undefined}
                    onClick={hasDemo ? close : (e) => e.preventDefault()}
                    className={
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10 " +
                      (hasDemo ? "" : "opacity-50 cursor-not-allowed")
                    }>
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        icon="solar:play-circle-linear"
                        width="20"
                        height="20"
                      />
                      Open Demo
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

      {toast ? (
        <div className="fixed inset-x-0 bottom-6 z-70 flex justify-center px-4">
          <div className="rounded-full bg-black/35 px-4 py-2 text-sm text-white ring-1 ring-white/10 backdrop-blur-md">
            {toast}
          </div>
        </div>
      ) : null}
    </>
  );
}
