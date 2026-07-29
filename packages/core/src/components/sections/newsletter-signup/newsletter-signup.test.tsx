import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Heading } from "@core/components/blocks/heading/heading";
import {
  NewsletterForm,
  NewsletterSignup,
  NewsletterSignupBody,
} from "@core/components/sections/newsletter-signup/newsletter-signup";

describe("NewsletterSignup", () => {
  it("renders the copy slot and a labelled email form under the section", () => {
    const { container } = render(
      <NewsletterSignup>
        <NewsletterSignupBody>
          <Heading level={2}>Stay in the loop</Heading>
        </NewsletterSignupBody>
        <NewsletterForm />
      </NewsletterSignup>,
    );
    const band = container.querySelector("[data-slot=newsletter-signup]");
    expect(band).toBeInTheDocument();
    expect(band?.querySelector("[data-slot=newsletter-signup-body]")).toBeInTheDocument();
    expect(screen.getByRole("heading", { level: 2, name: "Stay in the loop" })).toBeInTheDocument();
    // The email field stays accessible through the visually-hidden label.
    expect(screen.getByLabelText("Email")).toHaveAttribute("type", "email");
    expect(screen.getByRole("button", { name: "Subscribe" })).toBeInTheDocument();
  });

  it("is presentational: no action or submit handler on the form", () => {
    const { container } = render(
      <NewsletterSignup>
        <NewsletterForm />
      </NewsletterSignup>,
    );
    const form = container.querySelector("form[data-slot=newsletter-form]");
    expect(form).not.toHaveAttribute("action");
    expect(form).not.toHaveAttribute("onsubmit");
  });

  it("renders custom labels via the form props", () => {
    render(
      <NewsletterSignup>
        <NewsletterForm emailLabel="Work email" placeholder="name@company.com" submitLabel="Notify me" />
      </NewsletterSignup>,
    );
    expect(screen.getByLabelText("Work email")).toHaveAttribute(
      "placeholder",
      "name@company.com",
    );
    expect(screen.getByRole("button", { name: "Notify me" })).toBeInTheDocument();
  });

  it("forwards density to the Section shell", () => {
    const { container } = render(
      <NewsletterSignup density="compact">
        <NewsletterForm />
      </NewsletterSignup>,
    );
    expect(container.querySelector("[data-slot=section]")).toHaveClass("py-8");
  });

  it("warns in dev when a non-slot child is composed into the band", () => {
    const warn = vi.spyOn(console, "warn").mockImplementation(() => {});
    render(
      <NewsletterSignup>
        <div>not a slot</div>
      </NewsletterSignup>,
    );
    expect(warn).toHaveBeenCalledOnce();
    expect(warn.mock.calls[0]?.[0]).toContain("NewsletterSignup");
    warn.mockRestore();
  });
});
