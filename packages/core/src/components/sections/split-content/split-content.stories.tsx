import type { Meta, StoryObj } from "@storybook/nextjs-vite";

import { Button } from "@core/components/ui/button";
import {
  BulletItem,
  BulletList,
  CtaGroup,
  Eyebrow,
  Heading,
  MediaFrame,
  Prose,
} from "@core/components/blocks";
import {
  SplitContent,
  SplitContentBody,
  SplitContentMedia,
} from "@core/components/sections/split-content/split-content";

/**
 * SplitContent — the generic mid-page two-column split: copy (`SplitContentBody` with `Eyebrow` /
 * `Heading level={2}` / `Prose` / `BulletList` / `CtaGroup`) beside media (`SplitContentMedia` with a
 * `MediaFrame`). Use it for about/explainer/enrollment splits between other sections — `Hero` stays
 * the first section, `ContactBlock` the contact split. Root props: `mediaSide` (`end` | `start`,
 * default `end` — alternate sides down a page for rhythm) and the shared `density`. A "variant" is a
 * composition: **Default** (copy + CTA + media), **WithBullets** (checklist-led), **MediaStart**
 * (alternated side). Import the section from `@brief-to-site/core/sections` and the blocks from
 * `@brief-to-site/core/blocks`.
 */
const meta = {
  title: "Sections/SplitContent",
  component: SplitContent,
  tags: ["autodocs"],
  parameters: { layout: "fullscreen" },
  argTypes: {
    mediaSide: {
      control: "inline-radio",
      options: ["end", "start"],
      description: "Which side the media column sits on (CSS flex-direction). Default `end`.",
      table: { defaultValue: { summary: "end" } },
    },
    density: {
      control: "inline-radio",
      options: ["compact", "comfortable", "spacious"],
      description: "Vertical rhythm from the shared Section axis. Default `comfortable`.",
      table: { defaultValue: { summary: "comfortable" } },
    },
  },
  args: { mediaSide: "end", density: "comfortable" },
  render: (args) => (
    <SplitContent {...args}>
      <SplitContentBody>
        <Eyebrow>How it works</Eyebrow>
        <Heading level={2}>A brief in, a site out</Heading>
        <Prose>
          You describe the business and the audience; the studio turns that into pages, copy, and a
          palette derived from one brand colour.
        </Prose>
        <CtaGroup>
          <Button>See the process</Button>
        </CtaGroup>
      </SplitContentBody>
      <SplitContentMedia>
        <MediaFrame alt="Process overview" rounded />
      </SplitContentMedia>
    </SplitContent>
  ),
} satisfies Meta<typeof SplitContent>;

export default meta;
type Story = StoryObj<typeof meta>;

/** Default: copy + CTA on the left, media on the right. */
export const Default: Story = {};

/** Checklist-led: a `BulletList` carries the body — the benefits/explainer form. */
export const WithBullets: Story = {
  render: (args) => (
    <SplitContent {...args}>
      <SplitContentBody>
        <Heading level={2}>What every engagement includes</Heading>
        <BulletList>
          <BulletItem>Copy drafted from your brief, ready for review</BulletItem>
          <BulletItem>A palette derived from your brand colour</BulletItem>
          <BulletItem>Screenshots of every page at every viewport</BulletItem>
        </BulletList>
        <CtaGroup>
          <Button>Start a project</Button>
        </CtaGroup>
      </SplitContentBody>
      <SplitContentMedia>
        <MediaFrame alt="Engagement checklist illustration" rounded />
      </SplitContentMedia>
    </SplitContent>
  ),
};

/** `mediaSide: start` — media on the visual left; alternate with `end` down a page for rhythm. */
export const MediaStart: Story = { args: { mediaSide: "start" } };
