本站把 **Sanity** 当作唯一「可发布内容源」，把 **ingest 脚本** 当作「只进草稿的策展入口」，再用 **preflight / release** 保证上线可重复。下面是你 fork 后可以照做的默认流程。

## 1. 技术写作（原创）

1. 运行 `npm run studio:dev`，打开 Studio。  
2. 新建或编辑 `post`，在 Portable Text 中写完正文。  
3. 填写 `excerpt`、`sourceUrl`（若无可留空）。  
4. **发布** 后，文章会出现在 `/blog`、站点地图与 RSS（若已部署且配置了 `NEXT_PUBLIC_SITE_URL`）。

## 2. 策展（外部来源 → 草稿 → 你审稿）

1. **手动 URL**：在 `data/manual-urls.txt` 中每行一个链接，执行  
   `npm run ingest:manual -- --urls data/manual-urls.txt --dry-run` 再正式写入。  
2. **自动 RSS**：复制 `data/auto-sources.example.json` 为 `data/auto-sources.json`，配置关键词与 feed，执行  
   `npm run ingest:auto -- --config data/auto-sources.json`。  
3. 脚本只会创建 **`_drafts.*` 的 `post` 文档**，不会在未审稿时对外展示（公开列表已排除草稿）。  
4. 在 Studio 中补充观点、核对版权与引用，再发布。

说明：部分站点会 **403** 拦截脚本抓取；可在 `.env.local` 配置 `INGEST_JINA_ON_403`、`INGEST_USER_AGENT` 等，详见根目录 `README.md`。

## 3. 上线与回归

1. `npm run lint`  
2. `npm run preflight`（检查环境变量、核心路由、`next build`）  
3. `npm run release:preview` 或 `npm run release:prod`（需已登录 Vercel CLI）

## 4. 与其它模板的关系

版式与信息架构参考了社区常见的 **Next.js 作品集 + 博客** 模板；工程上刻意 **不捆绑 Nextra**，以便与 `next-intl`、Sanity 草稿模型长期共存。若你希望单独做一个「文档子站」，建议在 **monorepo 新包** 中引入 Nextra，而不是与本站混在同一 App Router 树里。
