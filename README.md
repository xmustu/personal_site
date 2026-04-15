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
