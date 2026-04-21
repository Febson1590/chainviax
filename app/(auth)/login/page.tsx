"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Logo } from "@/components/logo";
import { initiateLogin, completeLogin } from "@/lib/actions/auth";
import { sendOtp } from "@/lib/actions/otp";
import { OtpType } from "@prisma/client";
import {
  Eye, EyeOff, Lock, Mail, Loader2, AlertCircle,
  ShieldCheck, RefreshCw, ArrowLeft, TrendingUp, Users,
} from "lucide-react";
import { toast } from "sonner";

const schema = z.object({
  email:    z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});
type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const [step, setStep] = useState<"credentials" | "otp">("credentials");
  const [lockedEmail,    setLockedEmail]    = useState("");
  const [lockedPassword, setLockedPassword] = useState("");

  return (
    <div className="fixed inset-0 z-50 bg-[#05060a] text-white overflow-auto flex flex-col lg:flex-row">
      {/* ═════════ LEFT — BRANDING ═════════ */}
      <BrandingPanel />

      {/* ═════════ RIGHT — FORM (desktop) / FULL COLUMN (mobile) ═════════ */}
      <div className="w-full lg:w-1/2 flex flex-col relative">
        {/* Mobile-only subtle background: candles top-right + gold streak + lock bottom */}
        <MobileBackdrop />

        {/* Mobile header: centered logo + eyebrow + title + subtitle */}
        <div className="lg:hidden relative z-10 px-6 pt-12 pb-6 flex flex-col items-center text-center">
          <Logo size="md" href="/" className="justify-center" />
          <span className="mt-8 text-[14px] font-semibold tracking-wide chainviax-gold-text">Welcome Back</span>
          <h1 className="mt-2 text-[28px] font-bold tracking-[-0.01em] text-white">
            Log in to Chainviax
          </h1>
          <p className="mt-2 text-[14px] text-slate-400">
            Access your account securely
          </p>
        </div>

        <div className="relative z-10 flex-1 flex items-start lg:items-center justify-center px-5 sm:px-10 pb-10 pt-2 lg:py-14">
          {step === "credentials"
            ? <CredentialsCard
                onSuccess={(email, pwd) => {
                  setLockedEmail(email);
                  setLockedPassword(pwd);
                  setStep("otp");
                }}
              />
            : <OtpCard
                email={lockedEmail}
                password={lockedPassword}
                onBack={() => setStep("credentials")}
              />}
        </div>

        {/* Mobile-only: feature list below card + lock visual at bottom */}
        <MobileFeaturesAndLock />
      </div>
    </div>
  );
}

/* Mobile-only backdrop: candles top-right, gold streak left, subtle vignette */
function MobileBackdrop() {
  return (
    <div aria-hidden className="lg:hidden pointer-events-none absolute inset-0 overflow-hidden z-0">
      {/* Candles top right */}
      <svg viewBox="0 0 200 260" preserveAspectRatio="none" className="absolute top-0 right-0 w-[45%] h-[240px] opacity-[0.22]">
        {[
          [15, 120, 40, 7, true],[35, 100, 30, 7, false],[55, 80, 50, 7, true],
          [75, 95, 25, 7, false],[95, 60, 55, 7, true],[115, 75, 30, 7, false],
          [135, 40, 55, 7, true],[155, 55, 35, 7, false],[180, 20, 45, 7, true],
        ].map((c, i) => {
          const [x, y, h, w, up] = c as [number, number, number, number, boolean];
          return (
            <g key={i}>
              <line x1={x} y1={y-7} x2={x} y2={y+h+7} stroke={up ? "#f4c440" : "#8b6508"} strokeWidth="0.8" opacity="0.6" />
              <rect x={x-w/2} y={y} width={w} height={h} rx="1"
                    fill={up ? "rgba(244,196,64,0.55)" : "rgba(139,101,8,0.5)"} />
            </g>
          );
        })}
        <path d="M10,160 Q60,120 100,90 T180,30" stroke="#f4c440" strokeWidth="1" fill="none" opacity="0.5" />
      </svg>
      {/* Gold streak mid-left */}
      <div className="absolute top-[32%] left-[-80px] w-[260px] h-[140px] rotate-[-8deg]"
           style={{
             background: "radial-gradient(ellipse 80% 50% at 30% 50%, rgba(244,196,64,0.35), transparent 70%)",
             filter: "blur(22px)",
           }} />
    </div>
  );
}

