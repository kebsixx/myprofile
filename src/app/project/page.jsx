"use client";

import { Icon } from "@iconify/react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import projects from "../../data/projects";
import ProjectClient from "./ProjectClient";

const profile = {
  username: "cml6awvx",
  avatarSrc: "/img/profil.jpg",
};

export default function ProjectPage() {
  const searchParams = useSearchParams();
  const scrollId = searchParams.get("id");

  useEffect(() => {
    if (scrollId) {
      const el = document.getElementById(`project-${scrollId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [scrollId]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="sticky inset-x-0 top-0 z-50 h-16">
        {/* <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-50% via-black/40 via-70% to-black/0"></div> */}
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
      {/*
        Cara kerja:
        - Di halaman Home, link ke /project?id=p2 (misal)
        - Di halaman Project, ambil id dari query string
        - Saat komponen mount, scroll ke elemen dengan id "project-p2"
        - Pastikan setiap section project punya id="project-<id>"
      */}
      <ProjectClient profile={profile} projects={projects} />
    </div>
  );
}
