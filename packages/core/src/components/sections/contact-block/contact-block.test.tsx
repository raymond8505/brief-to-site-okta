import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Eyebrow, Heading, Prose } from "@core/components/blocks";
import {
  ContactBlock,
  ContactCopy,
  ContactForm,
} from "@core/components/sections/contact-block/contact-block";

describe("ContactBlock", () => {
  it("renders the composed copy and the three labelled form fields", () => {
    render(
      <ContactBlock>
        <ContactCopy>
          <Eyebrow>Say hi</Eyebrow>
          <Heading level={2}>Get in touch</Heading>
          <Prose>We reply within a day.</Prose>
        </ContactCopy>
        <ContactForm />
      </ContactBlock>,
    );
    expect(screen.getByRole("heading", { level: 2, name: "Get in touch" })).toBeInTheDocument();
    expect(screen.getByText("Say hi")).toBeInTheDocument();
    expect(screen.getByLabelText("Name")).toBeInTheDocument();
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByLabelText("Message").tagName).toBe("TEXTAREA");
  });

  it("renders a submit button with the default and a custom label", () => {
    const { rerender } = render(<ContactForm />);
    expect(screen.getByRole("button", { name: "Send" })).toHaveAttribute("type", "submit");
    rerender(<ContactForm submitLabel="Request a quote" />);
    expect(screen.getByRole("button", { name: "Request a quote" })).toBeInTheDocument();
  });

  it("gives each form instance its own field ids", () => {
    render(
      <>
        <ContactForm />
        <ContactForm />
      </>,
    );
    const [first, second] = screen.getAllByLabelText("Email");
    // With hardcoded ids both labels resolve to the first input, so this is the real regression.
    expect(first).not.toBe(second);
    expect(first?.id).not.toBe(second?.id);
  });

  it("maps formSide to a CSS-only flex-direction class", () => {
    const { container } = render(
      <ContactBlock formSide="start">
        <ContactCopy>x</ContactCopy>
        <ContactForm />
      </ContactBlock>,
    );
    expect(container.querySelector("[data-slot=contact-block]")).toHaveClass("lg:flex-row-reverse");
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <ContactBlock density="compact">
        <ContactForm />
      </ContactBlock>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the section", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <ContactBlock>
        <div>not a slot</div>
      </ContactBlock>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("ContactBlock");
    warn.mockRestore();
  });
});
