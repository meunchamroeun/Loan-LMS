"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Banknote, ShieldCheck, Lock, Activity } from "lucide-react";

interface AppLoaderProps {
  label?: string;
  sublabel?: string;
  fullScreen?: boolean;
}

const MESSAGES = [
  "Synchronizing core banking ledger...",
  "Loading borrower credit facilities...",
  "Connecting to loan.cavkim.tech API gateway...",
  "Verifying amortization schedules & collateral...",
];

export function AppLoader({
  label = "Loan-LMS Core Console",
  sublabel,
  fullScreen = true,
}: AppLoaderProps) {
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setMsgIndex((prev) => (prev + 1) % MESSAGES.length);
    }, 1800);
    return () => clearInterval(timer);
  }, []);

  const content = (
    <div className="flex flex-col items-center justify-center p-8 max-w-sm mx-auto text-center">
      {/* Animated Brand Emblem */}
      <div className="relative mb-6">
        {/* Ambient Glow */}
        <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-400 rounded-full blur-xl opacity-35 dark:opacity-50 animate-pulse" />

        {/* Orbiting Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          className="absolute -inset-2.5 rounded-2xl border border-dashed border-blue-400/40 dark:border-blue-500/40"
        />

        {/* Center Emblem */}
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: [0.95, 1.05, 0.95] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="relative h-16 w-16 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-xl shadow-blue-500/30"
        >
          <Banknote className="h-8 w-8" />
        </motion.div>
      </div>

      {/* Title */}
      <h3 className="font-bold text-lg tracking-tight text-slate-900 dark:text-white mb-1">
        {label}
      </h3>

      {/* Dynamic Sub-status */}
      <div className="h-6 flex items-center justify-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={msgIndex}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25 }}
            className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5"
          >
            <Activity className="h-3.5 w-3.5 text-blue-500 animate-pulse" />
            <span>{sublabel || MESSAGES[msgIndex]}</span>
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Sleek Gradient Progress Track */}
      <div className="w-56 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden mt-5 relative">
        <motion.div
          initial={{ x: "-100%" }}
          animate={{ x: "100%" }}
          transition={{
            duration: 1.4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-1/2 h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-cyan-400 rounded-full"
        />
      </div>

      {/* Security note */}
      <div className="flex items-center gap-1.5 mt-4 text-[10px] text-slate-400 dark:text-slate-500 font-medium">
        <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
        <span>256-Bit Encrypted Financial Session</span>
      </div>
    </div>
  );

  if (!fullScreen) {
    return <div className="py-16 w-full flex items-center justify-center">{content}</div>;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50/95 dark:bg-slate-950/95 backdrop-blur-md">
      {content}
    </div>
  );
}
