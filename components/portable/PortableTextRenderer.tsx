import { PortableText, PortableTextComponents } from "@portabletext/react";

type PortableTextRendererProps = {
  value: any[];
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2>{children}</h2>
    ),
    h3: ({ children }) => (
      <h3>{children}</h3>
    ),
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
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
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
    code: ({ value }) => (
      <pre>
        <code>{value?.code}</code>
      </pre>
    ),
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return (
    <div className="site-markdown">
      <PortableText components={components} value={value} />
    </div>
  );
}
