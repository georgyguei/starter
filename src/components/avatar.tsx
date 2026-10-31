"use client";

import Image, { type ImageProps } from "next/image";
import { useId } from "react";
import { LuUser } from "react-icons/lu";

import type { Assign } from "@repo/utils/types";

import { cn } from "@repo/utils/classes";

const DEFAULT_AVATAR_FALLBACK = <LuUser className="icon" />;

/**
 * The props for the Avatar component.
 */
export type AvatarProps = Assign<ImageProps, { name?: string; alt?: ImageProps["alt"]; src?: ImageProps["src"] }>;

/**-----------------------------------------------------------------------------
 * Avatar Component
 * -----------------------------------------------------------------------------
 * Used to represent user profile picture or initials.
 *
 * -----------------------------------------------------------------------------*/
export const Avatar = (props: AvatarProps) => {
  const { name, src, className, children, id, ...remainingProps } = props;

  const uid = useId();

  const avatarId = id || uid;

  const initials = name?.slice(0, 2).toUpperCase();

  const colorHint = name ? stringToColor(name).backgroundColor : undefined;

  const fallback = initials || DEFAULT_AVATAR_FALLBACK;

  return (
    <div id={avatarId} className={cn("avatar")} style={{ "--avatar-color": colorHint } as React.CSSProperties}>
      {/* Fallback layer — shown when no src or image fails to load */}
      {fallback || children ? (
        <div className={cn("avatar-fallback size-10 rounded-full bg-(--avatar-color) text-contrast", className)}>{children || <span>{fallback}</span>}</div>
      ) : null}

      {/* Image layer — only rendered when src is provided */}
      {src && (
        <Image
          src={src}
          alt={name || `Avatar_${avatarId}`}
          height={40}
          width={40}
          className={cn("size-10 rounded-full", className)}
          onLoad={handleImageLoad}
          onError={handleImageError}
          {...remainingProps}
        />
      )}
    </div>
  );
};

function handleImageLoad(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  event.currentTarget.classList.remove("hidden");
}

function handleImageError(event: React.SyntheticEvent<HTMLImageElement, Event>) {
  event.currentTarget.classList.add("hidden");
}

/**
 * Generates a background color and text color based on the provided name.
 * @param name - The name to generate the color from.
 * @returns An object containing the background color and text color.
 */
function stringToColor(name: string) {
  let hash = 0;
  // Loop through each character in the name to generate a hash
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  let backgroundColor = "#";
  // Generate the background color based on the hash
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    backgroundColor += `00${value.toString(16)}`.slice(-2);
  }

  // Determine if the background color is light or dark
  const r = Number.parseInt(backgroundColor.slice(1, 3), 16);
  const g = Number.parseInt(backgroundColor.slice(3, 5), 16);
  const b = Number.parseInt(backgroundColor.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  const color = brightness > 155 ? "#000000" : "#ffffff";

  return { backgroundColor, color };
}