/* Mobile-only: feature list + bottom lock (hidden on desktop where the left panel has these) */
function MobileFeaturesAndLock() {
  return (
    <div className="lg:hidden relative z-10 px-5 pb-[360px] sm:pb-[400px]">
      <ul className="space-y-5 max-w-[420px] mx-auto">
        <MobileFeature icon={<ShieldCheck className="h-5 w-5 text-amber-300" />} title="Bank-Level Security"
                       desc="Your assets and data are protected with global security standards." />
        <div className="h-px bg-white/[0.05]" />
        <MobileFeature icon={<TrendingUp className="h-5 w-5 text-amber-300" />} title="Real-Time Insights"
                       desc="Track the market and your portfolio with real-time data." />
        <div className="h-px bg-white/[0.05]" />
        <MobileFeature icon={<Users className="h-5 w-5 text-amber-300" />} title="Copy Top Traders"
                       desc="Follow and copy expert traders automatically." />
      </ul>
      {/* Lock visual anchored bottom-right */}
      <div aria-hidden className="absolute bottom-0 right-0 w-[58%] max-w-[260px] pointer-events-none">
        <div className="absolute inset-0 -z-10"
             style={{
               background: "radial-gradient(ellipse 80% 50% at 50% 70%, rgba(244,196,64,0.35), transparent 70%)",
               filter: "blur(30px)",
             }} />
        <Image src="/landing/login-lock.png" alt="" width={520} height={520}
               className="w-full h-auto drop-shadow-[0_20px_40px_rgba(244,196,64,0.2)]"
               onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
      </div>
    </div>
  );
}

function MobileFeature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
           style={{
             background: "linear-gradient(145deg, rgba(244,196,64,0.18), rgba(139,101,8,0.04))",
             border: "1px solid rgba(244,196,64,0.3)",
           }}>
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold text-white">{title}</div>
        <div className="text-[13px] text-slate-400 leading-[1.5] mt-0.5">{desc}</div>
      </div>
    </li>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   LEFT — Branding panel (desktop only)
   ═══════════════════════════════════════════════════════════════════════ */

