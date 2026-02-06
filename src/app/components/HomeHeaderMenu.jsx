"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import AuthStubInline from "./auth/AuthStubInline";
import { useAuthStub } from "./auth/AuthStubProvider";

export default function HomeHeaderMenu({ githubUrl }) {
  const { handle, isAuthed, signOut } = useAuthStub();
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const nickname = (handle || "").trim();
  const [open, setOpen] = useState(false);
  const [themeLabel, setThemeLabel] = useState("Dark mode");
  const panelRef = useRef(null);
  const buttonRef = useRef(null);
  const [menuCoords, setMenuCoords] = useState({ left: 0, top: 0 });
  const cvUrl = "/cv.pdf";

  const close = useCallback(() => setOpen(false), []);
  const placeMenu = useCallback(() => {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = 192;
    const left = Math.round(rect.right - menuWidth);
    const top = Math.round(rect.bottom + 8);
    setMenuCoords({ left: Math.max(left, 8), top });
  }, []);

  const toggle = useCallback(() => {
    setOpen((v) => {
      const next = !v;
      if (next) {
        requestAnimationFrame(placeMenu);
      }
      return next;
    });
  }, [placeMenu]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e) => {
      if (e.key === "Escape") close();
    };
    const onReflow = () => placeMenu();

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("resize", onReflow);
    window.addEventListener("scroll", onReflow, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("resize", onReflow);
      window.removeEventListener("scroll", onReflow, true);
    };
  }, [close, open, placeMenu]);

  useEffect(() => {
    if (!open) return;

    requestAnimationFrame(() => {
      const el = panelRef.current?.querySelector("a,button");
      el?.focus?.();
    });
  }, [open]);

  return (
    <>
      <div className="flex items-center gap-2">
        {/* Login/Signout icon (leftmost) */}
        {isAuthed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={signOut}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                aria-label="Sign out">
                <Icon icon="solar:logout-2-linear" width="20" height="20" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Sign out
            </TooltipContent>
          </Tooltip>
        ) : (
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={() => setIsAuthOpen(true)}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                aria-label="Sign in">
                <Icon icon="solar:login-2-linear" width="20" height="20" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="bottom" align="center">
              Sign in to chat
            </TooltipContent>
          </Tooltip>
        )}

        {/* Main menu button (right of login icon) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              ref={buttonRef}
              type="button"
              onClick={toggle}
              className="bg-white/10 p-2 backdrop-blur-md rounded-full hover:bg-white/15"
              aria-label="Open menu"
              aria-expanded={open}>
              <Icon icon="solar:menu-dots-bold" width="24" height="24" />
            </Button>
          </TooltipTrigger>
          <TooltipContent side="bottom" align="center">
            Open menu
          </TooltipContent>
        </Tooltip>
      </div>
      {isAuthOpen ? (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center">
            <div className="w-full md:max-w-md rounded-3xl bg-black/50 backdrop-blur-xl overflow-hidden">
              <div className="grid grid-cols-3 items-center px-3 pt-6">
                <p className="col-start-2 items-center text-lg text-center font-semibold text-white">
                  Sign in
                </p>
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-white/15 justify-self-end"
                  aria-label="Close">
                  <Icon icon="mingcute:close-fill" width="18" height="18" />
                </button>
              </div>
              <div className="px-4 pb-4">
                <AuthStubInline onAuthed={() => setIsAuthOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
      {open ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="Close menu"
            onClick={close}
          />

          <div
            className="fixed z-50 w-48"
            style={{ left: menuCoords.left, top: menuCoords.top }}>
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

                  <a
                    href={cvUrl}
                    download
                    onClick={close}
                    className="flex w-full items-center justify-between rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                    <span className="inline-flex items-center gap-2">
                      <Icon
                        icon="solar:document-linear"
                        width="20"
                        height="20"
                      />
                      Download CV
                    </span>
                    <Icon icon="solar:download-linear" width="20" height="18" />
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
