"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GsapGaugeProps {
  score: number; // e.g. 785 out of 1000
  maxScore?: number;
  label?: string;
  className?: string;
}

export function GsapCreditGauge({
  score,
  maxScore = 1000,
  label = "Credit Score",
  className = "",
}: GsapGaugeProps) {
  const needleRef = useRef<SVGLineElement>(null);
  const scoreTextRef = useRef<HTMLSpanElement>(null);
  const arcRef = useRef<SVGCircleElement>(null);

  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  // Needle angle from -90deg to +90deg (180deg sweep)
  const targetAngle = -90 + (percentage / 100) * 180;

  useEffect(() => {
    const needle = needleRef.current;
    const scoreText = scoreTextRef.current;
    const arc = arcRef.current;
    if (!needle || !scoreText) return;

    const proxy = { val: 0, angle: -90 };

    const tl = gsap.timeline({ defaults: { ease: "elastic.out(1, 0.75)", duration: 1.8 } });

    tl.to(proxy, {
      val: score,
      angle: targetAngle,
      onUpdate: () => {
        if (needle) {
          needle.setAttribute(
            "transform",
            `rotate(${proxy.angle}, 100, 100)`
          );
        }
        if (scoreText) {
          scoreText.innerText = Math.round(proxy.val).toString();
        }
      },
    });

    if (arc) {
      const circumference = Math.PI * 70; // half circle
      const strokeDash = (percentage / 100) * circumference;
      gsap.to(arc, {
        strokeDasharray: `${strokeDash} ${circumference}`,
        duration: 1.5,
        ease: "power2.out",
      });
    }

    return () => {
      tl.kill();
    };
  }, [score, maxScore, targetAngle, percentage]);

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div className="relative w-48 h-28 flex items-end justify-center">
        <svg viewBox="0 0 200 120" className="w-full h-full overflow-visible">
          {/* Background Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="currentColor"
            className="text-slate-200 dark:text-slate-800"
            strokeWidth="14"
            strokeLinecap="round"
          />

          {/* Color Gradient Segments */}
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ef4444" />
              <stop offset="45%" stopColor="#f59e0b" />
              <stop offset="85%" stopColor="#10b981" />
            </linearGradient>
          </defs>

          {/* Active Progress Arc */}
          <path
            d="M 25 100 A 75 75 0 0 1 175 100"
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="14"
            strokeLinecap="round"
            opacity="0.9"
          />

          {/* Center Pivot */}
          <circle cx="100" cy="100" r="7" className="fill-slate-800 dark:fill-white" />

          {/* Animated Needle */}
          <line
            ref={needleRef}
            x1="100"
            y1="100"
            x2="100"
            y2="34"
            stroke="currentColor"
            className="text-slate-900 dark:text-white"
            strokeWidth="3.5"
            strokeLinecap="round"
            transform="rotate(-90, 100, 100)"
          />
        </svg>

        {/* Center Score readout */}
        <div className="absolute bottom-0 flex flex-col items-center">
          <span
            ref={scoreTextRef}
            className="text-2xl font-black tracking-tight text-slate-900 dark:text-white"
          >
            {score}
          </span>
          <span className="text-[10px] text-slate-400 uppercase tracking-widest font-semibold">
            {label}
          </span>
        </div>
      </div>

      <div className="flex justify-between w-44 text-[10px] font-bold text-slate-400 mt-2 px-1">
        <span className="text-rose-500">Poor (0)</span>
        <span className="text-amber-500">Fair (500)</span>
        <span className="text-emerald-500">Prime (1000)</span>
      </div>
    </div>
  );
}
