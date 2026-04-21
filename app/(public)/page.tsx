import Link from "next/link";
import {
  ArrowRight, ShieldCheck, TrendingUp, Repeat, Wallet, Users,
  UserPlus, BadgeCheck, Copy, Activity,
} from "lucide-react";
import { getMarketAssets, type MarketAsset } from "@/lib/coingecko";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { getFeaturedLandingTraders } from "@/lib/actions/investment";
import { auth } from "@/auth";
import {
  LiveHeroPrice, LivePriceStrip, LiveMarketCards, LiveMarketTable,
} from "@/components/public/live-landing";

/* ═══════════════════════════════════════════════════════════════════════
   Chainviax — invest + copy-trading landing page
   Hero · live prices · two ways to invest · top traders · markets
   · features · how it works · trust · CTA
   ═══════════════════════════════════════════════════════════════════════ */

export default async function HomePage() {
  const [markets, featuredTraders, session] = await Promise.all([
    getMarketAssets(),
    getFeaturedLandingTraders(3),
    auth(),
  ]);
  const btc  = markets.find((a) => a.symbol === "BTC");
  const totalVolume = markets.reduce((a, m) => a + (m.volume24h || 0), 0);
  const isSignedIn = !!session?.user?.id;

  return (
    <div className="relative bg-[#04060c] text-white overflow-x-hidden">
      <AmbientGlow />
      <Hero initial={markets} btc={btc} />
      <LivePricesSection initial={markets} />
      <TwoWaysSection />
      {featuredTraders.length > 0 && (
        <TradersSection traders={featuredTraders} isSignedIn={isSignedIn} />
      )}
      <MarketsSection initial={markets} />
      <FeaturesRow />
      <HowItWorks />
      <TrustStrip totalVolume={totalVolume} />
      <ClosingCTA />
    </div>
  );
}

/* ═══ ambient glow ═════════════════════════════════════════════════════ */

function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full blur-[150px] opacity-40"
           style={{ background: "radial-gradient(circle, rgba(244,196,64,0.28), transparent 65%)" }} />
      <div className="absolute top-[1400px] left-[-300px] w-[700px] h-[700px] rounded-full blur-[150px] opacity-20"
           style={{ background: "radial-gradient(circle, rgba(244,196,64,0.18), transparent 70%)" }} />
    </div>
  );
}

/* ═══ HERO ═════════════════════════════════════════════════════════════ */

