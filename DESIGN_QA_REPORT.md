# Design QA Report

Project: Krishna Solar  
Audit Type: Visual Design / UX / CRO / Accessibility / Design System  
Date: 2026-07-15  
Scope Reviewed: Home, About, Services, Service Detail pages, Projects, Calculator listing, representative calculator detail pages, Contact, Policy/Subsidy information pages, header, footer, CTA, FAQ, forms, cards, tables, and responsive layouts visible in the current project.

Note: This report reviews design quality only. It does not evaluate HTML, CSS, JavaScript, implementation correctness, or backend logic.

## Executive Summary

The project has a strong foundation: the visual language feels modern, solar-focused, approachable, and conversion-oriented. The green and orange palette fits renewable energy well, the homepage and service-detail designs provide a trustworthy customer-facing experience, and the repeated CTA, FAQ, project, testimonial, and footer patterns are moving in the right direction for a scalable WordPress site.

The main design concerns are not foundational failures. They are polish and consistency issues: mobile hero sections are sometimes too crowded, text over imagery can lose contrast, calculator/detail pages feel less premium than the marketing pages, some project cards need stronger real-world visual proof, and floating contact actions can compete with important content on mobile.

## Scores

| Category | Score |
|---|---:|
| Visual Design | 84 |
| Brand Consistency | 82 |
| Typography | 86 |
| Spacing | 78 |
| Layout | 82 |
| Color System | 84 |
| Components | 80 |
| UX | 82 |
| CRO | 85 |
| Accessibility | 76 |
| Responsiveness | 76 |
| Design System | 78 |
| WordPress Readiness | 84 |
| CRM Readiness | 76 |
| Overall Design Quality | 82 |

## Strengths

- The brand direction is clear: renewable energy, residential trust, subsidy support, savings, and consultation-led conversion.
- The homepage and service-detail pages use strong hero storytelling with clear CTAs.
- The orange primary CTA is memorable and visually distinct.
- Reusable sections such as FAQ, CTA strip, cards, testimonials, process steps, and footer are suitable for future WordPress templates.
- Service pages communicate customer benefits well and use trust signals effectively.
- Calculator pages are valuable SEO/CRO assets and give the site practical utility beyond marketing content.
- Contact and lead-generation flows are prominent, which supports conversion.

## Issues

### DQA-001

Category: Responsive Design / Visual Hierarchy  
Severity: High  
Page: Homepage  
Section: Hero  
Component: Mobile hero layout  
Description: The mobile homepage hero is visually crowded. Large headline text, multiple CTAs, trust badges, background imagery, and the calculator card compete in the same first-screen area.  
Why it matters: Mobile users need a fast, simple first impression. Too many competing elements can reduce comprehension and CTA conversion.  
Recommendation: Simplify the mobile hero by prioritizing the headline, one primary CTA, and one secondary action. Move the calculator into a separate mobile section or a clearly separated band below the hero.  
Priority: P1  
Estimated Design Effort: Medium

### DQA-002

Category: Accessibility / Color Contrast  
Severity: High  
Page: Calculator Detail Pages  
Section: Hero  
Component: Heading over image background  
Description: Some calculator hero headings appear over busy photographic backgrounds, especially on mobile. The gradient text and image detail reduce readability.  
Why it matters: Poor text contrast hurts accessibility, SEO landing-page clarity, and perceived quality.  
Recommendation: Use a stronger overlay, simplify the mobile crop, or switch calculator detail heroes to a cleaner gradient treatment with the image as a secondary visual.  
Priority: P1  
Estimated Design Effort: Low

### DQA-003

Category: UX / Mobile Interaction  
Severity: Medium  
Page: Global  
Section: Floating Contact  
Component: WhatsApp button  
Description: The floating WhatsApp button overlaps important mobile content in several views, including forms, cards, and lower-page CTAs.  
Why it matters: Overlap creates accidental taps and makes forms feel less polished. It can block conversion-critical actions.  
Recommendation: Add a mobile safe area, reduce button size on small screens, or dock the button below primary form actions with adequate spacing.  
Priority: P1  
Estimated Design Effort: Low

### DQA-004

