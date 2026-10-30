"use client";

import React, { useEffect, useRef, useState } from "react";
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
  const [hasAnimated, setHasAnimated] = useState(false);

  const formatNum = (n: number) =>
    n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });

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
          el.innerText = `${prefix}${formatNum(proxy.val)}${suffix}`;
        }
      },
      onComplete: () => {
        setHasAnimated(true);
      },
    });

    return () => {
      tween.kill();
    };
  }, [value, duration, prefix, suffix, decimals]);

  return (
    <span ref={numberRef} className={className} suppressHydrationWarning>
      {prefix}{formatNum(value)}{suffix}
    </span>
  );
}
