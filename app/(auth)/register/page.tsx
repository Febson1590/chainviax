"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { registerUser } from "@/lib/actions/auth";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, Globe, MapPin,
  Loader2, AlertCircle, Check, ArrowRight, ArrowLeft,
  ShieldCheck, Info,
} from "lucide-react";
import { toast } from "sonner";

/* ─ Country list ────────────────────────────────────────────────────── */
const COUNTRIES = [
  "Afghanistan","Albania","Algeria","Angola","Argentina","Armenia","Australia",
  "Austria","Azerbaijan","Bahrain","Bangladesh","Belgium","Bolivia","Bosnia",
  "Brazil","Bulgaria","Cambodia","Cameroon","Canada","Chile","China","Colombia",
  "Costa Rica","Croatia","Cuba","Czech Republic","Denmark","Ecuador","Egypt",
  "El Salvador","Estonia","Ethiopia","Finland","France","Georgia","Germany",
  "Ghana","Greece","Guatemala","Honduras","Hong Kong","Hungary","India",
  "Indonesia","Iran","Iraq","Ireland","Israel","Italy","Jamaica","Japan",
  "Jordan","Kazakhstan","Kenya","Kuwait","Lebanon","Libya","Lithuania",
  "Malaysia","Mexico","Moldova","Morocco","Mozambique","Myanmar","Netherlands",
  "New Zealand","Nigeria","Norway","Oman","Pakistan","Panama","Paraguay","Peru",
  "Philippines","Poland","Portugal","Qatar","Romania","Russia","Saudi Arabia",
  "Senegal","Serbia","Singapore","South Africa","South Korea","Spain",
  "Sri Lanka","Sweden","Switzerland","Taiwan","Tanzania","Thailand","Tunisia",
  "Turkey","Uganda","Ukraine","United Arab Emirates","United Kingdom",
  "United States","Uruguay","Uzbekistan","Venezuela","Vietnam","Yemen",
  "Zimbabwe",
];

const PWD_RULES = [
  { label: "At least 8 characters",     test: (p: string) => p.length >= 8 },
  { label: "Contains uppercase letter", test: (p: string) => /[A-Z]/.test(p) },
  { label: "Contains number",           test: (p: string) => /[0-9]/.test(p) },
];

const STEP_LABELS = ["Personal", "Location", "Security"];

