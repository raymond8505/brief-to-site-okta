import * as React from "react";

/** Read a component's display name for a warning message; falls back to the intrinsic tag or "?". */
function childName(type: React.ElementType): string {
  if (typeof type === "string") return type;
  const named = type as { displayName?: string; name?: string };
  return named.displayName ?? named.name ?? "unknown";
}

/**
 * Dev-only guardrail for compound sections: warn when a direct child isn't one of the section's
 * permitted slot subcomponents. React children are `ReactNode` and cannot be narrowed to a specific
 * component set at the type level (see the section contract) — this reference-identity check catches
 * "wrong slot" composition mistakes at author time in dev / Storybook, and is a no-op in production.
 *
 * @param children the section's `children`
 * @param allowed the section's permitted slot subcomponents (compared by reference identity)
 * @param owner the section name, for the warning message
 */
export function assertAllowedChildren(
  children: React.ReactNode,
  allowed: readonly React.ElementType[],
  owner: string,
): void {
  if (process.env.NODE_ENV === "production") return;
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return; // strings / null / booleans — ignore
    // A fragment is one opaque child React.Children won't descend into; don't false-warn on it.
    if (child.type === React.Fragment) return;
    if (allowed.includes(child.type as React.ElementType)) return;
    console.warn(
      `[${owner}] unexpected child <${childName(child.type as React.ElementType)}>. ` +
        `Compose ${owner} from its slot components: ${allowed.map(childName).join(", ")}.`,
    );
  });
}
