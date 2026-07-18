import * as React from "react";

import { cn } from "@core/lib/utils";

export interface FaqItemProps extends React.ComponentProps<"div"> {
  /** The question. */
  question: string;
  /** The answer — pass the copy as children. */
  children: React.ReactNode;
}

/**
 * FaqItem — one question/answer pair. Static and always-open (the deliverable is full-page
 * screenshots, so answers never collapse behind a toggle). A leaf block: repeat it inside a `Faq`
 * section. Compose the question as a prop and the answer as children.
 */
export function FaqItem({ question, children, className, ...props }: FaqItemProps) {
  return (
    <div data-slot="faq-item" className={cn("flex flex-col gap-2", className)} {...props}>
      <p className="font-heading text-lg font-bold text-foreground">{question}</p>
      <div className="text-muted-foreground">{children}</div>
    </div>
  );
}
