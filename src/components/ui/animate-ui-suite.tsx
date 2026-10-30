"use client";

import * as React from "react";
import { motion } from "motion/react";
import { CountingNumber } from "@animate-ui/react/primitives/texts/counting-number";
import { Shine } from "@animate-ui/react/primitives/effects/shine";
import { Tilt, TiltContent } from "@animate-ui/react/primitives/effects/tilt";
import { Magnetic } from "@animate-ui/react/primitives/effects/magnetic";
import { RippleButton, RippleButtonRipples } from "@animate-ui/react/primitives/buttons/ripple";
import { cn } from "@/lib/utils";

// ============================================================================
// 1. Shimmering Text (Hardware-accelerated shimmer effect, zero Motion color warnings)
// ============================================================================
export interface AnimateShimmerTextProps {
  text: string;
  className?: string;
  duration?: number;
  color?: string;
  shimmeringColor?: string;
}

export function AnimateShimmerText({
  text,
  className,
  duration = 2.4,
  color,
  shimmeringColor = "rgba(255, 255, 255, 0.8)",
}: AnimateShimmerTextProps) {
  return (
    <span
      className={cn(
        "relative inline-flex items-center font-medium tracking-tight whitespace-nowrap overflow-hidden select-none",
        className
      )}
      style={color ? { color } : undefined}
    >
      <span className="relative z-10">{text}</span>
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${shimmeringColor} 50%, transparent 100%)`,
        }}
        initial={{ x: "-100%" }}
        animate={{ x: "200%" }}
        transition={{
          repeat: Infinity,
          duration,
          ease: "easeInOut",
          repeatDelay: 0.6,
        }}
      />
    </span>
  );
}

// ============================================================================
// 2. Ripple Button from Animate UI (animate-ui.com/docs/components/buttons/ripple-button)
// ============================================================================
export interface AnimateRippleButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "emerald";
  size?: "sm" | "md" | "lg";
  rippleColor?: string;
}

export function AnimateRippleButton({
  children,
  className,
  variant = "primary",
  size = "md",
  rippleColor,
  ...props
}: AnimateRippleButtonProps) {
  const variantStyles = {
    primary: "bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-500/20",
    secondary: "bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-900 dark:text-white",
    outline: "border border-slate-200 dark:border-slate-800 bg-transparent hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200",
    emerald: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-md shadow-emerald-500/20",
  };

  const sizeStyles = {
    sm: "h-8 px-3 text-xs rounded-lg",
    md: "h-9 px-4 text-sm rounded-xl",
    lg: "h-11 px-6 text-base font-semibold rounded-xl",
  };

  return (
    <RippleButton
      hoverScale={1.02}
      tapScale={0.97}
      className={cn(
        "relative inline-flex items-center justify-center overflow-hidden font-medium transition-all cursor-pointer whitespace-nowrap select-none",
        variantStyles[variant],
        sizeStyles[size],
        className
      )}
      {...(props as any)}
    >
      <RippleButtonRipples color={rippleColor || "rgba(255, 255, 255, 0.35)"} />
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </RippleButton>
  );
}

// ============================================================================
// 3. Shine Card / Badge from Animate UI (animate-ui.com/docs/components/effects/shine)
// ============================================================================
export interface AnimateShineProps {
  children: React.ReactNode;
  className?: string;
  duration?: number;
  loop?: boolean;
}

export function AnimateShine({
  children,
  className,
  duration = 3.5,
  loop = true,
}: AnimateShineProps) {
  return (
    <Shine
      duration={duration}
      loop={loop}
      opacity={0.4}
      color="rgba(255, 255, 255, 0.85)"
      className={cn("relative overflow-hidden rounded-xl", className)}
    >
      {children}
    </Shine>
  );
}

// ============================================================================
// 4. 3D Parallax Tilt Card from Animate UI (animate-ui.com/docs/components/effects/tilt)
// ============================================================================
export interface AnimateTiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
}

export function AnimateTiltCard({
  children,
  className,
  maxTilt = 7,
}: AnimateTiltCardProps) {
  return (
    <Tilt maxTilt={maxTilt} perspective={900} className={cn("h-full", className)}>
      <TiltContent className="h-full">{children}</TiltContent>
    </Tilt>
  );
}

// ============================================================================
// 5. Magnetic Button / Icon from Animate UI (animate-ui.com/docs/components/effects/magnetic)
// ============================================================================
export function AnimateMagnetic({
  children,
  className,
  strength = 0.25,
}: {
  children: React.ReactNode;
  className?: string;
  strength?: number;
}) {
  return (
    <Magnetic strength={strength} onlyOnHover className={cn("inline-flex", className)}>
      {children}
    </Magnetic>
  );
}

// ============================================================================
// 6. Smooth Counting Number from Animate UI (animate-ui.com/docs/components/texts/counting-number)
// ============================================================================
export function AnimateCountingNumber({
  number,
  prefix = "",
  suffix = "",
  decimalPlaces = 0,
  thousandSeparator = ",",
  className,
}: {
  number: number;
  prefix?: string;
  suffix?: string;
  decimalPlaces?: number;
  thousandSeparator?: string;
  className?: string;
}) {
  return (
    <span className={cn("inline-flex items-center font-mono whitespace-nowrap", className)}>
      {prefix && <span className="mr-0.5">{prefix}</span>}
      <CountingNumber
        number={number}
        decimalPlaces={decimalPlaces}
        thousandSeparator={thousandSeparator}
      />
      {suffix && <span className="ml-0.5">{suffix}</span>}
    </span>
  );
}
