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
    h2: ({ children }) => <h2>{children}</h2>,
    h3: ({ children }) => <h3>{children}</h3>,
    normal: ({ children }) => <p>{children}</p>,
    blockquote: ({ children }) => <blockquote>{children}</blockquote>,
  },
  list: {
    bullet: ({ children }) => <ul>{children}</ul>,
    number: ({ children }) => <ol>{children}</ol>,
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
          sizes="(max-width: 800px) 100vw, 760px"
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
    <main id="main-content" className="article-page">
      <Link
        href="/"
        className="article-back"
      >
        <span aria-hidden="true">←</span> Back to the journal
      </Link>

      <article>
        <header className="article-header">
          <div className="article-kicker">
            <span>{post.categories?.[0]?.title || "Field note"}</span>
            <br />
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
                  new Date(post.publishedAt),
                )}
              </time>
            ) : null}
            {post.author?.name ? <><br /><span>By {post.author.name}</span></> : null}
          </div>
          <div className="article-title">
            <h1>{post.title}</h1>
            {post.excerpt ? <p>{post.excerpt}</p> : null}
          </div>
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
            sizes="(max-width: 1320px) 100vw, 1280px"
            className="article-hero"
          />
        ) : null}

        {post.body?.length ? (
          <div className="article-body">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        ) : null}
      </article>
    </main>
  );
}
