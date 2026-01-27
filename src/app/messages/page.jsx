"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useCallback, useRef, useState } from "react";
import ChatComposer from "../components/ChatComposer";

export default function MessagesPage() {
  const [messages, setMessages] = useState([]);
  const scrollRef = useRef(null);

  const handleSend = useCallback((text) => {
    const newMessage = {
      id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
      text,
      ts: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);
    requestAnimationFrame(() => {
      const el = scrollRef.current;
      if (el) el.scrollTop = el.scrollHeight;
    });
  }, []);

  return (
    <div className="h-dvh overflow-hidden bg-black text-white">
      <div className="flex h-full flex-col">
        {/* Scrollable content area */}
        <div
          ref={scrollRef}
          className="no-scrollbar flex-1 overflow-y-auto overscroll-contain">
          {/* Header */}
          <header className="sticky inset-x-0 top-0 z-50 h-16">
            {/* <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-50% via-black/40 via-70% to-black/0"></div> */}
            <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-20% via-black/40 via-45% to-black/0 z-8" />
            <div className="pointer-events-none inset-0 absolute h-full backdrop-blur-lg fade-to-b z-9" />
            <div className="relative h-full z-10">
              <div className="relative mx-auto grid h-full max-w-283.75 grid-cols-3 items-center px-4">
                <Link
                  href="/"
                  aria-label="Back"
                  className="justify-self-start rounded-full bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
                  <Icon icon="mingcute:left-fill" width="24" height="24" />
                </Link>
                <h1 className="justify-self-center text-xl font-black tracking-tight">
                  cml6awvx
                </h1>
                <div />
              </div>
            </div>
          </header>

          <div className="relative -mt-16">
            <img
              src="/img/Testing.png"
              alt="Testing background"
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <img
              src="/img/Testing.png"
              alt="Testing background"
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <img
              src="/img/Testing.png"
              alt="Testing background"
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <img
              src="/img/Testing.png"
              alt="Testing background"
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <img
              src="/img/Testing.png"
              alt="Testing background"
              className="block w-full h-auto select-none"
              draggable={false}
            />
            <div className="pointer-events-none absolute inset-0 bg-black/20" />
          </div>

          {/* Messages Content */}
          <div className="relative z-10 p-4 pb-28">
            {messages.length === 0 ? (
              <p className="text-center text-gray-500">No messages yet.</p>
            ) : (
              <div className="mx-auto max-w-283.75">
                <div className="flex flex-col gap-3">
                  {messages.map((m) => (
                    <div key={m.id} className="flex w-full justify-end">
                      <div className="max-w-[85%] rounded-2xl rounded-br-md bg-indigo-500/20 ring-1 ring-indigo-400/20 px-3 py-2">
                        <p className="text-sm text-white/90 whitespace-pre-wrap wrap-break-word">
                          {m.text}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <ChatComposer onSend={handleSend} />
      </div>
    </div>
  );
}
