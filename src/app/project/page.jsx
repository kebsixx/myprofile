import { Icon } from "@iconify/react";
import Link from "next/link";
import { Suspense } from "react";
import { createClient } from "../../utils/supabase/server";
import ProjectClient from "./ProjectClient";

const profile = {
  username: "cml6awvx",
  avatarSrc: "/img/profil.jpg",
};

export default async function ProjectPage() {
  let projects = [];
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("projects")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data) {
      projects = data.map((p) => ({
        id: p.id,
        title: p.title,
        imageSrc: p.image_src || "",
        githubUrl: p.github_url || null,
        demoUrl: p.demo_url || null,
        description: p.description || "",
        date: p.date || null,
        stats: {
          likes: p.likes || 0,
          comments: p.comments_count || 0,
          reposts: p.reposts || 0,
          shares: p.shares || 0,
        },
      }));
    }
  } catch (e) {
    projects = [];
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky inset-x-0 top-0 z-50 h-16">
        <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-20% via-black/40 via-45% to-black/0 z-8"></div>
        <div className="pointer-events-none inset-0 absolute h-full backdrop-blur-lg fade-to-b z-9"></div>
        <div className="relative h-full z-10">
          <div className="relative mx-auto grid h-full w-full max-w-md grid-cols-3 items-center px-4 md:max-w-6xl">
            <Link
              href="/"
              aria-label="Back"
              className="justify-self-start rounded-full bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
              <Icon icon="mingcute:left-fill" width="24" height="24" />
            </Link>
            <h1 className="justify-self-center text-xl font-black tracking-tight">
              Projects
            </h1>
          </div>
        </div>
      </header>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <div className="animate-spin h-8 w-8 border-2 border-white border-t-transparent rounded-full" />
          </div>
        }>
        <ProjectClient profile={profile} projects={projects} />
      </Suspense>
    </div>
  );
}
