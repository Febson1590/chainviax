import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight, ShieldCheck, Zap, User, Home, LineChart,
  Wallet, UserPlus, BadgeCheck,
} from "lucide-react";
import { getMarketAssets, type MarketAsset } from "@/lib/coingecko";
import { formatCurrency, formatCompact } from "@/lib/utils";
import { LiveHeroPrice, LivePriceStrip, LiveMarketCards, LiveMarketTable } from "@/components/public/live-landing";

/* ═══════════════════════════════════════════════════════════════════════
   Chainviax — premium crypto broker landing page
   Clean hero · live prices · markets · terminal · why us · how it works · trust · CTA
   ═══════════════════════════════════════════════════════════════════════ */

export default async function HomePage() {
  const markets = await getMarketAssets();
  const btc  = markets.find((a) => a.symbol === "BTC");
  const totalVolume = markets.reduce((a, m) => a + (m.volume24h || 0), 0);

  return (
    <div className="relative bg-[#04060c] text-white overflow-x-hidden">
      <AmbientGlow />
      <Hero initial={markets} btc={btc} />
      <LivePricesSection initial={markets} />
      <MarketsSection initial={markets} />
      <TerminalSection btc={btc} />
      <WhySection />
      <HowItWorks />
      <TrustStrip totalVolume={totalVolume} />
      <ClosingCTA />
      <MobileTabBar />
    </div>
  );
}

/* ═══ ambient glow (single layer, no heavy fixed image) ════════════════ */

function AmbientGlow() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="absolute top-[-200px] right-[-200px] w-[800px] h-[800px] rounded-full blur-[150px] opacity-40"
           style={{ background: "radial-gradient(circle, rgba(244,196,64,0.28), transparent 65%)" }} />
      <div className="absolute top-[800px] left-[-300px] w-[700px] h-[700px] rounded-full blur-[150px] opacity-20"
           style={{ background: "radial-gradient(circle, rgba(244,196,64,0.18), transparent 70%)" }} />
    </div>
  );
}

/* ═══ HERO ═════════════════════════════════════════════════════════════ */

