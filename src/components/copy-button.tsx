"use client";

import { useId, useState } from "react";
import { LuClipboard, LuClipboardCheck } from "react-icons/lu";

interface CopyButtonProps {
  text: string;
  className?: string;
}

export function CopyButton({ text, className }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const id = useId();
  const Component = copied ? LuClipboardCheck : LuClipboard;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="tooltip-arrow tooltip absolute top-1 right-2 tooltip-left tooltip-animated tooltip-accent">
      <button type="button" tabIndex={0} className={className} aria-describedby={id} onClick={handleCopy}>
        <Component className="icon" />
      </button>
      <div id={id} className="tooltip-content" role="tooltip">
        <p className="px-2 py-1 text-sm font-semibold">{copied ? "Copied!" : "Copy"}</p>
        <span className="tooltip-arrow"></span>
      </div>
    </div>
  );
}