export default function RegisterPage() {
  const router = useRouter();

  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [form, setForm] = useState({
    username: "", fullName: "", email: "", phone: "",
    country: "",
    password: "", confirmPassword: "",
  });
  const [errors,      setErrors]      = useState<Record<string, string>>({});
  const [showPwd,     setShowPwd]     = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [captchaOk,   setCaptchaOk]   = useState<"idle" | "checking" | "ok">("idle");
  const [termsOk,     setTermsOk]     = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [loading,     setLoading]     = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => { const { [k]: _d, ...rest } = prev; return rest; });
  };

  function validate(s: 1 | 2 | 3): boolean {
    const errs: Record<string, string> = {};
    if (s === 1) {
      if (form.username.trim().length < 2) errs.username = "Username must be at least 2 characters";
      if (form.fullName.trim().length < 2) errs.fullName = "Full name must be at least 2 characters";
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Enter a valid email address";
      if (form.phone && !/^\+?[\d\s\-(). ]{6,20}$/.test(form.phone)) errs.phone = "Enter a valid phone number";
    }
    if (s === 2) {
      if (!form.country) errs.country = "Please select your country";
    }
    if (s === 3) {
      if (form.password.length < 8) errs.password = "Password must be at least 8 characters";
      else if (!/[A-Z]/.test(form.password)) errs.password = "Include at least one uppercase letter";
      else if (!/[0-9]/.test(form.password)) errs.password = "Include at least one number";
      if (form.password !== form.confirmPassword) errs.confirmPassword = "Passwords do not match";
      if (captchaOk !== "ok") errs.captcha = "Please complete human verification";
      if (!termsOk) errs.terms = "You must accept the Terms & Privacy Policy";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  const next = () => { if (validate(step)) setStep((s) => (s < 3 ? ((s + 1) as 2 | 3) : s)); };
  const back = () => { setErrors({}); setStep((s) => (s > 1 ? ((s - 1) as 1 | 2) : s)); };

  function handleCaptcha() {
    if (captchaOk !== "idle") return;
    setCaptchaOk("checking");
    setTimeout(() => {
      setCaptchaOk("ok");
      if (errors.captcha) setErrors((prev) => { const { captcha: _d, ...rest } = prev; return rest; });
    }, 900);
  }

  async function handleSubmit() {
    if (!validate(3)) return;
    setLoading(true);
    setSubmitError("");
    try {
      const result = await registerUser({
        name:     form.username,
        fullName: form.fullName,
        email:    form.email,
        password: form.password,
        phone:    form.phone   || undefined,
        country:  form.country || undefined,
      });
      if (result?.error) { setSubmitError(result.error); return; }
      try {
        sessionStorage.setItem(`chainviax:postVerifyAuth:${form.email.toLowerCase()}`, form.password);
      } catch { /* storage unavailable */ }
      toast.success("Account created", { description: "Check your email to verify your account." });
      router.push(`/verify?email=${encodeURIComponent(form.email)}&type=register`);
    } catch {
      setSubmitError("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#05060a] text-white overflow-auto">
      {/* Ambient gold glows */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute top-[-180px] right-[-140px] w-[520px] h-[520px] rounded-full blur-[130px] opacity-30"
             style={{ background: "radial-gradient(circle, rgba(244,196,64,0.28), transparent 65%)" }} />
        <div className="absolute bottom-[-200px] left-[-160px] w-[480px] h-[480px] rounded-full blur-[140px] opacity-22"
             style={{ background: "radial-gradient(circle, rgba(244,196,64,0.22), transparent 70%)" }} />
      </div>

      <div className="relative min-h-screen flex flex-col items-center px-5 sm:px-8 py-10 sm:py-14">
        {/* Top: Logo */}
        <Logo size="md" href="/" className="justify-center" />

        {/* Title block */}
        <div className="mt-8 text-center max-w-md">
          <h1 className="text-[26px] sm:text-[30px] font-bold text-white tracking-[-0.01em]">
            Create Your Account
          </h1>
          <p className="mt-2 text-[13.5px] font-medium text-slate-200">
            Step {step} of 3 — {step === 1 ? "Personal information" : step === 2 ? "Location & region" : "Secure your account"}
          </p>
        </div>

        {/* Stepper */}
        <div className="mt-7 w-full max-w-md">
          <Stepper step={step} />
        </div>

        {/* Card */}
        <div className="mt-8 w-full max-w-md chainviax-login-card p-7 sm:p-9">
          {submitError && (
            <div className="mb-5 flex items-center gap-2.5 text-[13px] text-red-300 bg-red-500/10 border border-red-500/25 rounded-lg px-4 py-3">
              <AlertCircle size={15} className="flex-shrink-0" />
              {submitError}
            </div>
          )}

          {/* ═════ STEP 1 — Personal ═════ */}
          {step === 1 && (
            <div className="space-y-[22px]">
              <FieldInput
                label="Trading Username" icon={User}
                value={form.username} onChange={set("username")}
                placeholder="e.g. tradervault" required
                error={errors.username}
              />
              <FieldInput
                label="Full Name" icon={User}
                value={form.fullName} onChange={set("fullName")}
                placeholder="Your full legal name" required
                error={errors.fullName}
              />
              <FieldInput
                label="Email Address" icon={Mail} type="email"
                value={form.email} onChange={set("email")}
                placeholder="you@example.com" required
                error={errors.email}
              />
              <FieldInput
                label="Phone Number" icon={Phone} type="tel"
                value={form.phone} onChange={set("phone")}
                placeholder="+1 555 123 4567"
                error={errors.phone}
              />
              <button onClick={next}
                      className="chainviax-btn-gold w-full h-[54px] mt-2 rounded-[12px] text-[14.5px] font-bold tracking-wide flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" />
              </button>
              <p className="text-center text-[13px] font-medium text-slate-200">
                Already have an account?{" "}
                <Link href="/login" className="text-amber-300 hover:text-amber-200 font-semibold">
                  Sign in
                </Link>
              </p>
            </div>
          )}

          {/* ═════ STEP 2 — Location ═════ */}
          {step === 2 && (
            <div className="space-y-[22px]">
              <div>
                <label className="block text-[13px] font-semibold text-white mb-2.5">
                  Country / Region <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-amber-400/75" />
                  <select
                    value={form.country}
                    onChange={set("country")}
                    className="chainviax-login-input w-full pl-[46px] pr-10 h-[56px] rounded-[12px] text-[14.5px] appearance-none cursor-pointer [&>option]:bg-[#0a0c14] [&>option]:text-white"
                  >
                    <option value="">Select your country…</option>
                    {COUNTRIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <MapPin className="absolute right-4 top-1/2 -translate-y-1/2 h-[15px] w-[15px] text-slate-500 pointer-events-none" />
                </div>
                {errors.country && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle size={11} /> {errors.country}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 rounded-xl px-4 py-3.5 border border-amber-500/20 bg-amber-500/[0.04]">
                <Info className="h-[15px] w-[15px] text-amber-300 shrink-0 mt-0.5" />
                <p className="text-[12.5px] text-slate-200 leading-[1.55]">
                  Your country helps us apply the right trading rules, payment methods, and
                  compliance checks for your region.
                </p>
              </div>

              <div className="flex gap-3">
                <button onClick={back}
                        className="chainviax-btn-outline h-[54px] px-6 rounded-[12px] text-[14.5px] font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={next}
                        className="chainviax-btn-gold flex-1 h-[54px] rounded-[12px] text-[14.5px] font-bold tracking-wide flex items-center justify-center gap-2">
                  Continue <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* ═════ STEP 3 — Security ═════ */}
          {step === 3 && (
            <div className="space-y-[22px]">
              <div>
                <label className="block text-[13px] font-semibold text-white mb-2.5">
                  Create Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-amber-400/75" />
                  <input
                    type={showPwd ? "text" : "password"}
                    value={form.password}
                    onChange={set("password")}
                    placeholder="Enter a strong password"
                    className="chainviax-login-input w-full pl-[46px] pr-12 h-[56px] rounded-[12px] text-[14.5px]"
                  />
                  <button type="button" onClick={() => setShowPwd(!showPwd)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-300 transition-colors"
                          aria-label={showPwd ? "Hide password" : "Show password"}>
                    {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle size={11} /> {errors.password}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-[13px] font-semibold text-white mb-2.5">
                  Confirm Password <span className="text-red-400">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-amber-400/75" />
                  <input
                    type={showConfirm ? "text" : "password"}
                    value={form.confirmPassword}
                    onChange={set("confirmPassword")}
                    placeholder="Re-enter your password"
                    className="chainviax-login-input w-full pl-[46px] pr-12 h-[56px] rounded-[12px] text-[14.5px]"
                  />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-amber-300 transition-colors"
                          aria-label={showConfirm ? "Hide password" : "Show password"}>
                    {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                    <AlertCircle size={11} /> {errors.confirmPassword}
                  </p>
                )}
              </div>

              {/* Password rules */}
              <ul className="space-y-1.5 rounded-xl px-4 py-3 border border-white/[0.07] bg-white/[0.02]">
                {PWD_RULES.map((r) => {
                  const ok = r.test(form.password);
                  return (
                    <li key={r.label} className={`flex items-center gap-2 text-[12px] font-medium ${ok ? "text-emerald-300" : "text-slate-300"}`}>
                      <span className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${ok ? "bg-emerald-500/20 text-emerald-300" : "bg-white/[0.06] text-slate-500"}`}>
                        {ok ? <Check size={9} strokeWidth={3} /> : <span className="w-1 h-1 rounded-full bg-current opacity-50" />}
                      </span>
                      {r.label}
                    </li>
                  );
                })}
              </ul>

              {/* Captcha */}
              <button type="button" onClick={handleCaptcha}
                      className="w-full flex items-center gap-3 rounded-xl px-4 py-3.5 border border-white/[0.08] bg-white/[0.02] hover:border-amber-500/35 transition-colors">
                <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center border ${
                  captchaOk === "ok"
                    ? "bg-emerald-500 border-emerald-500"
                    : captchaOk === "checking"
                      ? "bg-amber-500/20 border-amber-500/60"
                      : "bg-transparent border-white/20"
                }`}>
                  {captchaOk === "ok" && <Check size={12} className="text-white" strokeWidth={3} />}
                  {captchaOk === "checking" && <Loader2 size={12} className="text-amber-300 animate-spin" />}
                </div>
                <span className="text-[13.5px] font-medium text-slate-200">I&rsquo;m not a robot</span>
                <ShieldCheck size={14} className="ml-auto text-slate-500" />
              </button>
              {errors.captcha && <p className="text-xs text-red-400">{errors.captcha}</p>}

              {/* Terms */}
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input type="checkbox" checked={termsOk} onChange={(e) => {
                  setTermsOk(e.target.checked);
                  if (errors.terms) setErrors((prev) => { const { terms: _d, ...rest } = prev; return rest; });
                }}
                       className="mt-1 w-4 h-4 accent-amber-400 cursor-pointer" />
                <span className="text-[12.5px] font-medium text-slate-200 leading-[1.55]">
                  I agree to the{" "}
                  <Link href="/terms" className="text-amber-300 hover:text-amber-200 font-semibold">Terms of Service</Link>
                  {" "}and{" "}
                  <Link href="/privacy" className="text-amber-300 hover:text-amber-200 font-semibold">Privacy Policy</Link>.
                </span>
              </label>
              {errors.terms && <p className="text-xs text-red-400">{errors.terms}</p>}

              <div className="flex gap-3">
                <button onClick={back}
                        className="chainviax-btn-outline h-[54px] px-6 rounded-[12px] text-[14.5px] font-semibold flex items-center justify-center gap-2">
                  <ArrowLeft className="h-4 w-4" /> Back
                </button>
                <button onClick={handleSubmit} disabled={loading}
                        className="chainviax-btn-gold flex-1 h-[54px] rounded-[12px] text-[14.5px] font-bold tracking-wide flex items-center justify-center gap-2 disabled:opacity-60">
                  {loading
                    ? <><Loader2 className="h-4 w-4 animate-spin" /> Creating…</>
                    : "Create Account"}
                </button>
              </div>
            </div>
          )}
        </div>

        <p className="mt-8 text-[11px] text-slate-500">© {new Date().getFullYear()} Chainviax</p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Reusable field input
   ═══════════════════════════════════════════════════════════════════════ */

function FieldInput({
  label, icon: Icon, value, onChange, placeholder, type = "text", required, error,
}: {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  error?: string;
}) {
  return (
    <div>
      <label className="block text-[13px] font-semibold text-white mb-2.5">
        {label}
        {required && <span className="text-red-400 ml-0.5">*</span>}
      </label>
      <div className="relative">
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-amber-400/75" />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="chainviax-login-input w-full pl-[46px] pr-4 h-[56px] rounded-[12px] text-[14.5px]"
        />
      </div>
      {error && (
        <p className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
          <AlertCircle size={11} /> {error}
        </p>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Stepper — clean, gold, with completed checkmarks
   ═══════════════════════════════════════════════════════════════════════ */

function Stepper({ step }: { step: number }) {
  return (
    <div className="flex items-start justify-between select-none">
      {STEP_LABELS.map((label, i) => {
        const n = i + 1;
        const isDone = step > n;
        const isActive = step === n;
        return (
          <div key={label} className="flex items-center flex-1">
            <div className="flex flex-col items-center gap-2 shrink-0">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center text-[13px] font-bold transition-all duration-200
                ${isDone
                  ? "bg-amber-500 text-[#1b1205] shadow-[0_6px_16px_rgba(244,196,64,0.45)]"
                  : isActive
                    ? "bg-gradient-to-br from-amber-300 to-amber-500 text-[#1b1205] shadow-[0_6px_20px_rgba(244,196,64,0.5)] ring-4 ring-amber-500/15"
                    : "bg-white/[0.04] text-slate-400 border border-white/[0.12]"}`}>
                {isDone ? <Check size={15} strokeWidth={3} /> : n}
              </div>
              <span className={`text-[10.5px] font-semibold uppercase tracking-[0.18em] whitespace-nowrap
                ${isActive ? "text-amber-300" : isDone ? "text-amber-400/80" : "text-slate-500"}`}>
                {label}
              </span>
            </div>
            {i < STEP_LABELS.length - 1 && (
              <div className={`flex-1 h-[2px] mx-2.5 mt-[18px] rounded-full transition-colors duration-300
                ${step > n ? "bg-amber-500/60" : "bg-white/[0.08]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
