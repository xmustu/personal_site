import { ownerConsoleLogout } from "@/app/admin/actions";

const sanityStudioHref = "/studio";

const internal = [
  { href: sanityStudioHref, title: "Sanity Studio", desc: "编辑文章、项目、首页与关于等所有 CMS 内容。" },
  { href: "/workflow", title: "工作流说明", desc: "草稿 ingest、预检与发布流程。" },
  { href: "/blog", title: "博客（前台）", desc: "查看读者视角列表与详情。" },
  { href: "/projects", title: "项目（前台）", desc: "查看项目卡片与外链效果。" },
  { href: "/about", title: "关于", desc: "关于页前台预览。" },
] as const;

const external = [
  { href: "https://vercel.com/dashboard", title: "Vercel Dashboard", desc: "部署、域名与环境变量（密钥仅在此类平台管理）。" },
  { href: "https://github.com", title: "GitHub", desc: "代码仓库与 Actions。" },
] as const;

export default function AdminHomePage() {
  return (
    <div className="space-y-8">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">内容发布入口</h1>
        <p className="text-sm leading-relaxed text-neutral-600">
          所有可编辑内容仍在 <strong>Sanity</strong>；本页只做导航聚合。API 密钥、域名 DNS、邮件发信等请在 Vercel / 对应服务商控制台操作，不进入本站 UI。
        </p>
      </header>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-orange-800/90">站内</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {internal.map((item) => (
            <li key={item.href}>
              <a
                className="site-lift block rounded-2xl border bg-white p-4 transition hover:border-orange-200 hover:bg-orange-50/30"
                href={item.href}
                style={{ borderColor: "var(--site-line, #e5e5e5)" }}
              >
                <span className="font-medium text-neutral-900">{item.title}</span>
                <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-orange-800/90">外链</h2>
        <ul className="grid gap-3 sm:grid-cols-2">
          {external.map((item) => (
            <li key={item.href}>
              <a
                className="site-lift block rounded-2xl border bg-white p-4 transition hover:border-orange-200 hover:bg-orange-50/30"
                href={item.href}
                rel="noopener noreferrer"
                style={{ borderColor: "var(--site-line, #e5e5e5)" }}
                target="_blank"
              >
                <span className="font-medium text-neutral-900">{item.title}</span>
                <p className="mt-1 text-sm text-neutral-600">{item.desc}</p>
              </a>
            </li>
          ))}
        </ul>
      </section>

      <form action={ownerConsoleLogout}>
        <button
          className="text-sm text-neutral-500 underline-offset-2 hover:text-orange-700 hover:underline"
          type="submit"
        >
          退出登录
        </button>
      </form>
    </div>
  );
}
