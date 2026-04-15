import { PortableText, PortableTextComponents } from "@portabletext/react";

type PortableTextRendererProps = {
  value: unknown[];
};

const components: PortableTextComponents = {
  block: {
    h2: ({ children }) => (
      <h2 className="mt-8 text-2xl font-semibold tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-6 text-xl font-semibold tracking-tight">{children}</h3>
    ),
    normal: ({ children }) => (
      <p className="mt-4 leading-7 text-neutral-800">{children}</p>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-4 border-l-4 border-neutral-300 pl-4 italic text-neutral-700">
        {children}
      </blockquote>
    ),
  },
  list: {
    bullet: ({ children }) => <ul className="mt-4 list-disc space-y-1 pl-6">{children}</ul>,
    number: ({ children }) => (
      <ol className="mt-4 list-decimal space-y-1 pl-6">{children}</ol>
    ),
  },
  marks: {
    link: ({ children, value }) => {
      const href = value?.href as string | undefined;
      const isExternal = href?.startsWith("http");
      return (
        <a
          className="underline underline-offset-2"
          href={href}
          rel={isExternal ? "noreferrer" : undefined}
          target={isExternal ? "_blank" : undefined}
        >
          {children}
        </a>
      );
    },
  },
};

export function PortableTextRenderer({ value }: PortableTextRendererProps) {
  return <PortableText components={components} value={value} />;
}
