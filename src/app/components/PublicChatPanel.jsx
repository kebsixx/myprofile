"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ChatComposer from "./ChatComposer";
import AuthStubInline from "./auth/AuthStubInline";
import { useAuthStub } from "./auth/AuthStubProvider";

const STORAGE_KEY_MESSAGES = "myinsta:publicChat:messages";

function formatTime(ts) {
  try {
    return new Date(ts).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

export default function PublicChatPanel({
  heightClassName = "h-[70dvh] md:h-[520px]",
}) {
  const { handle, isAuthed, signOut } = useAuthStub();

  const [messages, setMessages] = useState([]);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const scrollRef = useRef(null);

  const nickname = (handle || "").trim();
  const canChat = isAuthed && nickname.length > 0;

  const scrollToBottom = useCallback(() => {
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY_MESSAGES);
      if (saved) setMessages(JSON.parse(saved));
    } catch {
      // ignore
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY_MESSAGES, JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  const sendMessage = useCallback(
    (text) => {
      if (!canChat) return;
      const name = nickname;
      if (!name) return;

      const newMessage = {
        id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
        name,
        text,
        ts: Date.now(),
      };

      setMessages((prev) => [...prev, newMessage]);
      scrollToBottom();
    },
    [canChat, nickname, scrollToBottom],
  );

  const clearChat = useCallback(() => {
    const ok = window.confirm("Clear chat history?");
    if (!ok) return;

    setMessages([]);
    try {
      localStorage.removeItem(STORAGE_KEY_MESSAGES);
    } catch {
      // ignore
    }
  }, []);

  const requestAuth = useCallback(() => {
    setIsAuthOpen(true);
  }, []);

  const handleAuthed = useCallback(() => {
    setIsAuthOpen(false);
    scrollToBottom();
  }, [scrollToBottom]);

  const renderedMessages = useMemo(() => {
    return messages.map((m) => {
      const mine = nickname && m.name === nickname;

      return (
        <div
          key={m.id}
          className={
            mine ? "flex w-full justify-end" : "flex w-full justify-start"
          }>
          <div
            className={
              mine
                ? "max-w-[85%] rounded-2xl rounded-br-md bg-zinc-800/80 ring-1 ring-white/10 px-3 py-2"
                : "max-w-[85%] rounded-2xl rounded-bl-md bg-zinc-800/60 ring-1 ring-white/10 px-3 py-2"
            }>
            <div className="flex items-baseline justify-between gap-3">
              <p className="text-xs font-semibold text-white/90">{m.name}</p>
              <p className="text-[10px] text-white/40">{formatTime(m.ts)}</p>
            </div>
            <p className="mt-1 text-sm text-white/85 whitespace-pre-wrap wrap-break-word">
              {m.text}
            </p>
          </div>
        </div>
      );
    });
  }, [messages, nickname]);

  return (
    <section className="px-4 py-4 md:px-2">
      <div
        className={`relative isolate overflow-hidden rounded-2xl ring-1 ring-white/10 ${heightClassName}`}>
        <div className="pointer-events-none absolute inset-0 -z-10">
          <img
            src="/img/wallpaper.jpg"
            alt=""
            aria-hidden="true"
            className="h-full w-full object-cover"
            draggable={false}
          />
          <div className="absolute inset-0 bg-black/25" />
        </div>

        {/* Header */}
        <div className="absolute inset-x-0 top-0 z-20">
          <div className="relative h-14">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/55 from-20% via-black/25 via-45% to-black/0" />
            <div className="pointer-events-none absolute inset-0 backdrop-blur-lg fade-to-b" />

            <div className="relative z-10 flex h-full items-center justify-between px-4">
              <div className="flex items-center gap-2 min-w-0">
                <Icon icon="solar:user-bold" width="20" height="20" />
                <p className="text-sm font-semibold text-white truncate">
                  {canChat ? `@${nickname}` : "Not signed in"}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {}}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                  aria-label="Fullscreen (coming soon)"
                  title="Fullscreen (coming soon)">
                  <Icon
                    icon="solar:full-screen-square-linear"
                    width="18"
                    height="18"
                  />
                </button>

                {isAuthed ? (
                  <button
                    type="button"
                    onClick={signOut}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                    aria-label="Sign out"
                    title="Sign out">
                    <Icon icon="solar:logout-2-linear" width="18" height="18" />
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={requestAuth}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                    aria-label="Sign in"
                    title="Sign in">
                    <Icon icon="solar:login-2-linear" width="18" height="18" />
                  </button>
                )}

                <button
                  type="button"
                  onClick={clearChat}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/15 backdrop-blur hover:bg-white/15"
                  aria-label="Clear chat"
                  title="Clear chat">
                  <Icon
                    icon="solar:trash-bin-trash-linear"
                    width="18"
                    height="18"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Messages (scrolls under header/composer) */}
        <div
          ref={scrollRef}
          className="no-scrollbar absolute inset-0 z-10 overflow-y-auto overscroll-contain px-4 pt-18 pb-32">
          {messages.length === 0 ? (
            <p className="text-center text-sm text-white/40">
              No messages yet. Say hi 👋
            </p>
          ) : (
            <div className="flex flex-col gap-3">{renderedMessages}</div>
          )}
        </div>

        {/* Composer (overlays like header) */}
        <div className="absolute inset-x-0 bottom-0 z-20">
          <ChatComposer
            position="none"
            maxWidthClassName="max-w-none"
            placeholder={canChat ? "Type a message..." : "Sign in to chat..."}
            onSend={canChat ? sendMessage : undefined}
            disabled={!canChat}
            onDisabledAttempt={requestAuth}
            inputClassName={!canChat ? "opacity-60" : ""}
          />
        </div>
      </div>

      <p className="mt-3 text-center text-xs text-white/35">
        Local demo (saved on this device only).
      </p>

      {isAuthOpen ? (
        <div className="fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close"
            onClick={() => setIsAuthOpen(false)}
          />

          <div className="absolute inset-x-0 bottom-0 md:inset-0 md:flex md:items-center md:justify-center p-4">
            <div className="w-full md:max-w-md rounded-3xl bg-black/80 ring-1 ring-white/10 backdrop-blur-xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3">
                <p className="text-sm font-semibold text-white">Sign in</p>
                <button
                  type="button"
                  onClick={() => setIsAuthOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10 hover:bg-white/15"
                  aria-label="Close">
                  <Icon
                    icon="solar:close-circle-linear"
                    width="18"
                    height="18"
                  />
                </button>
              </div>

              <div className="px-4 pb-4">
                <AuthStubInline onAuthed={handleAuthed} />
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
