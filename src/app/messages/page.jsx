import { Icon } from "@iconify/react";
import Link from "next/link";

export default function MessagesPage() {
  return (
    <div className="h-dvh overflow-hidden bg-black text-white">
      <div className="flex h-full flex-col">
        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
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
            <p className="text-center text-gray-500">No messages yet.</p>
          </div>
        </div>

        {/* Chat text field (always visible, not affected by scroll/focus) */}
        <div className="shrink-0 fixed inset-x-0 bottom-0 z-50 ">
          <div className="relative">
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/75 from-20% via-black/40 via-55% to-black/0" />
            <div className="pointer-events-none absolute inset-0 backdrop-blur-xl fade-to-t" />

            <div className="relative z-10 mx-auto max-w-283.75 px-4 pt-3 pb-[calc(env(safe-area-inset-bottom)+12px)]">
              <form className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type a message..."
                  className="flex-1 rounded-full bg-white/10 backdrop-blur-xs px-4 py-2 text-white placeholder-white/60 outline-none focus:ring-2 focus:ring-white/30"
                />
                <button
                  type="submit"
                  className="rounded-full bg-indigo-500/90 p-2.5 font-semibold text-white ring-1 ring-white/10 backdrop-blur transition hover:bg-indigo-500">
                  <Icon icon="solar:plain-3-linear" width="24" height="24" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
