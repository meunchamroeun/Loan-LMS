"use client";

import * as React from "react";
import { Slider as BaseSlider } from "@base-ui/react/slider";
import { cn } from "@/lib/utils";

export interface BaseLoanSliderProps {
  value: number;
  min?: number;
  max?: number;
  step?: number;
  onValueChange: (val: number) => void;
  className?: string;
  formatValue?: (val: number) => string;
  label?: string;
}

export function BaseLoanSlider({
  value,
  min = 500,
  max = 50000,
  step = 100,
  onValueChange,
  className,
  formatValue,
  label,
}: BaseLoanSliderProps) {
  return (
    <div className={cn("space-y-2 w-full", className)}>
      <div className="flex items-center justify-between text-sm">
        {label && <span className="font-medium text-slate-700 dark:text-slate-300">{label}</span>}
        <span className="font-semibold text-blue-600 dark:text-blue-400">
          {formatValue ? formatValue(value) : value}
        </span>
      </div>
      <BaseSlider.Root
        value={value}
        min={min}
        max={max}
        step={step}
        onValueChange={(val) => {
          if (typeof val === "number") onValueChange(val);
          else if (Array.isArray(val) && typeof val[0] === "number") onValueChange(val[0]);
        }}
        className="w-full"
      >
        <BaseSlider.Control className="relative flex items-center w-full h-6 cursor-pointer touch-none select-none">
          <BaseSlider.Track className="relative h-2 w-full rounded-full bg-slate-200 dark:bg-slate-700">
            <BaseSlider.Indicator className="h-full bg-blue-600 rounded-full" />
            <BaseSlider.Thumb className="block h-5 w-5 rounded-full bg-white border-2 border-blue-600 shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none cursor-grab active:cursor-grabbing" />
          </BaseSlider.Track>
        </BaseSlider.Control>
      </BaseSlider.Root>
      <div className="flex justify-between text-[11px] text-slate-400">
        <span>{formatValue ? formatValue(min) : min}</span>
        <span>{formatValue ? formatValue(max) : max}</span>
      </div>
    </div>
  );
}