function Hero({ initial, btc }: { initial: MarketAsset[]; btc?: MarketAsset }) {
  const price  = btc?.price ?? 43582.21;
  const high24 = price * 1.018;
  const low24  = price * 0.986;

  return (
    <section className="relative z-10 pt-28 md:pt-36 pb-20 md:pb-28 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] gap-14 lg:gap-16 items-center">
        <div className="relative max-w-2xl">
          <div className="chainviax-eyebrow inline-flex items-center gap-2 mb-9">
            <span className="chainviax-dot" /> Crypto Trading & Copy Investing
          </div>
          <h1 className="font-bold tracking-[-0.025em] text-[56px] sm:text-[76px] lg:text-[100px] leading-[0.94]">
            <span className="block text-white">Invest in Crypto</span>
            <span className="block chainviax-gold-text">Your Way.</span>
          </h1>
          <p className="mt-8 text-[17px] sm:text-[18px] text-slate-300/90 leading-[1.55] max-w-lg">
            Trade on your own, or copy top traders and let your account follow theirs.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-[56px] px-10 rounded-[10px] text-[14px] font-bold tracking-wide">
              Start Investing <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/traders" className="chainviax-btn-outline inline-flex items-center justify-center h-[56px] px-8 rounded-[10px] text-[14px] font-semibold">
              Explore Traders
            </Link>
          </div>
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <span>Safe storage</span>
            <span className="h-1 w-1 rounded-full bg-amber-500/60" />
            <span>Live 24/7</span>
            <span className="h-1 w-1 rounded-full bg-amber-500/60" />
            <span>Withdraw anytime</span>
          </div>
        </div>

        {/* clean trading panel — no floating decorative coins */}
        <div className="relative w-full">
          <div aria-hidden className="absolute -inset-6 -z-10 blur-[100px] opacity-60"
               style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(244,196,64,0.22), transparent 70%)" }} />

          <div className="relative chainviax-card-elite overflow-hidden">
            <div className="flex items-center justify-between px-6 h-12 border-b border-white/[0.06] bg-black/30">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#1f1f24]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1f1f24]" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#1f1f24]" />
                <span className="ml-4 text-[10.5px] uppercase tracking-[0.22em] text-slate-500 font-bold">chainviax.com</span>
              </div>
              <span className="text-[11px] uppercase tracking-[0.22em] text-amber-300/90 font-bold">BTC / USD</span>
              <span className="inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.2em] text-emerald-400/90 font-bold">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </div>

            <div className="flex items-start justify-between px-6 pt-5">
              <LiveHeroPrice initial={initial} />
              <div className="hidden sm:flex items-center gap-5 text-right">
                <div>
                  <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 font-bold">24h High</div>
                  <div className="text-[13px] font-bold text-emerald-400 tabular-nums">{formatCurrency(high24)}</div>
                </div>
                <div>
                  <div className="text-[9px] uppercase tracking-[0.22em] text-slate-500 font-bold">24h Low</div>
                  <div className="text-[13px] font-bold text-red-400 tabular-nums">{formatCurrency(low24)}</div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between px-6 pt-4">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
                {["1H","4H","1D","1W","1M"].map((t,i) => (
                  <span key={t} className={`px-2.5 py-1 rounded-md ${i===2 ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" : "text-slate-500 border border-transparent"}`}>{t}</span>
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Candles · 5m</div>
            </div>

            <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] mt-2">
              <HeroChart />
            </div>

            <div className="relative h-[48px] border-t border-white/[0.06] flex items-end justify-between gap-0.5 px-6 pt-2 pb-2">
              {Array.from({ length: 40 }).map((_, i) => {
                const h = 8 + Math.abs(Math.sin(i * 1.6) * 28) + (i % 5 === 0 ? 12 : 0);
                const up = i % 3 !== 0;
                return (
                  <span key={i} className={`block w-[3px] rounded-sm ${up ? "bg-emerald-500/55" : "bg-red-500/45"}`} style={{ height: h }} />
                );
              })}
              <div className="absolute right-6 top-2 text-[9px] uppercase tracking-widest text-slate-600 font-bold">Volume</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroChart() {
  return (
    <svg viewBox="0 0 600 300" preserveAspectRatio="none" className="absolute inset-0 w-full h-full">
      <defs>
        <linearGradient id="hero-area" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#f4c440" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#f4c440" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="hero-line" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#fde68a" />
          <stop offset="100%" stopColor="#f4c440" />
        </linearGradient>
      </defs>
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.035)" strokeDasharray="3 5" />
      ))}
      {[
        [40, 210, 45, 7, true],[70, 190, 32, 7, false],[100, 180, 50, 7, true],
        [130, 165, 40, 7, false],[160, 140, 55, 7, true],[190, 160, 25, 7, false],
        [220, 120, 50, 7, true],[250, 135, 35, 7, false],[280, 100, 55, 7, true],
        [310, 110, 38, 7, false],[340, 85, 48, 7, true],[370, 95, 30, 7, false],
        [400, 70, 40, 7, true],[430, 80, 28, 7, false],[460, 55, 36, 7, true],
        [490, 65, 24, 7, false],[520, 40, 40, 7, true],[550, 48, 22, 7, false],
      ].map((c, i) => {
        const [x, y, h, w, up] = c as [number, number, number, number, boolean];
        return (
          <g key={i}>
            <line x1={x} y1={y-7} x2={x} y2={y+h+7}
                  stroke={up ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)"} strokeWidth="1" />
            <rect x={x-w/2} y={y} width={w} height={h} rx="1"
                  fill={up ? "rgba(16,185,129,0.92)" : "rgba(239,68,68,0.92)"} />
          </g>
        );
      })}
      <path
        d="M0,265 C80,245 140,225 200,205 C260,185 300,155 360,135 C420,115 470,95 520,75 C560,55 590,45 600,40 L600,300 L0,300 Z"
        fill="url(#hero-area)"
      />
      <path
        d="M0,265 C80,245 140,225 200,205 C260,185 300,155 360,135 C420,115 470,95 520,75 C560,55 590,45 600,40"
        stroke="url(#hero-line)" strokeWidth="2.4" fill="none" strokeLinecap="round"
      />
      <circle cx="600" cy="40" r="4" fill="#fde68a" />
      <circle cx="600" cy="40" r="10" fill="#f4c440" fillOpacity="0.25" />
    </svg>
  );
}

