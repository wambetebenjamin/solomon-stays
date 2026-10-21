"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function HeroEntrance({ children }: { children: React.ReactNode }) {
  const scope = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!scope.current) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const context = gsap.context(() => {
      gsap.from(".ss-hero-copy > *", {
        y: 26,
        opacity: 0,
        duration: 0.75,
        ease: "power2.out",
        stagger: 0.09,
      });
      gsap.from(".ss-hero-stats > div", {
        y: 18,
        opacity: 0,
        duration: 0.6,
        delay: 0.45,
        ease: "power2.out",
        stagger: 0.08,
      });
      gsap.from(".ss-hero-panel", {
        y: 28,
        opacity: 0,
        duration: 0.8,
        delay: 0.3,
        ease: "power2.out",
      });
    }, scope);

    return () => context.revert();
  }, []);

  return <div ref={scope}>{children}</div>;
}
