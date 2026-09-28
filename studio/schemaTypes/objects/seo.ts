import {defineField, defineType} from 'sanity'

export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  fields: [
    defineField({
      name: 'title',
      title: 'SEO title',
      type: 'string',
      description: 'Overrides the post title in search results and social previews.',
      validation: (rule) => rule.max(60),
    }),
    defineField({
      name: 'description',
      title: 'Meta description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160),
    }),
    defineField({
      name: 'image',
      title: 'Social image',
      type: 'image',
      options: {hotspot: true},
    }),
    defineField({
      name: 'noIndex',
      title: 'Hide from search engines',
      description: 'Excludes this post from search results and the XML sitemap.',
      type: 'boolean',
      initialValue: false,
    }),
  ],
})
