import { defineRouting } from "next-intl/routing";

/** 策略 A：默认中文可不带 /zh；英文使用 /en 前缀 */
export const routing = defineRouting({
  locales: ["zh", "en"],
  defaultLocale: "zh",
  localePrefix: "as-needed",
});
