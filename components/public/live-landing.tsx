"use client";

import Link from "next/link";
import { ArrowUpRight, ArrowDownRight, Star } from "lucide-react";
import { useLiveMarkets, pickAsset } from "./use-live-markets";
import { Sparkline } from "./sparkline";
import type { MarketAsset } from "@/lib/coingecko";
import { formatCurrency } from "@/lib/utils";

/* ═══ shared helpers ═══════════════════════════════════════════════════ */

function coinRing(sym: string): string {
  switch (sym) {
    case "BTC":  return "#f7931a";
    case "ETH":  return "#627eea";
    case "USDT": return "#26a17b";
    case "SOL":  return "#9945ff";
    case "BNB":  return "#f3ba2f";
    case "XRP":  return "#346aa9";
    default:     return "#f4c440";
  }
}
function coinGlyph(sym: string): string {
  switch (sym) {
    case "BTC":  return "₿";
    case "ETH":  return "Ξ";
    case "USDT": return "₮";
    case "SOL":  return "◎";
    case "XRP":  return "X";
    default:     return sym.slice(0, 1);
  }
}
function fallbackSpark(isUp: boolean): number[] {
  const base = [1, 1.02, 0.99, 1.05, 1.03, 1.1, 1.08, 1.15, 1.12, 1.2, 1.18, 1.25, 1.22, 1.3];
  return isUp ? base : base.slice().reverse();
}

/* ═══ HERO PRICE — updates live under the BTC chart card ═══════════════ */

export function LiveHeroPrice({ initial }: { initial: MarketAsset[] }) {
  const { assets, flash } = useLiveMarkets(initial);
  const btc = pickAsset(assets, "BTC");
  const price  = btc?.price ?? 0;
  const change = btc?.change ?? 0;
  const isUp   = change >= 0;
  const f = flash["BTC"];
  const flashCls = f === "up" ? "text-emerald-400" : f === "down" ? "text-red-400" : "text-white";
  return (
    <div className="flex items-baseline gap-3">
      <span className={`text-[30px] sm:text-[36px] font-bold tabular-nums tracking-tight transition-colors duration-500 ${flashCls}`}>
        {formatCurrency(price)}
      </span>
      <span className={`inline-flex items-center gap-0.5 text-[13px] font-bold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
        {isUp ? <ArrowUpRight size={14}/> : <ArrowDownRight size={14}/>}
        {Math.abs(change).toFixed(2)}%
      </span>
    </div>
  );
}

/* ═══ LIVE PRICE STRIP — 4 coins, polled ══════════════════════════════ */

export function LivePriceStrip({ initial, symbols }: { initial: MarketAsset[]; symbols: string[] }) {
  const { assets, flash } = useLiveMarkets(initial);
  const coins = symbols.map((s) => pickAsset(assets, s)).filter(Boolean) as MarketAsset[];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4">
      {coins.map((a, i) => {
        const up = a.change >= 0;
        const f  = flash[a.symbol];
        const flashBg = f === "up" ? "bg-emerald-500/[0.06]" : f === "down" ? "bg-red-500/[0.06]" : "";
        return (
          <div key={a.symbol}
               className={`flex items-center gap-3 px-5 py-4 transition-colors duration-500 ${flashBg} ${i > 0 ? "md:border-l border-white/[0.06]" : ""} ${i >= 2 ? "border-t md:border-t-0 border-white/[0.06]" : ""} ${i === 2 ? "border-l-0 md:border-l" : ""}`}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-white shrink-0"
                 style={{ background: coinRing(a.symbol) }}>
              {coinGlyph(a.symbol)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-[13px] font-bold text-white truncate">{a.name}</span>
                <span className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">{a.symbol}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[14px] font-bold text-white tabular-nums">{formatCurrency(a.price)}</span>
                <span className={`text-[11px] font-bold tabular-nums ${up ? "text-emerald-400" : "text-red-400"}`}>
                  {up ? "+" : "−"}{Math.abs(a.change).toFixed(2)}%
                </span>
              </div>
            </div>
            {f && (
              <span aria-hidden className={`h-1.5 w-1.5 rounded-full ${f === "up" ? "bg-emerald-400" : "bg-red-400"} animate-pulse`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

/* ═══ LIVE MARKET CARDS — 3-up, polled ════════════════════════════════ */

export function LiveMarketCards({ initial, symbols }: { initial: MarketAsset[]; symbols: string[] }) {
  const { assets, flash } = useLiveMarkets(initial);
  return (
    <>
      {symbols.map((sym, i) => {
        const a = pickAsset(assets, sym);
        return <LiveMarketCard key={sym} n={String(i + 1).padStart(2, "0")} asset={a} flash={flash[sym]} />;
      })}
    </>
  );
}

function LiveMarketCard({ n, asset, flash }: { n: string; asset?: MarketAsset; flash: "up" | "down" | null | undefined }) {
  const price  = asset?.price ?? 0;
  const change = asset?.change ?? 0;
  const isUp   = change >= 0;
  const sym    = asset?.symbol ?? "—";
  const flashCls = flash === "up" ? "text-emerald-400" : flash === "down" ? "text-red-400" : "text-white";
  return (
    <article className="chainviax-card-elite p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-[22px] font-black text-white"
               style={{
                 background: `linear-gradient(145deg, ${coinRing(sym)}, ${coinRing(sym)}aa)`,
                 boxShadow: `0 10px 24px ${coinRing(sym)}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
               }}>
            {coinGlyph(sym)}
          </div>
          <div>
            <div className="text-[17px] font-bold text-white">{asset?.name ?? "—"}</div>
            <div className="text-[10.5px] uppercase tracking-[0.22em] text-slate-500 font-bold flex items-center gap-1.5">
              {sym}
              <span aria-hidden className="inline-flex items-center gap-1 text-emerald-400/80 normal-case tracking-normal font-semibold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                live
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400/90" />
          <span className="text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">{n}</span>
        </div>
      </div>
      <div className="mt-5 h-px w-full bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className="mt-5 flex items-end justify-between gap-4">
        <div>
          <div className={`text-[28px] sm:text-[30px] font-bold tabular-nums tracking-tight transition-colors duration-500 ${flashCls}`}>
            {formatCurrency(price)}
          </div>
          <span className={`mt-1.5 inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tabular-nums ${isUp ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"}`}>
            {isUp ? "+" : "−"}{Math.abs(change).toFixed(2)}%
          </span>
        </div>
        <div className="w-[120px] h-[44px] opacity-95">
          <Sparkline
            data={asset?.sparkline?.length ? asset.sparkline : fallbackSpark(isUp)}
            width={120} height={44} idSuffix={`mk-${sym}`}
          />
        </div>
      </div>
      <Link href="/markets"
            className="mt-5 chainviax-btn-outline-dark inline-flex w-full items-center justify-center h-10 rounded-md text-[12.5px] font-semibold">
        Trade {sym}
      </Link>
    </article>
  );
}
