import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

export default async function Home() {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });

  return (
    <main className="mx-auto w-full max-w-5xl px-6 py-16">
      <header className="mb-12">
        <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-zinc-500">
          FormatStack
        </p>
        <h1 className="text-4xl font-semibold tracking-tight text-zinc-950">
          Latest articles
        </h1>
      </header>

      {posts.length ? (
        <div className="grid gap-10 md:grid-cols-2">
          {posts.map((post) => (
            <article
              key={post._id}
              className="overflow-hidden rounded-2xl border border-zinc-200 bg-white"
            >
              {post.mainImage?.asset ? (
                <Image
                  src={urlFor(post.mainImage).width(1200).height(675).url()}
                  alt={post.mainImage.alt || ""}
                  width={1200}
                  height={675}
                  unoptimized
                  className="aspect-video w-full object-cover"
                />
              ) : null}
              <div className="p-6">
                <p className="mb-2 text-sm text-zinc-500">
                  {post.publishedAt
                    ? new Intl.DateTimeFormat("en", {
                        dateStyle: "medium",
                      }).format(new Date(post.publishedAt))
                    : null}
                  {post.author?.name ? ` · ${post.author.name}` : null}
                </p>
                <h2 className="text-2xl font-semibold text-zinc-950">
                  <Link href={`/${post.slug}`} className="hover:underline">
                    {post.title}
                  </Link>
                </h2>
                {post.excerpt ? (
                  <p className="mt-3 leading-7 text-zinc-600">{post.excerpt}</p>
                ) : null}
                <Link
                  href={`/${post.slug}`}
                  className="mt-5 inline-block font-medium text-zinc-950 underline underline-offset-4"
                >
                  View article
                </Link>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-zinc-600">
          No published posts yet. Create the first post in Sanity Studio.
        </p>
      )}
    </main>
  );
}
