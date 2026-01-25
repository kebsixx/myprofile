"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function useIsMobileViewport() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(media.matches);
    update();

    if (typeof media.addEventListener === "function") {
      media.addEventListener("change", update);
      return () => media.removeEventListener("change", update);
    }

    media.addListener(update);
    return () => media.removeListener(update);
  }, []);

  return isMobile;
}

function formatCount(value) {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ProjectClient({ profile, projects }) {
  const [openCommentsForId, setOpenCommentsForId] = useState(null);
  const isMobileViewport = useIsMobileViewport();

  const activeProject = useMemo(() => {
    if (!openCommentsForId) return null;
    return projects.find((p) => p.id === openCommentsForId) ?? null;
  }, [openCommentsForId, projects]);

  const isSheetOpen = Boolean(activeProject);

  useEffect(() => {
    if (!isSheetOpen || !isMobileViewport) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSheetOpen, isMobileViewport]);

  function openComments(projectId) {
    setOpenCommentsForId((current) =>
      current === projectId ? null : projectId,
    );
  }

  function closeComments() {
    setOpenCommentsForId(null);
  }

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-10 md:max-w-6xl">
      {projects.map((project, index) => {
        const isOpen = openCommentsForId === project.id;

        return (
          <section key={project.id} className="pt-4 md:pt-8">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              {/* Media + overlay meta */}
              <div
                className={
                  isOpen ? "md:col-span-7 lg:col-span-8" : "md:col-span-12"
                }>
                <div
                  className={
                    isOpen ? "" : "md:mx-auto md:max-w-3xl lg:max-w-4xl"
                  }>
                  <div className="overflow-hidden rounded-2xl ring-1 ring-white/10 bg-white/5">
                    <div className="relative bg-black">
                      <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[420px] lg:h-[480px]">
                        <Image
                          src={project.imageSrc}
                          alt={`Project ${index + 1}`}
                          fill
                          sizes="(min-width: 1024px) 768px, (min-width: 768px) 58vw, 100vw"
                          className="object-contain"
                          priority={index === 0}
                        />
                      </div>

                      {/* Top fade (no blur) for readability */}
                      <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/80 via-black/35 to-black/0" />

                      {/* Top meta overlay */}
                      <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 px-2 py-4 md:px-4">
                        <div className="flex items-center gap-3">
                          <Image
                            src={profile.avatarSrc}
                            alt="Photo Profile"
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full ring-1 ring-white/20"
                          />
                          <div className="flex flex-col">
                            <p className="text-sm font-black">
                              {profile.username}
                            </p>
                            <p className="text-xs text-white/70">
                              {project.date}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          aria-label="More"
                          className="rounded-full bg-white/10 p-2 backdrop-blur">
                          <Icon
                            icon="solar:menu-dots-bold"
                            width="22"
                            height="22"
                          />
                          {/* <Icon icon="mdi:github" width="32" height="32" /> */}
                        </button>
                      </div>
                    </div>

                    {/* Description + actions (below image, not overlay) */}
                    <div className="p-3">
                      <div className="text-sm text-white/90">
                        {project.description}
                      </div>

                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap items-center gap-3 max-[400px]:gap-2">
                          <button
                            type="button"
                            aria-label="Like"
                            className="flex items-center gap-1 rounded-full py-1.5 hover:bg-white/10">
                            <Icon
                              icon="solar:heart-outline"
                              width="24"
                              height="24"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.likes)}
                            </p>
                          </button>

                          <button
                            type="button"
                            aria-label={
                              isOpen ? "Close comments" : "Open comments"
                            }
                            onClick={() => openComments(project.id)}
                            className="flex items-center gap-1 rounded-full py-1.5 hover:bg-white/10">
                            <Icon
                              icon="solar:chat-round-linear"
                              width="24"
                              height="24"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.comments)}
                            </p>
                          </button>

                          <button
                            type="button"
                            aria-label="Repost"
                            className="flex items-center gap-1 rounded-full py-1.5 hover:bg-white/10">
                            <Icon
                              icon="solar:repeat-bold"
                              width="24"
                              height="24"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.reposts)}
                            </p>
                          </button>

                          <button
                            type="button"
                            aria-label="Share"
                            className="flex items-center gap-1 rounded-full py-1.5 hover:bg-white/10">
                            <Icon
                              icon="solar:plain-3-linear"
                              width="24"
                              height="24"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.shares)}
                            </p>
                          </button>
                        </div>

                        <Link
                          href={project.githubUrl}
                          aria-label="Open GitHub"
                          className="rounded-full bg-white/0 ring-1 ring-transparent transition hover:bg-white/10 hover:ring-white/15">
                          <Icon icon="mdi:github" width="32" height="32" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Desktop comments panel (only when open) */}
              <aside
                className={
                  isOpen
                    ? "mt-4 md:mt-0 md:col-span-5 lg:col-span-4 hidden md:block"
                    : "hidden"
                }>
                <div className="h-auto overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur md:h-[420px] lg:h-[480px]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-4 pt-4">
                      <div className="text-sm font-semibold">Comments</div>
                      <button
                        type="button"
                        onClick={closeComments}
                        aria-label="Close comments"
                        className="rounded-full bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15">
                        <Icon
                          icon="mingcute:close-fill"
                          width="18"
                          height="18"
                        />
                      </button>
                    </div>

                    <div className="mt-3 h-px bg-white/10" />

                    <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
                      {project.comments?.length ? (
                        <div className="space-y-3">
                          {project.comments.map((c) => (
                            <div key={c.id} className="flex gap-3">
                              <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10" />
                              <div className="min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-semibold">
                                    {c.user}
                                  </span>
                                  <span className="text-xs text-white/50">
                                    {c.date}
                                  </span>
                                </div>
                                <div className="text-sm text-white/80 break-words">
                                  {c.text}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-sm text-white/50">
                          No comments yet.
                        </div>
                      )}
                    </div>

                    <div className="border-t border-white/10 p-3">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Add a comment..."
                          className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/20"
                        />
                        <button
                          type="button"
                          className="rounded-full bg-indigo-500/90 p-2.5 text-white ring-1 ring-white/10 transition hover:bg-indigo-500"
                          aria-label="Send comment">
                          <Icon
                            icon="solar:plain-3-linear"
                            width="20"
                            height="20"
                          />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </section>
        );
      })}

      {/* Mobile bottom sheet */}
      <div
        className={
          isSheetOpen
            ? "fixed inset-0 z-[60] md:hidden"
            : "pointer-events-none fixed inset-0 z-[60] md:hidden"
        }
        aria-hidden={!isSheetOpen}>
        {/* Backdrop */}
        <button
          type="button"
          onClick={closeComments}
          className={
            isSheetOpen
              ? "absolute inset-0 bg-black/55"
              : "absolute inset-0 bg-black/0"
          }
          aria-label="Close comments backdrop"
          tabIndex={isSheetOpen ? 0 : -1}
        />

        {/* Sheet */}
        <div
          className={
            "absolute inset-x-0 bottom-0 rounded-t-2xl bg-black/85 ring-1 ring-white/10 backdrop-blur-xl transition-transform duration-300 " +
            (isSheetOpen ? "translate-y-0" : "translate-y-full")
          }
          style={{ height: "50dvh" }}>
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between px-4 pt-4">
              <div className="text-sm font-semibold">Comments</div>
              <button
                type="button"
                onClick={closeComments}
                aria-label="Close comments"
                className="rounded-full bg-white/10 p-2 ring-1 ring-white/15 hover:bg-white/15">
                <Icon icon="mingcute:close-fill" width="18" height="18" />
              </button>
            </div>

            <div className="mt-3 h-px bg-white/10" />

            <div className="flex-1 overflow-y-auto px-4 py-3 no-scrollbar">
              {activeProject?.comments?.length ? (
                <div className="space-y-3">
                  {activeProject.comments.map((c) => (
                    <div key={c.id} className="flex gap-3">
                      <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10" />
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">
                            {c.user}
                          </span>
                          <span className="text-xs text-white/50">
                            {c.date}
                          </span>
                        </div>
                        <div className="text-sm text-white/80 break-words">
                          {c.text}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-white/50">No comments yet.</div>
              )}
            </div>

            <div className="border-t border-white/10 p-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/20"
                />
                <button
                  type="button"
                  className="rounded-full bg-indigo-500/90 p-2.5 text-white ring-1 ring-white/10 transition hover:bg-indigo-500"
                  aria-label="Send comment">
                  <Icon icon="solar:plain-3-linear" width="20" height="20" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
