import { defineField, defineType } from "sanity";

/** 关于页时间线条目（中英各一套数组）。 */
export const aboutTimelineItemType = defineType({
  name: "aboutTimelineItem",
  title: "Timeline entry",
  type: "object",
  fields: [
    defineField({
      name: "year",
      title: "Year / label",
      type: "string",
      description: "例如 2026 或 2024 Q1",
      validation: (rule) => rule.required().max(32),
    }),
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule) => rule.required().max(120),
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
    }),
  ],
  preview: {
    select: { title: "title", year: "year" },
    prepare({ title, year }) {
      return {
        title: title || "Entry",
        subtitle: year || "",
      };
    },
  },
});
