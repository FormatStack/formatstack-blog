import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POST_QUERY, POST_SLUGS_QUERY } from "@/sanity/lib/queries";

type PortableImage = Extract<SanityImageSource, { asset: unknown }> & {
  alt?: string;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mb-4 mt-10 text-3xl font-semibold">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-3 mt-8 text-2xl font-semibold">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mb-5 leading-8 text-zinc-700">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-zinc-300 pl-5 italic text-zinc-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mb-5 list-disc space-y-2 pl-6 text-zinc-700">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mb-5 list-decimal space-y-2 pl-6 text-zinc-700">
        {children}
      </ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");

      return (
        <a
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="font-medium underline underline-offset-4"
        >
          {children}
        </a>
      );
    },
  },
  types: {
    image: ({ value }) => {
      const image = value as PortableImage;
      if (!image.asset) return null;

      return (
        <Image
          src={urlFor(image).width(1400).auto("format").url()}
          alt={image.alt || ""}
          width={1400}
          height={900}
          unoptimized
          className="my-10 h-auto w-full rounded-2xl"
        />
      );
    },
  },
};

export async function generateStaticParams() {
  return client.withConfig({ useCdn: false }).fetch(POST_SLUGS_QUERY);
}

export async function generateMetadata({
  params,
}: PageProps<"/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
    stega: false,
  });

  if (!post) return {};

  return {
    title: post.seo?.title || post.title,
    description: post.seo?.description || post.excerpt,
  };
}

export default async function PostPage({ params }: PageProps<"/[slug]">) {
  const { slug } = await params;
  const { data: post } = await sanityFetch({
    query: POST_QUERY,
    params: { slug },
  });

  if (!post) notFound();

  return (
    <main className="mx-auto w-full max-w-3xl px-6 py-12 md:py-20">
      <Link
        href="/"
        className="mb-10 inline-block text-sm font-medium text-zinc-600 hover:text-zinc-950"
      >
        ← All articles
      </Link>

      <article>
        <header className="mb-10">
          <div className="mb-4 flex flex-wrap gap-2 text-sm text-zinc-500">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
                  new Date(post.publishedAt),
                )}
              </time>
            ) : null}
            {post.author?.name ? <span>· {post.author.name}</span> : null}
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-zinc-950 md:text-5xl">
            {post.title}
          </h1>
          {post.excerpt ? (
            <p className="mt-5 text-xl leading-8 text-zinc-600">
              {post.excerpt}
            </p>
          ) : null}
        </header>

        {post.mainImage?.asset ? (
          <Image
            src={urlFor(post.mainImage)
              .width(1400)
              .height(875)
              .auto("format")
              .url()}
            alt={post.mainImage.alt || ""}
            width={1400}
            height={875}
            priority
            unoptimized
            className="mb-12 aspect-[8/5] w-full rounded-2xl object-cover"
          />
        ) : null}

        {post.body?.length ? (
          <PortableText value={post.body} components={portableTextComponents} />
        ) : null}
      </article>
    </main>
  );
}
