/**
 * Google reCAPTCHA v3 server verification.
 * The secret key never reaches the browser. If no secret is configured the
 * route reports a skipped verification so local builds stay usable.
 */

export interface RecaptchaResult {
  success: boolean;
  score: number;
  skipped: boolean;
  fallbackRequired: boolean;
  errorCodes: string[];
}

export async function verifyRecaptcha(token: string | undefined, remoteIp?: string): Promise<RecaptchaResult> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) {
    return { success: true, score: 0.9, skipped: true, fallbackRequired: false, errorCodes: [] };
  }
  if (!token) {
    return { success: false, score: 0, skipped: false, fallbackRequired: true, errorCodes: ["missing-input-response"] };
  }

  try {
    const params = new URLSearchParams({ secret, response: token });
    if (remoteIp) params.set("remoteip", remoteIp);

    const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
      cache: "no-store",
    });

    const payload = (await response.json()) as {
      success?: boolean;
      score?: number;
      "error-codes"?: string[];
    };

    const score = typeof payload.score === "number" ? payload.score : 0.5;
    const passed = Boolean(payload.success) && score >= 0.5;

    return {
      success: passed,
      score,
      skipped: false,
      fallbackRequired: !passed,
      errorCodes: payload["error-codes"] ?? [],
    };
  } catch {
    return {
      success: false,
      score: 0,
      skipped: false,
      fallbackRequired: true,
      errorCodes: ["verification-unreachable"],
    };
  }
}
