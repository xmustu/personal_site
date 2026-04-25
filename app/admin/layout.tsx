import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "站长控制台",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <div className="border-b bg-white/90 backdrop-blur-sm" style={{ borderColor: "var(--site-line, #e5e5e5)" }}>
        <div className="mx-auto flex max-w-3xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-semibold tracking-tight text-neutral-800">站长控制台</span>
          <a className="text-sm text-orange-700 underline-offset-2 hover:underline" href="/">
            返回站点
          </a>
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
    </div>
  );
}
