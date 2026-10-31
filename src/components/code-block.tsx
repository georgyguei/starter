import type { JSX } from "react";
import type { BundledLanguage } from "shiki";

import { toJsxRuntime } from "hast-util-to-jsx-runtime";
import { Fragment } from "react";
import { jsx, jsxs } from "react/jsx-runtime";

import { cn } from "@repo/utils/classes";

import { highlighter } from "./highlighter";

interface CodeBlockProps {
  code: string;
  lang: BundledLanguage;
  className?: string;
}

export async function CodeBlock({ code, lang, className }: CodeBlockProps) {
  const out = (await highlighter).codeToHast(code.trim(), {
    lang,
    theme: "dracula",
    defaultColor: false,
  });

  return toJsxRuntime(out, {
    Fragment,
    jsx,
    jsxs,
    components: {
      pre: ({ className: preClassName, style: _style, ...props }) => (
        <div className={cn("max-h-[inherit] min-h-30 max-w-dvw overflow-auto", className)}>
          <pre className={cn("px-4 py-2 text-sm", preClassName)} {...props} />
        </div>
      ),
    },
  }) as JSX.Element;
}
