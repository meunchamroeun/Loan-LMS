"use client";

import * as React from "react";
import { motion, type Variants } from "motion/react";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. Motion Jumping Dots Loader (Motion.dev standard jumping wave)
// ============================================================================
export interface MotionDotsLoaderProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg";
  color?: "primary" | "white" | "slate" | "emerald";
}

const sizeConfig = {
  xs: { dot: "w-1.5 h-1.5", gap: "gap-1", jump: -4 },
  sm: { dot: "w-2 h-2", gap: "gap-1.5", jump: -6 },
  md: { dot: "w-2.5 h-2.5", gap: "gap-2", jump: -9 },
  lg: { dot: "w-3.5 h-3.5", gap: "gap-2.5", jump: -12 },
};

const colorConfig = {
  primary: ["bg-blue-600 dark:bg-blue-400", "bg-indigo-600 dark:bg-indigo-400", "bg-cyan-500 dark:bg-cyan-300"],
  white: ["bg-white/90", "bg-white/75", "bg-white/60"],
  slate: ["bg-slate-400 dark:bg-slate-500", "bg-slate-500 dark:bg-slate-400", "bg-slate-600 dark:bg-slate-300"],
  emerald: ["bg-emerald-500", "bg-teal-500", "bg-cyan-500"],
};

export function MotionDotsLoader({
  className,
  size = "md",
  color = "primary",
}: MotionDotsLoaderProps) {
  const { dot, gap, jump } = sizeConfig[size];
  const colors = colorConfig[color];

  const dotVariants: Variants = {
    jump: {
      transform: `translateY(${jump}px)`,
      transition: {
        duration: 0.55,
        repeat: Infinity,
        repeatType: "mirror",
        ease: "easeInOut",
      },
    },
  };

  return (
    <motion.div
      animate="jump"
      transition={{
        staggerChildren: -0.15,
        staggerDirection: -1,
      }}
      className={cn("inline-flex items-center justify-center py-1", gap, className)}
      role="status"
      aria-label="Loading"
    >
      <motion.span
        variants={dotVariants}
        className={cn(dot, "rounded-full shadow-sm", colors[0])}
      />
      <motion.span
        variants={dotVariants}
        className={cn(dot, "rounded-full shadow-sm", colors[1])}
      />
      <motion.span
        variants={dotVariants}
        className={cn(dot, "rounded-full shadow-sm", colors[2])}
      />
    </motion.div>
  );
}

// ============================================================================
// 2. Motion Orbit Spinner (Motion.dev Circle Spinner with Dual Track)
// ============================================================================
export interface MotionOrbitSpinnerProps {
  className?: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  color?: "primary" | "white" | "slate" | "emerald";
}

const spinnerSizes = {
  xs: { outer: "w-4 h-4", border: "border-2", center: "w-1 h-1" },
  sm: { outer: "w-5 h-5", border: "border-2", center: "w-1.5 h-1.5" },
  md: { outer: "w-8 h-8", border: "border-[2.5px]", center: "w-2 h-2" },
  lg: { outer: "w-12 h-12", border: "border-3", center: "w-3 h-3" },
  xl: { outer: "w-16 h-16", border: "border-4", center: "w-3.5 h-3.5" },
};

