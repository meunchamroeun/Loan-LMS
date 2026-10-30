"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { TopoCanvas } from "@/components/ui/topo-canvas";
import {
  Banknote,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ArrowLeft,
  ArrowLeftRight,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Languages,
  ChevronDown,
  Check,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MotionOrbitSpinner } from "@/components/ui/motion-loader";
import { cn } from "@/lib/utils";

type Lang = "km" | "en";

const I18N = {
  km: {
    langName: "ខ្មែរ",
    title: "ចូលគណនី",
    subtitle: "សូមស្វាគមន៍ — បញ្ចូលព័ត៌មានគណនីដើម្បីបន្ត",
    identifierLabel: "លេខទូរស័ព្ទ ឬអ៊ីមែល",
    identifierPlaceholder: "ទូរស័ព្ទ (+855…) ឬអ៊ីមែល",
    passwordLabel: "ពាក្យសម្ងាត់",
    passwordPlaceholder: "••••••••",
    forgotPassword: "ភ្លេចពាក្យសម្ងាត់?",
    submitBtn: "ចូលគណនី",
    submitting: "កំពុងផ្ទៀងផ្ទាត់...",
    connectedTo: "ភ្ជាប់ទៅ",
    switchServer: "ប្តូរម៉ាស៊ីនមេ",
    production: "ប្រើប្រាស់ជាក់ស្តែង",
    demo: "សាកល្បង",
    slogan: "សុវត្ថិភាព · ទុកចិត្តបាន · តភ្ជាប់",
    quickFill: "បំពេញគំរូ:",
    backToDashboard: "ត្រឡប់ទៅផ្ទាំងគ្រប់គ្រង",
  },
  en: {
    langName: "English",
    title: "Sign In",
    subtitle: "Welcome back — enter your credentials to continue",
    identifierLabel: "Phone Number or Email",
    identifierPlaceholder: "Phone (+855…) or email / username",
    passwordLabel: "Password",
    passwordPlaceholder: "••••••••",
    forgotPassword: "Forgot password?",
    submitBtn: "Sign In",
    submitting: "Authenticating...",
    connectedTo: "Connected to",
    switchServer: "Switch Server",
    production: "Production API",
    demo: "Demo Sandbox",
    slogan: "SECURITY · RELIABILITY · CONNECTIVITY",
    quickFill: "Quick Fill:",
    backToDashboard: "Back to Dashboard",
  },
};

