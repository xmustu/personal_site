import Link from "next/link";

export default function NotFound() {
  return (
    <html lang="zh">
      <body className="mx-auto max-w-lg px-6 py-24 font-sans">
        <h1 className="text-2xl font-semibold">页面未找到</h1>
        <p className="mt-3 text-neutral-600">
          请从{" "}
          <Link className="underline" href="/">
            首页
          </Link>{" "}
          重新进入。
        </p>
      </body>
    </html>
  );
}
