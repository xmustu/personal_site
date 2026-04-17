import { PortableText, PortableTextComponents } from "@portabletext/react";
import { CodeBlock } from "@/components/portable/CodeBlock";

type PortableSpan = {
  _type?: string;
  text?: string;
};

type PortableBlock = {
  _type?: string;
  style?: string;
  children?: PortableSpan[];
};

export type TocHeading = {
  id: string;
  text: string;
  level: 2 | 3;
};

type PortableTextRendererProps = {
  value: any[];
  copyLabel: string;
  copiedLabel: string;
};

function textFromBlock(block: PortableBlock) {
  return (block.children ?? [])
    .map((child) => (child?._type === "span" ? child.text ?? "" : ""))
    .join("")
    .replace(/\s+/g, " ")
    .trim();
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^\w\u4e00-\u9fa5\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function buildHeadingId(text: string, usedIds: Set<string>) {
  const base = slugify(text) || "section";
  let candidate = base;
  let index = 2;
  while (usedIds.has(candidate)) {
    candidate = `${base}-${index}`;
    index += 1;
  }
  usedIds.add(candidate);
  return candidate;
}

function headingMetaFromBlocks(value: any[]) {
  const orderedIds: string[] = [];
  const usedIds = new Set<string>();

  for (const raw of value as PortableBlock[]) {
    if (raw?._type !== "block") {
      continue;
    }
    const style = raw.style;
    if (style !== "h2" && style !== "h3") {
      continue;
    }
    const text = textFromBlock(raw);
    if (!text) {
      continue;
    }
    const id = buildHeadingId(text, usedIds);
    orderedIds.push(id);
  }

  let pointer = 0;
  return {
    nextId() {
      const id = orderedIds[pointer];
      pointer += 1;
      return id;
    },
  };
}

export function extractTocHeadings(value: any[]): TocHeading[] {
  const headings: TocHeading[] = [];
  const usedIds = new Set<string>();

  for (const raw of value as PortableBlock[]) {
    if (raw?._type !== "block") {
      continue;
    }
    const style = raw.style;
    if (style !== "h2" && style !== "h3") {
      continue;
    }
    const text = textFromBlock(raw);
    if (!text) {
      continue;
    }
    headings.push({
      id: buildHeadingId(text, usedIds),
      text,
      level: style === "h2" ? 2 : 3,
    });
  }

  return headings;
}

export function PortableTextRenderer({
  value,
  copyLabel,
  copiedLabel,
}: PortableTextRendererProps) {
  const headingMeta = headingMetaFromBlocks(value);

  const components: PortableTextComponents = {
    block: {
      h2: ({ children }) => {
        const id = headingMeta.nextId();
        return (
          <h2 className="scroll-mt-24" id={id}>
            {children}
          </h2>
        );
      },
      h3: ({ children }) => {
        const id = headingMeta.nextId();
        return (
          <h3 className="scroll-mt-24" id={id}>
            {children}
          </h3>
        );
      },
      normal: ({ children }) => <p>{children}</p>,
      blockquote: ({ children }) => (
        <blockquote className="mt-4 border-l-4 border-orange-200 pl-4 italic text-neutral-700">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul>{children}</ul>,
      number: ({ children }) => <ol>{children}</ol>,
    },
    marks: {
      link: ({ children, value: markValue }) => {
        const href = markValue?.href as string | undefined;
        const isExternal = href?.startsWith("http");
        return (
          <a
            className="underline underline-offset-2 hover:text-orange-700"
            href={href}
            rel={isExternal ? "noreferrer" : undefined}
            target={isExternal ? "_blank" : undefined}
          >
            {children}
          </a>
        );
      },
      code: ({ children }) => <code>{children}</code>,
    },
    types: {
      code: ({ value: codeValue }) => (
        <CodeBlock
          code={(codeValue?.code as string | undefined) ?? ""}
          copiedLabel={copiedLabel}
          copyLabel={copyLabel}
          language={(codeValue?.language as string | undefined) ?? ""}
        />
      ),
    },
  };

  return (
    <div className="site-markdown">
      <PortableText components={components} value={value} />
    </div>
  );
}
