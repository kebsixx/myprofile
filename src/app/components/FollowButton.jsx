"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export default function FollowButton({ className = "" }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <a
            href="https://www.instagram.com/nvevam/"
            target="_blank"
            rel="noreferrer"
            className={
              className ||
              "inline-flex items-center gap-2 justify-center rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
            }>
            Follow
          </a>
        </TooltipTrigger>
        <TooltipContent side="top" align="center">
          Follow me on Instagram!
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