function Hero({ initial, btc }: { initial: MarketAsset[]; btc?: MarketAsset }) {
  const price  = btc?.price ?? 43582.21;
  const change = btc?.change ?? 2.34;
  const isUp   = change >= 0;
  const high24 = price * 1.018;
  const low24  = price * 0.986;

  return (
    <section className="relative z-10 pt-28 md:pt-36 pb-20 md:pb-32 px-5 sm:px-8 lg:px-12">
      <div className="max-w-[1320px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.18fr)] gap-14 lg:gap-16 items-center">
        {/* left */}
        <div className="relative max-w-2xl">
          <div className="chainviax-eyebrow inline-flex items-center gap-2 mb-9">
            <span className="chainviax-dot" /> Trusted Crypto Broker
          </div>
          <h1 className="font-bold tracking-[-0.025em] text-[60px] sm:text-[80px] lg:text-[104px] leading-[0.92]">
            <span className="block text-white">Your Premium</span>
            <span className="block chainviax-gold-text">Crypto Broker.</span>
          </h1>
          <p className="mt-8 text-[17px] sm:text-[18px] text-slate-300/90 leading-[1.55] max-w-lg">
            Buy, sell, and hold Bitcoin, Ethereum, and the top cryptocurrencies.
            <span className="block mt-1 text-slate-400/80 text-[15px]">Safe, simple, and fast.</span>
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3">
            <Link href="/register" className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-[56px] px-10 rounded-[10px] text-[14px] font-bold tracking-wide">
              Create Account <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/markets" className="chainviax-btn-outline inline-flex items-center justify-center h-[56px] px-8 rounded-[10px] text-[14px] font-semibold">
              View Markets
            </Link>
          </div>
          {/* Inline trust row with divider */}
          <div className="mt-10 pt-6 border-t border-white/[0.06] flex flex-wrap items-center gap-x-8 gap-y-2 text-[11px] uppercase tracking-[0.22em] text-slate-500">
            <span>Safe storage</span>
            <span className="h-1 w-1 rounded-full bg-amber-500/60" />
            <span>Live 24/7</span>
            <span className="h-1 w-1 rounded-full bg-amber-500/60" />
            <span>No hidden fees</span>
          </div>
        </div>

        {/* right — cinematic trading panel */}
        <div className="relative w-full min-h-[520px] lg:min-h-[620px]">
          {/* BIG ambient gold glow behind panel */}
          <div aria-hidden className="absolute inset-8 -z-10 blur-[120px] opacity-70"
               style={{ background: "radial-gradient(60% 60% at 50% 50%, rgba(244,196,64,0.30), transparent 70%)" }} />

          {/* main trading card */}
          <div className="absolute bottom-0 right-0 w-full md:w-[94%] lg:w-[98%] chainviax-card-elite overflow-hidden">
            {/* window chrome */}
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

            {/* price + stats row */}
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

            {/* timeframe tabs */}
            <div className="flex items-center justify-between px-6 pt-4">
              <div className="flex items-center gap-1 text-[10px] uppercase tracking-widest font-bold">
                {["1H","4H","1D","1W","1M"].map((t,i) => (
                  <span key={t} className={`px-2.5 py-1 rounded-md ${i===2 ? "bg-amber-500/15 text-amber-300 border border-amber-500/30" : "text-slate-500 border border-transparent"}`}>{t}</span>
                ))}
              </div>
              <div className="text-[10px] uppercase tracking-widest text-slate-600 font-bold">Candles · 5m</div>
            </div>

            {/* chart */}
            <div className="relative h-[240px] sm:h-[280px] lg:h-[320px] mt-2">
              <HeroChart />
            </div>

            {/* volume bars strip */}
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

          {/* Floating mini-stat: BTC price chip (top-right) */}
          <div className="absolute right-2 top-2 hidden md:flex chainviax-mini-chip items-center gap-3 px-4 py-3">
            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[18px] font-black text-white"
                 style={{ background: "linear-gradient(145deg,#f7931a,#c56a00)", boxShadow: "0 6px 18px rgba(247,147,26,0.5)" }}>₿</div>
            <div>
              <div className="text-[9px] uppercase tracking-[0.25em] text-slate-500 font-bold">BTC / USD</div>
              <div className="text-[14px] font-bold text-white tabular-nums">{formatCurrency(price)}</div>
            </div>
            <div className={`pl-3 border-l border-white/10 ${isUp ? "text-emerald-400" : "text-red-400"} text-[11px] font-bold tabular-nums`}>
              {isUp ? "+" : "−"}{Math.abs(change).toFixed(2)}%
            </div>
          </div>

          {/* BTC coin */}
          <div className="absolute left-[2%] sm:left-[4%] -top-2 sm:top-[-10px] w-[36%] sm:w-[30%] lg:w-[32%] max-w-[230px] drop-shadow-[0_50px_90px_rgba(247,147,26,0.4)]">
            <Image src="/landing/btc-coin.png" alt="Bitcoin" width={520} height={520} priority className="w-full h-auto select-none" />
          </div>
          {/* Chainviax coin */}
          <div className="absolute right-[6%] sm:right-[10%] top-[16%] w-[36%] sm:w-[28%] lg:w-[30%] max-w-[220px] drop-shadow-[0_50px_90px_rgba(244,196,64,0.5)]">
            <Image src="/landing/chainviax-coin.png" alt="Chainviax" width={520} height={520} priority className="w-full h-auto select-none" />
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

/* ═══ LIVE PRICES — polls /api/markets/public every 30s ═══════════════ */

function LivePricesSection({ initial }: { initial: MarketAsset[] }) {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 pb-6">
      <div className="max-w-[1280px] mx-auto chainviax-hairline-bar">
        <LivePriceStrip initial={initial} symbols={["BTC", "ETH", "SOL", "USDT"]} />
      </div>
    </section>
  );
}

/* ═══ MARKETS ══════════════════════════════════════════════════════════ */

function MarketsSection({ initial }: { initial: MarketAsset[] }) {
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          eyebrow="Top Coins"
          headingLead="Popular coins,"
          headingGold="one tap away."
          rightLink={{ href: "/markets", label: "View all" }}
        />
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6">
          <LiveMarketCards initial={initial} symbols={["BTC", "ETH", "USDT"]} />
        </div>
        {/* expanded live market table — real trading interface feel */}
        <div className="mt-8">
          <LiveMarketTable initial={initial} symbols={["SOL", "BNB", "XRP", "DOGE", "AVAX", "LINK"]} />
        </div>
      </div>
    </section>
  );
}

