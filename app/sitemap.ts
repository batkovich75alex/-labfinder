import type { MetadataRoute } from "next";
import { analyses, complexes, labs, articles } from "@/data/mock";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL || "https://labfinder-batkovich.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: now, changeFrequency: "daily", priority: 1.0 },
    { url: `${siteUrl}/catalog`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/complexes`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/labs`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/library`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
  ];

  const analysisPages: MetadataRoute.Sitemap = analyses.map((a) => ({
    url: `${siteUrl}/catalog/${a.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const complexPages: MetadataRoute.Sitemap = complexes.map((c) => ({
    url: `${siteUrl}/complexes/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const labPages: MetadataRoute.Sitemap = labs.map((l) => ({
    url: `${siteUrl}/labs/${l.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articlePages: MetadataRoute.Sitemap = articles.map((a) => ({
    url: `${siteUrl}/library/${a.slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...staticPages, ...analysisPages, ...complexPages, ...labPages, ...articlePages];
}