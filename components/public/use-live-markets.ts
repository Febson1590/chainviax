"use client";
import { useEffect, useRef, useState } from "react";
import type { MarketAsset } from "@/lib/coingecko";

/**
 * Poll /api/markets/public every `intervalMs` (default 30s) and keep
 * the latest snapshot in state. `initial` is the SSR snapshot so the
 * first paint has real data without flashing.
 */
export function useLiveMarkets(initial: MarketAsset[], intervalMs = 30_000) {
  const [assets, setAssets] = useState<MarketAsset[]>(initial);
  const [flash, setFlash] = useState<Record<string, "up" | "down" | null>>({});
  const lastRef = useRef<Map<string, number>>(new Map(initial.map((a) => [a.symbol, a.price])));

  useEffect(() => {
    let alive = true;
    async function tick() {
      try {
        const res = await fetch("/api/markets/public", { cache: "no-store" });
        if (!res.ok) return;
        const data = (await res.json()) as { assets: MarketAsset[] };
        if (!alive || !Array.isArray(data.assets)) return;

        const nextFlash: Record<string, "up" | "down" | null> = {};
        for (const a of data.assets) {
          const prev = lastRef.current.get(a.symbol);
          if (prev != null && a.price !== prev) {
            nextFlash[a.symbol] = a.price > prev ? "up" : "down";
          }
          lastRef.current.set(a.symbol, a.price);
        }

        setAssets(data.assets);
        if (Object.keys(nextFlash).length) {
          setFlash(nextFlash);
          window.setTimeout(() => { if (alive) setFlash({}); }, 900);
        }
      } catch {
        /* swallow — stay on previous snapshot */
      }
    }
    const id = window.setInterval(tick, intervalMs);
    return () => { alive = false; window.clearInterval(id); };
  }, [intervalMs]);

  return { assets, flash };
}

export function pickAsset(assets: MarketAsset[], symbol: string): MarketAsset | undefined {
  return assets.find((a) => a.symbol === symbol);
}
