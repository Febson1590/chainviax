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

// Horizontal logo source is 1956x804 (~2.43:1 aspect).
const FULL_ASPECT = 1956 / 804;
function fullDims(h: number) {
  return { h, w: Math.round(h * FULL_ASPECT) };
}
const FULL_SIZES = {
  sm: fullDims(48),   // w ~117
  md: fullDims(64),   // w ~156  — nav
  lg: fullDims(84),   // w ~204
  xl: fullDims(108),  // w ~263  — auth hero
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
  ) : (
    <Image
      src={src}
      alt={alt}
      width={FULL_SIZES[size].w}
      height={FULL_SIZES[size].h}
      priority={priority}
      className="select-none"
    />
  );

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
