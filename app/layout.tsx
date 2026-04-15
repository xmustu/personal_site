import type { ReactNode } from "react";
import "./globals.css";

type Props = {
  children: ReactNode;
};

/** 根布局：实际 `html/body` 在 `app/[locale]/layout.tsx`（与 next-intl 官方示例一致） */
export default function RootLayout({ children }: Props) {
  return children;
}
