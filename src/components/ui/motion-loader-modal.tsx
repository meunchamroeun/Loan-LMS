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
  MotionDotsLoader,
  MotionOrbitSpinner,
  MotionEqualizerBars,
  MotionPulseRing,
  MotionShimmerBar,
  MotionMatrixGrid,
} from "./motion-loader";
import { AppLoader } from "./app-loader";
import { Sparkles, ExternalLink, Play, CheckCircle2 } from "lucide-react";

export function MotionLoaderModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSimulatingFullPage, setIsSimulatingFullPage] = useState(false);

  const handleSimulateFullPage = () => {
    setIsSimulatingFullPage(true);
    setTimeout(() => {
      setIsSimulatingFullPage(false);
    }, 3200);
  };

  return (
    <>
      {isSimulatingFullPage && (
        <AppLoader
          label="Simulating Motion Gateway Sync"
          sublabel="Loading live ledger records via Motion.dev animation..."
        />
      )}

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-semibold border border-rose-500/20 transition-all cursor-pointer shadow-sm group whitespace-nowrap"
          >
            <Sparkles className="h-3.5 w-3.5 text-rose-500 group-hover:scale-110 transition-transform" />
            <span>Motion UI Loaders</span>
            <Badge variant="outline" className="text-[10px] py-0 px-1.5 border-rose-500/30 text-rose-500 font-mono">
              motion.dev
            </Badge>
          </button>
        </DialogTrigger>

        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-center justify-between pr-6">
              <div className="flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-rose-500/10 text-rose-600 flex items-center justify-center font-bold">
                  M
                </div>
                <div>
                  <DialogTitle className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Motion UI Loaders Suite
                    <a
                      href="https://motion.dev/ui/loaders"
                      target="_blank"
                      rel="noreferrer"
                      className="text-xs font-normal text-rose-600 dark:text-rose-400 hover:underline inline-flex items-center gap-1"
                    >
                      motion.dev/ui/loaders
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </DialogTitle>
                  <DialogDescription className="text-xs text-slate-500 dark:text-slate-400">
                    High-performance loaders and morphing shimmers built with modern <code className="text-rose-500">motion/react</code>.
                  </DialogDescription>
                </div>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6 pt-3">
            {/* Interactive Grid of Loaders */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Jumping Dots Wave */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Jumping Dots Wave</span>
                  <span className="text-[10px] text-slate-400 font-mono">Variants + Stagger</span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <MotionDotsLoader size="lg" color="primary" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Smooth 3-dot staggered wave with physics springs and reverse looping.
                </p>
              </div>

              {/* 2. Dual-Orbit Spinner */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Dual-Orbit Spinner</span>
                  <span className="text-[10px] text-slate-400 font-mono">Linear 360° + Pulse</span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <MotionOrbitSpinner size="lg" color="primary" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Dual-ring circular spinner with contrast gradient arc and center pulse.
                </p>
              </div>

              {/* 3. Equalizer Ledger Sync */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Equalizer Data Bars</span>
                  <span className="text-[10px] text-slate-400 font-mono">Real-time Stream</span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <MotionEqualizerBars size="lg" barCount={5} />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  5-track vertical bars animating height with harmonic delays for ledger sync.
                </p>
              </div>

              {/* 4. Radar Pulse Ring */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Radar Pulse Ring</span>
                  <span className="text-[10px] text-slate-400 font-mono">Scale + Fade Rings</span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <MotionPulseRing size="lg" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Concentric expanding rings indicating secure live session verification.
                </p>
              </div>

              {/* 5. Matrix 9-Dot Pulse */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Matrix Computation Grid</span>
                  <span className="text-[10px] text-slate-400 font-mono">Radial Delay Wave</span>
                </div>
                <div className="py-4 flex items-center justify-center">
                  <MotionMatrixGrid />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  3x3 grid with radial staggered pulsing for underwriting calculation engines.
                </p>
              </div>

              {/* 6. Shimmer Progress Bar */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col items-center justify-between gap-3 text-center">
                <div className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 dark:text-slate-300">
                  <span>Fluid Shimmer Bar</span>
                  <span className="text-[10px] text-slate-400 font-mono">Gradient Sweep</span>
                </div>
                <div className="py-4 w-full px-4 flex items-center justify-center">
                  <MotionShimmerBar height="md" />
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                  Horizontal sweeping light beam for seamless route and data transitions.
                </p>
              </div>
            </div>

            {/* Live Interactive Action */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-rose-600/10 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div>
                <h5 className="font-bold text-sm text-slate-900 dark:text-white">
                  Test Full-Screen Motion Route Loader
                </h5>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Triggers the branded Motion loader with rotating orbits and live status cycling.
                </p>
              </div>
              <Button
                onClick={handleSimulateFullPage}
                className="gap-2 shrink-0 bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                Simulate 3s Loader
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
