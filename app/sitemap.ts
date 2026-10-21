import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "https://solomonstays.co.ke").replace(/\/$/, "");
  const routes = ["", "/demo", "/pricing", "/contact", "/legal/privacy-policy", "/legal/terms", "/legal/cookie-policy"];
  const now = new Date();

  return routes.map((route) => ({
    url: `${base}${route}`,
    lastModified: now,
    changeFrequency: route === "" ? "weekly" : "monthly",
    priority: route === "" ? 1 : 0.7,
  }));
}
