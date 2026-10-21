"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface KpiCardProps {
  label: string;
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  delta?: number;
  foot?: string;
  prediction?: boolean;
  compareLabel?: string;
}

export function KpiCard({
  label,
  value,
  prefix,
  suffix,
  decimals = 0,
  delta,
  foot,
  prediction = false,
  compareLabel = "vs yesterday",
}: KpiCardProps) {
  const [display, setDisplay] = useState(value);
  const counter = useRef({ value });

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setDisplay(value);
      return;
    }

    counter.current.value = 0;
    setDisplay(0);

    const tween = gsap.to(counter.current, {
      value,
      duration: 1.1,
      ease: "power2.out",
      onUpdate: () => setDisplay(counter.current.value),
    });

    return () => {
      tween.kill();
    };
  }, [value]);

  const formatted = display.toLocaleString("en-KE", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <article className={`kpi-card${prediction ? " prediction" : ""}`}>
      <div className="kpi-label">
        {label}
        {prediction && <span className="ss-badge red">Forecast</span>}
      </div>
      <div className="kpi-value">
        {prefix}
        {formatted}
        {suffix && <small>{suffix}</small>}
      </div>
      <div className="kpi-foot">
        {typeof delta === "number" && Number.isFinite(delta) && (
          <span className={`kpi-delta ${delta >= 0 ? "up" : "down"}`}>
            {delta >= 0 ? "+" : ""}
            {delta.toFixed(1)}%
          </span>
        )}
        <span>{foot ?? compareLabel}</span>
      </div>
    </article>
  );
}