Category: CRO / Imagery  
Severity: High  
Page: Projects  
Section: Project Listing  
Component: Project cards  
Description: Project listing cards use flat placeholder-style visual blocks rather than real installation photography.  
Why it matters: Solar customers rely heavily on proof of work. Real project imagery increases trust, local credibility, and conversion confidence.  
Recommendation: Use real project thumbnails with consistent aspect ratios. Keep savings, location, capacity, and completion badges as overlays or structured card metadata.  
Priority: P1  
Estimated Design Effort: Medium

### DQA-005

Category: Brand Consistency  
Severity: Medium  
Page: Calculator Listing  
Section: Calculator Cards  
Component: Icons and badges  
Description: Calculator cards are usable, but the icon and badge treatment feels more like a generic SaaS directory than the polished solar brand used on the homepage.  
Why it matters: Inconsistent component styling weakens brand memorability across high-traffic utility pages.  
Recommendation: Standardize calculator icons, badge colors, card spacing, and CTA affordance using the same brand system as service and project cards.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-006

Category: Layout / Visual Polish  
Severity: Medium  
Page: Calculator Detail Pages  
Section: Calculator Form and Result  
Component: Empty result states  
Description: Some calculator result panels feel overly empty before calculation, creating large blank areas on desktop.  
Why it matters: Empty space without purposeful visual feedback can make a tool feel unfinished.  
Recommendation: Use a compact empty state with a relevant icon, one sentence of guidance, and subtle sample/result preview styling. Keep the larger result panel only after calculation.  
Priority: P2  
Estimated Design Effort: Low

### DQA-007

Category: Design System  
Severity: Medium  
Page: Global  
Section: Hero Sections  
Component: Hero variants  
Description: Hero sections alternate between photographic, gradient, and mixed layouts without a fully unified rule set.  
Why it matters: Variation is useful, but inconsistent treatment can make pages feel like separate templates rather than one coherent brand.  
Recommendation: Define three hero variants: Marketing Image Hero, Utility Gradient Hero, and Service Detail Hero. Standardize badge, heading, CTA, overlay, and responsive behavior for each.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-008

Category: Typography / Responsive Design  
Severity: Medium  
Page: Calculator Detail Pages  
Section: Hero  
Component: Mobile headings  
Description: Some mobile calculator headings wrap heavily and appear too large for their background context.  
Why it matters: Oversized text on narrow screens can reduce hierarchy and make the first viewport feel cramped.  
Recommendation: Use a mobile-specific heading scale for utility pages and avoid gradient text over complex imagery.  
Priority: P2  
Estimated Design Effort: Low

### DQA-009

Category: CRO  
Severity: Medium  
Page: Homepage  
Section: Hero  
Component: CTA cluster  
Description: The hero contains several strong actions close together: booking, WhatsApp, quote/calculator options, and calculator form interaction.  
Why it matters: Too many equivalent CTAs can slow decision-making.  
Recommendation: Establish one primary conversion action per viewport and make secondary actions visually quieter.  
Priority: P2  
Estimated Design Effort: Low

### DQA-010

Category: Component Design  
Severity: Medium  
Page: Calculator Detail Pages  
Section: Tables and Article Content  
Component: Data tables  
Description: Calculator informational tables are clean but feel more document-like than premium branded content.  
Why it matters: Tables are important SEO content, but visual density can reduce engagement and scanning.  
Recommendation: Add stronger table section headers, summary chips, zebra striping consistency, and mobile-friendly table card alternatives where needed.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-011

Category: Accessibility  
Severity: Medium  
Page: Global  
Section: Cards, Captions, Notes  
Component: Secondary text  
Description: Some supporting text, metadata, and note copy appears very light against pale backgrounds.  
Why it matters: Low-contrast supporting text can be difficult for users with low vision and reduces scannability.  
Recommendation: Increase neutral text contrast and reserve very light text only for decorative or non-essential metadata.  
Priority: P2  
Estimated Design Effort: Low

### DQA-012

