"use client";

import { type ReactNode, useState } from "react";
import { LuChevronDown } from "react-icons/lu";

import { cn } from "@repo/utils/classes";

interface ExpandableProps {
  /** The clickable title / summary shown when collapsed */
  title: ReactNode;
  /** The content revealed on expand */
  children: ReactNode;
  /** Whether the panel starts open */
  defaultOpen?: boolean;
  /** Called when open state changes */
  onToggle?: (open: boolean) => void;
  /** Extra classes for the outer wrapper */
  className?: string;
}

export function Expandable({ title, children, defaultOpen = false, onToggle, className = "" }: ExpandableProps) {
  const [open, setOpen] = useState(defaultOpen);

  const handleToggle = () => {
    setOpen((prev) => {
      const next = !prev;
      onToggle?.(next);
      return next;
    });
  };

  return (
    <div className={cn("rounded-md border border-base-300 bg-base-100", className)}>
      {/* Trigger */}
      <button
        type="button"
        onClick={handleToggle}
        className="flex w-full cursor-pointer items-center justify-between gap-2 px-4 py-3 text-start font-display"
        aria-expanded={open}
      >
        <span>{title}</span>
        <LuChevronDown className={cn("icon shrink-0 transition-transform duration-400", open && "rotate-180")} />
      </button>

      {/* Expandable content */}
      <div className={cn("expandable", open && "expandable-open")}>
        <div className="px-4 text-sm">{children}</div>
      </div>
    </div>
  );
}
