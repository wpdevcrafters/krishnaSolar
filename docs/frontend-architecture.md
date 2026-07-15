# Frontend Architecture Notes

## CSS Organization

`assets/css/style.css` remains the production entry stylesheet for the static HTML build. To avoid visual regressions, the current QA remediation did not reorder large blocks or remove high-specificity rules.

Future CSS work should happen in this order:

1. Freeze visual QA screenshots for home, services, service detail, calculators, contact, policy, and project pages.
2. Split rules into component groups: header, footer, hero, CTA, FAQ, calculator shell, cards, forms, tables, service detail, and utilities.
3. Move breakpoint overrides next to their component section.
4. Remove duplicate rules only after screenshot comparison passes.
5. Reduce `!important` only where cascade ownership is clear.

## Breakpoint Strategy

The project uses Bootstrap-oriented breakpoints:

- `575.98px`: small/mobile overrides
- `767.98px`: tablet portrait overrides
- `991.98px`: mobile navigation/tablet layout overrides
- `1199.98px` and above: desktop refinements

New responsive CSS should be added under the owning component section and avoid broad page-level overrides unless the component is shared globally.

## WordPress Migration Map

When converting to WordPress, map repeated static sections to these template parts:

- `header.php`: top navigation, drawer menu, favicon/meta enqueue hooks
- `footer.php`: footer columns, legal links, WhatsApp floating button
- `template-parts/cta.php`: CTA banner
- `template-parts/faq.php`: Bootstrap FAQ accordion
- `template-parts/calculator-hero.php`: calculator detail hero
- `template-parts/calculator-shell.php`: calculator form/result layout
- `template-parts/project-card.php`: project listing cards
- `template-parts/service-card.php`: service cards

Calculator JavaScript should remain page-specific and be enqueued conditionally by template slug.