Category: Layout  
Severity: Medium  
Page: Service Detail Pages  
Section: Mobile Hero and Lead Form  
Component: Trust chips and form block  
Description: On mobile, the service-detail lead form and trust chips occupy a large vertical area before users reach supporting content.  
Why it matters: The lead form is valuable, but excessive vertical stacking can make the page feel slow and heavy.  
Recommendation: Compact mobile trust chips into a two-column layout where possible and reduce vertical spacing between hero proof points and the form.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-013

Category: Imagery  
Severity: Medium  
Page: Service Detail Pages  
Section: Before / After  
Component: Comparison imagery  
Description: The before/after concept is strong, but it depends on high-quality, evenly cropped source images to feel convincing.  
Why it matters: Before/after sections are trust-building moments. Poorly matched crops can make the interaction feel less credible.  
Recommendation: Use matched-angle before/after project images with consistent lighting, scale, and composition.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-014

Category: Component Consistency  
Severity: Medium  
Page: Global  
Section: FAQ  
Component: Accordions  
Description: FAQ sections generally follow a consistent pattern, but page-specific spacing and visual density can vary.  
Why it matters: FAQ is a reusable conversion-support component and should feel identical across templates.  
Recommendation: Standardize FAQ width, item height, icon treatment, open state, and vertical rhythm across all page types.  
Priority: P2  
Estimated Design Effort: Low

### DQA-015

Category: Brand Consistency  
Severity: Low  
Page: Global  
Section: Header  
Component: Active navigation state  
Description: The active menu state is subtle compared with the strong orange CTA.  
Why it matters: Users should always know where they are, especially on multi-page service and calculator flows.  
Recommendation: Strengthen the active state with a small underline, pill highlight, or consistent accent treatment that does not compete with the CTA.  
Priority: P3  
Estimated Design Effort: Low

### DQA-016

Category: UX / Trust  
Severity: Low  
Page: Contact  
Section: Contact Cards  
Component: Social icons  
Description: Social icons appear clickable and visually prominent. If they are inactive or generic, they may create a trust gap.  
Why it matters: Contact pages are high-intent. Every interactive-looking element should increase confidence.  
Recommendation: Use real social links, reduce prominence, or remove inactive icons from the production design.  
Priority: P3  
Estimated Design Effort: Low

### DQA-017

Category: Color System  
Severity: Low  
Page: Global  
Section: CTAs and Highlights  
Component: Green/orange gradient text  
Description: Green-orange accent usage is energetic, but gradient text over image backgrounds can occasionally feel busy.  
Why it matters: Brand accents should guide attention, not reduce clarity.  
Recommendation: Reserve gradient accents for clean backgrounds. Use solid dark, green, or orange text on photographic sections.  
Priority: P3  
Estimated Design Effort: Low

### DQA-018

Category: Design System / WordPress Readiness  
Severity: Medium  
Page: Global  
Section: Reusable Sections  
Component: Section variants  
Description: The design has many reusable section types, but variant boundaries are not visually documented yet.  
Why it matters: Future WordPress, ACF, Elementor, or Gutenberg conversion will be smoother if each section has clear design rules.  
Recommendation: Create a section library covering hero variants, CTA strips, FAQ, calculator shells, project cards, testimonial cards, process steps, table blocks, and lead forms.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-019

Category: CRM Readiness  
Severity: Medium  
Page: Global  
Section: Lead Generation  
Component: Forms and conversion cards  
Description: Lead forms are strong visually, but CRM-style states such as success, error, loading, validation, and duplicate submission are not visible in the current design set.  
Why it matters: Production CRM flows require clear states to maintain confidence after submission.  
Recommendation: Design standardized form states for validation, loading, success confirmation, error recovery, and WhatsApp/contact alternatives.  
Priority: P2  
Estimated Design Effort: Medium

### DQA-020

Category: Page Coverage  
Severity: Suggestion  
Page: Gallery, Blog, 404, Thank You  
Section: Not observed  
Component: Page templates  
Description: These page types were not visible in the reviewed set.  
Why it matters: They may be needed for a complete production WordPress site, but no visual judgment can be made without designs.  
Recommendation: Add these templates to the design system only if they are part of the production scope.  
Priority: P3  
Estimated Design Effort: Medium

## Page-Specific Review

### Homepage

