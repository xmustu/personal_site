# 项目定位：技术写作 + 策展

本仓库是一个**可 fork 的个人站点工程模板**，面向希望长期做**技术写作**并对外展示**策展式信息整理**（来源、摘要、个人观点）的开发者。

## 与常见「作品集模板」的区别

| 维度 | 常见模板 | 本仓库 |
|------|----------|--------|
| 内容 | 多为 Markdown / MDX 文件 | **Sanity** 可视化编辑 + API |
| 工作流 | 手写或 Git 提交即发布 | **草稿管道**：RSS/URL 抓取 → 仅进草稿 → 人工审稿后发布 |
| 上线 | 各凭经验 | **`preflight` + `release:*`** 脚本串联 lint、验收、部署 |
| 叙事 | 偏「我是谁」 | 偏**「我如何持续产出与整理」** |

版式与信息架构上，借鉴了社区成熟作品集（如 [nextjs-portfolio-blog-research](https://github.com/zhengzangw/nextjs-portfolio-blog-research) 的区块化首页、博客列表层次）；博客工程与「小型文档站」体验上，参考了 [nextjs-blog-template](https://github.com/guangzhengli/nextjs-blog-template)、[Nextra](https://nextra.site/) 的**可读性、导航清晰、RSS** 等思路——但**不引入 Nextra 为运行时依赖**，以降低与现有 `next-intl` + App Router 的耦合。

## 开源标签（维护者承诺）

1. **Sanity 为单一内容源**：文章、项目、首页/关于的 CMS 化边界清晰。  
2. **策展草稿管道**：`scripts/content-pipeline/` 下手动/自动 ingest，**默认不自动发布**；合规与来源字段在 schema 与 README 中说明。  
3. **可复制的上线路径**：环境变量约定、预检、Vercel 发布脚本可文档化复现。

## 文档索引

- 本地开发与部署：根目录 [`README.md`](../README.md)  
- 冒烟清单：[`smoke-test-checklist.md`](./smoke-test-checklist.md)  
- 策展与写作工作流（站内）：`/workflow`（中英路由）  
- 需你本人拍板的清单：[`decisions-for-owner.md`](./decisions-for-owner.md)

## English summary

This repo is an **opinionated personal-site template** centered on **technical writing** and **curation** (source links, excerpts, editorial notes), with **Sanity** as the CMS, a **draft-only ingestion pipeline**, and **preflight/release** automation. Layout patterns are inspired by popular Next.js portfolio/blog templates; we **do not bundle Nextra** to keep the stack maintainable alongside `next-intl`.
