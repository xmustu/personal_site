import { ownerConsoleLogin } from "@/app/admin/login/actions";
import { isOwnerConsoleConfigured } from "@/lib/admin/consoleSession";
import { LoginForm } from "./ui";

export default function AdminLoginPage() {
  const configured = isOwnerConsoleConfigured();

  return (
    <div className="mx-auto max-w-md space-y-6">
      <div>
        <h1 className="text-xl font-semibold text-neutral-900">登录</h1>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          方案 A：内容在 Sanity Studio 编辑；此处为站长入口，串联常用链接。不包含环境变量或密钥管理。
        </p>
      </div>

      {!configured ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
          <p className="font-medium">尚未配置访问控制</p>
          <p className="mt-2 text-amber-800/90">
            在 <code className="rounded bg-amber-100/80 px-1">.env.local</code> 中设置{" "}
            <code className="rounded bg-amber-100/80 px-1">SITE_OWNER_CONSOLE_SECRET</code>（随机长字符串）与{" "}
            <code className="rounded bg-amber-100/80 px-1">SITE_OWNER_CONSOLE_PASSWORD</code>（仅本人知晓的密码），重启
            dev 服务器后再试。
          </p>
        </div>
      ) : (
        <LoginForm action={ownerConsoleLogin} />
      )}
    </div>
  );
}
