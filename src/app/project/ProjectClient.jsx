"use client";

import { Icon } from "@iconify/react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import supabase from "../../utils/supabase/browserClient";
import { useAuthStub } from "../components/auth/AuthStubProvider";
import ProjectPostMenu from "./ProjectPostMenu";

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

function formatTime(timestamp) {
  try {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  } catch {
    return "";
  }
}

export default function ProjectClient({ profile, projects }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const scrollId = searchParams?.get("id");
    if (scrollId) {
      const el = document.getElementById(`project-${scrollId}`);
      if (el) {
        setTimeout(
          () => el.scrollIntoView({ behavior: "smooth", block: "center" }),
          50,
        );
      }
    }
  }, [searchParams]);

  const { user, isAuthed } = useAuthStub();
  const [openCommentsForId, setOpenCommentsForId] = useState(null);
  const [likedIds, setLikedIds] = useState(() => new Set());
  const isMobileViewport = useIsMobileViewport();
  const [repostingIds, setRepostingIds] = useState(() => new Set());

  const [commentsMap, setCommentsMap] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [commentError, setCommentError] = useState(null);

  function serializeError(err) {
    if (!err) return null;
    try {
      const out = {};
      Object.getOwnPropertyNames(err).forEach((k) => {
        try {
          out[k] = err[k];
        } catch (e) {
          out[k] = String(err[k]);
        }
      });
      if (Object.keys(out).length > 0) return out;
      if (typeof err.toString === "function") return err.toString();
      return String(err);
    } catch (e) {
      return String(err);
    }
  }

  function isUuid(id) {
    if (typeof id !== "string") return false;
    return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(
      id,
    );
  }

  const activeProject = useMemo(() => {
    if (!openCommentsForId) return null;
    return projects.find((p) => p.id === openCommentsForId) ?? null;
  }, [openCommentsForId, projects]);

  const isSheetOpen = Boolean(activeProject);

  const fetchComments = useCallback(async (projectId) => {
    if (!isUuid(projectId)) {
      const msg =
        "Project ID is not a UUID. Comments are stored by project UUID in the database. If you're using local/sample numeric IDs, either migrate projects to UUIDs in the DB or update the comments schema.";
      setCommentError(msg);
      console.error(msg, { projectId });
      return;
    }
    try {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Supabase fetch error details:", error);
        throw error;
      }
      setCommentsMap((prev) => ({ ...prev, [projectId]: data || [] }));
    } catch (error) {
      try {
        console.error("Error fetching comments:", serializeError(error));
      } catch (e) {
        console.error("Error fetching comments (unknown error):", error);
      }
    }
  }, []);

  useEffect(() => {
    if (openCommentsForId) {
      fetchComments(openCommentsForId);
    }
  }, [openCommentsForId, fetchComments]);

  useEffect(() => {
    const channels = projects.map((project) => {
      const channel = supabase
        .channel(`project-comments-${project.id}`)
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "project_comments",
            filter: `project_id=eq.${project.id}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setCommentsMap((prev) => ({
                ...prev,
                [project.id]: [payload.new, ...(prev[project.id] || [])],
              }));
            } else if (payload.eventType === "DELETE") {
              setCommentsMap((prev) => ({
                ...prev,
                [project.id]: (prev[project.id] || []).filter(
                  (c) => c.id !== payload.old.id,
                ),
              }));
            }
          },
        )
        .subscribe();
      return channel;
    });

    return () => {
      channels.forEach((channel) => supabase.removeChannel(channel));
    };
  }, [projects]);

  useEffect(() => {
    if (!isSheetOpen || !isMobileViewport) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isSheetOpen, isMobileViewport]);

  function toggleComments(projectId) {
    setOpenCommentsForId((current) =>
      current === projectId ? null : projectId,
    );
  }

  function closeComments() {
    setOpenCommentsForId(null);
  }

  function toggleLike(projectId) {
    setLikedIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }

  function toggleRepost(projectId) {
    setRepostingIds((current) => {
      const next = new Set(current);
      if (next.has(projectId)) next.delete(projectId);
      else next.add(projectId);
      return next;
    });
  }

  const handleSubmitComment = async (e, projectId) => {
    e.preventDefault();
    if (!newCommentText.trim() || !user || submitting) return;
    if (!isUuid(projectId)) {
      const msg =
        "Cannot post comment: project ID is not a UUID. Ensure project IDs match the database UUIDs.";
      setCommentError(msg);
      console.error(msg, { projectId });
      return;
    }

    setSubmitting(true);
    try {
      const { data, error } = await supabase.from("project_comments").insert({
        project_id: projectId,
        user_id: user.id,
        content: newCommentText.trim(),
      });

      if (error) {
        console.error("Supabase insert error:", serializeError(error));
        throw error;
      }

      setCommentsMap((prev) => ({
        ...prev,
        [projectId]: [...(prev[projectId] || []), ...(data || [])],
      }));

      setNewCommentText("");
      setCommentError(null);
    } catch (error) {
      try {
        const serialized = serializeError(error);
        console.error("Error posting comment:", serialized);
        setCommentError(
          serialized?.message || serialized?.error || String(serialized),
        );
      } catch (e) {
        console.error("Error posting comment (unknown):", error);
        setCommentError(String(error));
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto w-full max-w-md px-4 pb-10 md:max-w-6xl">
      {projects.map((project, index) => {
        const isOpen = openCommentsForId === project.id;
        const isLiked = likedIds.has(project.id);
        const isReposting = repostingIds.has(project.id);
        const projectAnchorId = `project-${project.id}`;
        const projectComments = commentsMap[project.id] || [];

        return (
          <section
            key={project.id}
            id={projectAnchorId}
            className="pt-4 md:pt-8">
            <div
              className={
                "md:flex md:items-stretch md:justify-center " +
                (isOpen ? "md:gap-8" : "md:gap-0")
              }>
              <article className="w-full overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 md:w-130 lg:w-160">
                <div className="relative bg-black">
                  <div className="relative w-full aspect-4/3">
                    <Image
                      src={project.imageSrc}
                      alt={`Project ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 640px, (min-width: 768px) 520px, 100vw"
                      className="object-cover object-center"
                      priority={index === 0}
                    />
                  </div>

                  <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-linear-to-b from-black/80 via-black/35 to-black/0" />

                  <div className="absolute inset-x-0 top-0 z-10 flex items-start justify-between gap-4 px-3 py-4 md:px-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <Image
                        src={profile.avatarSrc}
                        alt="Profile"
                        width={36}
                        height={36}
                        className="h-9 w-9 shrink-0 rounded-full"
                      />
                      <div className="min-w-0">
                        <div className="truncate text-sm font-semibold leading-tight">
                          {profile.username}
                        </div>
                        <div className="text-xs text-white/60">
                          {project.date}
                        </div>
                      </div>
                    </div>

                    <ProjectPostMenu
                      githubUrl={project.githubUrl}
                      demoUrl={project.demoUrl}
                      projectAnchorId={projectAnchorId}
                    />
                  </div>
                </div>

                <div className="px-3 pb-3 pt-3 md:px-4">
                  <div className="text-sm text-white/85 wrap-break-word">
                    {project.description}
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => toggleLike(project.id)}
                        aria-label="Like"
                        className={
                          "flex items-center gap-1 rounded-full px-2 py-1.5 hover:bg-white/10 " +
                          (isLiked ? "bg-white/10" : "")
                        }>
                        <Icon
                          icon={
                            isLiked ? "solar:heart-bold" : "solar:heart-linear"
                          }
                          width="24"
                          height="24"
                        />
                        <p className="text-sm font-semibold max-[400px]:text-xs">
                          {formatCount(project.stats.likes)}
                        </p>
                      </button>

                      <button
                        type="button"
                        onClick={() => toggleComments(project.id)}
                        aria-label="Comments"
                        className={
                          "flex items-center gap-1 rounded-full px-2 py-1.5 hover:bg-white/10 " +
                          (isOpen ? "bg-white/10" : "")
                        }>
                        <Icon
                          icon={
                            isOpen
                              ? "solar:chat-round-line-bold"
                              : "solar:chat-round-line-linear"
                          }
                          width="24"
                          height="24"
                        />
                        <p className="text-sm font-semibold max-[400px]:text-xs">
                          {formatCount(project.stats.comments)}
                        </p>
                      </button>

                      <button
                        type="button"
                        aria-label="Repost"
                        onClick={() => toggleRepost(project.id)}
                        className="flex items-center gap-1 rounded-full px-2 py-1.5 hover:bg-white/10">
                        <Icon
                          icon={
                            isReposting
                              ? "solar:repeat-one-minimalistic-bold"
                              : "solar:repeat-linear"
                          }
                          width="24"
                          height="24"
                        />
                        <p className="text-sm font-semibold max-[400px]:text-xs">
                          {formatCount(project.stats.reposts)}
                        </p>
                      </button>
                      <button
                        type="button"
                        aria-label="Share"
                        className="flex items-center gap-1 rounded-full px-2 py-1.5 hover:bg-white/10">
                        <Icon
                          icon="solar:plain-3-linear"
                          width="24"
                          height="24"
                        />
                        <p className="text-sm font-semibold max-[400px]:text-xs">
                          {formatCount(project.stats.shares)}
                        </p>
                      </button>
                    </div>

                    <div className="shrink-0" />
                  </div>
                </div>
              </article>

              <aside
                aria-hidden={!isOpen}
                className={
                  "hidden md:block overflow-hidden transition-[width,opacity,transform] duration-300 ease-out " +
                  (isOpen
                    ? "w-90 lg:w-105 opacity-100 translate-x-0"
                    : "w-0 opacity-0 translate-x-6 pointer-events-none")
                }>
                {isOpen && (
                  <div className="h-full min-h-0 w-90 rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur lg:w-105">
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
                        {projectComments.length ? (
                          <div className="space-y-3">
                            {projectComments.map((c) => (
                              <div key={c.id} className="flex gap-3">
                                <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10" />
                                <div className="min-w-0">
                                  <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold">
                                      {c.user_id === user?.id ? "You" : "User"}
                                    </span>
                                    <span className="text-xs text-white/50">
                                      {formatTime(c.created_at)}
                                    </span>
                                  </div>
                                  <div className="text-sm text-white/80 wrap-break-word">
                                    {c.content}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-white/50">
                            {isAuthed
                              ? "No comments yet. Be the first!"
                              : "No comments yet."}
                          </div>
                        )}
                      </div>

                      {isAuthed && (
                        <div className="border-t border-white/10 p-3">
                          <form
                            onSubmit={(e) => handleSubmitComment(e, project.id)}
                            className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newCommentText}
                              onChange={(e) =>
                                setNewCommentText(e.target.value)
                              }
                              placeholder="Add a comment..."
                              disabled={submitting}
                              className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                            />
                            <button
                              type="submit"
                              disabled={!newCommentText.trim() || submitting}
                              className="rounded-full bg-indigo-500/90 p-2.5 text-white ring-1 ring-white/10 transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                              aria-label="Send comment">
                              <Icon
                                icon={
                                  submitting
                                    ? "solar:round-arrow-right-linear"
                                    : "solar:plain-3-linear"
                                }
                                width="20"
                                height="20"
                                className={submitting ? "animate-spin" : ""}
                              />
                            </button>
                          </form>
                          {commentError && (
                            <div className="mt-2 text-sm text-red-400">
                              {commentError}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </aside>
            </div>
          </section>
        );
      })}

      {isMobileViewport && (
        <div
          className={
            isSheetOpen
              ? "fixed inset-0 z-60"
              : "pointer-events-none fixed inset-0 z-60"
          }
          aria-hidden={!isSheetOpen}>
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
                {activeProject && commentsMap[activeProject.id]?.length ? (
                  <div className="space-y-3">
                    {commentsMap[activeProject.id].map((c) => (
                      <div key={c.id} className="flex gap-3">
                        <div className="mt-1 h-8 w-8 shrink-0 rounded-full bg-white/10 ring-1 ring-white/10" />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-semibold">
                              {c.user_id === user?.id ? "You" : "User"}
                            </span>
                            <span className="text-xs text-white/50">
                              {formatTime(c.created_at)}
                            </span>
                          </div>
                          <div className="text-sm text-white/80 wrap-break-word">
                            {c.content}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-sm text-white/50">
                    {isAuthed
                      ? "No comments yet. Be the first!"
                      : "No comments yet."}
                  </div>
                )}
              </div>

              {isAuthed && activeProject && (
                <div className="border-t border-white/10 p-3">
                  <form
                    onSubmit={(e) => handleSubmitComment(e, activeProject.id)}
                    className="flex items-center gap-2">
                    <input
                      type="text"
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      disabled={submitting}
                      className="flex-1 rounded-full bg-white/10 px-4 py-2 text-sm text-white placeholder-white/50 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/20 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!newCommentText.trim() || submitting}
                      className="rounded-full bg-indigo-500/90 p-2.5 text-white ring-1 ring-white/10 transition hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      aria-label="Send comment">
                      <Icon
                        icon={
                          submitting
                            ? "solar:round-arrow-right-linear"
                            : "solar:plain-3-linear"
                        }
                        width="20"
                        height="20"
                        className={submitting ? "animate-spin" : ""}
                      />
                    </button>
                  </form>
                  {commentError && (
                    <div className="mt-2 text-sm text-red-400">
                      {commentError}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
