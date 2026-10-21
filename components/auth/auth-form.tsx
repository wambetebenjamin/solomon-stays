"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import { Lock, Mail } from "lucide-react";
import { getRecaptchaV3Token, recaptchaConfigured } from "@/lib/recaptchaClient";

interface AuthFormProps {
  mode: "signin" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard";

  const [name, setName] = useState("");
  const [hotel, setHotel] = useState("");
  const [email, setEmail] = useState(mode === "signin" ? "manager@solomonstays.co.ke" : "");
  const [password, setPassword] = useState(mode === "signin" ? "solomon2026" : "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCredentials = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const token = await getRecaptchaV3Token(mode === "signin" ? "signin" : "signup");
    if (recaptchaConfigured() && token) {
      try {
        const check = await fetch("/api/recaptcha/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, version: "v3", action: mode }),
        });
        const result = await check.json();
        if (!result.success) {
          setError("Our automated check was not confident. Please try again in a moment.");
          setLoading(false);
          return;
        }
      } catch {
        setError("Verification is temporarily unavailable. Please try again.");
        setLoading(false);
        return;
      }
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (result?.error) {
      setError(
        mode === "signin"
          ? "That email and password combination did not match a manager account."
          : "We could not create the account with those details. Check the email and password length.",
      );
      return;
    }

    router.push(callbackUrl);
  };

  const handleGoogle = async () => {
    setLoading(true);
    await signIn("google", { callbackUrl });
  };

  return (
    <div className="auth-card">
      <span className="ss-eyebrow">Solomon Stays workspace</span>
      <h1>{mode === "signin" ? "Sign in to your dashboard" : "Create your hotel workspace"}</h1>
      <p className="auth-lede">
        {mode === "signin"
          ? "Hotel managers and revenue managers sign in here. Your workspace only shows your own property data."
          : "Default role is hotel manager with full dashboard access for your property. Multi property managers can switch properties from the header."}
      </p>

      {mode === "signin" && (
        <div className="demo-credentials">
          <b>Demo manager login</b>
          <br />
          Email manager@solomonstays.co.ke
          <br />
          Password solomon2026
        </div>
      )}

      <form onSubmit={handleCredentials}>
        {mode === "signup" && (
          <>
            <div className="ss-field">
              <label htmlFor="auth-name">Your name</label>
              <input
                id="auth-name"
                className="ss-input"
                required
                minLength={2}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Wanjiku Kamau"
              />
            </div>
            <div className="ss-field">
              <label htmlFor="auth-hotel">Hotel name</label>
              <input
                id="auth-hotel"
                className="ss-input"
                required
                minLength={2}
                value={hotel}
                onChange={(event) => setHotel(event.target.value)}
                placeholder="Riverside Lodge, Naivasha"
              />
            </div>
          </>
        )}

        <div className="ss-field">
          <label htmlFor="auth-email">
            <Mail size={12} aria-hidden="true" /> Work email
          </label>
          <input
            id="auth-email"
            type="email"
            className="ss-input"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>

        <div className="ss-field">
          <label htmlFor="auth-password">
            <Lock size={12} aria-hidden="true" /> Password
          </label>
          <input
            id="auth-password"
            type="password"
            className="ss-input"
            required
            minLength={6}
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
          {mode === "signup" && <p className="ss-hint">At least 6 characters. Use a work address you check daily.</p>}
        </div>

        {error && <div className="ss-alert error">{error}</div>}

        <button type="submit" className="ss-btn" style={{ width: "100%" }} disabled={loading}>
          {loading ? (
            <>
              <span className="spinner" aria-hidden="true" /> Please wait
            </>
          ) : mode === "signin" ? (
            "Sign in"
          ) : (
            "Create workspace"
          )}
        </button>
      </form>

      <div className="auth-divider">or</div>

      <button type="button" className="ss-btn outline" style={{ width: "100%" }} onClick={handleGoogle} disabled={loading}>
        Continue with Google
      </button>

      <p className="auth-alt">
        {mode === "signin" ? (
          <>
            New to Solomon Stays? <Link href="/auth/signup">Start a free 14 day trial</Link>
          </>
        ) : (
          <>
            Already have a workspace? <Link href="/auth/signin">Sign in</Link>
          </>
        )}
      </p>

      <p className="ss-hint" style={{ marginTop: 14, textAlign: "center" }}>
        Protected by Google reCAPTCHA v3. By continuing you accept our{" "}
        <Link href="/legal/terms" style={{ color: "var(--ss-red)" }}>
          terms
        </Link>{" "}
        and{" "}
        <Link href="/legal/privacy-policy" style={{ color: "var(--ss-red)" }}>
          privacy policy
        </Link>
        .
      </p>
    </div>
  );
}
