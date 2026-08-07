import { RuleTester } from "eslint";
import tsParser from "@typescript-eslint/parser";
import { describe } from "vitest";

import plugin from "./rsc-boundary.mjs";

// TS + JSX parsing, matching how the rules are applied in eslint.config.mjs.
const ruleTester = new RuleTester({
  languageOptions: {
    parser: tsParser,
    parserOptions: { ecmaFeatures: { jsx: true }, sourceType: "module" },
  },
});

describe("rsc-boundary", () => {
  ruleTester.run(
    "no-component-prop-in-client-file",
    plugin.rules["no-component-prop-in-client-file"],
    {
      valid: [
        // Server module (no directive) — a component-valued prop never crosses a boundary.
        { code: `interface Props { icon: LucideIcon }` },
        { code: `interface Props { icon: React.ComponentType }` },
        // Client module, but the prop is an *element*, which serializes.
        { code: `"use client";\ninterface Props { icon: React.ReactNode }` },
        // Client module importing its own icon rather than taking one as a prop.
        { code: `"use client";\nimport { Check } from "lucide-react";\nconst a = <Check />;` },
        // "use client" appearing somewhere other than the directive prologue is not a directive.
        { code: `const x = 1;\n"use client";\ninterface Props { icon: LucideIcon }` },
      ],
      invalid: [
        {
          code: `"use client";\ninterface Props { icon: LucideIcon }`,
          errors: [{ messageId: "componentProp", data: { name: "LucideIcon" } }],
        },
        {
          code: `"use client";\ninterface Props { as: React.ElementType }`,
          errors: [{ messageId: "componentProp" }],
        },
        {
          code: `"use client";\ntype Props = { Comp: ComponentType }`,
          errors: [{ messageId: "componentProp" }],
        },
        {
          // Directive after a leading comment still counts.
          code: `"use client";\ninterface A { icon: LucideIcon }\ninterface B { icon: LucideIcon }`,
          errors: [{ messageId: "componentProp" }, { messageId: "componentProp" }],
        },
      ],
    },
  );

  ruleTester.run("no-function-render-prop", plugin.rules["no-function-render-prop"], {
    valid: [
      // The prescribed element form.
      { code: `const a = <Button render={<Link href="/x" />}>Go</Button>;` },
      { code: `const a = <Button>Go</Button>;` },
      // A `render` prop that isn't a function is fine.
      { code: `const a = <Thing render={someElement} />;` },
      // Inside a client module the function form is legal — no boundary is crossed.
      {
        code: `"use client";\nconst a = <Button render={(props) => <a {...props} />}>Go</Button>;`,
      },
    ],
    invalid: [
      {
        code: `const a = <Button render={(props) => <a {...props} href="/x" />}>Go</Button>;`,
        errors: [{ messageId: "functionRender" }],
      },
      {
        code: `const a = <Button render={function (props) { return <a {...props} />; }}>Go</Button>;`,
        errors: [{ messageId: "functionRender" }],
      },
    ],
  });
});
