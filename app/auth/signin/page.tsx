import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Sign in to your Solomon Stays hotel occupancy dashboard.",
};

export default function SignInPage() {
  return (
    <Suspense fallback={<div className="auth-card">Loading sign in</div>}>
      <AuthForm mode="signin" />
    </Suspense>
  );
}
