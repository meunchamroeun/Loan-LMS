"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AnimateShimmerText,
  AnimateRippleButton,
  AnimateShine,
  AnimateTiltCard,
  AnimateMagnetic,
  AnimateCountingNumber,
} from "./animate-ui-suite";
import { Sparkles, ExternalLink, Zap, Layers, Activity, TrendingUp, ShieldCheck } from "lucide-react";

export function AnimateUIModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [counterVal, setCounterVal] = useState(2450000);

  const randomizeCounter = () => {
    setCounterVal(Math.floor(1000000 + Math.random() * 4000000));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-violet-500/10 hover:bg-violet-500/20 text-violet-600 dark:text-violet-400 text-xs font-semibold border border-violet-500/20 transition-all cursor-pointer shadow-sm group whitespace-nowrap"
        >
          <Zap className="h-3.5 w-3.5 text-violet-500 group-hover:scale-110 transition-transform" />
          <span>Animate UI</span>
          <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-violet-500/30 text-violet-500 font-mono">
            animate-ui.com
          </Badge>
        </button>
      </DialogTrigger>

      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between pr-6">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-violet-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-violet-500/20">
                A
              </div>
              <div>
                <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  Animate UI Primitives & Effects
                  <a
                    href="https://animate-ui.com/"
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-normal text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-1"
                  >
                    animate-ui.com
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </DialogTitle>
                <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                  Animated drop-in primitives for Radix UI, Base UI, and interactive micro-effects.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-5 pt-3">
          {/* Grid of Animate UI Showcase Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* 1. 3D Parallax Tilt Card */}
            <div className="flex flex-col">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                <span>3D Parallax Tilt Card</span>
                <span className="text-[10px] text-slate-400 font-mono">Mouse Cursor Physics</span>
              </div>
              <AnimateTiltCard maxTilt={10}>
                <div className="p-4 rounded-xl border border-violet-500/30 bg-gradient-to-br from-violet-500/10 via-purple-500/5 to-transparent h-full flex flex-col justify-between select-none">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-violet-600 dark:text-violet-400">
                      Hover & Move Cursor
                    </span>
                    <Layers className="h-4 w-4 text-violet-500" />
                  </div>
                  <div className="my-3">
                    <div className="text-xl font-bold text-slate-900 dark:text-white font-mono">
                      $12,450.00
                    </div>
                    <div className="text-[11px] text-slate-500">Active Collateral Facility</div>
                  </div>
                  <div className="text-[10px] text-violet-500 font-medium">
                    Perspective 900 • MaxTilt 10°
                  </div>
                </div>
              </AnimateTiltCard>
            </div>

            {/* 2. Interactive Ripple Button */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Physics Ripple Button</span>
                <span className="text-[10px] text-slate-400 font-mono">Click to Trigger Wave</span>
              </div>
              <div className="flex flex-col items-center justify-center py-2 gap-2.5">
                <AnimateRippleButton variant="primary" size="md" className="w-full">
                  <Sparkles className="h-4 w-4" />
                  Click for Physics Ripple
                </AnimateRippleButton>
                <AnimateRippleButton variant="emerald" size="sm" className="w-full">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Instant Approval Ripple
                </AnimateRippleButton>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center">
                Uses Animate UI RippleButton with dynamic origin click tracking.
              </p>
            </div>

            {/* 3. Shimmering Ambient Text */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Shimmering Text</span>
                <span className="text-[10px] text-slate-400 font-mono">Continuous Beam</span>
              </div>
              <div className="py-4 text-center">
                <div className="text-lg font-bold">
                  <AnimateShimmerText
                    text="CORE BANKING LEDGER ONLINE"
                    color="rgba(99, 102, 241, 0.9)"
                    shimmeringColor="rgba(255, 255, 255, 1)"
                    duration={2.0}
                  />
                </div>
                <div className="text-xs text-slate-500 mt-1">
                  <AnimateShimmerText
                    text="Real-time Amortization Schedule Engine v3.4"
                    duration={2.8}
                  />
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center">
                Animate UI text primitive with customizable beam duration and radiance.
              </p>
            </div>

            {/* 4. Smooth Counting Numbers */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Counting Numbers</span>
                <span className="text-[10px] text-slate-400 font-mono">Animated Rolling</span>
              </div>
              <div className="py-2 text-center">
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  <AnimateCountingNumber
                    number={counterVal}
                    prefix="$"
                    thousandSeparator=","
                  />
                </div>
                <div className="mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={randomizeCounter}
                    className="text-xs h-7 gap-1"
                  >
                    <Activity className="h-3 w-3 text-blue-500" />
                    Roll New Value
                  </Button>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center">
                Spring physics counting animation with comma separators.
              </p>
            </div>

            {/* 5. Luminous Shine Effect */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between gap-3">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Luminous Shine</span>
                <span className="text-[10px] text-slate-400 font-mono">Looping Light Beam</span>
              </div>
              <div className="py-2">
                <AnimateShine className="p-3 bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold">Tier-1 Capital Ratio</span>
                    <Badge className="bg-white/20 text-white text-[10px] border-none">
                      18.4%
                    </Badge>
                  </div>
                  <div className="text-xs opacity-80 mt-1">
                    Compliant with National Bank of Cambodia Prudence Regulations
                  </div>
                </AnimateShine>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight text-center">
                Continuous smooth light refraction across surfaces.
              </p>
            </div>

            {/* 6. Magnetic Cursor Interaction */}
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col justify-between gap-3 text-center">
              <div className="text-xs font-semibold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                <span>Magnetic Cursor Attraction</span>
                <span className="text-[10px] text-slate-400 font-mono">Hover to Pull</span>
              </div>
              <div className="py-3 flex items-center justify-center gap-3">
                <AnimateMagnetic strength={0.4}>
                  <div className="h-10 w-10 rounded-xl bg-violet-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-violet-500 transition-colors">
                    <Zap className="h-5 w-5" />
                  </div>
                </AnimateMagnetic>
                <AnimateMagnetic strength={0.3}>
                  <div className="h-10 w-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-blue-500 transition-colors">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                </AnimateMagnetic>
                <AnimateMagnetic strength={0.35}>
                  <div className="h-10 w-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-md cursor-pointer hover:bg-emerald-500 transition-colors">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                </AnimateMagnetic>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                Elements magnetically track the mouse pointer on proximity.
              </p>
            </div>
          </div>

          {/* Radix UI Primitives Note */}
          <div className="p-3.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-xs text-slate-700 dark:text-slate-300 flex items-center gap-2.5">
            <Zap className="h-4 w-4 text-violet-500 shrink-0" />
            <span>
              All dialogs, tooltips, dropdown menus, popovers, and tabs across Loan-LMS are now powered by <strong>Animate UI Radix Primitives</strong> with native Motion physics.
            </span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
