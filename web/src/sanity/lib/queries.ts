import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ] | order(publishedAt desc) {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": coalesce(slug.current, ""),
    excerpt,
    "publishedAt": coalesce(publishedAt, _createdAt),
    mainImage {
      asset,
      alt,
      crop,
      hotspot
    },
    author->{name},
    categories[]->{_id, "title": coalesce(title, "Uncategorized")}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now()
  ]{"slug": coalesce(slug.current, "")}
`);

export const POST_QUERY = defineQuery(`
  *[
    _type == "post" &&
    slug.current == $slug &&
    defined(publishedAt) &&
    publishedAt <= now()
  ][0] {
    _id,
    _updatedAt,
    "title": coalesce(title, "Untitled"),
    "slug": coalesce(slug.current, ""),
    excerpt,
    "publishedAt": coalesce(publishedAt, _createdAt),
    mainImage {
      asset,
      alt,
      crop,
      hotspot
    },
    author->{name, "slug": slug.current, image},
    categories[]->{_id, title, "slug": slug.current},
    body[]{
      ...,
      _type == "image" => {
        asset,
        alt,
        crop,
        hotspot
      }
    },
    seo {
      title,
      description,
      image,
      "noIndex": noIndex == true
    }
  }
`);

export const RELATED_POSTS_QUERY = defineQuery(`
  *[
    _type == "post" &&
    _id != $postId &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    seo.noIndex != true &&
    $categoryId in categories[]._ref
  ] | order(publishedAt desc)[0...4] {
    _id,
    "title": coalesce(title, "Untitled"),
    "slug": coalesce(slug.current, ""),
    mainImage {
      asset,
      alt,
      crop,
      hotspot
    }
  }
`);

export const SITEMAP_QUERY = defineQuery(`
  *[
    _type == "post" &&
    defined(slug.current) &&
    defined(publishedAt) &&
    publishedAt <= now() &&
    seo.noIndex != true
  ] | order(publishedAt desc) {
    "slug": coalesce(slug.current, ""),
    _updatedAt
  }
`);
