import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

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
      <section className="journal-hero" aria-labelledby="journal-title">
        <h1 id="journal-title">
          The FormatStack
          <span>
            Blog<span className="title-dot">.</span>
          </span>
        </h1>
        <p className="journal-hero__intro">
          Field notes and practical guides for turning PDF review markup into
          structured, dependable source-file changes.
        </p>
      </section>

      {posts.length > 0 ? (
        <>
          <section
            className="story-feed"
            id="posts"
            aria-labelledby="posts-title"
          >
            <div className="section-heading">
              <p>Browse articles</p>
              <h2
                id="posts-title"
                className={activeCategory ? undefined : "visually-hidden"}
              >
                {activeCategory || "All articles"}
              </h2>
              <span>
                {String(filteredPosts.length).padStart(2, "0")} articles
              </span>
            </div>
            <div className="story-layout">
              <div className="story-list">
                {filteredPosts.map((post, index) => (
                  <article className="story-card" key={post._id}>
                    <Link
                      href={`/${post.slug}`}
                      className="story-card__image"
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
                          sizes="(max-width: 680px) calc(100vw - 2rem), (max-width: 900px) 45vw, (max-width: 1200px) 24vw, 270px"
                        />
                      ) : (
                        <span
                          className={`story-placeholder story-placeholder--${(index % 3) + 1}`}
                          aria-hidden="true"
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                        </span>
                      )}
                    </Link>
                    <div className="story-card__body">
                      <time
                        className="story-card__date"
                        dateTime={post.publishedAt || undefined}
                      >
                        {formatDate(post.publishedAt)}
                      </time>
                      <h3>
                        <Link href={`/${post.slug}`}>{post.title}</Link>
                      </h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
              <aside
                className="category-rail"
                id="categories"
                aria-labelledby="categories-title"
              >
                <p className="category-rail__label">Filter the blog</p>
                <h2 id="categories-title">Categories</h2>
                <nav aria-label="Filter articles by category">
                  <ul>
                    <li>
                      <span>00</span>
                      <Link
                        href="/#posts"
                        aria-current={!activeCategory ? "page" : undefined}
                      >
                        All categories
                      </Link>
                    </li>
                    {categories.map((category, index) => (
                      <li key={category._id}>
                        <span>{String(index + 1).padStart(2, "0")}</span>
                        <Link
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
        <section className="empty-state">
          <span>✦</span>
          <h2>The blog is taking shape.</h2>
          <p>The first FormatStack post will appear here soon.</p>
        </section>
      )}
    </main>
  );
}
