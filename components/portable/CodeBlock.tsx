"use client";

import { useState } from "react";

type CodeBlockProps = {
  code: string;
  language?: string;
  copyLabel: string;
  copiedLabel: string;
};

export function CodeBlock({
  code,
  language,
  copyLabel,
  copiedLabel,
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      // ignore clipboard errors
    }
  }

  return (
    <div className="site-code-block">
      <button
        className="site-code-copy"
        onClick={onCopy}
        type="button"
      >
        {copied ? copiedLabel : copyLabel}
      </button>
      {language ? (
        <p className="site-code-lang">{language}</p>
      ) : null}
      <pre>
        <code>{code}</code>
      </pre>
    </div>
  );
}