export function LoginView() {
  const router = useRouter();
  const { user, isDemoMode, toggleDemoMode, login, isLoading } = useAuth();

  const [lang, setLang] = useState<Lang>("km");
  const [identifier, setIdentifier] = useState("admin");
  const [password, setPassword] = useState("password");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const t = I18N[lang];

  useEffect(() => {
    const syncTheme = () => {
      if (typeof window !== "undefined") {
        setIsDark(document.documentElement.classList.contains("dark"));
      }
    };
    syncTheme();
    window.addEventListener("themechange", syncTheme);
    return () => window.removeEventListener("themechange", syncTheme);
  }, []);

  const toggleTheme = () => {
    const nextDark = !document.documentElement.classList.contains("dark");
    setIsDark(nextDark);
    if (nextDark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("lms_theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("lms_theme", "light");
    }
    window.dispatchEvent(new Event("themechange"));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const success = await login(identifier, password);
    setIsSubmitting(false);
    if (success) {
      router.push("/dashboard");
    }
  };

  const handleSelectServer = (demo: boolean) => {
    toggleDemoMode(demo);
  };

  return (
    <div
      suppressHydrationWarning
      className="relative isolate flex min-h-dvh items-center justify-center overflow-hidden bg-[#ece4d4] p-0 sm:p-6 dark:bg-[#18191b] select-none"
    >
      {/* 1. Animated Topographic WebGL Canvas Background */}
      <TopoCanvas />

      {/* 2. Top-Right Floating Control Bar (Language & Theme Toggler) */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1 rounded-lg border border-slate-300/80 dark:border-slate-800 bg-white/85 dark:bg-[#020817]/85 p-0.5 backdrop-blur shadow-xs">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              aria-label="Language selection"
              className="flex h-8 items-center gap-1.5 rounded-md px-2 text-xs font-medium text-slate-600 dark:text-slate-300 outline-none hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
            >
              <Languages className="size-3.5" />
              <span>{t.langName}</span>
              <ChevronDown className="size-3.5 opacity-60" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-32">
            <DropdownMenuItem
              onClick={() => setLang("km")}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span>ខ្មែរ (Khmer)</span>
              {lang === "km" && <Check className="size-3.5 text-blue-500" />}
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => setLang("en")}
              className="flex items-center justify-between text-xs cursor-pointer"
            >
              <span>English</span>
              {lang === "en" && <Check className="size-3.5 text-blue-500" />}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <span className="h-4 w-px bg-slate-200 dark:bg-slate-800" />

        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          aria-label="Theme toggle"
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        >
          {isDark ? (
            <Moon className="size-4 rotate-0 scale-100 transition-transform" />
          ) : (
            <Sun className="size-4 rotate-0 scale-100 transition-transform text-amber-500" />
          )}
        </button>
      </div>

      {/* 3. Main Login Card Container (Exact SabayRide Admin Structure) */}
      <div className="login-card grid w-full max-w-[760px] overflow-hidden bg-white shadow-2xl shadow-black/40 ring-1 ring-black/10 sm:rounded-2xl lg:min-h-[600px] lg:grid-cols-[340px_1fr] dark:bg-[#020817] dark:ring-[rgba(51,51,51,0.5)] z-10">
        {/* Left Aside: Brand Presentation, Hero Photo, and Interactive Server Switcher */}
        <aside className="relative hidden shrink-0 flex-col justify-between overflow-hidden bg-[#0a0a0a] text-white lg:flex">
          {/* Hero Photo with object-cover */}
          <div className="absolute inset-0">
            <Image
              src="/login-hero.jpg"
              alt="Hero Presentation"
              fill
              priority
              sizes="340px"
              className="hero-photo scale-105 object-cover"
            />
          </div>

          {/* Top Gradient Overlay */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[44%] bg-[linear-gradient(rgba(6,20,26,0.66)_0%,rgba(6,20,26,0.28)_46%,transparent_100%)]" />

          {/* Bottom Gradient Overlay */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[40%] bg-[linear-gradient(0deg,rgba(4,16,21,0.72)_0%,transparent_100%)]" />

          {/* Top Brand Block */}
          <div className="relative px-7 pt-[34px]">
            {/* Brand Logo Container */}
            <div className="size-[52px] overflow-hidden rounded-[14px] bg-white/90 p-2.5 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.7),0_10px_28px_-12px_rgba(0,0,0,0.5)] flex items-center justify-center">
              <div className="h-full w-full rounded-lg bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xs">
                <Banknote className="size-6 text-white" />
              </div>
            </div>

            {/* Brand Title */}
            <h2 className="mt-2.5 font-heading text-[22px] leading-tight font-bold tracking-[-0.77px] text-white/[0.97] [text-shadow:0_2px_12px_rgba(0,0,0,0.45)]">
              Loan-LMS Admin
            </h2>
          </div>

          {/* Bottom Interactive Server Switcher & Slogan */}
          <div className="relative px-7 pb-5">
            {/* Hover Flip Server Door Card */}
            <div
              tabIndex={0}
              aria-label="Server Door Switch"
              className="group/door relative mb-4 cursor-pointer rounded-[15px] border border-white/25 bg-black/40 px-4 py-3 backdrop-blur-md transition-[background-color,border-color] duration-200 outline-none hover:border-white/40 hover:bg-black/55 focus-within:border-white/40 focus-within:bg-black/55"
            >
              {/* Visible Normal View (Translates up on hover/focus) */}
              <div className="transition-[opacity,translate] duration-200 group-focus-within/door:-translate-y-1 group-focus-within/door:opacity-0 group-hover/door:-translate-y-1 group-hover/door:opacity-0">
                <span className="block text-[11px] leading-[1.7] text-white/60">
                  {t.connectedTo}
                </span>
                <span className="flex items-center justify-between gap-2.5 text-[14.5px] leading-[1.7] font-semibold text-white">
                  <span className="flex items-center gap-2">
                    <span className="relative flex size-1.5 shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60 bg-emerald-400" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span>{isDemoMode ? t.demo : t.production}</span>
                  </span>
                  <ArrowRight className="size-[17px] shrink-0 opacity-80" />
                </span>
              </div>

              {/* Hover / Focus Revealed Server Selector */}
              <div className="pointer-events-none absolute inset-0 flex translate-y-1 flex-col justify-center gap-1.5 px-3 opacity-0 transition-[opacity,translate] duration-200 group-focus-within/door:pointer-events-auto group-focus-within/door:translate-y-0 group-focus-within/door:opacity-100 group-hover/door:pointer-events-auto group-hover/door:translate-y-0 group-hover/door:opacity-100">
                <span className="flex items-center gap-1.5 px-1 text-[11px] leading-none text-white/60">
                  <ArrowLeftRight className="size-3" />
                  <span>{t.switchServer}</span>
                </span>
                <div className="grid w-full grid-cols-2 gap-1 rounded-[11px] p-1 bg-white/10">
                  <button
                    type="button"
                    onClick={() => handleSelectServer(false)}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer",
                      !isDemoMode
                        ? "bg-white text-black shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="relative flex size-1.5 shrink-0">
                      <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
                    </span>
                    <span>{t.production}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSelectServer(true)}
                    className={cn(
                      "flex h-8 items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer",
                      isDemoMode
                        ? "bg-white text-black shadow-sm"
                        : "text-white/80 hover:bg-white/10 hover:text-white"
                    )}
                  >
                    <span className="relative flex size-1.5 shrink-0">
                      <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60 bg-emerald-400" />
                      <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                    </span>
                    <span>{t.demo}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Slogan Divider Line */}
            <div className="h-px w-10 bg-white/35" />

            {/* Official Slogan */}
            <p className="mt-2.5 text-[10px] tracking-[1.4px] text-white/[0.62] uppercase [text-shadow:0_1px_8px_rgba(0,0,0,0.3)]">
              {t.slogan}
            </p>
          </div>
        </aside>

        {/* Right Content: Login Form and Credentials */}
        <main className="flex flex-col justify-center px-5 py-10 sm:px-8 lg:justify-start lg:pt-[31px] lg:pb-6">
          <div className="mx-auto w-full max-w-[353px]">
            {/* Mobile Header (visible on < lg screens) */}
            <div className="mb-6 flex items-center justify-center gap-2.5 lg:hidden">
              <div className="size-8 rounded-[28%] bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white ring-1 ring-white/10">
                <Banknote className="size-4" />
              </div>
              <span className="font-heading font-semibold text-slate-900 dark:text-white">
                Loan-LMS Admin
              </span>
            </div>

            {/* Title & Subtitle */}
            <div className="text-center">
              <h1 className="mb-[5px] font-heading text-[26px] font-bold tracking-[-0.65px] text-slate-900 dark:text-white">
                {t.title}
              </h1>
              <p className="text-[13.5px] text-slate-500 dark:text-slate-400">
                {t.subtitle}
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-4" noValidate>
              {/* Field 1: Identifier (Username / Email / Phone) */}
              <div className="space-y-2">
                <label
                  htmlFor="identifier"
                  className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-900 dark:text-slate-200"
                >
                  <Mail className="size-3.5" />
                  <span>{t.identifierLabel}</span>
                  <span className="text-rose-500" aria-hidden="true">
                    *
                  </span>
                </label>
                <div className="flex h-11 items-center gap-2.5 rounded-[10px] border border-slate-200 bg-white px-3.5 transition-[border-color,box-shadow] focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/20 dark:bg-[#020817] dark:border-[#333]">
                  <Mail className="size-4 shrink-0 text-slate-400" />
                  <input
                    id="identifier"
                    type="text"
                    autoComplete="username"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder={t.identifierPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-[15px] outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <span className="flex h-5 items-center border-l border-slate-200 dark:border-slate-800 pl-3 text-slate-400">
                    <Phone className="size-4" />
                  </span>
                </div>
              </div>

              {/* Field 2: Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="flex items-center gap-1.5 text-[12.5px] font-semibold text-slate-900 dark:text-slate-200"
                  >
                    <Lock className="size-3.5" />
                    <span>{t.passwordLabel}</span>
                    <span className="text-rose-500" aria-hidden="true">
                      *
                    </span>
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      alert("Please contact the system administrator to reset your credentials.");
                    }}
                    className="rounded-sm text-[12.5px] text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:underline cursor-pointer"
                  >
                    {t.forgotPassword}
                  </button>
                </div>
                <div className="flex h-11 items-center gap-2.5 rounded-[10px] border border-slate-200 bg-white px-3.5 transition-[border-color,box-shadow] focus-within:border-blue-500 focus-within:ring-[3px] focus-within:ring-blue-500/20 dark:bg-[#020817] dark:border-[#333]">
                  <Lock className="size-4 shrink-0 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t.passwordPlaceholder}
                    className="min-w-0 flex-1 bg-transparent text-[15px] outline-none text-slate-900 dark:text-slate-100 placeholder:text-slate-400"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                  </button>
                </div>
              </div>

              {/* Quick Fill Credentials Chips */}
              <div className="pt-1 flex items-center justify-between text-xs text-slate-500">
                <span className="text-[11px] font-medium">{t.quickFill}</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("admin");
                      setPassword("password");
                    }}
                    className="px-2 py-0.5 rounded-md bg-blue-500/10 hover:bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Admin
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("officer");
                      setPassword("password");
                    }}
                    className="px-2 py-0.5 rounded-md bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Officer
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setIdentifier("cashier");
                      setPassword("password");
                    }}
                    className="px-2 py-0.5 rounded-md bg-purple-500/10 hover:bg-purple-500/20 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[11px] font-medium transition-colors cursor-pointer"
                  >
                    Cashier
                  </button>
                </div>
              </div>

              {/* Submit Button (Exact SabayRide styling with hover shimmer sweep) */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="group/btn relative flex h-11 w-full items-center justify-center overflow-hidden rounded-[10px] text-[15px] font-semibold transition-[background-color,box-shadow,color] duration-300 shadow-sm bg-slate-900 text-white hover:bg-slate-800 hover:shadow-md dark:bg-[#f2f2f2] dark:text-black dark:hover:bg-white cursor-pointer mt-3"
              >
                {/* Luminous Shimmer Sweep Line */}
                <span className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full dark:via-black/10" />

                <span className="flex items-center gap-2">
                  {isSubmitting || isLoading ? (
                    <>
                      <MotionOrbitSpinner size="xs" color="white" />
                      <span>{t.submitting}</span>
                    </>
                  ) : (
                    <>
                      <span>{t.submitBtn}</span>
                      <ArrowRight className="size-4 transition-transform duration-200 group-hover/btn:translate-x-1" />
                    </>
                  )}
                </span>
              </button>
            </form>

            {/* Mobile Server Radio Group (visible on < lg screens) */}
            <div className="mt-6 flex flex-col items-center gap-2 lg:hidden">
              <span className="text-[11px] text-slate-500">{t.connectedTo}</span>
              <div className="grid w-full grid-cols-2 gap-1 rounded-[11px] p-1 max-w-[260px] bg-slate-100 dark:bg-white/[0.06]">
                <button
                  type="button"
                  onClick={() => handleSelectServer(false)}
                  className={cn(
                    "flex h-8 items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer",
                    !isDemoMode
                      ? "bg-white text-black shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="relative inline-flex size-1.5 rounded-full bg-rose-500" />
                  </span>
                  <span>{t.production}</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectServer(true)}
                  className={cn(
                    "flex h-8 items-center justify-center gap-1.5 rounded-lg text-[12.5px] font-semibold transition-colors cursor-pointer",
                    isDemoMode
                      ? "bg-white text-black shadow-sm"
                      : "text-slate-500 dark:text-slate-400"
                  )}
                >
                  <span className="relative flex size-1.5 shrink-0">
                    <span className="absolute inline-flex size-full animate-ping rounded-full opacity-60 bg-emerald-400" />
                    <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
                  </span>
                  <span>{t.demo}</span>
                </button>
              </div>
            </div>

            {/* Return Link to Dashboard (only shown if session is active) */}
            {user && (
              <div className="mt-6 text-center">
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <ArrowLeft className="size-3.5" />
                  <span>{t.backToDashboard}</span>
                </Link>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