/* ═══ LIVE PRICES ══════════════════════════════════════════════════════ */

function LivePricesSection({ initial }: { initial: MarketAsset[] }) {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 pb-6">
      <div className="max-w-[1320px] mx-auto chainviax-hairline-bar">
        <LivePriceStrip initial={initial} symbols={["BTC", "ETH", "SOL", "USDT"]} />
      </div>
    </section>
  );
}

/* ═══ TWO WAYS TO INVEST ═══════════════════════════════════════════════ */

function TwoWaysSection() {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading
          eyebrow="Two Ways"
          headingLead="Choose how you"
          headingGold="want to invest."
        />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-0 relative">
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/30 to-transparent" />
          {/* Trade yourself */}
          <div className="p-10 md:pr-14 border-b md:border-b-0 md:border-r border-white/[0.06]">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                 style={{
                   background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
                   border: "1px solid rgba(244,196,64,0.4)",
                   boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                 }}>
              <TrendingUp className="h-5 w-5 text-amber-300" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80 font-bold mb-3">Trade Yourself</div>
            <h3 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-[1.1] mb-4">
              Buy and sell any coin, any time.
            </h3>
            <p className="text-[15px] text-slate-400 leading-[1.6] max-w-md mb-6">
              Open the charts, place a market or limit order, and watch it fill in seconds.
            </p>
            <Link href="/markets" className="inline-flex items-center gap-2 text-[13px] font-bold text-amber-300 hover:text-amber-200">
              View Markets <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          {/* Copy a trader */}
          <div className="p-10 md:pl-14">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6"
                 style={{
                   background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
                   border: "1px solid rgba(244,196,64,0.4)",
                   boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
                 }}>
              <Copy className="h-5 w-5 text-amber-300" />
            </div>
            <div className="text-[11px] uppercase tracking-[0.22em] text-amber-300/80 font-bold mb-3">Copy a Trader</div>
            <h3 className="text-[28px] sm:text-[32px] font-bold tracking-tight leading-[1.1] mb-4">
              Let a top trader invest for you.
            </h3>
            <p className="text-[15px] text-slate-400 leading-[1.6] max-w-md mb-6">
              Pick a trader with a strong track record. Your account follows every trade they make.
            </p>
            <Link href="/traders" className="inline-flex items-center gap-2 text-[13px] font-bold text-amber-300 hover:text-amber-200">
              Browse Traders <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
        </div>
      </div>
    </section>
  );
}

/* ═══ TOP TRADERS — fed by db.copyTrader (featured on landing) ════════ */

type DbTrader = Awaited<ReturnType<typeof getFeaturedLandingTraders>>[number];

function TradersSection({ traders, isSignedIn }: { traders: DbTrader[]; isSignedIn: boolean }) {
  return (
    <section id="traders" className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading
          eyebrow="Top Traders"
          headingLead="Copy a trader."
          headingGold="Grow together."
          rightText="Past performance shown · Not a guarantee"
        />
        <div className={`mt-12 grid gap-5 lg:gap-6 grid-cols-1 ${traders.length >= 3 ? "md:grid-cols-3" : traders.length === 2 ? "md:grid-cols-2" : ""}`}>
          {traders.map((t) => <TraderCard key={t.id} trader={t} isSignedIn={isSignedIn} />)}
        </div>
        <p className="mt-8 text-[12px] text-slate-600 text-center max-w-xl mx-auto leading-relaxed">
          All stats are shown for information only. Crypto is volatile and past performance does not guarantee future results.
          You keep full control of your funds and can stop copying any time.
        </p>
      </div>
    </section>
  );
}

function initialsFrom(name: string): string {
  return name.trim().split(/\s+/).slice(0, 2).map((p) => p[0]?.toUpperCase() ?? "").join("");
}
function ringColorFor(name: string): string {
  const palette = ["#f7931a", "#627eea", "#9945ff", "#26a17b", "#f3ba2f", "#346aa9", "#e84142", "#2a5ada"];
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return palette[h % palette.length];
}

