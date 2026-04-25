"use client";

import { FormEvent, useState } from "react";
import { useTranslations } from "next-intl";

type SubmitState = "idle" | "submitting" | "success" | "error";

export function ContactForm() {
  const t = useTranslations("Contact");
  const [state, setState] = useState<SubmitState>("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setState("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = {
      name: String(formData.get("name") ?? ""),
      email: String(formData.get("email") ?? ""),
      message: String(formData.get("message") ?? ""),
      website: String(formData.get("website") ?? ""),
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Request failed");
      }

      form.reset();
      setState("success");
    } catch {
      setState("error");
    }
  }

  const fieldClass =
    "rounded-xl border bg-white px-3 py-2 text-sm outline-none ring-orange-200/80 focus:ring-2";

  return (
    <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
      <label className="flex flex-col gap-2 text-sm text-neutral-700">
        {t("nameLabel")}
        <input
          className={fieldClass}
          name="name"
          required
          style={{ borderColor: "var(--site-line)" }}
          type="text"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-neutral-700">
        {t("emailLabel")}
        <input
          className={fieldClass}
          name="email"
          required
          style={{ borderColor: "var(--site-line)" }}
          type="email"
        />
      </label>

      <label className="flex flex-col gap-2 text-sm text-neutral-700">
        {t("messageLabel")}
        <textarea
          className={`min-h-32 ${fieldClass}`}
          name="message"
          required
          style={{ borderColor: "var(--site-line)" }}
        />
      </label>

      <input autoComplete="off" className="hidden" name="website" tabIndex={-1} />

      <button
        className="inline-flex w-fit rounded-xl bg-neutral-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-orange-700 disabled:opacity-60"
        disabled={state === "submitting"}
        type="submit"
      >
        {state === "submitting" ? t("sending") : t("submit")}
      </button>

      {state === "success" ? (
        <p className="text-sm text-emerald-700">{t("success")}</p>
      ) : null}
      {state === "error" ? <p className="text-sm text-red-700">{t("error")}</p> : null}
    </form>
  );
}
