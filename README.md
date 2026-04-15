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