function TraderCard({ trader: t, isSignedIn }: { trader: DbTrader; isSignedIn: boolean }) {
  const ring = ringColorFor(t.name);
  const initials = initialsFrom(t.name);
  const perf = Number(t.performance30d);
  const win  = Number(t.winRate);
  const followers = t.followers;
  const copyHref = isSignedIn ? `/dashboard/copy-trading?trader=${t.id}` : `/register?next=/dashboard/copy-trading?trader=${t.id}`;
  const isPos = perf >= 0;

  return (
    <article className="chainviax-card-elite p-7">
      <div className="flex items-center gap-4">
        <div className="relative w-14 h-14 rounded-full flex items-center justify-center text-[18px] font-black text-white overflow-hidden"
             style={{
               background: `linear-gradient(145deg, ${ring}, ${ring}88)`,
               boxShadow: `0 10px 24px ${ring}55, inset 0 1px 0 rgba(255,255,255,0.25)`,
             }}>
          {t.avatarUrl
            ? <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
            : <span>{initials || "?"}</span>}
          <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center bg-amber-400 text-[10px] font-black text-[#1b1205] shadow-[0_4px_10px_rgba(244,196,64,0.6)]" title="Verified trader">✓</span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[16px] font-bold text-white truncate">{t.name}</div>
          <div className="text-[11px] uppercase tracking-[0.2em] text-slate-500 font-bold truncate">
            {t.specialty ?? "Crypto Trader"}
          </div>
        </div>
      </div>

      {/* 30d return + spark */}
      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] uppercase tracking-[0.22em] text-slate-500 font-bold mb-1">30-Day Return</div>
          <div className={`text-[30px] font-bold tabular-nums tracking-tight leading-none ${isPos ? "text-emerald-400" : "text-red-400"}`}>
            {isPos ? "+" : ""}{perf.toFixed(1)}%
          </div>
        </div>
        <TraderSpark profit={perf} />
      </div>

      {/* stats row */}
      <div className="mt-6 pt-5 border-t border-white/[0.06] grid grid-cols-3 gap-3">
        <Stat big={`${win.toFixed(0)}%`} small="Win Rate" />
        <Stat big={formatCompact(followers)} small="Followers" />
        <Stat big={t.riskLevel} small="Risk" />
      </div>

      <Link href={copyHref}
            className="mt-6 chainviax-btn-outline-dark inline-flex w-full items-center justify-center gap-2 h-11 rounded-md text-[13px] font-bold hover:border-amber-500/40">
        <Copy className="h-3.5 w-3.5" /> {isSignedIn ? "Copy Trader" : "Sign in to Copy"}
      </Link>
    </article>
  );
}

function Stat({ big, small }: { big: string; small: string }) {
  return (
    <div>
      <div className="text-[16px] font-bold text-white tabular-nums">{big}</div>
      <div className="text-[9.5px] uppercase tracking-[0.22em] text-slate-500 font-bold mt-0.5">{small}</div>
    </div>
  );
}

