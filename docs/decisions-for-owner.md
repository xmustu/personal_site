# 留给你拍板的决策清单

以下项会影响品牌、合规与维护成本，模板代码已用**中性默认**实现；请你按需调整，不必改代码也能先上线的一部分可在 Studio 或环境变量完成。

## 品牌与叙事

- [ ] **站点标题 / OG siteName**：当前布局 metadata 中仍为通用「个人网站 / Personal site」类文案，是否改为你的笔名或全名？  
- [ ] **首页 Hero 标签文案**：`messages/*` 中 `Home.pill*` 与默认 `body` 是否替换为你的真实方向陈述？  
- [ ] **GitHub 链接**：`SiteHeader` 中仓库外链当前为示例账号路径，是否改为你的 profile？

## 内容与合规

- [ ] **ingest 源与频率**：`data/auto-sources.json` 中的 RSS、关键词、`maxUrlsPerRun` 是否符合你的版权与引用习惯？  
- [ ] **403 / Jina 回退**：是否在 `.env.local` 中长期开启 `INGEST_JINA_ON_403`（涉及第三方代抓）？  
- [ ] **默认语言策略**：当前 `i18n/routing.ts` 为 **默认中文 + `as-needed`**；若你希望与早期需求一致（**默认英文**），需调整 `defaultLocale` 与文案默认值。

## 工程与部署

- [ ] **生产域名与 `NEXT_PUBLIC_SITE_URL`**：RSS 绝对链接、sitemap、canonical 均依赖该变量。  
- [ ] **是否将本仓库定位为「公开模板」**：若 yes，建议在 GitHub 上写清 **License**、**展示用 Demo 部署**、以及 **不收集访客 PII 的说明**（若你扩展了表单/分析）。

## 可选增强（未实现）

- Monorepo 中单独 **Nextra 文档子站**（与主站双部署）。  
- 博客正文 **目录（TOC）**、**阅读进度条**、**代码复制按钮**（需客户端组件与 AST 处理）。  
- **全文搜索**（Algolia / Orama 等，涉及成本与索引策略）。
