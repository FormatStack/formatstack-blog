import Image from "next/image";
import Link from "next/link";

import { urlFor } from "@/sanity/lib/image";
import { sanityFetch } from "@/sanity/lib/live";
import { POSTS_QUERY } from "@/sanity/lib/queries";

function formatDate(date?: string | null) {
  if (!date) return "Field note";
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(date));
}

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string | string[] }>;
}) {
  const { data: posts } = await sanityFetch({ query: POSTS_QUERY });
  const categories = Array.from(new Map(posts.flatMap((post) => post.categories ?? []).map((category) => [category._id, category])).values());
  const requestedCategory = (await searchParams).category;
  const categoryName = Array.isArray(requestedCategory) ? requestedCategory[0] : requestedCategory;
  const activeCategory = categories.find((category) => category.title === categoryName)?.title;
  const filteredPosts = activeCategory
    ? posts.filter((post) => post.categories?.some((category) => category.title === activeCategory))
    : posts;
  const featuredPost = posts[0];
  const storyPosts = activeCategory ? filteredPosts : posts.slice(1);

  return (
    <main id="main-content">
      <section className="journal-hero" aria-labelledby="journal-title">
        <div className="journal-hero__eyebrow"><span>For localization</span><span>and DTP teams</span></div>
        <h1 id="journal-title">The FormatStack<span>Journal<span className="title-dot">.</span></span></h1>
        <p className="journal-hero__intro">Field notes and practical guides for turning PDF review markup into structured, dependable source-file changes.</p>
      </section>

      {featuredPost ? (
        <>
          {!activeCategory ? <section className="featured-story" aria-labelledby="featured-title">
            <Link href={`/${featuredPost.slug}`} className="featured-story__image" aria-label={`Read ${featuredPost.title}`}>
              {featuredPost.mainImage?.asset ? <Image src={urlFor(featuredPost.mainImage).width(1600).height(1000).auto("format").url()} alt={featuredPost.mainImage.alt || ""} width={1600} height={1000} unoptimized priority sizes="(max-width: 860px) 100vw, 64vw" /> : <span className="story-placeholder" aria-hidden="true"><span>FS</span></span>}
            </Link>
            <div className="featured-story__copy">
              <p className="story-meta"><span>Featured</span><time dateTime={featuredPost.publishedAt || undefined}>{formatDate(featuredPost.publishedAt)}</time></p>
              <h2 id="featured-title"><Link href={`/${featuredPost.slug}`}>{featuredPost.title}</Link></h2>
              {featuredPost.excerpt ? <p>{featuredPost.excerpt}</p> : null}
              <div className="featured-story__footer"><span>{featuredPost.author?.name || "FormatStack Editorial"}</span><Link className="round-link" href={`/${featuredPost.slug}`} aria-label={`Read ${featuredPost.title}`}><span aria-hidden="true">↗</span></Link></div>
            </div>
          </section> : null}

          <section className="story-feed" id="stories" aria-labelledby="stories-title">
            <div className="section-heading"><p>02 / Dispatches</p><h2 id="stories-title">{activeCategory || "Latest stories"}</h2><span>{String(filteredPosts.length).padStart(2, "0")} articles</span></div>
            <div className="story-layout">
              <div className="story-grid">
                {storyPosts.map((post, index) => (
                  <article className="story-card" key={post._id}>
                    <Link href={`/${post.slug}`} className="story-card__image" aria-label={`Read ${post.title}`}>
                      {post.mainImage?.asset ? <Image src={urlFor(post.mainImage).width(900).height(600).auto("format").url()} alt={post.mainImage.alt || ""} width={900} height={600} unoptimized sizes="(max-width: 680px) 100vw, (max-width: 1100px) 50vw, 34vw" /> : <span className={`story-placeholder story-placeholder--${(index % 3) + 1}`} aria-hidden="true"><span>{String(index + 2).padStart(2, "0")}</span></span>}
                    </Link>
                    <div className="story-card__body">
                      <p className="story-meta"><span>{post.categories?.[0]?.title || "Insights"}</span><time dateTime={post.publishedAt || undefined}>{formatDate(post.publishedAt)}</time></p>
                      <h3><Link href={`/${post.slug}`}>{post.title}</Link></h3>
                      {post.excerpt ? <p>{post.excerpt}</p> : null}
                    </div>
                  </article>
                ))}
              </div>
              <aside className="category-rail" id="categories" aria-labelledby="categories-title">
                <p className="category-rail__label">Filter the journal</p><h2 id="categories-title">Categories</h2>
                <nav aria-label="Filter articles by category">
                  <ul>
                    <li><span>00</span><a href="/#stories" aria-current={!activeCategory ? "page" : undefined}>All categories</a></li>
                    {categories.map((category, index) => <li key={category._id}><span>{String(index + 1).padStart(2, "0")}</span><a href={`/?category=${encodeURIComponent(category.title)}#stories`} aria-current={activeCategory === category.title ? "page" : undefined}>{category.title}</a></li>)}
                  </ul>
                </nav>
                <div className="category-rail__note"><span aria-hidden="true">✦</span><p>Built for teams that ship reviewed documents.</p></div>
              </aside>
            </div>
          </section>
        </>
      ) : <section className="empty-state"><span>✦</span><h2>The journal is taking shape.</h2><p>The first FormatStack story will appear here soon.</p></section>}
    </main>
  );
}