function TraderSpark({ profit }: { profit: number }) {
  // synthesize a gently rising curve that ends at the stated profit
  const N = 16;
  const pts = Array.from({ length: N }, (_, i) => {
    const t = i / (N - 1);
    const trend = t * profit;
    const wobble = Math.sin(i * 1.7 + profit) * (Math.abs(profit) * 0.04);
    return trend + wobble;
  });
  const min = Math.min(...pts);
  const max = Math.max(...pts);
  const W = 110, H = 40, pad = 4;
  const xs = pts.map((_, i) => pad + (i * (W - 2 * pad)) / (N - 1));
  const ys = pts.map((v) => H - pad - ((v - min) / (max - min || 1)) * (H - 2 * pad));
  const d = xs.map((x, i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${ys[i].toFixed(1)}`).join(" ");
  const da = `${d} L${(W - pad).toFixed(1)},${H} L${pad},${H} Z`;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className="shrink-0">
      <defs>
        <linearGradient id={`tg-${profit}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#10b981" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={da} fill={`url(#tg-${profit})`} />
      <path d={d} stroke="#10b981" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/* ═══ MARKETS ══════════════════════════════════════════════════════════ */

function MarketsSection({ initial }: { initial: MarketAsset[] }) {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 md:py-24">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading
          eyebrow="Live Prices"
          headingLead="Trade any coin"
          headingGold="at live prices."
          rightLink={{ href: "/markets", label: "View all" }}
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          <LiveMarketCards initial={initial} symbols={["BTC", "ETH", "USDT"]} />
        </div>
        <div className="mt-8">
          <LiveMarketTable initial={initial} symbols={["SOL", "BNB", "XRP", "DOGE", "AVAX", "LINK"]} />
        </div>
      </div>
    </section>
  );
}

/* ═══ FEATURES ═════════════════════════════════════════════════════════ */

function FeaturesRow() {
  const items = [
    { icon: Users,       title: "Copy Expert Traders", desc: "Follow top traders and match their trades in one tap." },
    { icon: Activity,    title: "Track Performance",   desc: "See your profit, loss, and history in a clean dashboard." },
    { icon: Wallet,      title: "Withdraw Anytime",    desc: "Your money is yours. Pull it out whenever you want." },
    { icon: ShieldCheck, title: "Secure Your Account", desc: "Email codes on every sign-in. Most crypto kept offline." },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-28">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading eyebrow="What You Get" headingLead="Everything you need" headingGold="to invest." />
        <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 relative">
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
          {items.map((f, i) => (
            <div key={f.title}
                 className={`py-9 px-8 ${i > 0 ? "lg:border-l border-white/[0.06]" : ""} ${i === 1 ? "sm:border-l lg:border-l" : ""} ${i === 3 ? "sm:border-l" : ""} ${i >= 2 ? "border-t sm:border-t-0 lg:border-t-0 border-white/[0.06]" : ""} ${i === 2 ? "sm:border-t" : ""}`}>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5"
                   style={{
                     background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
                     border: "1px solid rgba(244,196,64,0.4)",
                   }}>
                <f.icon className="h-5 w-5 text-amber-300" />
              </div>
              <h3 className="text-[17px] font-bold text-white mb-2">{f.title}</h3>
              <p className="text-[13.5px] text-slate-400 leading-[1.6]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ═══ HOW IT WORKS ═════════════════════════════════════════════════════ */

function HowItWorks() {
  const steps = [
    { n: "01", icon: UserPlus,   title: "Sign Up",         desc: "Open a free account with just your email." },
    { n: "02", icon: BadgeCheck, title: "Add Money",       desc: "Deposit a small amount to get started. No minimum." },
    { n: "03", icon: Repeat,     title: "Trade or Copy",   desc: "Buy a coin yourself, or pick a trader to copy." },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading eyebrow="Get Started" headingLead="Start investing" headingGold="in 3 steps." />
        <div className="mt-14 relative">
          <div aria-hidden className="hidden md:block absolute top-9 left-[10%] right-[10%] h-px"
               style={{ backgroundImage: "linear-gradient(90deg, rgba(244,196,64,0.4) 50%, transparent 0)", backgroundSize: "10px 1px" }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative flex flex-col items-start md:items-center md:text-center">
                <div className="relative w-[72px] h-[72px] rounded-full flex items-center justify-center mb-6"
                     style={{
                       background: "radial-gradient(circle at 35% 30%, rgba(244,196,64,0.35), rgba(139,101,8,0.12) 70%)",
                       border: "1px solid rgba(244,196,64,0.45)",
                       boxShadow: "0 20px 60px rgba(244,196,64,0.18), inset 0 1px 0 rgba(255,255,255,0.15)",
                     }}>
                  <s.icon className="h-6 w-6 text-amber-200" />
                  <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-black text-[#1b1205] bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600 shadow-[0_6px_14px_rgba(244,196,64,0.55)]">{s.n}</span>
                </div>
                <h3 className="text-[22px] sm:text-[24px] font-bold text-white mb-2 tracking-tight">{s.title}</h3>
                <p className="text-[14.5px] text-slate-400 leading-[1.6] max-w-xs">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ TRUST STRIP ══════════════════════════════════════════════════════ */

function TrustStrip({ totalVolume }: { totalVolume: number }) {
  const items = [
    { big: `$${formatCompact(totalVolume || 8_755_342_108)}`, small: "Traded Today" },
    { big: "98+",    small: "Coins to Trade" },
    { big: "1,200+", small: "Traders to Copy" },
    { big: "250K+",  small: "Happy Users" },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-14 md:py-16">
      <div className="max-w-[1320px] mx-auto chainviax-hairline-bar">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {items.map((it, i) => (
            <div key={it.small}
                 className={`px-6 py-7 ${i > 0 ? "md:border-l border-white/[0.06]" : ""} ${i === 2 ? "border-l md:border-l" : ""} ${i >= 2 ? "border-t md:border-t-0 border-white/[0.06]" : ""}`}>
              <div className="chainviax-gold-text text-[28px] sm:text-[32px] font-bold tabular-nums tracking-tight leading-none">{it.big}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">{it.small}</div>
            </div>
          ))}
        </div>
        <div className="border-t border-white/[0.06] px-6 py-5 flex flex-wrap items-center justify-center gap-x-10 gap-y-3 opacity-70">
          <span className="text-[10px] uppercase tracking-[0.3em] text-slate-600 font-bold">As seen in</span>
          <span className="text-slate-400/80 font-serif italic text-[22px] tracking-tight">Forbes</span>
          <span className="text-slate-400/80 font-bold text-[18px] tracking-tighter">Bloomberg</span>
          <span className="text-slate-400/80 font-black text-[18px] tracking-tight">YAHOO!</span>
          <span className="text-slate-400/80 font-semibold text-[18px] tracking-tight">coindesk</span>
          <span className="text-slate-400/80 font-black italic text-[18px] tracking-[0.1em]">CNBC</span>
        </div>
      </div>
    </section>
  );
}

/* ═══ CLOSING CTA ══════════════════════════════════════════════════════ */

function ClosingCTA() {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-28 pb-28 md:pb-32">
      <div className="max-w-[960px] mx-auto">
        <div className="chainviax-card-elite relative overflow-hidden px-8 sm:px-14 py-14 sm:py-16 text-center">
          <div aria-hidden className="absolute inset-0 pointer-events-none"
               style={{ background: "radial-gradient(60% 80% at 50% 0%, rgba(244,196,64,0.18), transparent 70%)" }} />
          <div className="relative">
            <div className="inline-flex items-center gap-2 chainviax-eyebrow mb-6">
              <span className="chainviax-dot" /> Ready?
            </div>
            <h2 className="text-[34px] sm:text-[44px] lg:text-[54px] font-bold tracking-[-0.02em] leading-[1.04]">
              <span className="text-white">Your first investment </span>
              <span className="chainviax-gold-text">starts here.</span>
            </h2>
            <p className="mt-5 text-[15px] text-slate-400 max-w-lg mx-auto leading-relaxed">
              Trade on your own or copy a top trader. Open an account and start today.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register" className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-[54px] px-9 rounded-[10px] text-[14px] font-bold tracking-wide">
                Start Investing <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/traders" className="chainviax-btn-outline inline-flex items-center justify-center h-[54px] px-8 rounded-[10px] text-[14px] font-semibold">
                Explore Traders
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">
              <span>Free account</span>
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              <span>No minimum</span>
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              <span>Withdraw anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══ Section heading ══════════════════════════════════════════════════ */

function SectionHeading({
  eyebrow, headingLead, headingGold, rightLink, rightText,
}: {
  eyebrow: string;
  headingLead: string;
  headingGold: string;
  rightLink?: { href: string; label: string };
  rightText?: string;
}) {
  return (
    <div className="flex items-end justify-between gap-8 flex-wrap">
      <div className="max-w-2xl">
        <div className="inline-flex items-center gap-2 chainviax-eyebrow mb-5">
          <span className="chainviax-dot" /> {eyebrow}
        </div>
        <h2 className="text-[30px] sm:text-[38px] lg:text-[48px] font-bold tracking-[-0.02em] leading-[1.05]">
          <span className="text-white">{headingLead}</span>{" "}
          <span className="chainviax-gold-text">{headingGold}</span>
        </h2>
      </div>
      {rightLink && (
        <Link href={rightLink.href} className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.22em] text-amber-300 font-bold hover:text-amber-200">
          {rightLink.label}
          <ArrowRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      )}
      {rightText && (
        <p className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold max-w-xs">{rightText}</p>
      )}
    </div>
  );
}
