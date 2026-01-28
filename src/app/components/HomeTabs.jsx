"use client";

import { Icon } from "@iconify/react";
import { useCallback, useState } from "react";

export default function HomeTabs({ projectsSlot, roomSlot }) {
  const [activeTab, setActiveTab] = useState("projects");

  const handleTabChange = useCallback((tab) => {
    setActiveTab(tab);
  }, []);

  const isProjects = activeTab === "projects";

  return (
    <section>
      <div className="grid grid-cols-2">
        <button
          type="button"
          onClick={() => handleTabChange("projects")}
          className={
            isProjects
              ? "flex items-center justify-center gap-2 py-4 text-xs font-semibold tracking-widest text-white border-b-2 border-white"
              : "flex items-center justify-center gap-2 border-b border-transparent py-4 text-xs font-semibold tracking-widest text-zinc-500 hover:text-white hover:border-white"
          }
          aria-pressed={isProjects}>
          <Icon icon="solar:widget-5-linear" width="20" height="20" />
          <span className="hidden md:block">Projects</span>
        </button>

        <button
          type="button"
          onClick={() => handleTabChange("room")}
          className={
            !isProjects
              ? "flex items-center justify-center gap-2 py-4 text-xs font-semibold tracking-widest text-white border-b-2 border-white"
              : "flex items-center justify-center gap-2 border-b border-transparent py-4 text-xs font-semibold tracking-widest text-zinc-500 hover:text-white hover:border-white"
          }
          aria-pressed={!isProjects}>
          <Icon icon="solar:dialog-linear" width="20" height="20" />
          <span className="hidden md:block">Public Chat</span>
        </button>
      </div>

      <div>{isProjects ? projectsSlot : roomSlot}</div>
    </section>
  );
}
