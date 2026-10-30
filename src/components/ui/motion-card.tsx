"use client";

import React from "react";
import { motion, HTMLMotionProps } from "motion/react";
import { Tilt, TiltContent } from "@animate-ui/react/primitives/effects/tilt";
import { cn } from "@/lib/utils";

export interface MotionCardProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  tilt?: boolean;
}

export function MotionCard({
  children,
  className,
  delay = 0,
  tilt = false,
  ...props
}: MotionCardProps) {
  const cardContent = (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{
        duration: 0.45,
        delay,
        ease: [0.25, 0.1, 0.25, 1.0],
      }}
      whileHover={tilt ? undefined : { y: -3, transition: { duration: 0.2 } }}
      className={cn(
        "rounded-2xl border border-slate-200/80 bg-white p-5 text-slate-900 shadow-sm transition-shadow hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );

  if (tilt) {
    return (
      <Tilt maxTilt={6} perspective={1000} className="h-full">
        <TiltContent className="h-full">{cardContent}</TiltContent>
      </Tilt>
    );
  }

  return cardContent;
}

export const motionContainerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

export const motionItemVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};
