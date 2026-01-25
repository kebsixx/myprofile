import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const profile = {
  username: "cml6awvx",
};

export default function ProjectPage() {
  return (
    <div className="min-h-500 bg-black text-white">
      {/* Header */}
      <header className="sticky inset-x-0 top-0 z-50 h-16">
        {/* <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-black/75 from-50% via-black/40 via-70% to-black/0"></div> */}
        <div className="pointer-events-none inset-0 absolute h-full bg-linear-to-b from-70% from-black to-black/0 opacity-10"></div>
        <div className="pointer-events-none inset-0 absolute h-full backdrop-blur-lg fade-to-b z-9"></div>
        <div className="relative h-full z-10">
          <div className="relative mx-auto grid h-full max-w-283.75 grid-cols-3 items-center px-4">
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
      <div>
        {/* Project Title */}
        <div className="mb-4 px-4 text-2xl flex justify-between items-center font-bold">
          <div className="flex items-center gap-4">
            <Image
              src="/img/profil.jpg"
              alt="Photo Profile"
              width={40}
              height={40}
              className="rounded-full h-10 w-10"
            />
            <div className="flex flex-col">
              <p className="text-sm font-black">{profile.username}</p>
              <p className="text-xs">12 January 2025</p>
            </div>
          </div>
          <Icon icon="solar:menu-dots-bold" width="28" height="28"></Icon>
        </div>
        <Image
          src="https://images.unsplash.com/photo-1483921020237-2ff51e8e4b22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c25vd3xlbnwwfHwwfHx8Mg%3D%3D"
          alt="Profile"
          width={192}
          height={192}
          className="h-full w-full mx-auto object-cover opacity-70"
        />
        <div className="my-3 flex items-center justify-between px-2">
          <div className="flex gap-4">
            <div className="flex items-center justify-between gap-1">
              <Icon icon="solar:heart-outline" width="28" height="28"></Icon>
              <p className="font-xs font-semibold">200</p>
            </div>
            <div className="flex items-center justify-between gap-1">
              <Icon
                icon="solar:chat-round-linear"
                width="28"
                height="28"></Icon>
              <p className="font-xs font-semibold">50</p>
            </div>
            <div className="flex items-center justify-between gap-1">
              <Icon icon="solar:repeat-bold" width="28" height="28"></Icon>
              <p className="font-xs font-semibold">20</p>
            </div>
            <div className="flex items-center justify-between gap-1">
              <Icon icon="solar:plain-3-linear" width="28" height="28"></Icon>
              <p className="font-xs font-semibold">3</p>
            </div>
          </div>
          <Icon icon="mdi:github" width="32" height="32"></Icon>
        </div>
      </div>
    </div>
  );
}
