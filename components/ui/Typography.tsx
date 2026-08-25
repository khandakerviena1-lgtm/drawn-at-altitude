// Typography primitives mirroring the Framer text-style system
// (docs/FRAMER-DESIGN-AUDIT.md). Server components; styling lives in
// globals.css so scenes can reuse the same classes directly.
import type { ElementType, ReactNode } from "react";

type TypoProps = {
  as?: ElementType;
  className?: string;
  children: ReactNode;
  id?: string;
};

function make(defaultTag: ElementType, baseClass: string) {
  return function Typo({ as, className, children, id }: TypoProps) {
    const Tag = as ?? defaultTag;
    return (
      <Tag id={id} className={`${baseClass}${className ? ` ${className}` : ""}`}>
        {children}
      </Tag>
    );
  };
}

export const EditorialTitle = make("h1", "typoDisplay");
export const ChapterTitle = make("h2", "typoChapter");
export const EditorialStatement = make("h2", "typoStatement");
export const SectionEyebrow = make("p", "typoEyebrow");
export const MetaLabel = make("p", "typoLabel");
export const BodyEditorial = make("p", "typoBody");
export const PracticalValue = make("dd", "typoValue");
