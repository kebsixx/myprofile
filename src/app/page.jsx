import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import projects from "../data/projects";
import ContactMenu from "./components/ContactMenu";
import CopyToClipboardButton from "./components/CopyToClipboardButton";
import HomeHeaderMenu from "./components/HomeHeaderMenu";
import HomeTabs from "./components/HomeTabs";
import PublicChatPanel from "./components/PublicChatPanel";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../components/ui/tooltip";

export default function Home() {
  const profile = {
    username: "cml6awvx",
    name: "Muhammad Rizieq Anwar",
    title: "Developer",
    description: (
      <>
        Mahasiswa Teknik Informatika Politeknik Elektronika Negeri Surabaya.
        <br />
        Part of <span className="font-semibold">@softdevpens</span>
      </>
    ),
    email: "zieqanw@outlook.com",
    link: "https://github.com/kebsixx",
    avatarSrc: "/img/profil.jpg",
  };

  const hobbies = [
    {
      label: "Programming",
      img: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1469&auto=format&fit=crop",
    },
    {
      label: "Gaming",
      img: "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1470&auto=format&fit=crop",
    },
    {
      label: "Olahraga",
      img: "https://images.unsplash.com/photo-1549476464-37392f717541?q=80&w=687&auto=format&fit=crop",
    },
    {
      label: "Music",
      img: "https://images.unsplash.com/photo-1675795921263-0781cdbedb64?q=80&w=750&auto=format&fit=crop",
    },
    {
      label: "Reading",
      img: "https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?q=80&w=1374&auto=format&fit=crop",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white font-inter">
      {/* Header */}
      <header className="sticky inset-x-0 top-0 z-50 h-16">
        <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-20% via-black/40 via-45% to-black/0 z-8"></div>
        <div className="pointer-events-none inset-0 absolute h-full backdrop-blur-lg fade-to-b z-9"></div>
        <div className="relative h-full z-10">
          <div className="relative mx-auto flex h-full w-full max-w-243.75 items-center justify-between px-4">
            <h1 className="text-xl font-bold tracking-tight">
              {profile.username}
            </h1>
            <div className="flex items-center gap-2">
              <HomeHeaderMenu githubUrl={profile.link} />
            </div>
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="mx-auto max-w-233.75 pb-10">
        {/* Mobile */}
        <section className="md:hidden px-4">
          <div className="flex items-start gap-4">
            <div className="h-20 w-20 overflow-hidden rounded-full border border-zinc-200">
              <Image
                src={profile.avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
                width={80}
                height={80}
                priority
              />
            </div>

            <div className="flex-1 my-auto">
              <div className="flex items-center">
                <p className="text-sm font-semibold">{profile.name}</p>
              </div>

              <div className="flex justify-start gap-8">
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">20</span>
                  <span className="text-sm text-white">projects</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">20K</span>
                  <span className="text-sm text-white">comments</span>
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-base font-semibold">20</span>
                  <span className="text-sm text-white">likes</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-4">
            <p className="text-sm text-zinc-400">{profile.title}</p>
            <p className="mt-1 text-sm font-light text-white">
              {profile.description}
            </p>
            <div className="mt-1 flex items-center gap-2 text-sm text-white">
              <span>📩 {profile.email}</span>
              <CopyToClipboardButton
                value={profile.email}
                ariaLabel="Copy email"
              />
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <a
              href="https://www.instagram.com/cml6awvx/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex flex-1 gap-2 items-center justify-center rounded-lg bg-indigo-500 px-1 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
              <Icon icon="mdi:instagram" width="20" height="20" />
              Follow
            </a>
            <ContactMenu
              label="Messages"
              iconClassName="w-5 h-5"
              wrapperClassName="flex-1"
              buttonClassName="w-full inline-flex gap-2 items-center justify-center rounded-lg bg-gray-700 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
            />
          </div>
        </section>

        {/* Desktop */}
        <section className="hidden md:flex md:items-start md:gap-20">
          <div className="shrink-0">
            <div className="h-48 w-48 overflow-hidden rounded-full border border-zinc-200">
              <Image
                src={profile.avatarSrc}
                alt="Profile"
                className="h-full w-full object-cover"
                width={192}
                height={192}
                priority
              />
            </div>
          </div>

          <div className="flex-1">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-xl font-normal">{profile.username}</h2>

              <div className="ml-1 flex flex-wrap items-center gap-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <a
                      href="https://www.instagram.com/cml6awvx/"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600">
                      Follow
                    </a>
                  </TooltipTrigger>
                  <TooltipContent side="top" align="center">
                    Follow me on Instagram
                  </TooltipContent>
                </Tooltip>
                <ContactMenu label="Messages" />
              </div>
            </div>

            <div className="mt-5 flex justify-start gap-8">
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold">20</span>
                <span className="text-base text-white">Projects</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold">50</span>
                <span className="text-base text-white">Comments</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-base font-semibold">20</span>

                <span className="text-base text-white">Likes</span>
              </div>
            </div>
            <div className="mt-5">
              <p className="text-sm text-zinc-400">{profile.title}</p>
              <h3 className="text-base font-semibold">{profile.name}</h3>
              <p className="mt-1 text-sm text-white">{profile.description}</p>
              <div className="mt-1 flex items-center gap-2 text-sm text-white">
                <span>📩 {profile.email}</span>
                <CopyToClipboardButton
                  value={profile.email}
                  ariaLabel="Copy email"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Hobbies */}
        <section className="mt-6">
          <ul className="no-scrollbar flex gap-5 overflow-x-auto px-4 py-2 md:gap-6 md:px-2">
            {hobbies.map((hobby) => (
              <li key={hobby.label} className="shrink-0">
                <div className="flex flex-col items-center gap-2">
                  <div className="h-20 w-20 overflow-hidden rounded-full outline-4 outline-offset-2 outline-gray-800 transition hover:scale-[1.05] md:h-20 md:w-20">
                    <Image
                      src={hobby.img}
                      alt={hobby.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                      width={80}
                      height={80}
                    />
                  </div>
                  <span className="text-center text-xs font-medium text-white">
                    {hobby.label}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <HomeTabs
          projectsSlot={
            <section>
              <div className="grid grid-cols-3">
                {projects.map((project) => (
                  <Link
                    key={project.id}
                    href={"/project?id=" + project.id}
                    className="group relative aspect-square w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={project.imageSrc}
                      alt={project.title}
                      className="h-full w-full object-cover transition group-hover:scale-[1.03]"
                      width={500}
                      height={500}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition group-hover:opacity-100">
                      <div className="flex gap-6 text-sm font-semibold text-white">
                        <span className="inline-flex items-center gap-2">
                          <Icon
                            icon="solar:heart-linear"
                            width="20"
                            height="20"
                          />{" "}
                          {project.stats.likes}
                        </span>
                        <span className="inline-flex items-center gap-2">
                          <Icon
                            icon="solar:chat-round-outline"
                            width="20"
                            height="20"
                          />{" "}
                          {project.stats.comments}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          }
          roomSlot={<PublicChatPanel />}
        />

        {/* Footer */}
        <footer className="mt-14 border-t border-zinc-200 py-6 text-center">
          <p className="text-xs text-zinc-500">
            © 2026 MyInsta. All rights reserved.
          </p>
        </footer>
      </main>
    </div>
  );
}
