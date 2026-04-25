import { defineArrayMember, defineField, defineType } from "sanity";

import { parseGithubRepoUrl } from "@/lib/github/parseRepoUrl";

export const projectType = defineType({
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      description:
        "若填写了有效的 GitHub 仓库链接，标题可留空，前台会用仓库名展示。",
      type: "string",
      validation: (rule) =>
        rule.custom((value, context) => {
          const repoUrl = (context.parent as { repoUrl?: string })?.repoUrl;
          if (parseGithubRepoUrl(repoUrl)) {
            return true;
          }
          return typeof value === "string" && value.trim().length >= 2
            ? true
            : "请填写至少 2 个字的标题，或填写有效的 GitHub 仓库链接";
        }),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      description: "站内详情页路径，例如 facebook-react。",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "repoUrl",
      title: "GitHub 仓库链接",
      description:
        "填写后项目列表与首页卡片将直达该仓库；标题/摘要可留空并由 GitHub 信息补全。支持 github.com 的 https 链接。",
      type: "url",
      validation: (rule) =>
        rule.custom((value) => {
          if (!value || typeof value !== "string" || !value.trim()) {
            return true;
          }
          return parseGithubRepoUrl(value)
            ? true
            : "请使用 github.com 上的仓库地址（https）";
        }),
    }),
    defineField({
      name: "cardImage",
      title: "卡片封面图",
      description: "可选。优先于「卡片封面 URL」与 GitHub 自动预览图。",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "cardCoverUrl",
      title: "卡片封面 URL",
      description:
        "可选。不填且已填 GitHub 链接时，使用 GitHub Open Graph 图作为卡片背景。",
      type: "url",
    }),
    defineField({
      name: "summary",
      title: "Summary",
      type: "text",
      rows: 3,
    }),
    defineField({
      name: "stack",
      title: "Tech Stack",
      type: "array",
      of: [defineArrayMember({ type: "string" })],
    }),
    defineField({
      name: "demoUrl",
      title: "Demo URL",
      type: "url",
    }),
    defineField({
      name: "body",
      title: "Details",
      type: "array",
      of: [
        defineArrayMember({ type: "block" }),
        defineArrayMember({ type: "image", options: { hotspot: true } }),
      ],
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "summary",
      repoUrl: "repoUrl",
    },
    prepare({ title, subtitle, repoUrl }) {
      const parsed = parseGithubRepoUrl(repoUrl);
      const t =
        (typeof title === "string" && title.trim()) ||
        (parsed ? `${parsed.owner}/${parsed.repo}` : "Project");
      return {
        title: t,
        subtitle: subtitle || repoUrl || "",
      };
    },
  },
});
