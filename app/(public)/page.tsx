import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ShieldCheck, BarChart3, Lock, Star, User, Home, LineChart } from "lucide-react";
import { getMarketAssets, type MarketAsset } from "@/lib/coingecko";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Sparkline } from "@/components/public/sparkline";

/* ═══════════════════════════════════════════════════════════════════════
   CHAINVIAX — Landing page (premium crypto broker)
   Desktop + mobile rebuilt to match provided mockups:
   Hero → Markets Band → Advanced Features + Laptop → Stats → Press → Mobile tab bar
   ═══════════════════════════════════════════════════════════════════════ */

export default async function HomePage() {
  const markets = await getMarketAssets();
  const btc  = markets.find((a) => a.symbol === "BTC");
  const eth  = markets.find((a) => a.symbol === "ETH");
  const usdt = markets.find((a) => a.symbol === "USDT");

  /* Stat strip — derived from live data where possible */
  const totalVolume = markets.reduce((a, m) => a + (m.volume24h || 0), 0);

  return (
    <div className="relative overflow-x-hidden bg-[#05060a] text-white">
      {/* Global gold particle backdrop */}
      <GoldBackdrop />

      {/* ═══ HERO ═══════════════════════════════════════════════════════ */}
      <section className="relative pt-28 md:pt-32 pb-16 md:pb-24 px-4 sm:px-6 lg:px-10">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] gap-10 lg:gap-12 items-center">
          {/* Left — copy + CTAs */}
          <div className="relative z-10 max-w-xl">
            <h1 className="text-[44px] sm:text-[56px] lg:text-[68px] leading-[1.02] tracking-tight font-bold">
              <span className="text-white">Your Premium</span>
              <br />
              <span className="chainviax-gold-text">Crypto Broker</span>
            </h1>
            <p className="mt-5 text-[15px] sm:text-[16px] text-slate-400 leading-relaxed max-w-lg">
              Trade Bitcoin, Ethereum, and top cryptocurrencies with institution-grade
              security and deep liquidity.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/register"
                className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-[52px] px-8 rounded-[10px] text-[14px] font-bold tracking-wide"
              >
                Get Started <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/markets"
                className="chainviax-btn-outline inline-flex items-center justify-center h-[52px] px-7 rounded-[10px] text-[14px] font-semibold"
              >
                Explore Markets
              </Link>
            </div>
          </div>

          {/* Right — floating coins + chart card */}
          <HeroVisual btc={btc} />
        </div>
      </section>

      {/* ═══ MARKETS BAND ═════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-10 pb-20">
        <div className="max-w-[1280px] mx-auto">
          <div className="chainviax-band px-5 sm:px-8 lg:px-10 py-8 sm:py-10">
            <h2 className="text-[22px] sm:text-[26px] lg:text-[30px] font-bold text-white tracking-tight mb-6 sm:mb-8">
              Trade the most popular cryptocurrencies
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
              <MarketCard asset={btc} tag="Rank" iconBg="#f7931a" iconText="B" />
              <MarketCard asset={eth} tag="Rank" iconBg="#4b5563" iconText="◆" />
              <MarketCard asset={usdt} tag="Rank" iconBg="#26a17b" iconText="T" />
            </div>
            <div className="mt-8 sm:mt-10 flex justify-center">
              <Link
                href="/markets"
                className="chainviax-btn-outline-dark inline-flex items-center justify-center h-11 px-8 rounded-full text-[13.5px] font-semibold"
              >
                View All Markets
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ADVANCED TRADING FEATURES ═════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-16 md:py-24">
        <div className="max-w-[1280px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.1fr)] gap-10 lg:gap-14 items-center">
          <div>
            <h2 className="text-[32px] sm:text-[38px] lg:text-[44px] font-bold tracking-tight leading-[1.08]">
              <span className="chainviax-gold-text">Advanced Trading Features</span>
            </h2>
            <p className="mt-4 text-[15px] text-slate-400 max-w-md leading-relaxed">
              Trade like a pro with powerful tools and deep liquidity.
            </p>
            <div className="mt-8 space-y-6">
              <FeatureRow
                icon={<ShieldCheck className="h-5 w-5" />}
                title="Institutional Liquidity"
                desc="Deep order books and tight spreads from top-tier liquidity providers."
              />
              <FeatureRow
                icon={<BarChart3 className="h-5 w-5" />}
                title="Advanced Charting"
                desc="Professional-grade charting tools, indicators, and real-time market data."
              />
              <FeatureRow
                icon={<Lock className="h-5 w-5" />}
                title="Secure Transactions"
                desc="Robust security protocols, cold storage, and 24/7 monitoring."
              />
            </div>
          </div>
          <div className="relative">
            <LaptopMockup />
          </div>
        </div>
      </section>

      {/* ═══ STATS STRIP ═══════════════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-10 py-10 md:py-14">
        <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-y-8 gap-x-6">
          <Stat big={`$${compactMoney(totalVolume)}+`} label="24 Hour Volume" />
          <Stat big="98+" label="Listed Cryptocurrencies" />
          <Stat big="0.05%" label="Starting Fees" />
          <Stat big="Bank-Grade" label="Security" shield />
        </div>
      </section>

      {/* ═══ PRESS / TRUST BAND ═══════════════════════════════════════════ */}
      <section className="relative px-4 sm:px-6 lg:px-10 pb-24 md:pb-28 pt-4">
        <div className="max-w-[1100px] mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 opacity-70">
            {[
              { name: "Forbes",    cls: "font-serif italic text-[26px] tracking-tight" },
              { name: "Bloomberg", cls: "font-bold text-[22px] tracking-tight" },
              { name: "YAHOO!",    cls: "font-black text-[22px] tracking-tight" },
              { name: "coindesk",  cls: "font-semibold text-[22px] tracking-tight lowercase" },
              { name: "CNBC",      cls: "font-black italic text-[22px] tracking-wider" },
            ].map((p) => (
              <span key={p.name} className={`text-slate-400/80 ${p.cls}`}>{p.name}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ MOBILE BOTTOM NAV ════════════════════════════════════════════ */}
      <MobileTabBar />
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Subcomponents
   ═══════════════════════════════════════════════════════════════════════ */

function GoldBackdrop() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Generated cinematic gold-particle backdrop */}
      <Image
        src="/landing/hero-backdrop.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover opacity-[0.55] select-none"
        style={{
          maskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.15) 100%)",
          WebkitMaskImage:
            "linear-gradient(180deg, rgba(0,0,0,1) 0%, rgba(0,0,0,0.85) 55%, rgba(0,0,0,0.15) 100%)",
        }}
      />
      {/* Soft warm wash over the right edge */}
      <div
        className="absolute top-0 right-[-10%] w-[55%] h-[80%] blur-[120px] opacity-50"
        style={{ background: "radial-gradient(60% 60% at 70% 40%, rgba(244,196,64,0.22), transparent 70%)" }}
      />
    </div>
  );
}