/* ═══ TERMINAL ═════════════════════════════════════════════════════════ */

function TerminalSection({ btc }: { btc?: MarketAsset }) {
  const price  = btc?.price ?? 43582.21;
  const change = btc?.change ?? 2.34;
  const isUp   = change >= 0;

  const asks = [12.5, 18.2, 24.1, 31.8, 38.4, 45.0].map((o, i) => ({ p: price + o, a: 0.2 + i * 0.31, t: (price + o) * (0.2 + i * 0.31) }));
  const bids = [11.9, 17.6, 23.5, 30.2, 37.8, 44.4].map((o, i) => ({ p: price - o, a: 0.18 + i * 0.29, t: (price - o) * (0.18 + i * 0.29) }));

  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-20 md:py-24">
      <div className="max-w-[1280px] mx-auto">
        <SectionHeading
          eyebrow="Trading"
          headingLead="A real trading terminal,"
          headingGold="built in."
          rightText="Live prices · Real order book · Fast trades"
        />
        <div className="mt-10 chainviax-card-elite overflow-hidden">
          <div className="flex items-center justify-between px-6 h-12 border-b border-white/[0.06] bg-black/30">
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1f]" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#1a1a1f]" />
              <span className="ml-4 text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">chainviax.com / trade</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-slate-400">
              <span className="inline-flex items-center gap-1 text-amber-300/90">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" /> Live
              </span>
              <span className="text-slate-600">|</span>
              <span>BTC / USD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,0.9fr)_minmax(0,0.85fr)] min-h-[440px]">
            {/* chart */}
            <div className="border-r border-white/[0.06] p-5">
              <div className="flex items-baseline gap-3">
                <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">BTC / USD</span>
                <span className="text-[26px] sm:text-[30px] font-bold text-white tabular-nums">{formatCurrency(price)}</span>
                <span className={`text-[12px] font-bold tabular-nums ${isUp ? "text-emerald-400" : "text-red-400"}`}>
                  {isUp ? "+" : "−"}{Math.abs(change).toFixed(2)}%
                </span>
              </div>
              <div className="relative mt-4 h-[330px]">
                <HeroChart />
              </div>
            </div>

            {/* book */}
            <div className="border-r border-white/[0.06] p-5">
              <div className="flex items-center justify-between">
                <span className="text-[11px] uppercase tracking-[0.22em] text-slate-500 font-bold">Order Book</span>
                <span className="text-[10px] text-slate-600 uppercase tracking-widest">Spread · $24</span>
              </div>
              <div className="mt-3 grid grid-cols-3 text-[9px] uppercase tracking-[0.18em] text-slate-600 font-bold">
                <span>Price</span><span className="text-right">Size</span><span className="text-right">Total</span>
              </div>
              <div className="mt-1">
                {asks.slice().reverse().map((r, i) => <BookRow key={"a"+i} p={r.p} a={r.a} t={r.t} side="ask" />)}
              </div>
              <div className="my-2 flex items-center justify-between px-2 py-1.5 rounded bg-amber-500/10 border border-amber-500/20">
                <span className="text-[13px] font-bold tabular-nums text-amber-300">{formatCurrency(price)}</span>
                <span className="text-[9px] uppercase tracking-widest text-amber-300/80 font-bold">Last</span>
              </div>
              <div>
                {bids.map((r, i) => <BookRow key={"b"+i} p={r.p} a={r.a} t={r.t} side="bid" />)}
              </div>
            </div>

            {/* form */}
            <div className="p-5">
              <div className="grid grid-cols-2 gap-1 p-1 rounded-lg bg-white/[0.03] border border-white/[0.06] mb-4">
                <button className="h-9 rounded-md text-[12px] font-bold bg-emerald-500/90 text-white">Buy</button>
                <button className="h-9 rounded-md text-[12px] font-bold text-slate-400">Sell</button>
              </div>
              <div className="space-y-3">
                <Field label="Price (USD)"  value={formatCurrency(price)} />
                <Field label="Amount (BTC)" value="0.25000" />
                <Field label="Total (USD)"  value={formatCurrency(price * 0.25)} accent />
              </div>
              <div className="mt-4 grid grid-cols-4 gap-1">
                {["25%","50%","75%","MAX"].map(q => (
                  <button key={q} className="h-8 rounded-md text-[10px] font-bold text-slate-400 bg-white/[0.02] border border-white/[0.06]">{q}</button>
                ))}
              </div>
              <button className="chainviax-btn-gold w-full h-12 mt-5 rounded-lg text-[13px] font-bold">Buy Bitcoin</button>
              <div className="mt-4 pt-4 border-t border-white/[0.06] flex items-center justify-between">
                <span className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">Available</span>
                <span className="text-[12px] text-slate-300 font-bold tabular-nums">$25,480.00</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function BookRow({ p, a, t, side }: { p: number; a: number; t: number; side: "ask" | "bid" }) {
  const pct = Math.min(100, (a / 3) * 100);
  return (
    <div className="relative grid grid-cols-3 py-[3px] text-[11px] tabular-nums">
      <div aria-hidden className="absolute inset-y-0 right-0 rounded-sm"
           style={{ width: `${pct}%`, background: side === "ask" ? "rgba(239,68,68,0.10)" : "rgba(16,185,129,0.10)" }} />
      <span className={`relative font-semibold ${side === "ask" ? "text-red-400" : "text-emerald-400"}`}>{formatCurrency(p)}</span>
      <span className="relative text-right text-slate-400">{a.toFixed(3)}</span>
      <span className="relative text-right text-slate-600">{formatCompact(t)}</span>
    </div>
  );
}

