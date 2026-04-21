"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/logo";
import { registerUser } from "@/lib/actions/auth";
import {
  Eye, EyeOff, Lock, Mail, User, Phone, Globe,
  Loader2, AlertCircle, Check, ArrowRight, ArrowLeft,
  ShieldCheck, Info, ChevronDown, Search,
} from "lucide-react";
import { toast } from "sonner";

/* ─ Country list with ISO-3166-1 alpha-2 codes for emoji flags ─────── */
const COUNTRIES: Array<{ name: string; code: string }> = [
  { name: "Afghanistan", code: "AF" },{ name: "Albania", code: "AL" },{ name: "Algeria", code: "DZ" },
  { name: "Angola", code: "AO" },{ name: "Argentina", code: "AR" },{ name: "Armenia", code: "AM" },
  { name: "Australia", code: "AU" },{ name: "Austria", code: "AT" },{ name: "Azerbaijan", code: "AZ" },
  { name: "Bahrain", code: "BH" },{ name: "Bangladesh", code: "BD" },{ name: "Belgium", code: "BE" },
  { name: "Bolivia", code: "BO" },{ name: "Bosnia", code: "BA" },{ name: "Brazil", code: "BR" },
  { name: "Bulgaria", code: "BG" },{ name: "Cambodia", code: "KH" },{ name: "Cameroon", code: "CM" },
  { name: "Canada", code: "CA" },{ name: "Chile", code: "CL" },{ name: "China", code: "CN" },
  { name: "Colombia", code: "CO" },{ name: "Costa Rica", code: "CR" },{ name: "Croatia", code: "HR" },
  { name: "Cuba", code: "CU" },{ name: "Czech Republic", code: "CZ" },{ name: "Denmark", code: "DK" },
  { name: "Ecuador", code: "EC" },{ name: "Egypt", code: "EG" },{ name: "El Salvador", code: "SV" },
  { name: "Estonia", code: "EE" },{ name: "Ethiopia", code: "ET" },{ name: "Finland", code: "FI" },
  { name: "France", code: "FR" },{ name: "Georgia", code: "GE" },{ name: "Germany", code: "DE" },
  { name: "Ghana", code: "GH" },{ name: "Greece", code: "GR" },{ name: "Guatemala", code: "GT" },
  { name: "Honduras", code: "HN" },{ name: "Hong Kong", code: "HK" },{ name: "Hungary", code: "HU" },
  { name: "India", code: "IN" },{ name: "Indonesia", code: "ID" },{ name: "Iran", code: "IR" },
  { name: "Iraq", code: "IQ" },{ name: "Ireland", code: "IE" },{ name: "Israel", code: "IL" },
  { name: "Italy", code: "IT" },{ name: "Jamaica", code: "JM" },{ name: "Japan", code: "JP" },
  { name: "Jordan", code: "JO" },{ name: "Kazakhstan", code: "KZ" },{ name: "Kenya", code: "KE" },
  { name: "Kuwait", code: "KW" },{ name: "Lebanon", code: "LB" },{ name: "Libya", code: "LY" },
  { name: "Lithuania", code: "LT" },{ name: "Malaysia", code: "MY" },{ name: "Mexico", code: "MX" },
  { name: "Moldova", code: "MD" },{ name: "Morocco", code: "MA" },{ name: "Mozambique", code: "MZ" },
  { name: "Myanmar", code: "MM" },{ name: "Netherlands", code: "NL" },{ name: "New Zealand", code: "NZ" },
  { name: "Nigeria", code: "NG" },{ name: "Norway", code: "NO" },{ name: "Oman", code: "OM" },
  { name: "Pakistan", code: "PK" },{ name: "Panama", code: "PA" },{ name: "Paraguay", code: "PY" },
  { name: "Peru", code: "PE" },{ name: "Philippines", code: "PH" },{ name: "Poland", code: "PL" },
  { name: "Portugal", code: "PT" },{ name: "Qatar", code: "QA" },{ name: "Romania", code: "RO" },
  { name: "Russia", code: "RU" },{ name: "Saudi Arabia", code: "SA" },{ name: "Senegal", code: "SN" },
  { name: "Serbia", code: "RS" },{ name: "Singapore", code: "SG" },{ name: "South Africa", code: "ZA" },
  { name: "South Korea", code: "KR" },{ name: "Spain", code: "ES" },{ name: "Sri Lanka", code: "LK" },
  { name: "Sweden", code: "SE" },{ name: "Switzerland", code: "CH" },{ name: "Taiwan", code: "TW" },
  { name: "Tanzania", code: "TZ" },{ name: "Thailand", code: "TH" },{ name: "Tunisia", code: "TN" },
  { name: "Turkey", code: "TR" },{ name: "Uganda", code: "UG" },{ name: "Ukraine", code: "UA" },
  { name: "United Arab Emirates", code: "AE" },{ name: "United Kingdom", code: "GB" },
  { name: "United States", code: "US" },{ name: "Uruguay", code: "UY" },{ name: "Uzbekistan", code: "UZ" },
  { name: "Venezuela", code: "VE" },{ name: "Vietnam", code: "VN" },{ name: "Yemen", code: "YE" },
  { name: "Zimbabwe", code: "ZW" },
];

