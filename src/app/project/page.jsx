import { Icon } from "@iconify/react";
import Link from "next/link";
import ProjectClient from "./ProjectClient";

const profile = {
  username: "cml6awvx",
  avatarSrc: "/img/profil.jpg",
};

const projects = [
  {
    id: "p1",
    imageSrc: "https://images.unsplash.com/photo-1768772123991-b17e721119a7",
    date: "12 January 2025",
    description: "Desktop layout preview (testing).",
    stats: {
      likes: 200,
      comments: 50,
      reposts: 20,
      shares: 3,
    },
    comments: [
      {
        id: "c1",
        user: "alvin",
        text: "Keren banget, vibe-nya dapet.",
        date: "2h",
      },
      {
        id: "c2",
        user: "naya",
        text: "Ini pake apa buat UI blur-nya?",
        date: "1h",
      },
      {
        id: "c3",
        user: "raka",
        text: "Mantap, lanjutkan!",
        date: "15m",
      },
    ],
    githubUrl: "https://github.com/kebsixx",
  },
  {
    id: "p2",
    imageSrc: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    date: "5 February 2024",
    description: "Mobile layout preview (testing).",
    stats: {
      likes: 1500,
      comments: 300,
      reposts: 120,
      shares: 30,
    },
    comments: [
      {
        id: "c1",
        user: "dina",
        text: "Warnanya enak dilihat.",
        date: "1d",
      },
      {
        id: "c2",
        user: "bimo",
        text: "Boleh share repo nya?",
        date: "20h",
      },
    ],
    githubUrl: "https://github.com/kebsixx",
  },
];

export default function ProjectPage() {
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
            <div />
          </div>
        </div>
      </header>
      <ProjectClient profile={profile} projects={projects} />
    </div>
  );
}