function Field({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  return (
    <div className={`rounded-lg border ${accent ? "border-amber-500/30 bg-amber-500/[0.04]" : "border-white/[0.06] bg-white/[0.02]"} px-3 py-2.5`}>
      <div className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">{label}</div>
      <div className={`mt-0.5 text-[14px] font-bold tabular-nums ${accent ? "text-amber-300" : "text-white"}`}>{value}</div>
    </div>
  );
}

/* ═══ WHY ══════════════════════════════════════════════════════════════ */

function WhySection() {
  const items = [
    { icon: Zap,         n: "01", title: "Fair Prices",         desc: "Buy and sell at live market rates. No hidden markups, no surprise spreads." },
    { icon: ShieldCheck, n: "02", title: "Your Crypto is Safe", desc: "Most funds are kept offline in cold storage and monitored around the clock." },
    { icon: LineChart,   n: "03", title: "Easy to Use",         desc: "Clean charts, simple orders, and a dashboard anyone can follow from day one." },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading eyebrow="Why Chainviax" headingLead="Built to make" headingGold="trading simple." />
        <div className="mt-14 grid grid-cols-1 md:grid-cols-3 relative">
          {/* top + bottom hairlines */}
          <div className="absolute -top-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/25 to-transparent" />
          <div className="absolute -bottom-px left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
          {items.map((f, i) => (
            <div key={f.title} className={`py-10 px-2 md:px-8 relative ${i > 0 ? "md:border-l border-white/[0.06]" : ""}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                     style={{
                       background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
                       border: "1px solid rgba(244,196,64,0.4)",
                       boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12), 0 10px 24px rgba(244,196,64,0.15)",
                     }}>
                  <f.icon className="h-5 w-5 text-amber-300" />
                </div>
                <span className="chainviax-gold-text text-[34px] font-bold tabular-nums leading-none">{f.n}</span>
              </div>
              <h3 className="text-[22px] sm:text-[24px] font-bold text-white mb-3 tracking-tight">{f.title}</h3>
              <p className="text-[14.5px] text-slate-400 leading-[1.6] max-w-sm">{f.desc}</p>
              <div className="mt-6 h-px w-16 bg-gradient-to-r from-amber-500 to-amber-500/0" />
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
    { n: "01", icon: UserPlus,   title: "Sign Up",         desc: "Create your free account with just an email. Under a minute." },
    { n: "02", icon: BadgeCheck, title: "Verify Your ID",  desc: "Upload a photo of your ID. Most checks are approved the same day." },
    { n: "03", icon: Wallet,     title: "Fund & Trade",    desc: "Add money, pick a coin, and start trading with a single tap." },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-24 md:py-32">
      <div className="max-w-[1320px] mx-auto">
        <SectionHeading eyebrow="Getting Started" headingLead="Start trading in" headingGold="three steps." />
        <div className="mt-14 relative">
          {/* continuous dashed gold path */}
          <div aria-hidden className="hidden md:block absolute top-9 left-[10%] right-[10%] h-px"
               style={{ backgroundImage: "linear-gradient(90deg, rgba(244,196,64,0.4) 50%, transparent 0)", backgroundSize: "10px 1px" }} />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {steps.map((s) => (
              <div key={s.n} className="relative flex flex-col items-start md:items-center md:text-center">
                {/* numbered ring */}
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
    { big: "98+",    small: "Coins Listed" },
    { big: "0.05%",  small: "Fees Start At" },
    { big: "250K+",  small: "Active Users" },
  ];
  return (
    <section className="relative z-10 px-5 sm:px-8 lg:px-12 py-12 md:py-16">
      <div className="max-w-[1280px] mx-auto chainviax-hairline-bar">
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
              <span className="chainviax-dot" /> Ready to start?
            </div>
            <h2 className="text-[34px] sm:text-[44px] lg:text-[54px] font-bold tracking-[-0.02em] leading-[1.04]">
              <span className="text-white">Start trading </span>
              <span className="chainviax-gold-text">in minutes.</span>
            </h2>
            <p className="mt-5 text-[15px] text-slate-400 max-w-lg mx-auto leading-relaxed">
              Create a free account and start buying crypto today. It only takes a few minutes.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row justify-center gap-3">
              <Link href="/register" className="chainviax-btn-gold inline-flex items-center justify-center gap-2 h-[54px] px-9 rounded-[10px] text-[14px] font-bold tracking-wide">
                Create Account <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/login" className="chainviax-btn-outline inline-flex items-center justify-center h-[54px] px-8 rounded-[10px] text-[14px] font-semibold">
                Sign In
              </Link>
            </div>
            <div className="mt-7 flex flex-wrap justify-center items-center gap-x-5 gap-y-2 text-[10px] uppercase tracking-[0.25em] text-slate-500 font-bold">
              <span>Free to join</span>
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              <span>Quick ID check</span>
              <span className="h-1 w-1 rounded-full bg-amber-500/60" />
              <span>Trade the same day</span>
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

/* ═══ Mobile tab bar ═══════════════════════════════════════════════════ */

function MobileTabBar() {
  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-40 h-16 border-t border-white/[0.08]"
         style={{
           background: "linear-gradient(180deg, rgba(5,8,14,0.98) 0%, rgba(3,5,9,0.98) 100%)",
           backdropFilter: "blur(24px)",
           WebkitBackdropFilter: "blur(24px)",
         }}>
      <div className="grid grid-cols-3 h-full">
        <Link href="/markets" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-300">
          <Home className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Markets</span>
        </Link>
        <Link href="/markets" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-300">
          <LineChart className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Trade</span>
        </Link>
        <Link href="/login" className="flex flex-col items-center justify-center gap-1 text-slate-400 hover:text-amber-300">
          <User className="h-5 w-5" />
          <span className="text-[10px] font-bold uppercase tracking-wider">Profile</span>
        </Link>
      </div>
    </nav>
  );
}