function BrandingPanel() {
  return (
    <div className="hidden lg:flex relative w-1/2 flex-col justify-between overflow-hidden p-10 xl:p-14">
      {/* Ambient gold wash */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute top-[-200px] right-[-150px] w-[700px] h-[700px] rounded-full blur-[120px] opacity-40"
             style={{ background: "radial-gradient(circle, rgba(244,196,64,0.35), transparent 65%)" }} />
        <div className="absolute bottom-[-100px] left-[-200px] w-[600px] h-[600px] rounded-full blur-[140px] opacity-30"
             style={{ background: "radial-gradient(circle, rgba(244,196,64,0.28), transparent 70%)" }} />
        {/* subtle faded trading chart behind */}
        <svg viewBox="0 0 600 400" preserveAspectRatio="none" className="absolute inset-0 w-full h-full opacity-[0.12]">
          <defs>
            <linearGradient id="login-chart-area" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f4c440" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f4c440" stopOpacity="0" />
            </linearGradient>
          </defs>
          {[80, 160, 240, 320].map((y) => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.06)" strokeDasharray="3 5" />
          ))}
          {[
            [40, 280, 45, 6, true],[70, 260, 32, 6, false],[100, 250, 50, 6, true],
            [130, 235, 40, 6, false],[160, 200, 55, 6, true],[190, 220, 25, 6, false],
            [220, 180, 50, 6, true],[250, 195, 35, 6, false],[280, 150, 55, 6, true],
            [310, 160, 38, 6, false],[340, 130, 48, 6, true],[370, 140, 30, 6, false],
            [400, 110, 40, 6, true],[430, 120, 28, 6, false],[460, 90, 36, 6, true],
            [490, 100, 24, 6, false],[520, 70, 40, 6, true],[550, 80, 22, 6, false],
          ].map((c, i) => {
            const [x, y, h, w, up] = c as [number, number, number, number, boolean];
            return (
              <rect key={i} x={x-w/2} y={y} width={w} height={h} rx="1"
                    fill={up ? "rgba(16,185,129,0.6)" : "rgba(239,68,68,0.6)"} />
            );
          })}
          <path d="M0,300 C80,280 140,260 200,240 C260,220 300,190 360,170 C420,150 470,130 520,110 C560,90 590,80 600,75 L600,400 L0,400 Z"
                fill="url(#login-chart-area)" />
          <path d="M0,300 C80,280 140,260 200,240 C260,220 300,190 360,170 C420,150 470,130 520,110 C560,90 590,80 600,75"
                stroke="#f4c440" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>

      {/* Logo top */}
      <div className="relative z-10">
        <Logo size="md" href="/" />
      </div>

      {/* Center copy */}
      <div className="relative z-10 max-w-lg">
        <span className="chainviax-eyebrow inline-flex items-center gap-2 uppercase">
          Welcome Back
        </span>
        <h1 className="mt-6 text-[44px] xl:text-[56px] font-bold tracking-[-0.025em] leading-[1.02]">
          <span className="block text-white">Access Your</span>
          <span className="block text-white">Portfolio.</span>
          <span className="block chainviax-gold-text">Trade Smarter.</span>
        </h1>
        <p className="mt-6 text-[15px] text-slate-400 leading-[1.6] max-w-md">
          Securely log in to manage your investments, track performance, and copy top traders.
        </p>

        {/* Feature list */}
        <ul className="mt-10 space-y-5">
          <Feature
            icon={<ShieldCheck className="h-5 w-5 text-amber-300" />}
            title="Bank-Level Security"
            desc="Your assets and data are protected with global security standards."
          />
          <Feature
            icon={<TrendingUp className="h-5 w-5 text-amber-300" />}
            title="Real-Time Insights"
            desc="Track the market and your portfolio with real-time data."
          />
          <Feature
            icon={<Users className="h-5 w-5 text-amber-300" />}
            title="Copy Top Traders"
            desc="Follow and copy expert traders automatically."
          />
        </ul>
      </div>

      {/* Lock visual — bottom-left area */}
      <LockVisual />

      {/* Footer copyright */}
      <div className="relative z-10 text-[12px] text-slate-500">
        © {new Date().getFullYear()} Chainviax. All rights reserved.
      </div>
    </div>
  );
}

function Feature({ icon, title, desc }: { icon: React.ReactNode; title: string; desc: string }) {
  return (
    <li className="flex items-start gap-4">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
           style={{
             background: "linear-gradient(145deg, rgba(244,196,64,0.18), rgba(139,101,8,0.03))",
             border: "1px solid rgba(244,196,64,0.35)",
             boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)",
           }}>
        {icon}
      </div>
      <div>
        <div className="text-[15px] font-bold text-white">{title}</div>
        <div className="text-[13px] text-slate-400 leading-[1.5] mt-0.5">{desc}</div>
      </div>
    </li>
  );
}

function LockVisual() {
  return (
    <div aria-hidden className="absolute bottom-0 left-0 w-full pointer-events-none z-[2]">
      {/* gold streak beneath lock */}
      <div className="absolute bottom-16 left-0 right-0 h-[80px]"
           style={{
             background: "radial-gradient(ellipse 70% 100% at 30% 60%, rgba(244,196,64,0.25), transparent 70%)",
             filter: "blur(20px)",
           }} />
      <div className="relative w-[320px] xl:w-[360px] mx-auto xl:ml-6 pb-2">
        <Image
          src="/landing/login-lock.png"
          alt=""
          width={720}
          height={720}
          priority
          className="w-full h-auto opacity-95 drop-shadow-[0_30px_60px_rgba(244,196,64,0.25)] select-none"
          onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }}
        />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RIGHT — Credentials card
   ═══════════════════════════════════════════════════════════════════════ */

