"use client";

import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  /** "full" = chain icon + wordmark (default), "icon" = chain icon only */
  variant?: "full" | "icon";
  /** "dark" = for dark backgrounds (default, CHAINVIAX in white + gold),
   *  "light" = for light backgrounds (CHAINVIAX in black + gold) */
  theme?: "dark" | "light";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
  priority?: boolean;
}

// Trimmed horizontal logos — content only, no surrounding padding.
// Dark PNG is 1589x254 (~6.26:1). Light PNG is 1553x224 (~6.93:1).
const DARK_ASPECT  = 1589 / 254;
const LIGHT_ASPECT = 1553 / 224;
function fullDims(h: number, aspect: number) {
  return { h, w: Math.round(h * aspect) };
}
const FULL_HEIGHTS = {
  sm: 26,
  md: 38,   // fits a standard h-16 navbar with ~13px padding top/bottom
  lg: 50,
  xl: 68,   // auth hero
};

const ICON_SIZES = {
  sm: 28,
  md: 36,
  lg: 48,
  xl: 60,
};

export function Logo({
  variant = "full",
  theme = "dark",
  size = "md",
  href = "/",
  className,
  priority = false,
}: LogoProps) {
  const src =
    variant === "icon"
      ? "/chainviax-icon.png"
      : theme === "light"
        ? "/chainviax-logo-light.png"
        : "/chainviax-logo.png";

  const alt = "Chainviax";

  const img = variant === "icon" ? (
    <Image
      src={src}
      alt={alt}
      width={ICON_SIZES[size]}
      height={ICON_SIZES[size]}
      priority={priority}
      className="select-none"
    />
  ) : (() => {
      const h = FULL_HEIGHTS[size];
      const aspect = theme === "light" ? LIGHT_ASPECT : DARK_ASPECT;
      const { w } = fullDims(h, aspect);
      return (
        <Image
          src={src}
          alt={alt}
          width={w}
          height={h}
          priority={priority}
          className="select-none"
        />
      );
    })();

  const content = (
    <span className={cn("inline-flex items-center", className)}>
      {img}
    </span>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }
  return content;
}
