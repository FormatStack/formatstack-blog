import Image from "next/image";
import Link from "next/link";

import { StoryPlaceholder } from "@/app/components/story-placeholder";
import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

const categoryItem = "flex gap-4 border-b border-line text-[.86rem] font-bold";
const categoryIndex = "pt-[1.08rem] text-[.62rem] text-[#9aa0a9]";
const categoryLink =
  "flex-1 py-[.88rem] transition-[color,padding-left] duration-200 ease-[ease] hover:pl-1 hover:text-blue aria-[current=page]:text-blue aria-[current=page]:after:content-['_↗']";

function formatDate(date?: string | null) {
  if (!date) return "Field note";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });
  const categories = Array.from(
    new Map(
      posts
        .flatMap((post) => post.categories ?? [])
        .map((category) => [category._id, category]),
    ).values(),
  );
  const requestedCategory = (await searchParams).category;
  const categoryName = Array.isArray(requestedCategory)
    ? requestedCategory[0]
    : requestedCategory;
  const activeCategory = categories.find(
    (category) => category.title === categoryName,
  )?.title;
  const filteredPosts = activeCategory
    ? posts.filter((post) =>
        post.categories?.some((category) => category.title === activeCategory),
      )
    : posts;

  return (
    <main id="main-content">
      <section
        className="relative mx-auto grid min-h-132.5 w-full max-w-300 grid-cols-[1.5fr_.55fr] items-end gap-10 px-6 pt-28 pb-20 after:absolute after:top-8 after:-right-48 after:size-80 after:rounded-full after:border after:border-line max-tablet:min-h-120 max-tablet:grid-cols-1 max-tablet:gap-6 max-tablet:pt-20 max-phone:min-h-107.5 max-phone:pt-16 max-phone:pb-12"
        aria-labelledby="journal-title"
      >
        <h1
          id="journal-title"
          className="text-[clamp(3rem,5.5vw,5.5rem)] leading-[.86] font-extrabold tracking-[-.075em] max-phone:text-[clamp(2.6rem,11vw,4rem)]"
        >
          The FormatStack
          <span className="block text-blue">
            Blog<span className="text-lime">.</span>
          </span>
        </h1>
        <p className="mb-2 max-w-80 text-[.94rem] leading-[1.65] text-muted max-tablet:mt-4">
          Field notes and practical guides for turning PDF review markup into
          structured, dependable source-file changes.
        </p>
      </section>

      {posts.length > 0 ? (
        <>
          <section
            className="mx-auto w-full max-w-300 px-6 pt-28 pb-36 max-phone:pt-20 max-phone:pb-24"
            id="posts"
            aria-labelledby="posts-title"
          >
            <div className="grid grid-cols-[.55fr_1.45fr_.45fr] items-end gap-8 border-b border-ink pb-8 max-phone:grid-cols-[1fr_auto]">
              <p className="eyebrow text-muted max-phone:col-span-full">
                Browse articles
              </p>
              <h2
                id="posts-title"
                className={
                  activeCategory
                    ? "text-[clamp(2.7rem,5vw,5rem)] leading-[.9] tracking-[-.055em]"
                    : "sr-only"
                }
              >
                {activeCategory || "All articles"}
              </h2>
              <span className="eyebrow -col-start-2 text-right text-muted">
                {String(filteredPosts.length).padStart(2, "0")} articles
              </span>
            </div>
            <div className="mt-14 grid grid-cols-[minmax(0,1fr)_260px] items-start gap-[clamp(3rem,6vw,7rem)] max-tablet:grid-cols-1">
              <div className="grid grid-cols-3 gap-x-[clamp(1rem,2vw,1.75rem)] gap-y-12 max-tablet:grid-cols-2 max-phone:grid-cols-1 max-phone:gap-10">
                {filteredPosts.map((post, index) => (
                  <article className="min-w-0" key={post._id}>
                    <Link
                      href={`/${post.slug}`}
                      className="group block aspect-4/3 overflow-hidden rounded-sm bg-[#e5e2da] max-phone:aspect-3/2"
                      aria-label={`Read ${post.title}`}
                    >
                      {post.mainImage?.asset ? (
                        <Image
                          src={urlFor(post.mainImage)
                            .width(800)
                            .height(600)
                            .auto("format")
                            .url()}
                          alt={post.mainImage.alt || ""}
                          width={800}
                          height={600}
                          unoptimized
                          priority={index < 2}
                          className="size-full object-cover transition-transform duration-600 ease-[cubic-bezier(.2,.7,.2,1)] group-hover:scale-[1.025]"
                          sizes="(max-width: 680px) calc(100vw - 2rem), (max-width: 900px) 45vw, (max-width: 1200px) 24vw, 270px"
                        />
                      ) : (
                        <StoryPlaceholder index={index} />
                      )}
                    </Link>
                    <div className="min-w-0 pt-[1.2rem]">
                      <time
                        className="block font-plex text-[.72rem] font-semibold tracking-[.07em] text-muted uppercase"
                        dateTime={post.publishedAt || undefined}
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      <h3 className="mt-[.65rem] mb-[.3rem] text-[clamp(1.1rem,1.6vw,1.35rem)] leading-[1.12] tracking-[-.035em] max-phone:mt-[.6rem] max-phone:text-[1.25rem]">
                        <Link href={`/${post.slug}`} className="link-underline">
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt ? (
                        <p className="line-clamp-3 text-[.98rem] leading-[1.65] text-muted">
                          {post.excerpt}
                        </p>
                      ) : null}
                    </div>
                  </article>
                ))}
              </div>
              <aside
                className="sticky top-8 border-t border-ink pt-[1.2rem] max-tablet:static"
                id="categories"
                aria-labelledby="categories-title"
              >
                <p className="eyebrow mb-[2.8rem] text-blue">Filter the blog</p>
                <h2
                  id="categories-title"
                  className="mb-4 text-[2rem] tracking-[-.045em]"
                >
                  Categories
                </h2>
                <nav aria-label="Filter articles by category">
                  <ul className="border-t border-line max-tablet:grid max-tablet:grid-cols-[repeat(2,1fr)] max-phone:grid-cols-[1fr]">
                    <li className={categoryItem}>
                      <span className={categoryIndex}>00</span>
                      <Link
                        href="/#posts"
                        className={categoryLink}
                        aria-current={!activeCategory ? "page" : undefined}
                      >
                        All categories
                      </Link>
                    </li>
                    {categories.map((category, index) => (
                      <li key={category._id} className={categoryItem}>
                        <span className={categoryIndex}>
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <Link
                          className={categoryLink}
                          href={`/?category=${encodeURIComponent(category.title)}#posts`}
                          aria-current={
                            activeCategory === category.title
                              ? "page"
                              : undefined
                          }
                        >
                          {category.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </aside>
            </div>
          </section>
        </>
      ) : (
        <section className="mx-auto mb-32 w-full max-w-300 bg-ink p-24 text-center text-white">
          <span className="text-[2rem] text-lime">✦</span>
          <h2 className="my-4 text-[3rem] tracking-tighter">
            The blog is taking shape.
          </h2>
          <p className="text-[#b9bfca]">
            The first FormatStack post will appear here soon.
          </p>
        </section>
      )}
    </main>
  );
}
