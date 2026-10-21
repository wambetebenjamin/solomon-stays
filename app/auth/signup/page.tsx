import type { Metadata } from "next";
import { Suspense } from "react";
import { AuthForm } from "@/components/auth/auth-form";

export const metadata: Metadata = {
  title: "Create your workspace",
  description:
    "Start a free 14 day Solomon Stays trial. No credit card required. Default role is hotel manager for your property.",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div className="auth-card">Loading sign up</div>}>
      <AuthForm mode="signup" />
    </Suspense>
  );
}