function flagEmoji(code: string): string {
  return [...code.toUpperCase()].map((c) =>
    String.fromCodePoint(0x1F1E6 + c.charCodeAt(0) - 65)
  ).join("");
}

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

      <div className="relative min-h-screen flex flex-col items-center px-5 sm:px-8 pt-10 sm:pt-14 pb-16 sm:pb-20">
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
                <CountryDropdown
                  value={form.country}
                  onChange={(name) => {
                    setForm((f) => ({ ...f, country: name }));
                    if (errors.country) setErrors((e) => { const { country: _d, ...rest } = e; return rest; });
                  }}
                />
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

/* ═══════════════════════════════════════════════════════════════════════
   Country dropdown — searchable, with emoji flags (Binance/Stripe quality)
   ═══════════════════════════════════════════════════════════════════════ */

function CountryDropdown({ value, onChange }: { value: string; onChange: (name: string) => void }) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) return;
    function onDoc(e: MouseEvent) {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) { if (e.key === "Escape") setOpen(false); }
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    setTimeout(() => inputRef.current?.focus(), 40);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const selected = COUNTRIES.find((c) => c.name === value);
  const filtered = query.trim()
    ? COUNTRIES.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()))
    : COUNTRIES;

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="chainviax-login-input w-full h-[56px] pl-[46px] pr-10 rounded-[12px] text-[14.5px] text-left flex items-center cursor-pointer"
      >
        <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-[17px] w-[17px] text-amber-400/75" />
        {selected
          ? <span className="flex items-center gap-2 text-white">
              <span className="text-[20px] leading-none">{flagEmoji(selected.code)}</span>
              <span className="font-medium">{selected.name}</span>
            </span>
          : <span className="text-slate-400/70">Select your country…</span>}
        <ChevronDown
          className={`absolute right-4 top-1/2 -translate-y-1/2 h-[16px] w-[16px] text-slate-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 left-0 right-0 mt-2 rounded-[14px] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.7)]"
             style={{
               background: "linear-gradient(180deg, rgba(14,16,24,0.98) 0%, rgba(8,10,16,0.98) 100%)",
               border: "1px solid rgba(244,196,64,0.22)",
               backdropFilter: "blur(18px) saturate(125%)",
               WebkitBackdropFilter: "blur(18px) saturate(125%)",
             }}>
          {/* Search */}
          <div className="relative border-b border-white/[0.06] p-2.5">
            <Search className="absolute left-[22px] top-1/2 -translate-y-1/2 h-[14px] w-[14px] text-slate-500" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search country…"
              className="w-full h-10 rounded-[10px] bg-white/[0.03] border border-white/[0.08] pl-10 pr-3 text-[13px] text-white placeholder:text-slate-500 outline-none focus:border-amber-500/45 focus:bg-amber-500/[0.03] transition-colors"
            />
          </div>
          {/* List */}
          <ul className="max-h-[280px] overflow-y-auto py-1.5" style={{ scrollbarWidth: "thin" }}>
            {filtered.length === 0 ? (
              <li className="px-4 py-3 text-[13px] text-slate-400">No countries match &ldquo;{query}&rdquo;</li>
            ) : filtered.map((c) => {
              const isSel = c.name === value;
              return (
                <li key={c.code}>
                  <button
                    type="button"
                    onClick={() => { onChange(c.name); setOpen(false); setQuery(""); }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 text-[13.5px] text-left transition-colors ${
                      isSel
                        ? "bg-amber-500/[0.10] text-amber-200"
                        : "text-slate-200 hover:bg-white/[0.04] hover:text-white"
                    }`}
                  >
                    <span className="text-[20px] leading-none">{flagEmoji(c.code)}</span>
                    <span className="flex-1 font-medium">{c.name}</span>
                    {isSel && <Check size={14} className="text-amber-300" strokeWidth={3} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

