# Krishna Solar Section Library

This note documents the reusable visual section variants used across the current static site so future WordPress, ACF, Gutenberg, Elementor, or CRM templates can reuse the same design language without drifting.

## Hero Variants

### Marketing Image Hero

Used on the homepage and service archive-style pages.

- Large trust-building headline.
- One primary CTA and one quieter secondary CTA.
- Solar/home imagery may sit behind the content with a strong readability overlay.
- Mobile layout should prioritize headline, short copy, and primary action before secondary tools.

### Utility Gradient Hero

Used on calculator, contact, policy, and information pages.

- Green solar gradient background.
- White heading text for high contrast.
- Short badge row for trust signals.
- No busy photographic detail behind critical text on mobile.

### Service Detail Hero

Used on residential, commercial, and industrial pages.

- Service-specific headline and proof points.
- Lead-generation form is visually connected but must remain compact on mobile.
- Trust chips use concise two-line labels and consistent icon alignment.

## Core Sections

### CTA Strip

- Full-width banner inside a Bootstrap container.
- Green/orange solar palette.
- One primary action plus optional secondary action.
- Mobile actions stack with equal button widths.

### FAQ Accordion

- Uses the shared FAQ visual treatment.
- Two columns on desktop, one column on mobile.
- Minimum 44px tappable question row.
- Plus/toggle icon alignment must remain consistent across pages.

### Project Card

- Real solar imagery or optimized project photography.
- Category badge over image.
- Location, annual savings, and system size remain visible in the body.
- Images use consistent aspect ratio and crop.

### Calculator Shell

- 30/70 or compact/wide form-result rhythm when applicable.
- Empty state is compact and instructional.
- Result state can expand with metrics, charts, and tables after calculation.
- Informational tables use branded headers, zebra rows, and readable spacing.

### Lead Form

- Required fields should be visually clear.
- Validation, loading, success, and error states should reuse the shared form visual rules.
- Floating contact actions must not overlap submit buttons on mobile.

### Content Tables

- Branded dark or green header row.
- Strong row spacing and readable numeric hierarchy.
- Long tables should retain comfortable mobile scroll or responsive card fallback.

## Component Tokens

- Primary CTA: orange.
- Solar/action success: green.
- Backgrounds: white, soft slate, pale green.
- Border radius: medium rounded cards, restrained pill badges.
- Shadows: soft elevation only for cards, forms, and proof blocks.
- Typography: bold headings, readable body text, no low-contrast secondary copy.

## WordPress Mapping

Recommended flexible content blocks:

- Hero: marketing, utility, service detail.
- Service card grid.
- Project card grid.
- Calculator form/result shell.
- FAQ accordion.
- CTA strip.
- Testimonial carousel/card grid.
- Process timeline.
- Subsidy/finance card pair.
- Long-form article/table block.
- Lead-generation form with CRM states.
