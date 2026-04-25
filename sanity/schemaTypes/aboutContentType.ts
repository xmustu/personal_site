import { UserIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const aboutContentType = defineType({
  name: "aboutContent",
  title: "About Content",
  type: "document",
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
      name: "bodyEn",
      title: "Body (EN)",
      type: "text",
      rows: 6,
    }),
    defineField({
      name: "timelineZh",
      title: "时间线（中文）",
      description: "关于页时间线；留空则前台使用内置默认示例。",
      type: "array",
      of: [defineArrayMember({ type: "aboutTimelineItem" })],
    }),
    defineField({
      name: "timelineEn",
      title: "Timeline (English)",
      description: "About page timeline; if empty, the site uses built-in English placeholders.",
      type: "array",
      of: [defineArrayMember({ type: "aboutTimelineItem" })],
    }),
  ],
});
