/**
 * Local ESLint plugin: the React Server Component boundary rules that only a real `next build`
 * would otherwise catch.
 *
 * Both rules encode the same fact — React's flight serializer rejects **functions** "passed
 * directly to Client Components", while React **elements** serialize fine. Neither violation is
 * visible to `tsc` (both typecheck cleanly), and vitest runs jsdom against client React, so
 * without these rules the first signal is a failed production build. The prose that explains the
 * why lives in `.claude/skills/component-authoring/index.md`; this is the deterministic gate.
 *
 * Authored as plain `.mjs` on purpose: ESLint flat config loads JS directly, so the lint path
 * needs no transpile step. RuleTester tests are the safety net in place of type coverage.
 */

/** Directive that moves a module out of the server graph. */
const CLIENT_DIRECTIVE = "use client";

/**
 * Type names that denote a *component* (a function) rather than a rendered element. A prop of one
 * of these types cannot be handed to a Client Component.
 */
const COMPONENT_TYPE_NAMES = new Set([
  "LucideIcon",
  "ComponentType",
  "ElementType",
  "FunctionComponent",
  "JSXElementConstructor",
]);

/** True when the file opens with a `"use client"` directive prologue. */
function hasClientDirective(sourceCode) {
  for (const statement of sourceCode.ast.body) {
    if (statement.type !== "ExpressionStatement") break;
    const { expression } = statement;
    if (expression.type !== "Literal" || typeof expression.value !== "string") break;
    if (expression.value === CLIENT_DIRECTIVE) return true;
  }
  return false;
}

/** Resolve `Foo` and `React.Foo` to the trailing identifier name. */
function typeReferenceName(typeName) {
  if (typeName.type === "Identifier") return typeName.name;
  if (typeName.type === "TSQualifiedName" && typeName.right.type === "Identifier") {
    return typeName.right.name;
  }
  return undefined;
}

const noComponentPropInClientFile = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow component-valued props (e.g. `icon: LucideIcon`) in a `\"use client\"` module — a component is a function and cannot cross the RSC boundary.",
    },
    schema: [],
    messages: {
      componentProp:
        'A `{{name}}` prop cannot live in a "use client" module: a component is a function, and React rejects functions passed directly to Client Components. Take the icon as an element instead (`icon={<Check/>}`), or import it inside this file and drop the prop.',
    },
  },
  create(context) {
    if (!hasClientDirective(context.sourceCode)) return {};
    return {
      TSTypeReference(node) {
        const name = typeReferenceName(node.typeName);
        if (name && COMPONENT_TYPE_NAMES.has(name)) {
          context.report({ node, messageId: "componentProp", data: { name } });
        }
      },
    };
  },
};

const noFunctionRenderProp = {
  meta: {
    type: "problem",
    docs: {
      description:
        "Disallow the function form of Base UI's `render` prop outside a client module — it typechecks and then fails at prerender.",
    },
    schema: [],
    messages: {
      functionRender:
        "Pass `render` an element, not a function. `Button`/`Input` wrap client Base UI primitives, so a function `render` crosses the RSC boundary and fails at prerender (it typechecks fine). Use `render={<Link href=\"…\" />}`.",
    },
  },
  create(context) {
    if (hasClientDirective(context.sourceCode)) return {};
    return {
      JSXAttribute(node) {
        if (node.name.type !== "JSXIdentifier" || node.name.name !== "render") return;
        const value = node.value;
        if (!value || value.type !== "JSXExpressionContainer") return;
        const { expression } = value;
        if (
          expression.type === "ArrowFunctionExpression" ||
          expression.type === "FunctionExpression"
        ) {
          context.report({ node: expression, messageId: "functionRender" });
        }
      },
    };
  },
};

export default {
  meta: { name: "rsc-boundary" },
  rules: {
    "no-component-prop-in-client-file": noComponentPropInClientFile,
    "no-function-render-prop": noFunctionRenderProp,
  },
};