The homepage has the strongest overall design quality. The hero communicates savings clearly, uses warm solar imagery, and provides strong conversion paths. Desktop feels polished and conversion-ready. Mobile needs simplification because the hero, CTAs, badges, and calculator compete in the same vertical flow.

### About

The page direction is consistent with the broader site and should reuse the same header, CTA, FAQ, and footer patterns. The design should keep its content readable and avoid becoming too card-heavy.

### Services

The services page feels aligned with the brand and uses a clean service-card approach. It is suitable for WordPress service archive conversion. Card consistency and icon discipline should be maintained as more services are added.

### Service Detail Pages

Residential, commercial, and industrial detail pages have a strong landing-page structure: hero, proof points, lead form, benefits, process, projects, comparison, finance/subsidy, testimonials, FAQ, related services, CTA, and footer. This is a good conversion architecture. The main design improvements are mobile compaction, before/after image quality, and avoiding floating CTA overlap.

### Projects

The project listing structure is clear and scalable. The biggest design weakness is the lack of real project imagery in cards. For a solar company, project photography is one of the strongest trust signals and should be prioritized.

### Calculator Listing

The calculator listing is functional and useful for SEO. It should feel slightly more premium and closer to the homepage/service design system, especially in icon treatment, badges, and card CTAs.

### Calculator Detail Pages

Calculator pages are useful and conversion-friendly, but the visual quality varies. Cost calculator and price-list pages are improving, yet some tool layouts still feel denser and more utilitarian than the main brand pages. Result states, tables, and article sections should have a more unified design system.

### Contact

The contact page is clean, professional, and easy to understand. The contact cards and form structure are strong. Mobile layout is acceptable, with the main concern being floating WhatsApp overlap.

### Policy and Subsidy Information Pages

These pages should preserve readability first. Long-form content works best with strong headings, short paragraphs, callout boxes, and consistent section spacing. The subsidy information page benefits from calculator-style data blocks and should continue using structured tables/cards.

### Header

The header is polished and conversion-focused. The primary CTA is clear. Active navigation styling can be more obvious, especially as the site grows.

### Footer

The five-column footer with contact, service links, legal links, and map is strong for trust and local SEO. Ensure spacing and map presentation remain consistent on tablet and mobile.

## Design System Assessment

The project already contains the beginnings of a solid design system:

- Primary CTA: orange, high contrast, conversion-focused.
- Secondary brand color: green, strongly tied to renewable energy.
- Cards: white surfaces, rounded corners, soft shadows.
- Sections: hero, CTA, FAQ, process, project cards, calculator shell, footer.
- Typography: bold headings, friendly rounded feel, good marketing tone.

The next design maturity step is documentation and consolidation. Define component variants and spacing rules so future WordPress templates do not drift visually.

## Accessibility Assessment

The design is generally readable, with good button sizes and clear grouping. Main risks are:

- Text over image backgrounds on mobile.
- Low-contrast secondary text in cards and notes.
- Floating WhatsApp overlap.
- Visual reliance on color for some badges and result highlights.

These are fixable without changing the overall design direction.

## CRO Assessment

The site is conversion-focused. Strong elements include:

- Persistent header CTA.
- WhatsApp quick contact.
- Hero lead forms on service-detail pages.
- Savings and subsidy messaging.
- FAQ blocks near decision points.
- Calculator tools for high-intent users.

CRO can improve by reducing competing CTAs in crowded mobile sections and making project proof more visual and credible.

## WordPress and CRM Readiness

The design is suitable for future Headless WordPress, ACF flexible content, Gutenberg blocks, or Elementor templates. Recommended reusable blocks:

- Header / navigation
- Footer with map
- Hero variants
- Service card grid
- Calculator shell
- FAQ accordion
- CTA strip
- Project card
- Testimonial card
- Process timeline
- Subsidy / finance cards
- Long-form content table/card blocks
- Lead-generation form states

CRM readiness is promising, but form states need full visual coverage before production.

## Final Verdict

⚠ Production Ready with Minor Improvements

The design direction is strong, brand-appropriate, and commercially useful. It can move toward production, but the mobile hero density, calculator-page polish, project imagery, text contrast over images, and floating CTA overlap should be resolved to reach a truly premium production standard.
