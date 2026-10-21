"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";

const TOUR_SCRIPT =
  "Welcome to Solomon Stays. This is a hotel occupancy and revenue dashboard built for Kenyan hospitality managers. Track your room status in real time, forecast demand for the next 30 days, understand which booking channels are most profitable, and generate one-click reports for your team. No more spreadsheets. No more guesswork. Start your free 14-day trial today and take control of your hotel's revenue.";

export function VoiceTour() {
  const [speaking, setSpeaking] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [supported, setSupported] = useState(true);
  const startedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
    }
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setSpeaking(false);
  }, []);

  const play = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setSupported(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(TOUR_SCRIPT);
    utterance.rate = 0.94;
    utterance.pitch = 1.08;
    utterance.lang = "en-KE";
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    utterance.onerror = () => {
      setSpeaking(false);
      setHasPlayed(true);
    };
    window.speechSynthesis.speak(utterance);
    setSpeaking(true);
    setHasPlayed(true);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const trigger = (event?: Event) => {
      if (startedRef.current) return;
      const target = event?.target as HTMLElement | null | undefined;
      if (target?.closest(".ss-voice")) return;
      startedRef.current = true;
      play();
    };
    const onScroll = () => {
      if (window.scrollY > 80) trigger();
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", trigger);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", trigger);
    };
  }, [play]);

  useEffect(() => () => stop(), [stop]);

  const handleClick = () => {
    if (speaking) {
      stop();
      return;
    }
    play();
  };

  const label = speaking
    ? "Site voice tour, click to mute"
    : hasPlayed
      ? "Replay tour"
      : "Site voice tour, click to play";

  return (
    <button
      type="button"
      className={`ss-float ss-voice${speaking ? " speaking" : ""}`}
      onClick={handleClick}
      aria-label={label}
      aria-pressed={speaking}
      title={hasPlayed && !speaking ? "Replay tour" : "Hear what this site is about"}
      disabled={!supported}
    >
      {speaking ? (
        <Volume2 size={24} aria-hidden="true" />
      ) : (
        <VolumeX size={24} aria-hidden="true" />
      )}
      <span className="ss-float-tooltip" role="tooltip">
        {hasPlayed && !speaking ? "Replay tour" : "Hear what this site is about"}
      </span>
    </button>
  );
}
