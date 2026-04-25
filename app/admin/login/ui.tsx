"use client";

import { useActionState } from "react";
import type { LoginState } from "./actions";

const initial: LoginState = { error: null };

export function LoginForm({ action }: { action: typeof import("./actions").ownerConsoleLogin }) {
  const [state, formAction, pending] = useActionState(action, initial);

  return (
    <form action={formAction} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-neutral-800" htmlFor="password">
          控制台密码
        </label>
        <input
          autoComplete="current-password"
          className="mt-1 w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none ring-orange-200 focus:ring-2"
          id="password"
          name="password"
          required
          type="password"
        />
      </div>
      {state?.error ? (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      ) : null}
      <button
        className="w-full rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        disabled={pending}
        type="submit"
      >
        {pending ? "验证中…" : "进入控制台"}
      </button>
    </form>
  );
}
