"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  variant?: "full" | "icon" | "text";
  size?: "sm" | "md" | "lg" | "xl";
  href?: string;
  className?: string;
}

const sizes = {
  sm: { icon: 30, textClass: "text-[15px]" },
  md: { icon: 36, textClass: "text-[18px]" },
  lg: { icon: 48, textClass: "text-[22px]" },
  xl: { icon: 60, textClass: "text-[28px]" },
};

export function Logo({ variant = "full", size = "md", href = "/", className }: LogoProps) {
  const s = sizes[size];

  const mark = (
    <svg
      width={s.icon}
      height={s.icon}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Chainviax"
      className="drop-shadow-[0_2px_10px_rgba(234,179,8,0.35)]"
    >
      <defs>
        <linearGradient id="cv-gold" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="45%" stopColor="#f4c440" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
        <linearGradient id="cv-gold-edge" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#fff3c4" />
          <stop offset="100%" stopColor="#8b6508" />
        </linearGradient>
        <filter id="cv-soft" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="0.6" result="b" />
          <feMerge>
            <feMergeNode in="b" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g filter="url(#cv-soft)" transform="translate(32 32)">
        <g transform="rotate(-28) translate(-8 -10)">
          <rect x="-12" y="-9" width="24" height="18" rx="5.5" ry="5.5" fill="none" stroke="url(#cv-gold)" strokeWidth="5.5" />
          <rect x="-12" y="-9" width="24" height="18" rx="5.5" ry="5.5" fill="none" stroke="url(#cv-gold-edge)" strokeWidth="1" opacity="0.55" />
        </g>
        <g transform="rotate(-28) translate(8 10)">
          <rect x="-12" y="-9" width="24" height="18" rx="5.5" ry="5.5" fill="none" stroke="url(#cv-gold)" strokeWidth="5.5" />
          <rect x="-12" y="-9" width="24" height="18" rx="5.5" ry="5.5" fill="none" stroke="url(#cv-gold-edge)" strokeWidth="1" opacity="0.55" />
        </g>
      </g>
    </svg>
  );

  const content = (
    <div className={cn("flex items-center gap-2.5 select-none", className)}>
      {variant !== "text" && (
        <div className="relative flex-shrink-0" style={{ width: s.icon, height: s.icon }}>
          {mark}
        </div>
      )}
      {variant !== "icon" && (
        <span
          className={cn("font-extrabold tracking-[0.22em] text-white", s.textClass)}
          style={{ textShadow: "0 1px 18px rgba(234,179,8,0.18)" }}
        >
          CHAINVIAX
        </span>
      )}
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
