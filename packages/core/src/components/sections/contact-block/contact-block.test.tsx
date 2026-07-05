import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { ContactBlock } from "@core/components/sections/contact-block/contact-block";

describe("ContactBlock", () => {
  it("renders the heading, optional copy, and the three labelled fields", () => {
    render(
      <ContactBlock eyebrow="Say hi" heading="Get in touch" subcopy="We reply within a day." />,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Get in touch" })).toBeInTheDocument();
    expect(screen.getByText("Say hi")).toBeInTheDocument();
    expect(screen.getByText("We reply within a day.")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });

  it("renders a submit button with the default and a custom label", () => {
    const { rerender } = render(<ContactBlock heading="H" />);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
    rerender(<ContactBlock heading="H" submitLabel="Request a quote" />);
    expect(screen.getByRole("button", { name: "Request a quote" })).toBeInTheDocument();
  });

  it("omits the eyebrow and subcopy when not supplied", () => {
    render(<ContactBlock heading="Just a heading" />);
    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
    expect(screen.queryByText("Say hi")).not.toBeInTheDocument();
  });

  it("keeps DOM order copy → form regardless of the form variant (FR-3.11: no source reorder)", () => {
    for (const form of ["inline-end", "inline-start"] as const) {
      const { container, unmount } = render(<ContactBlock heading="H" form={form} />);
      const row = container.querySelector("[data-slot=contact-block]")!;
      expect(row.children[0]).toHaveAttribute("data-slot", "contact-copy");
      expect(row.children[1]).toHaveAttribute("data-slot", "contact-form");
      unmount();
    }
  });

  it("maps the form variant to a CSS-only flex-direction class", () => {
    const { container } = render(<ContactBlock heading="H" form="inline-start" />);
    expect(container.querySelector("[data-slot=contact-block]")).toHaveClass("lg:flex-row-reverse");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(<ContactBlock heading="H" density="compact" />);
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });
});
