"use client";
import React, { useEffect, useState } from "react";

type Project = {
  id: string;
  title: string;
  description?: string | null;
  image_src?: string | null;
};

export default function AdminClient() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  async function fetchProjects() {
    setLoading(true);
    try {
      const res = await fetch("/api/projects");
      const data = await res.json();
      setProjects(Array.isArray(data) ? data : []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchProjects();
  }, []);

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    try {
      const res = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description }),
      });
      if (!res.ok) throw new Error("Create failed");
      setTitle("");
      setDescription("");
      await fetchProjects();
    } catch (err) {
      alert("Failed to create project");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this project?")) return;
    try {
      const res = await fetch("/api/projects", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Delete failed");
      await fetchProjects();
    } catch (err) {
      alert("Failed to delete");
    }
  }

  return (
    <div>
      <section style={{ marginBottom: 24 }}>
        <h2>Create Project</h2>
        <form onSubmit={handleCreate}>
          <div>
            <label>Title</label>
            <br />
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label>Description</label>
            <br />
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div style={{ marginTop: 8 }}>
            <button type="submit">Create</button>
          </div>
        </form>
      </section>

      <section>
        <h2>Projects</h2>
        {loading ? (
          <p>Loading…</p>
        ) : (
          <ul>
            {projects.map((p) => (
              <li key={p.id} style={{ marginBottom: 12 }}>
                <strong>{p.title}</strong>
                <div>{p.description}</div>
                <div style={{ marginTop: 6 }}>
                  <button onClick={() => handleDelete(p.id)}>Delete</button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
