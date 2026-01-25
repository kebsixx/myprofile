import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

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

function formatCount(value) {
  if (typeof value !== "number") return value;
  return new Intl.NumberFormat("en-US").format(value);
}

export default function ProjectPage() {
  return (
    <div className="min-h-dvh bg-black text-white">
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
      {/* Project */}
      <main className="mx-auto w-full max-w-md px-4 pb-10 md:max-w-6xl">
        {projects.map((project, index) => (
          <section key={project.id} className="pt-4 md:pt-8">
            <div className="md:grid md:grid-cols-12 md:gap-8">
              {/* Media + overlay meta */}
              <div className="md:col-span-7 lg:col-span-8">
                <div className="relative overflow-hidden rounded-2xl ring-1 ring-white/10">
                  <div className="relative w-full aspect-[4/3] md:aspect-auto md:h-[420px] lg:h-[480px]">
                    <Image
                      src={project.imageSrc}
                      alt={`Project ${index + 1}`}
                      fill
                      sizes="(min-width: 1024px) 768px, (min-width: 768px) 58vw, 100vw"
                      className="object-cover"
                      priority={index === 0}
                    />
                  </div>

                  {/* Readability overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/35 via-black/5 to-black/55" />

                  {/* Meta overlay */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {/* Top meta */}
                    <div className="flex items-start justify-between gap-4">
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
                        className="rounded-full bg-white/10 p-2 ring-1 ring-white/15 backdrop-blur">
                        <Icon
                          icon="solar:menu-dots-bold"
                          width="22"
                          height="22"
                        />
                      </button>
                    </div>

                    {/* Bottom meta */}
                    <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                      <div className="text-sm text-white/80">
                        {project.description}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex gap-4">
                          <div className="flex items-center gap-1">
                            <Icon
                              icon="solar:heart-outline"
                              width="28"
                              height="28"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.likes)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon
                              icon="solar:chat-round-linear"
                              width="28"
                              height="28"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.comments)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon
                              icon="solar:repeat-bold"
                              width="28"
                              height="28"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.reposts)}
                            </p>
                          </div>
                          <div className="flex items-center gap-1">
                            <Icon
                              icon="solar:plain-3-linear"
                              width="28"
                              height="28"
                            />
                            <p className="text-sm font-semibold">
                              {formatCount(project.stats.shares)}
                            </p>
                          </div>
                        </div>

                        {/* GitHub on far right */}
                        <a
                          href={project.githubUrl}
                          target="_blank"
                          rel="noreferrer"
                          aria-label="Open GitHub"
                          className="rounded-full bg-white/0 p-1 ring-1 ring-transparent transition hover:bg-white/10 hover:ring-white/15">
                          <Icon icon="mdi:github" width="32" height="32" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Comments panel */}
              <aside className="mt-4 md:mt-0 md:col-span-5 lg:col-span-4">
                <div className="h-auto overflow-hidden rounded-2xl bg-white/5 ring-1 ring-white/10 backdrop-blur md:h-[420px] lg:h-[480px]">
                  <div className="flex h-full flex-col">
                    <div className="flex items-center justify-between px-4 pt-4">
                      <div className="text-sm font-semibold">Comments</div>
                      <div className="text-xs text-white/60">
                        {formatCount(project.stats.comments)} total
                      </div>
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
        ))}
      </main>
    </div>
  );
}
