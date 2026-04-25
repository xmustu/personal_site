# personal-site

面向 **技术写作 + 策展** 的个人站点开源模板。  
技术栈：`Next.js App Router` + `next-intl` + `Sanity` + `Tailwind`，并内置草稿优先的内容管道与自动化发布流程。

## Features

- **双语站点结构**：默认中文（`/`），英文（`/en`）并行路由。
- **Sanity 作为单一内容源**：博客、项目、首页/关于可视化编辑。
- **策展草稿管道**：`ingest:manual` / `ingest:auto` 只写 `drafts`，不自动发布。
- **SEO 基础完善**：动态 metadata、`sitemap.xml`、`robots.txt`、RSS（`/blog/rss`）。
- **上线自动化**：`preflight` 检查 + `release:preview` / `release:prod`。
- **开源模板友好**：MIT License、文档化决策、可 fork 可扩展。

## Quick Start

### 1) 环境准备

- Node.js `20 LTS` 或 `22`
- Sanity 项目（`projectId` + `dataset` + token）
- 可选：Vercel CLI（用于一键发布）

### 2) 安装依赖

```powershell
cd $HOME\Projects\personal-site
npm install
```

### 3) 配置环境变量

先复制并填写：

```powershell
copy .env.example .env.local
```

至少需要（核心）：

- `NEXT_PUBLIC_SITE_URL`（你已填入正式域名，保持这个值和线上一致）
- `NEXT_PUBLIC_SANITY_PROJECT_ID`（或 `SANITY_STUDIO_PROJECT_ID`）
- `NEXT_PUBLIC_SANITY_DATASET`（或 `SANITY_STUDIO_DATASET`）
- `SANITY_API_WRITE_TOKEN`（抓取脚本写草稿时需要）

可选：

- `INGEST_JINA_ON_403=1`（403 时启用 `r.jina.ai` 回退）
- `INGEST_USER_AGENT`（模拟浏览器 UA，降低部分站点拦截概率）

### 4) 本地启动

```powershell
npm run dev
```

访问：

- 中文：`/`、`/about`、`/projects`、`/blog`、`/workflow`
- 英文：`/en`、`/en/about`、`/en/projects`、`/en/blog`、`/en/workflow`
- RSS：`/blog/rss`、`/en/blog/rss`

### 5) 基础验收 + 构建

```powershell
npm run preflight
npm run build
```

## Demo

- Live site: [https://jiangyouchaodan.dpdns.org](https://jiangyouchaodan.dpdns.org)
- Production (Vercel): `https://personal-site-iota-navy.vercel.app`
- Workflow page: `/workflow`
- RSS: `/blog/rss`

> 你的正式域名已配置后，请确认 Vercel 环境变量中的 `NEXT_PUBLIC_SITE_URL` 与之完全一致（影响 canonical / sitemap / RSS 绝对链接）。

## Release

```powershell
npm run release:preview
npm run release:prod
```

- `release:preview`：预览环境
- `release:prod`：生产环境
- 任一步失败即停止，避免带病发布

## Content Workflow

### A. 原创写作（推荐）

```powershell
npm run studio:dev
```

在 `http://localhost:3333` 中编辑并发布。

### B. 手动来源抓取（只进草稿）

```powershell
npm run ingest:manual -- --urls data/manual-urls.txt --dry-run
npm run ingest:manual -- --urls data/manual-urls.txt
```

### C. 自动搜索抓取（关键词 + RSS）

```powershell
copy data\auto-sources.example.json data\auto-sources.json
npm run ingest:auto -- --config data/auto-sources.json --dry-run
npm run ingest:auto -- --config data/auto-sources.json
npm run ingest:auto:watch -- --config data/auto-sources.json
```

## Roadmap

- [x] 多语言路由（中/英）与核心页面
- [x] Sanity 内容模型与可视化编辑
- [x] 博客/项目详情页 SEO + sitemap/robots + RSS
- [x] Preflight / Release 自动化
- [x] 草稿优先内容管道（manual + auto ingest）
- [x] 博客正文增强：TOC / 阅读进度条 / 代码复制
- [ ] Nextra 文档子站（monorepo 双部署）
- [ ] 全文搜索（Algolia / Orama）

## 开源与隐私说明

- License: [`MIT`](LICENSE)
- 本仓库定位为公开模板，欢迎 fork / issue / PR
- 默认不主动收集访客 PII
  - GA4 用于基础访问统计
  - 联系表单仅处理访客主动提交的内容
  - 若启用 `INGEST_JINA_ON_403=1`，抓取链接会发送到第三方 `r.jina.ai`

## 文档索引

- 项目定位与开源边界：[`docs/PROJECT.md`](docs/PROJECT.md)
- 已确认的维护决策：[`docs/decisions-for-owner.md`](docs/decisions-for-owner.md)
- 冒烟测试清单：[`docs/smoke-test-checklist.md`](docs/smoke-test-checklist.md)
