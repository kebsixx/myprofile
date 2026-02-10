"use client";

import { Icon } from "@iconify/react";
import { useCallback, useEffect, useState } from "react";
import { useAuthStub } from "./auth/AuthStubProvider";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
);

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

export default function ProjectComments({ projectId }) {
  const { user, isAuthed } = useAuthStub();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch comments
  const fetchComments = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("project_comments")
        .select("*")
        .eq("project_id", projectId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setComments(data || []);
    } catch (error) {
      console.error("Error fetching comments:", error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  useEffect(() => {
    fetchComments();

    // Real-time subscription untuk comments baru
    const channel = supabase
      .channel(`project-comments-${projectId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "project_comments",
          filter: `project_id=eq.${projectId}`,
        },
        (payload) => {
          if (payload.eventType === "INSERT") {
            setComments((prev) => [payload.new, ...prev]);
          } else if (payload.eventType === "DELETE") {
            setComments((prev) => prev.filter((c) => c.id !== payload.old.id));
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [projectId, fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || !user || submitting) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("project_comments").insert({
        project_id: projectId,
        user_id: user.id,
        content: newComment.trim(),
      });

      if (error) throw error;

      setNewComment("");
    } catch (error) {
      console.error("Error posting comment:", error);
      alert("Failed to post comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="rounded-2xl bg-black/30 backdrop-blur-sm ring-1 ring-white/10 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Icon icon="solar:chat-round-line-linear" width="24" height="24" />
        Comments ({comments.length})
      </h3>

      {/* Comment form */}
      {isAuthed ? (
        <form onSubmit={handleSubmit} className="mb-6">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full rounded-xl bg-white/10 px-4 py-3 text-sm text-white placeholder-white/40 ring-1 ring-white/10 outline-none focus:ring-2 focus:ring-white/25 resize-none"
            rows={3}
          />
          <div className="mt-2 flex justify-end">
            <button
              type="submit"
              disabled={!newComment.trim() || submitting}
              className="inline-flex items-center gap-2 rounded-xl bg-white/10 px-4 py-2 text-sm font-semibold text-white ring-1 ring-white/10 hover:bg-white/15 disabled:opacity-50 disabled:cursor-not-allowed">
              {submitting ? (
                <>
                  <Icon
                    icon="solar:round-arrow-right-linear"
                    width="18"
                    height="18"
                    className="animate-spin"
                  />
                  Posting...
                </>
              ) : (
                <>
                  <Icon icon="solar:plain-3-linear" width="18" height="18" />
                  Post Comment
                </>
              )}
            </button>
          </div>
        </form>
      ) : (
        <div className="mb-6 rounded-xl bg-white/5 px-4 py-3 text-center text-sm text-white/60">
          Please sign in to comment
        </div>
      )}

      {/* Comments list */}
      {loading ? (
        <div className="text-center py-8 text-white/40">
          <Icon
            icon="solar:round-arrow-right-linear"
            width="24"
            height="24"
            className="animate-spin inline-block"
          />
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-white/40">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="rounded-xl bg-white/5 p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm font-semibold text-white/90">
                    {comment.user_id === user?.id ? "You" : "User"}
                  </p>
                  <p className="text-xs text-white/40">
                    {formatTime(comment.created_at)}
                  </p>
                </div>
              </div>
              <p className="text-sm text-white/80 whitespace-pre-wrap">
                {comment.content}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
