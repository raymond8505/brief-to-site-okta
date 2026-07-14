import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Separator } from "@core/components/ui/separator";

// Render smoke test for the Separator primitive. Queries the hard-coded data-slot the CSS keys
// off (rather than base-ui's orientation internals) to keep the assertion stable.
describe("Separator", () => {
  it("renders a separator element", () => {
    const { container } = render(<Separator />);
    expect(container.querySelector('[data-slot="separator"]')).not.toBeNull();
  });

  it("forwards className", () => {
    const { container } = render(<Separator className="custom-x" />);
    expect(container.querySelector('[data-slot="separator"]')).toHaveClass("custom-x");
  });
});
