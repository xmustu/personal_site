import {UserIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

export const aboutContentType = defineType({
  name: 'aboutContent',
  title: 'About Content',
  type: 'document',
  icon: UserIcon,
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
      name: 'bodyZh',
      title: 'Body (ZH)',
      type: 'text',
      rows: 6,
    }),
    defineField({
      name: 'bodyEn',
      title: 'Body (EN)',
      type: 'text',
      rows: 6,
    }),
  ],
})
