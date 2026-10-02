import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/constants";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["", "/sobre", "/agenda", "/galeria", "/contato"].map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "/agenda" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