export function MotionOrbitSpinner({
  className,
  size = "md",
  color = "primary",
}: MotionOrbitSpinnerProps) {
  const { outer, border, center } = spinnerSizes[size];

  const borderColors = {
    primary:
      "border-blue-500/20 border-t-blue-600 border-r-indigo-600 dark:border-blue-500/20 dark:border-t-blue-400 dark:border-r-cyan-400",
    white: "border-white/20 border-t-white border-r-white/80",
    slate: "border-slate-300 dark:border-slate-700 border-t-slate-700 dark:border-t-slate-200",
    emerald: "border-emerald-500/20 border-t-emerald-500 border-r-teal-500",
  };

  const centerColors = {
    primary: "bg-blue-600 dark:bg-blue-400",
    white: "bg-white",
    slate: "bg-slate-600 dark:bg-slate-300",
    emerald: "bg-emerald-500",
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center shrink-0", outer, className)}
      role="status"
      aria-label="Loading"
    >
      {/* Primary Spinning Track */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{
          duration: 0.9,
          repeat: Infinity,
          ease: "linear",
        }}
        className={cn(
          "w-full h-full rounded-full",
          border,
          borderColors[color]
        )}
      />

      {/* Pulsing center micro-core */}
      <motion.div
        animate={{ scale: [0.8, 1.25, 0.8], opacity: [0.6, 1, 0.6] }}
        transition={{
          duration: 1.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className={cn("absolute rounded-full", center, centerColors[color])}
      />
    </div>
  );
}

// ============================================================================
// 3. Motion Equalizer Bars (Real-time data/ledger sync indicator)
// ============================================================================
export interface MotionEqualizerBarsProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  barCount?: 3 | 4 | 5;
}

export function MotionEqualizerBars({
  className,
  size = "md",
  barCount = 4,
}: MotionEqualizerBarsProps) {
  const heights = {
    sm: "h-4 w-4 gap-0.5",
    md: "h-6 w-7 gap-1",
    lg: "h-9 w-10 gap-1.5",
  };

  const barWidths = {
    sm: "w-0.5",
    md: "w-1",
    lg: "w-1.5",
  };

  return (
    <div
      className={cn("flex items-end justify-center", heights[size], className)}
      role="status"
      aria-label="Synchronizing"
    >
      {Array.from({ length: barCount }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            height: ["25%", "100%", "25%"],
          }}
          transition={{
            duration: 0.85,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 0.14,
          }}
          className={cn(
            "rounded-full bg-gradient-to-t from-blue-600 via-indigo-500 to-cyan-400",
            barWidths[size]
          )}
        />
      ))}
    </div>
  );
}

// ============================================================================
// 4. Motion Pulse Ring / Radar (Live connection/session verification)
// ============================================================================
export interface MotionPulseRingProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function MotionPulseRing({ className, size = "md" }: MotionPulseRingProps) {
  const dims = {
    sm: "w-6 h-6",
    md: "w-10 h-10",
    lg: "w-14 h-14",
  };

  return (
    <div className={cn("relative flex items-center justify-center", dims[size], className)}>
      {/* Expanding Ripple Ring 1 */}
      <motion.div
        animate={{ scale: [0.8, 2], opacity: [0.75, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut" }}
        className="absolute inset-0 rounded-full border border-blue-500/40 bg-blue-500/10"
      />
      {/* Expanding Ripple Ring 2 (delayed) */}
      <motion.div
        animate={{ scale: [0.8, 2], opacity: [0.75, 0] }}
        transition={{ duration: 1.8, repeat: Infinity, ease: "easeOut", delay: 0.6 }}
        className="absolute inset-0 rounded-full border border-indigo-500/40 bg-indigo-500/10"
      />
      {/* Solid Center Core */}
      <div className="relative w-2.5 h-2.5 rounded-full bg-blue-600 dark:bg-blue-400 shadow-md shadow-blue-500/50" />
    </div>
  );
}

// ============================================================================
// 5. Motion Shimmer Bar (Smooth progress indicator)
// ============================================================================
export interface MotionShimmerBarProps {
  className?: string;
  height?: "sm" | "md" | "lg";
}

export function MotionShimmerBar({ className, height = "md" }: MotionShimmerBarProps) {
  const hClasses = {
    sm: "h-1",
    md: "h-1.5",
    lg: "h-2.5",
  };

  return (
    <div
      className={cn(
        "relative w-full overflow-hidden rounded-full bg-slate-200/80 dark:bg-slate-800/80",
        hClasses[height],
        className
      )}
    >
      <motion.div
        animate={{
          x: ["-100%", "200%"],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-0 bottom-0 w-1/2 rounded-full bg-gradient-to-r from-transparent via-blue-500 to-cyan-400 opacity-90 shadow-sm"
      />
    </div>
  );
}

// ============================================================================
// 6. Motion Matrix Grid (9-dot pulse matrix for analytical data)
// ============================================================================
export function MotionMatrixGrid({ className }: { className?: string }) {
  const dotIndices = [
    [0, 1, 2],
    [1, 2, 3],
    [2, 3, 4],
  ];

  return (
    <div className={cn("grid grid-cols-3 gap-1.5 w-7 h-7", className)}>
      {dotIndices.flat().map((tier, idx) => (
        <motion.span
          key={idx}
          animate={{
            scale: [0.65, 1.25, 0.65],
            opacity: [0.35, 1, 0.35],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: tier * 0.15,
          }}
          className="w-1.5 h-1.5 rounded-sm bg-gradient-to-tr from-blue-600 to-cyan-400"
        />
      ))}
    </div>
  );
}
