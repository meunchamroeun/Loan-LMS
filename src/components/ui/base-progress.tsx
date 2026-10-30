"use client";

import * as React from "react";
import { Progress as BaseProgress } from "@base-ui/react/progress";
import { cn } from "@/lib/utils";

export interface BaseProgressBarProps {
  value: number;
  max?: number;
  className?: string;
  indicatorClassName?: string;
  label?: string;
  showValueText?: boolean;
}

export function BaseProgressBar({
  value,
  max = 100,
  className,
  indicatorClassName,
  label,
  showValueText = true,
}: BaseProgressBarProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((value / max) * 100)));

  return (
    <div className={cn("space-y-1.5 w-full", className)}>
      {(label || showValueText) && (
        <div className="flex items-center justify-between text-xs">
          {label && <span className="text-slate-500 dark:text-slate-400 font-medium">{label}</span>}
          {showValueText && (
            <span className="font-bold text-slate-800 dark:text-slate-200">{percentage}%</span>
          )}
        </div>
      )}
      <BaseProgress.Root
        value={percentage}
        className="w-full"
      >
        <BaseProgress.Track className="relative h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
          <BaseProgress.Indicator
            className={cn(
              "h-full rounded-full transition-all duration-500 ease-out",
              percentage >= 80
                ? "bg-emerald-500"
                : percentage >= 40
                ? "bg-blue-600"
                : "bg-amber-500",
              indicatorClassName
            )}
          />
        </BaseProgress.Track>
      </BaseProgress.Root>
    </div>
  );
}
