import type { MetadataRoute } from "next";

import { absoluteUrl } from "@/lib/site";
import { client } from "@/sanity/lib/client";
import { POSTS_CACHE_TAG, SITEMAP_QUERY } from "@/sanity/lib/queries";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await client.fetch(SITEMAP_QUERY, {}, {
    next: { revalidate: 3600, tags: [POSTS_CACHE_TAG] },
  });

  return [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    ...posts.map((post) => ({
      url: absoluteUrl(`/${post.slug}`),
      lastModified: new Date(post._updatedAt),
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
  ];
}
