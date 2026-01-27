"use client";

import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";

export default function CopyToClipboardButton({
  value,
  ariaLabel = "Copy",
  className = "",
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 900);
    return () => clearTimeout(t);
  }, [copied]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(String(value ?? ""));
      setCopied(true);
    } catch {
      // Ignore; clipboard may be blocked by browser permissions.
    }
  };

  return (
    <button
      type="button"
      onClick={onCopy}
      aria-label={ariaLabel}
      title={copied ? "Copied" : ariaLabel}
      className={
        "inline-flex h-7 w-7 items-center justify-center rounded-md bg-white/0 text-white/80 ring-1 ring-white/10 backdrop-blur-sm transition hover:bg-white/10 hover:text-white " +
        className
      }>
      <Icon
        icon={copied ? "solar:check-circle-linear" : "solar:copy-linear"}
        width="16"
        height="16"
      />
    </button>
  );
}
