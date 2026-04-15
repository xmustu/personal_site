import {HomeIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const homeContentType = defineType({
  name: 'homeContent',
  title: 'Home Content',
  type: 'document',
  icon: HomeIcon,
  fields: [
    defineField({
      name: 'titleZh',
      title: 'Title (ZH)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'titleEn',
      title: 'Title (EN)',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'subtitleZh',
      title: 'Subtitle (ZH)',
      type: 'string',
    }),
    defineField({
      name: 'subtitleEn',
      title: 'Subtitle (EN)',
      type: 'string',
    }),
    defineField({
      name: 'bodyZh',
      title: 'Body (ZH)',
      type: 'text',
      rows: 4,
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body (EN)',
      type: 'text',
      rows: 4,
    }),
  ],
})
