"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Banknote, ShieldCheck, Activity } from "lucide-react";
import {
  MotionDotsLoader,
  MotionOrbitSpinner,
  MotionShimmerBar,
  MotionEqualizerBars,
} from "./motion-loader";
import { cn } from "@/lib/utils";

interface AppLoaderProps {
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
  variant?: "brand" | "orbit" | "dots" | "minimal";
  className?: string;
}

const FINTECH_STATUS_MESSAGES = [
  "Synchronizing core banking ledger...",
  "Loading borrower credit facilities...",
  "Connecting to loan.cavkim.tech API gateway...",
  "Verifying amortization schedules & collateral...",
  "Streaming latest portfolio risk indices...",
];

export function AppLoader({
  label = "Loan-LMS Core Console",
  sublabel,
  fullScreen = true,
  variant = "brand",
  className,
}: AppLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % FINTECH_STATUS_MESSAGES.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Minimal variant for table/card widgets
  if (variant === "minimal") {
    return (
      <div suppressHydrationWarning className={cn("flex flex-col items-center justify-center p-6 gap-2.5", className)}>
        <MotionOrbitSpinner size="md" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
          {sublabel || "Loading data..."}
        </span>
      </div>
    );
  }

  // Dots wave variant
  if (variant === "dots") {
    return (
      <div suppressHydrationWarning className={cn("flex flex-col items-center justify-center p-6 gap-2", className)}>
        <MotionDotsLoader size="md" />
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap">
          {sublabel || "Processing request..."}
        </span>
      </div>
    );
  }

  const content = (
    <div suppressHydrationWarning className="flex flex-col items-center justify-center p-8 max-w-sm mx-auto text-center select-none">
      {/* Animated Brand Emblem with Motion Orbit & Aura */}
      <div className="relative mb-6">
        {/* Ambient Gradient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full blur-xl opacity-35 dark:opacity-50 animate-pulse" />

        {/* Outer Motion Orbit Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-3 rounded-2xl border border-dashed border-blue-400/40 dark:border-blue-500/40"
        />

        {/* Counter-rotating Inner Micro Accent */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-1 rounded-2xl border border-cyan-400/20"
        />

        {/* Center Emblem with Breathing Motion */}
        <motion.div
          initial={{ scale: 0.95 }}
          animate={{ scale: [0.96, 1.04, 0.96] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/30"
        >
          <Banknote className="h-8 w-8" />
        </motion.div>

        {/* Live sync equalizer badge attached */}
        <div className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-900 rounded-full p-1 shadow-md border border-slate-200 dark:border-slate-800">
          <MotionEqualizerBars size="sm" barCount={3} />
        </div>
      </div>

      {/* Brand Title */}
      <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white mb-1.5 whitespace-nowrap">
        {label}
      </h3>

      {/* Motion Jumping Dots */}
      <div className="mb-2">
        <MotionDotsLoader size="sm" color="primary" />
      </div>

      {/* Dynamic Sub-status with Motion AnimatePresence Slide */}
      <div className="h-6 flex items-center justify-center min-w-[260px]">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5 whitespace-nowrap"
          >
            <Activity className="h-3.5 w-3.5 text-blue-500 shrink-0 animate-pulse" />
            <span>{sublabel || FINTECH_STATUS_MESSAGES[msgIndex]}</span>
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Modern Motion Shimmer Progress Track */}
      <div className="w-60 mt-5">
        <MotionShimmerBar height="md" />
      </div>

      {/* Encrypted Session Footer */}
      <div className="flex items-center gap-1.5 mt-5 text-[11px] text-slate-400 dark:text-slate-500 font-medium whitespace-nowrap">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
        <span>256-Bit Encrypted Financial Gateway</span>
      </div>
    </div>
  );

  if (!fullScreen) {
    return (
      <div suppressHydrationWarning className={cn("py-12 w-full flex items-center justify-center", className)}>
        {content}
      </div>
    );
  }

  return (
    <div suppressHydrationWarning className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md">
      {content}
    </div>
  );
}
