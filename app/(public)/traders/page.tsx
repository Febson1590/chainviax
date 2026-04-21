import Link from "next/link";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import { ArrowRight, Copy, Star, TrendingUp } from "lucide-react";
import { formatCompact } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Top Traders",
  description: "Browse Chainviax copy traders. View performance, win rate, and followers. Pick a trader to copy and let your account follow their trades.",
};

export default async function PublicTradersPage() {
  const [traders, session] = await Promise.all([
    db.copyTrader.findMany({
      where: { isActive: true },
      orderBy: [
        { isFeaturedOnLanding: "desc" },
        { featuredOrder: { sort: "asc", nulls: "last" } },
        { performance30d: "desc" },
      ],
    }),
    auth(),
  ]);
  const isSignedIn = !!session?.user?.id;

  return (
    <div className="relative bg-[#04060c] text-white min-h-screen">
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full blur-[150px] opacity-30"
             style={{ background: "radial-gradient(circle, rgba(244,196,64,0.22), transparent 65%)" }} />
      </div>

      <section className="relative z-10 pt-32 pb-16 px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1280px] mx-auto">
          <div className="chainviax-eyebrow inline-flex items-center gap-2 mb-6">
            <span className="chainviax-dot" /> Copy Trading
          </div>
          <h1 className="font-bold tracking-[-0.025em] text-[44px] sm:text-[56px] lg:text-[68px] leading-[0.98] max-w-3xl">
            <span className="block text-white">Browse top traders.</span>
            <span className="block chainviax-gold-text">Copy the best.</span>
          </h1>
          <p className="mt-6 text-[16px] text-slate-300/90 leading-relaxed max-w-xl">
            Pick a trader with a track record you like. Your account follows their trades automatically.
            Stop any time — your funds stay in your own wallet.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-5 sm:px-8 lg:px-12 pb-24">
        <div className="max-w-[1280px] mx-auto">
          {traders.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
              {traders.map((t) => <PublicTraderCard key={t.id} trader={t} isSignedIn={isSignedIn} />)}
            </div>
          )}
          <p className="mt-10 text-[12px] text-slate-600 text-center max-w-xl mx-auto leading-relaxed">
            All stats are shown for information only. Crypto is volatile and past performance does not guarantee future results.
            You keep full control of your funds and can stop copying any time.
          </p>
        </div>
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="chainviax-card-elite px-8 py-16 text-center">
      <div className="w-14 h-14 mx-auto rounded-2xl flex items-center justify-center mb-5"
           style={{
             background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
             border: "1px solid rgba(244,196,64,0.4)",
           }}>
        <TrendingUp className="h-6 w-6 text-amber-300" />
      </div>
      <h2 className="text-[22px] font-bold text-white mb-2">No traders available yet</h2>
      <p className="text-[14px] text-slate-400 max-w-md mx-auto">
        New traders are added all the time. Create an account and we&rsquo;ll let you know as soon as they&rsquo;re live.
      </p>
      <Link href="/register"
            className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-11 px-6 mt-6 rounded-[10px] text-[13px] font-bold">
        Create Account <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

type T = Awaited<ReturnType<typeof db.copyTrader.findMany>>[number];

function ringColorFor(name: string): string {
  const palette = ["#f7931a", "#627eea", "#9945ff", "#26a17b", "#f3ba2f", "#346aa9", "#e84142", "#2a5ada"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function PublicTraderCard({ trader: t, isSignedIn }: { trader: T; isSignedIn: boolean }) {
  const ring = ringColorFor(t.name);
  const initials = t.name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
  const perf = Number(t.performance30d);
  const win  = Number(t.winRate);
  const isPos = perf >= 0;
  const copyHref = isSignedIn
    ? `/dashboard/copy-trading?trader=${t.id}`
    : `/register?next=/dashboard/copy-trading?trader=${t.id}`;

  return (
    <article className="chainviax-card-elite p-6 flex flex-col">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="relative w-12 h-12 rounded-full flex items-center justify-center text-[16px] font-black text-white overflow-hidden shrink-0"
               style={{
                 background: `linear-gradient(145deg, ${ring}, ${ring}88)`,
                 boxShadow: `0 10px 24px ${ring}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
               }}>
            {t.avatarUrl
              ? <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
              : <span>{initials || "?"}</span>}
          </div>
          <div className="min-w-0">
            <div className="text-[15px] font-bold text-white truncate">{t.name}</div>
            <div className="text-[10.5px] uppercase tracking-[0.2em] text-slate-500 font-bold truncate">
              {t.specialty ?? "Crypto Trader"}
            </div>
          </div>
        </div>
        {t.isFeaturedOnLanding && (
          <span className="shrink-0 inline-flex items-center gap-1 text-[10px] font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2 py-1 rounded-full">
            <Star className="h-3 w-3 fill-amber-300" /> Featured
          </span>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">30-Day Return</div>
          <div className={`text-[26px] font-bold tabular-nums tracking-tight leading-none ${isPos ? "text-emerald-400" : "text-red-400"}`}>
            {isPos ? "+" : ""}{perf.toFixed(1)}%
          </div>
        </div>
        <div className={`text-[10px] uppercase tracking-widest font-bold px-2 py-1 rounded-md ${
          t.riskLevel === "LOW"  ? "bg-emerald-500/15 text-emerald-300" :
          t.riskLevel === "HIGH" ? "bg-red-500/15 text-red-300" :
                                   "bg-amber-500/15 text-amber-300"
        }`}>
          {t.riskLevel} Risk
        </div>
      </div>

      <div className="mt-5 pt-4 border-t border-white/[0.06] grid grid-cols-3 gap-2">
        <div>
          <div className="text-[14px] font-bold text-white tabular-nums">{win.toFixed(0)}%</div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-0.5">Win Rate</div>
        </div>
        <div>
          <div className="text-[14px] font-bold text-white tabular-nums">{formatCompact(t.followers)}</div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-0.5">Followers</div>
        </div>
        <div>
          <div className="text-[14px] font-bold text-white tabular-nums">${Number(t.minCopyAmount).toFixed(0)}</div>
          <div className="text-[9.5px] uppercase tracking-[0.2em] text-slate-500 font-bold mt-0.5">Min Copy</div>
        </div>
      </div>

      {t.description && (
        <p className="mt-4 text-[12.5px] text-slate-400 leading-relaxed line-clamp-2">
          {t.description}
        </p>
      )}

      <Link href={copyHref}
            className="mt-5 chainviax-btn-outline-dark inline-flex w-full items-center justify-center gap-2 h-11 rounded-md text-[13px] font-bold hover:border-amber-500/40">
        <Copy className="h-3.5 w-3.5" /> {isSignedIn ? "Copy Trader" : "Sign in to Copy"}
      </Link>
    </article>
  );
}
