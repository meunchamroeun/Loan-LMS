"use client";

import React from "react";
import { Sparkles, Layers, CheckCircle2, ExternalLink } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const TECH_ITEMS = [
  {
    name: "Radix UI",
    url: "https://www.radix-ui.com/",
    badge: "Accessible Primitives",
    color: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    description: "WAI-ARIA compliant headless primitives for credit dialogs, dropdowns, select menus, and underwriting tabs.",
  },
  {
    name: "shadcn/ui",
    url: "https://ui.shadcn.com/",
    badge: "Design Tokens",
    color: "bg-slate-500/10 text-slate-700 dark:text-slate-300 border-slate-500/20",
    description: "Enterprise design tokens, typography scales, financial card components, and consistent state styling.",
  },
  {
    name: "Base UI",
    url: "https://base-ui.com/",
    badge: "Headless Engine",
    color: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    description: "Unstyled primitives powering loan amortization sliders, status toggle switches, and progress meters.",
  },
  {
    name: "Tailwind CSS",
    url: "https://tailwindcss.com/",
    badge: "Styling System",
    color: "bg-cyan-500/10 text-cyan-600 border-cyan-500/20",
    description: "Responsive styling engine with dual light/dark microfinance themes, glassmorphism, and responsive layouts.",
  },
  {
    name: "Animate UI",
    url: "https://animate-ui.com/",
    badge: "Animated Primitives",
    color: "bg-violet-500/10 text-violet-600 border-violet-500/20",
    description: "Drop-in animated primitives for Radix UI, 3D tilt cards, ripple buttons, shining badges, and text shimmers.",
  },
  {
    name: "Motion",
    url: "https://motion.dev/ui/loaders",
    badge: "Physics Loaders",
    color: "bg-rose-500/10 text-rose-600 border-rose-500/20",
    description: "Motion.dev jumping dots wave, dual-orbit spinners, real-time equalizer sync bars, and morphing shimmer skeletons.",
  },
  {
    name: "GSAP",
    url: "https://gsap.com/",
    badge: "Timeline Engine",
    color: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    description: "Real-time animated counter rollups for portfolio balances and dynamic credit risk speedometer needle rotation.",
  },
];

export function TechBadgeShowcase({ className }: { className?: string }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-xs font-medium text-slate-700 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 transition-all cursor-pointer shadow-sm group"
        >
          <div className="flex -space-x-1">
            <span className="h-2 w-2 rounded-full bg-blue-500" />
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span className="h-2 w-2 rounded-full bg-purple-500" />
            <span className="h-2 w-2 rounded-full bg-rose-500" />
          </div>
          <span className="font-semibold">System Architecture</span>
          <span className="text-[10px] text-slate-400 group-hover:text-blue-500">Framework Specs</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-88 p-4">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-slate-100 dark:border-slate-800">
          <Sparkles className="h-4 w-4 text-amber-500" />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">Enterprise UI & Framework Stack</h4>
            <p className="text-[11px] text-slate-400">Production-grade architecture verified for LMS operations</p>
          </div>
        </div>
        <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
          {TECH_ITEMS.map((t) => (
            <div
              key={t.name}
              className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 text-xs space-y-1"
            >
              <div className="flex items-center justify-between">
                <a
                  href={t.url}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 inline-flex items-center gap-1"
                >
                  {t.name}
                  <ExternalLink className="h-3 w-3 opacity-60" />
                </a>
                <span className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${t.color}`}>
                  {t.badge}
                </span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-tight">
                {t.description}
              </p>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