function HeroVisual({ btc }: { btc?: MarketAsset }) {
  const price  = btc?.price ?? 43582.21;
  const change = btc?.change ?? 2.34;
  const isUp   = change >= 0;
  return (
    <div className="relative min-h-[420px] sm:min-h-[480px] lg:min-h-[560px] w-full">
      {/* Chart card sitting behind the coins */}
      <div className="absolute right-0 bottom-0 w-full md:w-[92%] lg:w-[96%] chainviax-chart-card">
        <div className="px-5 pt-5 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-[11px] text-slate-400 font-semibold tracking-wide">
              <span className="px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30">BTC / USD</span>
              <span className={isUp ? "text-emerald-400" : "text-red-400"}>
                {isUp ? "▲" : "▼"} {Math.abs(change).toFixed(2)}%
              </span>
            </div>
            <div className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Last 24h</div>
          </div>
        </div>
        <div className="relative h-[220px] sm:h-[260px] lg:h-[300px] w-full">
          <HeroChart />
          <div className="absolute left-5 bottom-4 tabular-nums">
            <div className="text-[20px] sm:text-[24px] lg:text-[28px] font-bold text-white">
              {formatCurrency(price)}
            </div>
            <div className={`text-[12px] font-semibold ${isUp ? "text-emerald-400" : "text-red-400"}`}>
              {isUp ? "+" : "-"}{Math.abs(change).toFixed(2)}%
            </div>
          </div>
        </div>
      </div>
      {/* BTC coin — floating */}
      <div className="absolute left-[2%] sm:left-[6%] top-[0%] sm:top-[2%] w-[38%] sm:w-[34%] lg:w-[38%] max-w-[260px] drop-shadow-[0_30px_60px_rgba(247,147,26,0.35)]">
        <Image src="/landing/btc-coin.png" alt="Bitcoin" width={520} height={520} priority className="w-full h-auto select-none" />
      </div>
      {/* Chainviax coin — floating */}
      <div className="absolute right-[4%] sm:right-[10%] top-[16%] w-[38%] sm:w-[32%] lg:w-[36%] max-w-[250px] drop-shadow-[0_30px_60px_rgba(244,196,64,0.45)]">
        <Image src="/landing/chainviax-coin.png" alt="Chainviax" width={520} height={520} priority className="w-full h-auto select-none" />
      </div>
    </div>
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
      {/* grid ticks */}
      {[60, 120, 180, 240].map((y) => (
        <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.04)" strokeDasharray="3 5" />
      ))}
      {/* candles hint */}
      {[
        [40, 200, 45, 7, true], [70, 180, 32, 7, false], [100, 170, 50, 7, true],
        [130, 155, 40, 7, false], [160, 130, 55, 7, true], [190, 150, 25, 7, false],
        [220, 110, 50, 7, true], [250, 125, 35, 7, false], [280, 90, 55, 7, true],
        [310, 100, 38, 7, false], [340, 75, 48, 7, true], [370, 85, 30, 7, false],
        [400, 60, 40, 7, true],
      ].map((c, i) => {
        const [x, y, h, w, up] = c as [number, number, number, number, boolean];
        return (
          <rect
            key={i}
            x={x - w / 2} y={y} width={w} height={h} rx="1"
            fill={up ? "rgba(16,185,129,0.55)" : "rgba(239,68,68,0.55)"}
          />
        );
      })}
      {/* Area + line */}
      <path
        d="M0,260 C80,240 140,220 200,200 C260,180 300,150 360,130 C420,110 470,90 520,70 C560,55 590,45 600,40 L600,300 L0,300 Z"
        fill="url(#hero-area)"
      />
      <path
        d="M0,260 C80,240 140,220 200,200 C260,180 300,150 360,130 C420,110 470,90 520,70 C560,55 590,45 600,40"
        stroke="url(#hero-line)" strokeWidth="2.2" fill="none" strokeLinecap="round"
      />
      <circle cx="600" cy="40" r="4" fill="#fde68a" />
      <circle cx="600" cy="40" r="10" fill="#f4c440" fillOpacity="0.25" />
    </svg>
  );
}

