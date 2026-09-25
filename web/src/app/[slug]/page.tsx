import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText, type PortableTextComponents } from "next-sanity";
import type { SanityImageSource } from "@sanity/image-url";

import { StoryPlaceholder } from "@/app/components/story-placeholder";
import { client } from "@/sanity/lib/client";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import {
  POST_QUERY,
  POST_SLUGS_QUERY,
  RELATED_POSTS_QUERY,
} from "@/sanity/lib/queries";

type PortableImage = Extract<SanityImageSource, { asset: unknown }> & {
  alt?: string;
};

type RelatedPost = {
  _id: string;
  title: string;
  slug: string;
  mainImage?: PortableImage;
};

const portableTextComponents: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-14 mb-[1.2rem] text-[2.5rem] leading-[1.05] tracking-[-.045em]">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-[2.8rem] mb-4 text-[1.7rem] tracking-[-.035em]">
        {children}
      </h3>
    ),
    normal: ({ children }) => (
      <p className="mb-6 leading-[1.85] text-[#454b55]">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-12 border-l-4 border-blue bg-white px-8 py-[1.8rem] text-[1.25rem]">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mb-6 pl-[1.4rem]">{children}</ul>,
    number: ({ children }) => <ol className="mb-6 pl-[1.4rem]">{children}</ol>,
  },
  listItem: ({ children }) => (
    <li className="leading-[1.85] text-[#454b55]">{children}</li>
  ),
  marks: {
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const external = href.startsWith("http");

      return (
        <a
          href={href}
          className="text-blue underline underline-offset-3"
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
          className="my-12 h-auto w-full"
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

  const primaryCategory = post.categories?.[0];
  const relatedPosts: RelatedPost[] = primaryCategory
    ? await sanityFetch({
        query: RELATED_POSTS_QUERY,
        params: { categoryId: primaryCategory._id, postId: post._id },
      }).then(({ data }) => data as RelatedPost[])
    : [];

  return (
    <main
      id="main-content"
      className="mx-auto w-full max-w-300 px-6 pt-16 pb-32 max-phone:pt-10"
    >
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-[.75rem] font-extrabold tracking-[.08em] text-muted uppercase hover:text-blue"
      >
        <span aria-hidden="true">←</span> Back to the blog
      </Link>

      <article>
        <header className="mx-auto mt-12 mb-12 grid max-w-190 gap-6 max-tablet:mt-16 max-phone:mt-14 max-phone:mb-10">
          <div className="eyebrow leading-[1.8] text-blue">
            {post.publishedAt ? (
              <time dateTime={post.publishedAt}>
                {new Intl.DateTimeFormat("en", { dateStyle: "long" }).format(
                  new Date(post.publishedAt),
                )}
              </time>
            ) : null}
            {post.author?.name ? (
              <>
                <br />
                <span>By {post.author.name}</span>
              </>
            ) : null}
          </div>
          <div>
            <h1 className="text-[clamp(1.8rem,4vw,2.35rem)] leading-[1.1] tracking-[-.04em]">
              {post.title}
            </h1>
            {post.excerpt ? (
              <p className="mt-2 text-[1rem] leading-[1.65] text-muted">
                {post.excerpt}
              </p>
            ) : null}
          </div>
        </header>

        {post.mainImage?.asset ? (
          <Image
            src={urlFor(post.mainImage)
              .width(1400)
              .height(875)
              .auto("format")
              .url()}
            alt={post.mainImage.alt || post.title}
            width={1400}
            height={875}
            priority
            unoptimized
            sizes="(max-width: 1248px) 100vw, 1200px"
            className="mx-auto block aspect-video w-full max-w-190 object-cover"
          />
        ) : null}

        {post.body?.length ? (
          <div className="mx-auto mt-12 max-w-190 max-phone:mt-12">
            <PortableText
              value={post.body}
              components={portableTextComponents}
            />
          </div>
        ) : null}
      </article>

      {relatedPosts.length ? (
        <section
          className="mt-16 border-t border-ink/30 pt-8 max-phone:mt-20"
          aria-labelledby="related-posts-title"
        >
          <div className="mb-10 flex items-end justify-between gap-8 max-phone:mb-7 max-phone:block">
            <p className="eyebrow text-blue max-phone:mb-3">Keep reading</p>
            <h2
              id="related-posts-title"
              className="text-[clamp(1rem,2vw,1.875rem)] leading-[.95] tracking-tighter"
            >
              {primaryCategory?.title || "this category"}
            </h2>
          </div>
          <div className="grid grid-cols-4 gap-[clamp(1rem,2vw,2rem)] max-tablet:grid-cols-2 max-tablet:gap-x-6 max-tablet:gap-y-10 max-phone:grid-cols-1 max-phone:gap-9">
            {relatedPosts.map((relatedPost, index) => (
              <article className="min-w-0" key={relatedPost._id}>
                <Link
                  href={`/${relatedPost.slug}`}
                  className="group block aspect-4/3 overflow-hidden rounded-xl bg-[#e5e2da] max-phone:aspect-3/2"
                  aria-label={`Read ${relatedPost.title}`}
                >
                  {relatedPost.mainImage?.asset ? (
                    <Image
                      src={urlFor(relatedPost.mainImage)
                        .width(800)
                        .height(600)
                        .auto("format")
                        .url()}
                      alt={relatedPost.mainImage.alt || ""}
                      width={800}
                      height={600}
                      unoptimized
                      sizes="(max-width: 680px) calc(100vw - 3rem), (max-width: 900px) 50vw, 25vw"
                      className="size-full object-cover transition-transform duration-600 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.025]"
                    />
                  ) : (
                    <StoryPlaceholder index={index} />
                  )}
                </Link>
                <h3 className="mt-[.65rem] mb-[.3rem] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.12] tracking-[-.035em] max-phone:mt-[.6rem] max-phone:text-[1.25rem]">
                  <Link
                    href={`/${relatedPost.slug}`}
                    className="link-underline"
                  >
                    {relatedPost.title}
                  </Link>
                </h3>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </main>
  );
}
