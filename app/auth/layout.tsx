import { SiteHeader } from "@/components/site-header";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="auth-wrap">
        <div className="container">{children}</div>
      </main>
    </>
  );
}