function MarketCard({ asset, tag, iconBg, iconText }: {
  asset?: MarketAsset; tag: string; iconBg: string; iconText: string;
}) {
  const price  = asset?.price ?? 0;
  const change = asset?.change ?? 0;
  const isUp   = change >= 0;
  const name   = asset?.name ?? "—";
  const sym    = asset?.symbol ?? "—";
  return (
    <div className="chainviax-coin-card p-5 sm:p-6 relative">
      <Star className="absolute top-4 right-4 h-4 w-4 text-amber-400 fill-amber-400/90" />
      <div className="flex items-center gap-3">
        <div
          className="w-11 h-11 rounded-full flex items-center justify-center text-white font-black text-[18px] shadow-[0_6px_18px_rgba(0,0,0,0.35)]"
          style={{ background: iconBg }}
        >
          {iconText}
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[15px] font-bold text-white">{name}</span>
            <span className="text-[11px] font-semibold text-slate-500 tracking-wide">{sym}</span>
          </div>
          <span className="text-[11px] text-slate-500">{tag}</span>
        </div>
      </div>

      <div className="mt-4 flex items-end justify-between gap-3">
        <div>
          <div className="text-[24px] sm:text-[26px] font-bold tabular-nums text-white">
            {formatCurrency(price)}
          </div>
          <div className="text-[11px] text-slate-500 mt-0.5 uppercase tracking-wider">24h change</div>
        </div>
        <div className="flex-1 max-w-[130px] h-[42px] opacity-90">
          <Sparkline
            data={asset?.sparkline?.length ? asset.sparkline : fallbackSpark(isUp)}
            width={130}
            height={42}
            idSuffix={`mk-${sym}`}
          />
        </div>
      </div>

      <div className="mt-3">
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-bold tabular-nums ${
            isUp ? "bg-emerald-500/15 text-emerald-300" : "bg-red-500/15 text-red-300"
          }`}
        >
          {isUp ? "+" : "−"}{Math.abs(change).toFixed(2)}%
        </span>
      </div>
    </div>
  );
}

function FeatureRow({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <div className="flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{
          background: "linear-gradient(145deg, rgba(244,196,64,0.18), rgba(139,101,8,0.05))",
          border: "1px solid rgba(244,196,64,0.35)",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 8px 22px rgba(244,196,64,0.12)",
        }}
      >
        <span className="chainviax-gold-text">{icon}</span>
      </div>
      <div>
        <h3 className="text-[16px] font-bold text-white mb-1">{title}</h3>
        <p className="text-[13.5px] text-slate-400 leading-relaxed max-w-md">{desc}</p>
      </div>
    </div>
  );
}

function LaptopMockup() {
  return (
    <div className="relative w-full">
      {/* Ambient glow behind laptop */}
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 blur-[80px] opacity-60 pointer-events-none"
        style={{ background: "radial-gradient(50% 60% at 50% 55%, rgba(244,196,64,0.22), transparent 70%)" }}
      />
      <Image
        src="/landing/laptop-trading.png"
        alt="Chainviax trading dashboard"
        width={1536}
        height={1024}
        priority
        className="relative w-full h-auto drop-shadow-[0_30px_60px_rgba(0,0,0,0.5)] select-none"
      />
    </div>
  );
}

function Stat({ big, label, shield }: { big: string; label: string; shield?: boolean }) {
  return (
    <div className="text-center md:text-left">
      <div className="flex items-center gap-2 justify-center md:justify-start">
        {shield && <ShieldCheck className="h-6 w-6 text-amber-400" />}
        <span className="chainviax-gold-text text-[26px] sm:text-[32px] lg:text-[38px] font-bold tracking-tight tabular-nums leading-none">
          {big}
        </span>
      </div>
      <div className="mt-2 text-[12px] sm:text-[13px] text-slate-400 uppercase tracking-[0.18em]">{label}</div>
    </div>
  );
}

function MobileTabBar() {
  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-white/[0.08]"
      style={{
        background: "linear-gradient(180deg, rgba(5,8,14,0.98) 0%, rgba(3,5,9,0.98) 100%)",
        backdropFilter: "blur(24px)",
        WebkitBackdropFilter: "blur(24px)",
      }}
    >
      <div className="grid grid-cols-3 h-full">
        <Link href="/markets" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-wide">Markets</span>
        </Link>
        <Link href="/markets" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white">
          <LineChart className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-wide">Trade</span>
        </Link>
        <Link href="/login" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-white">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-semibold tracking-wide">Profile</span>
        </Link>
      </div>
    </nav>
  );
}

/* ── utilities ───────────────────────────────────────────────────────── */

function compactMoney(n: number): string {
  if (!isFinite(n) || n <= 0) return "8,755,342,108";
  return Math.round(n).toLocaleString("en-US");
}

function fallbackSpark(isUp: boolean): number[] {
  const base = [1, 1.02, 0.99, 1.05, 1.03, 1.1, 1.08, 1.15, 1.12, 1.2, 1.18, 1.25, 1.22, 1.3];
  return isUp ? base : base.slice().reverse();
}
