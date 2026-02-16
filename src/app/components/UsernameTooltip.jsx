"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../components/ui/tooltip";

export default function UsernameTooltip({ username, className = "" }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <span className={`cursor-help ${className}`}>{username}</span>
      </TooltipTrigger>
      <TooltipContent side="top" align="center">
        "nvevam" is Caesar cipher (+22) of "rizieq"
      </TooltipContent>
    </Tooltip>
  );
}
