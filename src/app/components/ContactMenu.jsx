"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

export default function ContactMenu({
  variant = "text",
  label = "Messages",
  iconClassName = "",
  buttonClassName = "",
  wrapperClassName = "",
}) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState({ left: 0, top: 0 });
  const buttonRef = useRef(null);
  const panelRef = useRef(null);

  const close = useCallback(() => setOpen(false), []);

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

  // Buka menu saat klik
  const openMenu = useCallback(() => {
    setOpen(true);
    requestAnimationFrame(place);
  }, [place]);
  const closeMenu = useCallback(() => setOpen(false), []);

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

  return (
    <>
      <div className={"relative " + wrapperClassName}>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              ref={buttonRef}
              type="button"
              aria-label="Contact options"
              onClick={openMenu}
              className={
                (variant === "icon"
                  ? "rounded-full bg-white/10 backdrop-blur-md p-2 transition hover:bg-white/10 hover:ring-white/15 "
                  : "rounded-lg bg-gray-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800 ") +
                buttonClassName
              }>
              {variant === "icon" ? (
                <Icon
                  icon="solar:chat-round-line-linear"
                  width="22"
                  height="22"
                  className={iconClassName}
                />
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold">
                  {iconClassName ? (
                    <Icon
                      icon="solar:chat-round-line-linear"
                      width="20"
                      height="20"
                      className={iconClassName}
                    />
                  ) : null}
                  {label}
                </span>
              )}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" align="center">
            Contact Me
          </TooltipContent>
        </Tooltip>
        {open ? (
          <div className="fixed inset-0 z-60">
            <button
              type="button"
              className="absolute inset-0"
              aria-label="Close contact menu"
              onClick={close}
            />
            <div
              className="absolute"
              style={{ left: coords.left, top: coords.top }}>
              <div
                ref={panelRef}
                className="w-48 overflow-hidden rounded-2xl bg-black/10 backdrop-blur-md"
                role="dialog"
                aria-label="Contact menu">
                <div className="pointer-events-none absolute inset-0 bg-white/10" />
                <div className="relative p-1.5">
                  <div className="grid gap-2">
                    <Link
                      href="https://t.me/surekind"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                      <Icon icon="lineicons:telegram" width="20" height="20" />{" "}
                      Telegram
                    </Link>
                    <a
                      href="mailto:surekind@protonmail.com"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                      <Icon icon="ic:outline-email" width="20" height="20" />{" "}
                      Email
                    </a>
                    <a
                      href="https://wa.me/6285175280571"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-white hover:bg-white/10">
                      <Icon
                        icon="ic:baseline-whatsapp"
                        width="20"
                        height="20"
                      />{" "}
                      WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
}
