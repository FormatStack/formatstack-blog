import { defineQuery } from "next-sanity";

export const POSTS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    mainImage {
      asset,
      alt,
      crop,
      hotspot
    },
    author->{name},
    categories[]->{_id, title}
  }
`);

export const POST_SLUGS_QUERY = defineQuery(`
  *[_type == "post" && defined(slug.current)]{"slug": slug.current}
`);

export const POST_QUERY = defineQuery(`
  *[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
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
    seo
  }
`);
