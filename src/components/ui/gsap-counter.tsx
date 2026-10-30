"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";

interface GsapCounterProps {
  value: number;
  duration?: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}

export function GsapCounter({
  value,
  duration = 1.2,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: GsapCounterProps) {
  const numberRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = numberRef.current;
    if (!el) return;

    const proxy = { val: 0 };
    const tween = gsap.to(proxy, {
      val: value,
      duration,
      ease: "power2.out",
      onUpdate: () => {
        if (el) {
          const formatted = proxy.val.toLocaleString("en-US", {
            minimumFractionDigits: decimals,
            maximumFractionDigits: decimals,
          });
          el.innerText = `${prefix}${formatted}${suffix}`;
        }
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, prefix, suffix, decimals]);

  return <span ref={numberRef} className={className} />;
}
