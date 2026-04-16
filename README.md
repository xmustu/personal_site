# personal-site

个人网站（Next.js + Tailwind + `next-intl`）。当前步骤：本地可运行的 **MVP 骨架**（多语言策略 **A**：壳层中英，正文后续以中文为主）。

## 环境要求

- Node.js **20 LTS** 或 **22**（从 [https://nodejs.org/](https://nodejs.org/) 安装）
- 安装后在 PowerShell 执行 `node -v` 应能输出版本号

若提示找不到 `node`：重启终端；仍不行则在「系统环境变量 → Path」中确认已加入 Node 的安装目录（常见为 `C:\Program Files\nodejs\`）。

## 本地运行

在仓库根目录执行：

```powershell
cd $HOME\Projects\personal-site
npm install
npm run dev
```

浏览器打开 `http://localhost:3000`：

- 默认中文路由：`/`、`/about`、`/projects`、`/blog`
- 英文路由：`/en`、`/en/about` 等同理

## 本步交付

- 国际化路由与顶部导航
- 首页 + 三个栏目占位页

下一步：接入 **Sanity Studio** 与内容模型（文章/项目/站点信息）。

## SEO 预渲染与 404 策略

- 详情页预渲染：博客与项目详情页通过 `generateStaticParams` 预渲染最近更新的 20 条内容（中英文路由都会生成）。
- 动态回退：`dynamicParams = true`，未被预渲染但在 Sanity 中存在的 slug，首次访问时仍可动态生成页面。
- 404 策略：若 slug 在 Sanity 中不存在，页面会调用 `notFound()`，返回站点 404 页面，避免搜索引擎抓到空壳内容。
- sitemap 动态输出：`/sitemap.xml` 会自动包含博客/项目详情页链接，发新内容后可被爬虫更快发现。

## 上线前自动验收

执行一条命令完成基础验收：

```powershell
npm run preflight
```

脚本会按顺序检查：

- `.env.local` 必填项（站点 URL 与 Sanity 基础配置）
- 核心路由可访问性（含中英文页面、`sitemap.xml`、`robots.txt`）
- 生产构建是否通过（`npm run build`）

说明：

- 若只缺可选项（如 GA、Giscus、Resend），会给出 warning，但不会阻塞通过。
- 任何必填项缺失、路由返回非 2xx、或构建失败，都会直接返回失败并给出原因。
- 手工冒烟测试清单见：[`docs/smoke-test-checklist.md`](docs/smoke-test-checklist.md)

## 一键发布

执行以下命令可一键完成：`lint` → `preflight` → `Vercel deploy`：

```powershell
npm run release:preview
npm run release:prod
```

说明：

- `release:preview` 会发预览环境；`release:prod` 会发生产环境。
- `npm run release` 默认等同于 `npm run release:prod`。
- 任意一步失败都会立即停止，不会继续部署。
- 请先确认已安装并登录 Vercel CLI（`vercel whoami` 可返回账号）。

## 半自动内容抓取（手动来源）

已提供手动来源抓取脚本：读取 URL 列表，抓取正文并写入 Sanity `post` 草稿（不自动发布）。

1) 准备 URL 文件（例如 `data/manual-urls.txt`）：

```txt
https://example.com/article-1
https://example.com/article-2
```

2) 先试跑（不写入）：

```powershell
npm run ingest:manual -- --urls data/manual-urls.txt --dry-run
```

3) 正式写入草稿：

```powershell
npm run ingest:manual -- --urls data/manual-urls.txt
```

说明：

- 写入类型固定为 `post`，并使用 `_drafts.*` ID，只生成草稿。
- 默认生成中文草稿结构（来源、摘要、要点、编辑备注），发布前请在 Sanity Studio 审核。
- 需要环境变量：`NEXT_PUBLIC_SANITY_PROJECT_ID`、`NEXT_PUBLIC_SANITY_DATASET`、`SANITY_API_WRITE_TOKEN`。

## 自动搜索模式（关键词 + RSS 自动发现 + 定时抓取）

1) 复制并编辑配置文件：

```powershell
copy data\auto-sources.example.json data\auto-sources.json
```

2) 一次性运行自动抓取：

```powershell
npm run ingest:auto -- --config data/auto-sources.json --dry-run
npm run ingest:auto -- --config data/auto-sources.json
```

3) 定时抓取（常驻）：

```powershell
npm run ingest:auto:watch -- --config data/auto-sources.json
```

说明：

- 自动模式会先根据关键词从 RSS/Atom 源筛选候选 URL，再调用手动抓取脚本写入 `post` 草稿。
- 只写草稿，不自动发布。
- 建议优先使用公开 RSS/API 来源，遵守网站条款与 robots 规则。

## 内容更新（不改代码）

日常更新博客、项目、首页和关于页内容，优先使用 Sanity：

```powershell
npm run studio:dev
```

然后访问 `http://localhost:3333`，编辑并发布内容即可。  
多数内容更新无需重新部署代码（页面会读取最新 Sanity 数据）。

## 代码更新与上线流程

若修改了页面样式、组件、接口等代码，推荐流程：

```powershell
git add .
git commit -m "your message"
git push
npm run release:preview
npm run release:prod
```

## 线上地址

- Production: `https://personal-site-iota-navy.vercel.app`
- 冒烟测试清单：[`docs/smoke-test-checklist.md`](docs/smoke-test-checklist.md)
