"use client";

declare global {
  interface Window {
    grecaptcha?: {
      ready: (callback: () => void) => void;
      execute: (siteKey: string, options: { action: string }) => Promise<string>;
      render: (
        container: HTMLElement | string,
        options: { sitekey: string; theme?: "light" | "dark"; size?: "normal" | "compact" },
      ) => number;
      reset: (widgetId?: number) => void;
    };
    ssRecaptchaLoaded?: Promise<void>;
  }
}

const SITE_KEY = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;

export function recaptchaConfigured(): boolean {
  return Boolean(SITE_KEY);
}

export function loadRecaptcha(): Promise<void> {
  if (typeof window === "undefined" || !SITE_KEY) return Promise.resolve();
  if (window.ssRecaptchaLoaded) return window.ssRecaptchaLoaded;

  window.ssRecaptchaLoaded = new Promise<void>((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>("script[data-ss-recaptcha]");
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("recaptcha-load-failed")));
      return;
    }

    const script = document.createElement("script");
    script.src = `https://www.google.com/recaptcha/api.js?render=${SITE_KEY}`;
    script.async = true;
    script.defer = true;
    script.dataset.ssRecaptcha = "true";
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("recaptcha-load-failed"));
    document.head.appendChild(script);
  });

  return window.ssRecaptchaLoaded;
}

export async function getRecaptchaV3Token(action: string): Promise<string | undefined> {
  if (!SITE_KEY) return undefined;
  try {
    await loadRecaptcha();
    if (!window.grecaptcha) return undefined;
    await new Promise<void>((resolve) => {
      window.grecaptcha?.ready(() => resolve());
    });
    return await window.grecaptcha.execute(SITE_KEY, { action });
  } catch {
    return undefined;
  }
}

export function renderRecaptchaV2(container: HTMLElement): number | null {
  if (!SITE_KEY || !window.grecaptcha) return null;
  try {
    return window.grecaptcha.render(container, { sitekey: SITE_KEY, theme: "light" });
  } catch {
    return null;
  }
}