function CredentialsCard({ onSuccess }: { onSuccess: (email: string, pwd: string) => void }) {
  const [showPassword, setShowPassword] = useState(false);
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setError("");
    try {
      const result = await initiateLogin(data);
      setLoading(false);
      if ('error' in result) { setError(result.error); return; }
      onSuccess(data.email, data.password);
    } catch { /* admin redirect — Next.js handles */ }
  };

  return (
    <div className="w-full max-w-[460px] chainviax-login-card p-8 sm:p-10">
      <h2 className="text-[28px] font-bold text-white text-center tracking-[-0.01em]">
        Log in to Chainviax
      </h2>
      <p className="mt-2 text-[14px] text-slate-400 text-center">
        Enter your details to continue to your account.
      </p>

      {error && (
        <div className="mt-6 flex items-center gap-2.5 text-sm text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3">
          <AlertCircle size={15} className="flex-shrink-0" />
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="mt-7 space-y-5">
        <div>
          <label className="block text-[13px] font-semibold text-white mb-2">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              {...register("email")}
              type="email"
              placeholder="Enter your email"
              className="chainviax-login-input w-full pl-10 pr-3 h-[52px] rounded-[10px] text-[14px] text-white placeholder:text-slate-600"
            />
          </div>
          {errors.email && <p className="mt-1.5 text-xs text-red-400">{errors.email.message}</p>}
        </div>

        <div>
          <label className="block text-[13px] font-semibold text-white mb-2">Password</label>
          <div className="relative">
            <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              {...register("password")}
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="chainviax-login-input w-full pl-10 pr-11 h-[52px] rounded-[10px] text-[14px] text-white placeholder:text-slate-600"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {errors.password && <p className="mt-1.5 text-xs text-red-400">{errors.password.message}</p>}
        </div>

        <div className="flex justify-end">
          <Link href="/contact" className="text-[12.5px] font-semibold text-amber-300 hover:text-amber-200">
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="chainviax-btn-gold w-full h-[52px] rounded-[10px] text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {loading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in…</>
            : "Log In"}
        </button>
      </form>

      <p className="mt-7 text-center text-[13px] text-slate-500">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-amber-300 hover:text-amber-200 font-semibold">
          Sign up
        </Link>
      </p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   RIGHT — OTP step (same card style)
   ═══════════════════════════════════════════════════════════════════════ */

function OtpCard({ email, password, onBack }: { email: string; password: string; onBack: () => void }) {
  const [digits,         setDigits]         = useState<string[]>(Array(6).fill(""));
  const [otpLoading,     setOtpLoading]     = useState(false);
  const [otpError,       setOtpError]       = useState("");
  const [resending,      setResending]      = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setTimeout(() => inputRefs.current[0]?.focus(), 80);
  }, []);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const t = setTimeout(() => setResendCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [resendCooldown]);

  function handleDigitChange(index: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (cleaned.length > 1) {
      const arr = [...digits];
      for (let i = 0; i < 6 && i < cleaned.length; i++) arr[index + i] = cleaned[i] ?? "";
      setDigits(arr);
      inputRefs.current[Math.min(index + cleaned.length, 5)]?.focus();
      return;
    }
    const arr = [...digits]; arr[index] = cleaned; setDigits(arr); setOtpError("");
    if (cleaned && index < 5) inputRefs.current[index + 1]?.focus();
  }

  function handleDigitKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[index]) { const arr = [...digits]; arr[index] = ""; setDigits(arr); }
      else if (index > 0) inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft"  && index > 0) inputRefs.current[index - 1]?.focus();
    if (e.key === "ArrowRight" && index < 5) inputRefs.current[index + 1]?.focus();
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = digits.join("");
    if (code.length < 6) { setOtpError("Enter all 6 digits."); return; }
    setOtpLoading(true);
    setOtpError("");
    try {
      const result = await completeLogin({ email, password, otp: code });
      if (result && 'error' in result) {
        setOtpError(result.error);
        setDigits(Array(6).fill(""));
        setTimeout(() => inputRefs.current[0]?.focus(), 50);
      }
    } catch { /* redirect */ }
    finally { setOtpLoading(false); }
  }

  async function handleResend() {
    if (resendCooldown > 0 || !email) return;
    setResending(true);
    const result = await sendOtp(email, OtpType.LOGIN);
    setResending(false);
    if ('error' in result) toast.error(result.error);
    else {
      toast.success("New code sent! Check your inbox.");
      setResendCooldown(60);
      setDigits(Array(6).fill(""));
      setTimeout(() => inputRefs.current[0]?.focus(), 50);
    }
  }

  return (
    <div className="w-full max-w-[460px] chainviax-login-card p-8 sm:p-10">
      <div className="flex justify-center mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
             style={{
               background: "linear-gradient(145deg, rgba(244,196,64,0.22), rgba(139,101,8,0.04))",
               border: "1px solid rgba(244,196,64,0.4)",
               boxShadow: "inset 0 1px 0 rgba(255,255,255,0.12)",
             }}>
          <ShieldCheck className="h-6 w-6 text-amber-300" />
        </div>
      </div>
      <h2 className="text-[26px] font-bold text-white text-center tracking-[-0.01em]">Verify your sign-in</h2>
      <p className="mt-2 text-[14px] text-slate-400 text-center">
        We sent a 6-digit code to <span className="text-amber-300 font-medium">{email}</span>.
      </p>

      <form onSubmit={handleOtpSubmit} className="mt-8">
        <div className="flex gap-2 sm:gap-2.5 justify-center">
          {digits.map((d, i) => (
            <input
              key={i}
              ref={(el) => { inputRefs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              pattern="[0-9]*"
              maxLength={6}
              value={d}
              onChange={(e) => handleDigitChange(i, e.target.value)}
              onKeyDown={(e) => handleDigitKeyDown(i, e)}
              disabled={otpLoading}
              className={`w-11 h-14 sm:w-12 sm:h-14 text-center text-[20px] font-bold rounded-xl bg-white/[0.04] text-white border transition
                ${otpError
                  ? "border-red-500/50"
                  : d
                    ? "border-amber-500/60 bg-amber-500/[0.06]"
                    : "border-white/[0.10] focus:border-amber-500/50"}
              `}
              style={{ caretColor: "transparent" }}
              aria-label={`Digit ${i + 1}`}
            />
          ))}
        </div>

        {otpError && (
          <div className="mt-4 flex items-center gap-2 text-sm text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3">
            <AlertCircle size={14} className="flex-shrink-0" />
            {otpError}
          </div>
        )}

        <button
          type="submit"
          disabled={otpLoading || digits.join("").length < 6}
          className="chainviax-btn-gold w-full h-[52px] mt-6 rounded-[10px] text-[14px] font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {otpLoading
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
            : "Confirm & Log In"}
        </button>
      </form>

      <div className="mt-5 pt-5 border-t border-white/[0.07] text-center">
        <p className="text-[13px] text-slate-500 mb-2">Didn&apos;t receive the code?</p>
        <button type="button" onClick={handleResend} disabled={resending || resendCooldown > 0}
                className="inline-flex items-center gap-2 text-[13px] font-semibold text-amber-300 hover:text-amber-200 disabled:text-slate-600 disabled:cursor-not-allowed">
          {resending
            ? <><Loader2 size={14} className="animate-spin" /> Sending…</>
            : resendCooldown > 0
              ? <><RefreshCw size={14} /> Resend in {resendCooldown}s</>
              : <><RefreshCw size={14} /> Resend code</>}
        </button>
      </div>

      <div className="mt-4 text-center">
        <button type="button" onClick={onBack}
                className="inline-flex items-center gap-1.5 text-[12px] text-slate-500 hover:text-slate-300">
          <ArrowLeft size={12} />
          Use a different account
        </button>
      </div>
    </div>
  );
}
