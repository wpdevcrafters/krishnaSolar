---
name: pixelperfect-html
description: Convert website screenshots or Figma exports into production-ready, WordPress dynamic-ready, fully responsive, Bootstrap 5.3, Accessible (WCAG 2.1 AA), SEO-Friendly, Cross-Browser, Performance-Optimized, W3C-Valid, and clean commented HTML. Trigger this skill whenever the user shares a website screenshot, UI design image, Figma export, or mockup and wants it converted to HTML. Also trigger when the user asks to "build this page", "code this design", "make this responsive", "convert to HTML", or "create a WordPress-ready template" from any visual reference. Always use this skill even if the user only says "convert" or "make this into code" alongside an image.
---

# Pixel Perfect HTML Skill

## Objective

Whenever the user provides a website screenshot or UI design, convert it into production-ready HTML that:

- Matches the design with 99–100% visual accuracy
- Is structured to be made dynamic in WordPress without refactoring
- Meets professional web standards across all quality dimensions

---

## Pre-Coding Analysis Checklist

Before writing a single line of code, identify and document:

- Header / Navigation structure
- Hero / Banner sections
- Card and grid layouts
- Buttons and CTAs
- Icons and image placements
- Footer structure
- Background styles (color, gradient, image)
- Spacing (margins, padding, gaps)
- Typography hierarchy (H1–H6, body, captions)
- Interactive states (hover, focus, active)
- Repeating content patterns (loops → WordPress dynamic zones)
- Static vs. dynamic content (hardcoded text vs. CMS-controlled text)

---

## File Output Structure

Always generate these files:

```
index.html
assets/
  css/
    style.css
  js/
    main.js
  images/
    (all image assets or placeholders)
```

Never mix CSS or JS into HTML files.

---

## HTML Rules

### Structure & Semantics

- Use `<!DOCTYPE html>` with `<html lang="en">` always
- Use semantic HTML5 elements: `<header>`, `<nav>`, `<main>`, `<section>`, `<article>`, `<aside>`, `<footer>`
- One `<h1>` per page; follow strict heading hierarchy (H1 → H2 → H3)
- Never use `<div>` where a semantic element exists
- Never use inline styles
- Never use deprecated HTML tags (`<center>`, `<font>`, `<b>` for styling, etc.)
- Use `<button>` for actions, `<a>` for navigation — never swap them

### WordPress Dynamic-Ready Comments

Mark every region that will become dynamic with a WordPress placeholder comment before and after:

```html
<!-- WP: site_name / bloginfo('name') -->
<span class="brand-name">Brand Name</span>
<!-- /WP -->

<!-- WP: wp_nav_menu() -->
<ul class="navbar-nav">...</ul>
<!-- /WP -->

<!-- WP: the_title() -->
<h1 class="hero__title">Page Title</h1>
<!-- /WP -->

<!-- WP: the_content() -->
<div class="entry-content">...</div>
<!-- /WP -->

<!-- WP: Loop Start — get_template_part('template-parts/card') -->
<div class="card">...</div>
<!-- WP: Loop End -->

<!-- WP: get_sidebar() -->
<!-- WP: wp_footer() -->
```

### Section Comments

Open and close every major section with a clear comment:

```html
<!-- ========================================
     SECTION: Hero Banner
======================================== -->
<section class="hero" id="hero" aria-label="Hero Banner">
  ...
</section>
<!-- /SECTION: Hero Banner -->
```

### Class Naming Convention

Use BEM for custom classes to make WordPress template parts cleanly reusable:

```html
<div class="card card--featured">
  <div class="card__image">...</div>
  <div class="card__body">
    <h3 class="card__title">...</h3>
  </div>
</div>
```

### Complete `<head>` Boilerplate

Every page must open with this full `<head>` — never omit any block:

```html
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">

  <!-- SEO -->
  <title><!-- WP: wp_title() -->Page Title | Brand<!-- /WP --></title>
  <meta name="description" content="<!-- WP: the_excerpt() -->Page description<!-- /WP -->">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="<!-- WP: get_permalink() -->#<!-- /WP -->">

  <!-- Open Graph -->
  <meta property="og:type"        content="website">
  <meta property="og:url"         content="<!-- WP: get_permalink() -->#<!-- /WP -->">
  <meta property="og:title"       content="<!-- WP: the_title() -->Page Title<!-- /WP -->">
  <meta property="og:description" content="<!-- WP: the_excerpt() --><!-- /WP -->">
  <meta property="og:image"       content="<!-- WP: get_the_post_thumbnail_url() -->assets/images/og-image.jpg<!-- /WP -->">

  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="<!-- WP: the_title() -->Page Title<!-- /WP -->">
  <meta name="twitter:description" content="<!-- WP: the_excerpt() --><!-- /WP -->">
  <meta name="twitter:image"       content="<!-- WP: get_the_post_thumbnail_url() -->assets/images/og-image.jpg<!-- /WP -->">

  <!-- Favicon & PWA -->
  <link rel="icon"             type="image/svg+xml" href="assets/images/favicon.svg">
  <link rel="icon"             type="image/png"     href="assets/images/favicon.png" sizes="32x32">
  <link rel="apple-touch-icon"                      href="assets/images/apple-touch-icon.png">
  <link rel="manifest"                              href="site.webmanifest">
  <meta name="theme-color" content="#10b981">

  <!-- Font Preconnect & Load (Outfit) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700;800&display=swap">

  <!-- Preload LCP hero image — always set fetchpriority="high" on the above-fold image -->
  <link rel="preload" as="image" href="assets/images/hero.webp" fetchpriority="high">

  <!-- Bootstrap 5.3 -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

  <!-- Bootstrap Icons -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

  <!-- Swiper (include only when sliders exist on page) -->
  <link rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

  <!-- Custom Styles -->
  <link rel="stylesheet" href="assets/css/style.css">
</head>
```

### Icon-Only Button Accessibility Pattern

Every icon-only interactive element must have a visible label for screen readers. Never rely on the icon alone:

```html
<!-- ✅ Correct — icon hidden from AT, label announced -->
<a href="https://wa.me/91XXXXXXXXXX"
   class="whatsapp-btn btn btn-success rounded-circle d-flex align-items-center justify-content-center"
   aria-label="Chat with us on WhatsApp"
   target="_blank" rel="noopener noreferrer">
  <i class="bi bi-whatsapp fs-4" aria-hidden="true"></i>
</a>

<!-- ✅ Correct — mobile menu toggle -->
<button class="navbar-toggler" type="button"
        data-bs-toggle="offcanvas" data-bs-target="#navDrawer"
        aria-controls="navDrawer" aria-label="Open navigation menu">
  <span class="navbar-toggler-icon"></span>
</button>

<!-- ✅ Correct — social icon links in footer -->
<a href="#" aria-label="Follow us on Instagram" target="_blank" rel="noopener noreferrer">
  <i class="bi bi-instagram" aria-hidden="true"></i>
</a>
```

Rule: `aria-hidden="true"` on the `<i>` tag always; `aria-label` on the parent `<a>` or `<button>` always.

---

## CSS Rules (style.css)

### CSS Variables

Use the `--brand-*` naming prefix. Define all design tokens at `:root`. These are the established brand tokens — adapt hex values only slightly per project, never change the palette family (green primary, amber warning, blue/purple accents, slate dark):

```css
/* ==========================================================================
   CSS Variables & Base Config
   ========================================================================== */
:root {
    /* Brand Colors */
    --brand-success:       #10b981;   /* Primary Green */
    --brand-success-dark:  #059669;
    --brand-warning:       #f59e0b;   /* Solar Yellow / Orange CTA */
    --brand-warning-hover: #d97706;
    --brand-primary:       #3b82f6;   /* Blue Accent */
    --brand-purple:        #8b5cf6;   /* Industrial / Secondary Accent */
    --brand-dark:          #0f172a;   /* Near-black text & dark UI */

    /* Typography */
    --font-family-base:    'Outfit', sans-serif;
    --font-size-base:      1rem;
    --line-height-base:    1.6;

    /* Spacing scale */
    --space-xs:  0.25rem;
    --space-sm:  0.5rem;
    --space-md:  1rem;
    --space-lg:  1.5rem;
    --space-xl:  3rem;

    /* Border Radius */
    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;

    /* Shadows */
    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08);
    --shadow-md: 0 4px 12px rgba(0,0,0,0.12);
    --shadow-lg: 0 10px 25px rgba(0,0,0,0.10);

    /* Transitions */
    --transition-fast: 0.15s ease;
    --transition-base: 0.3s ease;
}

body {
    font-family: var(--font-family-base);
    color: #334155;
    background-color: #f8fafc;
}

*, *::before, *::after {
    box-sizing: border-box;
}
```

### Typography & Utility Classes

Always include these utility extensions after `:root`:

```css
/* ==========================================================================
   Typography & Utilities
   ========================================================================== */

/* Fluid headings — use clamp() for all heading sizes */
h1, .display-4 { font-size: clamp(2rem,   4vw,  3.5rem); }
h2              { font-size: clamp(1.75rem, 3vw,  2.5rem); }
h3              { font-size: clamp(1.5rem,  2.5vw, 2rem); }

/* Extra font-size utilities Bootstrap doesn't provide */
.fs-7 { font-size: 0.875rem !important; } /* 14px */
.fs-8 { font-size: 0.75rem  !important; } /* 12px */

/* Color utility overrides — always use !important to beat Bootstrap */
.text-success  { color: var(--brand-success)  !important; }
.text-warning  { color: var(--brand-warning)  !important; }
.text-purple   { color: var(--brand-purple)   !important; }
.text-primary-dark { color: var(--brand-dark) !important; }

.bg-success { background-color: var(--brand-success) !important; }
.bg-warning { background-color: var(--brand-warning) !important; }

/* Button overrides — always pair fill + hover states */
.btn-success {
    background-color: var(--brand-success);
    border-color: var(--brand-success);
}
.btn-success:hover {
    background-color: var(--brand-success-dark);
    border-color: var(--brand-success-dark);
}

.btn-warning {
    background-color: var(--brand-warning);
    border-color: var(--brand-warning);
    color: #fff;
}
.btn-warning:hover {
    background-color: var(--brand-warning-hover);
    border-color: var(--brand-warning-hover);
}

.btn-outline-success {
    color: var(--brand-success);
    border-color: rgba(16, 185, 129, 0.15);
    background-color: #f8fdf8;
}
.btn-outline-success:hover {
    color: #fff;
    background-color: var(--brand-success);
    border-color: var(--brand-success);
}

.btn-white {
    color: var(--brand-dark);
    background-color: #ffffff;
    border: 1px solid rgba(15, 23, 42, 0.08);
}
.btn-white:hover { background-color: #f8fafc; }

/* Interaction utilities */
.hover-lift {
    transition: transform var(--transition-base), box-shadow var(--transition-base);
}
.hover-lift:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg) !important;
}

.backdrop-blur { backdrop-filter: blur(10px); }
```

### Header / Navbar Pattern

The header starts transparent and gains a frosted-glass background on scroll. Always wire the `.scrolled` class via JS:

```css
/* ==========================================================================
   Header & Navbar
   ========================================================================== */
.header {
    background-color: transparent;
    transition: background-color var(--transition-base), box-shadow var(--transition-base);
}
.header.scrolled {
    background-color: rgba(255,255,255,0.96) !important;
    box-shadow: 0 0.125rem 0.25rem rgba(15,23,42,0.12) !important;
    backdrop-filter: blur(16px);
    border-bottom: 1px solid rgba(15,23,42,0.05);
    z-index: 9999;
}

.navbar-nav .nav-link {
    color: var(--brand-dark);
    font-size: 0.95rem;
    padding: 0.5rem 1rem;
    transition: color var(--transition-fast);
}
.navbar-nav .nav-link:hover,
.navbar-nav .nav-link.active { color: var(--brand-warning) !important; }

.navbar-toggler:focus { box-shadow: none !important; }
```

### Stats Banner Pattern

Amber-to-orange gradient bar; divide columns with a faint right border:

```css
/* ==========================================================================
   Stats Banner
   ========================================================================== */
.stats-banner {
    background: linear-gradient(90deg, #f59e0b, #f97316);
    color: #fff;
    padding: 1rem;
    --bs-gutter-x: 0;
}
.stats-col {
    flex: 0 0 20%;
    max-width: 20%;
    padding: 0 0.75rem;
    border-right: 2px solid rgba(233,136,20,0.35);
}
.stats-col:last-child { border-right: none; }
.stats-icon {
    width: 58px;
    height: 58px;
    background: rgba(255,255,255,0.08);
}
.stats-item:hover { transform: translateY(-4px); transition: transform var(--transition-base); }
```

### Solution / Feature Cards Pattern

Four tinted card variants using 8–10% brand-color backgrounds:

```css
/* ==========================================================================
   Solution Cards
   ========================================================================== */
.solution-card {
    border: 1px solid rgba(15,23,42,0.06);
    background: rgba(255,255,255,0.9);
    transition: transform var(--transition-base), box-shadow var(--transition-base),
                border-color var(--transition-base);
    overflow: hidden;
}
.solution-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 45px rgba(15,23,42,0.12);
    border-color: rgba(15,23,42,0.12);
}

/* Tinted variants — add one class per card theme */
.solution-card--green  { background: rgba(16,  185, 129, 0.08); }
.solution-card--blue   { background: rgba(59,  130, 246, 0.08); }
.solution-card--purple { background: rgba(139,  92, 246, 0.08); }
.solution-card--yellow { background: rgba(245, 158,  11, 0.10); }
```

### CTA Banner Pattern

Full-bleed image with a green-to-amber gradient overlay:

```css
/* ==========================================================================
   CTA Banner
   ========================================================================== */
.cta-banner {
    background: url('../images/cta-bg.webp') no-repeat center center / cover;
}
.cta-overlay {
    background: linear-gradient(90deg,
        rgba(16,185,129,0.90) 0%,
        rgba(245,158,11,0.80) 100%);
}
```

### Form Input Focus States

Always match focus ring to brand green:

```css
/* ==========================================================================
   Form Focus Overrides
   ========================================================================== */
.form-control:focus,
.form-select:focus {
    box-shadow: none;
    border-color: var(--brand-success);
    background-color: #fff !important;
}
.form-range { accent-color: var(--brand-success); }
.form-range::-webkit-slider-thumb { background: var(--brand-success); }
.form-range::-moz-range-thumb     { background: var(--brand-success); }
```

### Additional CSS Rules

- Mobile-first: write base styles for mobile, override upward with `min-width` queries
- All hover, focus, and active states must be explicitly defined
- Use `transition: var(--transition-base)` on every interactive element
- Never use `!important` unless overriding a Bootstrap utility or specificity conflict
- Comment every logical CSS block with the section header pattern shown above
- **Never scatter `@media` rules inside component blocks** — see Responsive Organization below

---

## JS Rules (main.js)

`main.js` is always required. Never leave it empty. Load it before `</body>` with `defer`.

### Standard Init Block

Every project must include these three behaviors at minimum:

```js
'use strict';

/* ==========================================================================
   Scrolled Header — adds .scrolled for frosted-glass effect
   ========================================================================== */
(function () {
    const header = document.querySelector('.header');
    if (!header) return;

    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load in case page is already scrolled
})();

/* ==========================================================================
   Offcanvas Mobile Nav — submenu accordion toggle
   ========================================================================== */
(function () {
    document.querySelectorAll('#navDrawer .has-submenu > .nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const item = link.closest('.has-submenu');
            const isOpen = item.classList.contains('open');

            // Close all siblings first
            item.closest('ul')?.querySelectorAll('.has-submenu.open').forEach(el => {
                if (el !== item) el.classList.remove('open');
            });

            item.classList.toggle('open', !isOpen);
            link.setAttribute('aria-expanded', String(!isOpen));
        });
    });
})();

/* ==========================================================================
   Smooth Scroll — internal anchor links
   ========================================================================== */
(function () {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', e => {
            const target = document.querySelector(anchor.getAttribute('href'));
            if (!target) return;
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });
    });
})();
```

### Swiper.js Initialization Pattern

Use Swiper whenever the design includes a carousel, testimonial slider, or project gallery. Always configure `autoHeight` and responsive breakpoints:

```js
/* ==========================================================================
   Swiper — Testimonials Slider
   ========================================================================== */
(function () {
    const el = document.querySelector('.swiper-testimonials');
    if (!el) return;

    new Swiper(el, {
        loop: true,
        autoHeight: true,           // equal-height slides without fixed height CSS hacks
        spaceBetween: 24,
        grabCursor: true,
        a11y: {
            prevSlideMessage: 'Previous testimonial',
            nextSlideMessage: 'Next testimonial',
        },
        breakpoints: {
            0:   { slidesPerView: 1 },
            768: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
        },
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
        navigation: {
            nextEl: '.swiper-button-next',
            prevEl: '.swiper-button-prev',
        },
    });
})();

/* ==========================================================================
   Swiper — Projects Gallery (with filter tabs if needed)
   ========================================================================== */
(function () {
    const el = document.querySelector('.swiper-projects');
    if (!el) return;

    new Swiper(el, {
        loop: false,
        slidesPerView: 1,
        spaceBetween: 20,
        grabCursor: true,
        breakpoints: {
            576: { slidesPerView: 2 },
            992: { slidesPerView: 3 },
            1200: { slidesPerView: 4 },
        },
        pagination: { el: '.swiper-pagination', clickable: true },
    });
})();
```

### Swiper CDN (add before `</body>`, after Bootstrap JS)

```html
<!-- Swiper JS — only include on pages that use sliders -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>
```

### JS Rules Summary

- Wrap every feature in an IIFE `(function () { ... })()` to avoid global scope pollution
- Always guard with `if (!el) return` before calling any DOM method
- Use `{ passive: true }` on scroll and touch event listeners
- Load order before `</body>`: Bootstrap Bundle → Swiper → `main.js`
- Never use jQuery unless the project explicitly requires it

---

## Accessibility (WCAG 2.1 AA)

- Add `aria-label`, `aria-labelledby`, `aria-describedby` where needed
- Every `<img>` must have a descriptive `alt` attribute; decorative images use `alt=""`
- All form inputs must have associated `<label>` elements
- Interactive elements must be keyboard-navigable and show visible focus styles
- Color contrast must meet 4.5:1 for normal text, 3:1 for large text and UI components
- Include a skip-to-content link as the very first element inside `<body>`:

```html
<a class="skip-link visually-hidden-focusable" href="#main-content">
  Skip to main content
</a>
```

- Use `role="navigation"`, `role="banner"`, `role="main"`, `role="contentinfo"` on landmark elements
- Add `aria-current="page"` to the active nav link
- Use `aria-expanded`, `aria-controls` on toggles, offcanvas, and accordions
- Never remove `:focus` outline — replace it with a visible custom style:

```css
:focus-visible {
    outline: 2px solid var(--brand-success);
    outline-offset: 3px;
}
```

- All icon-only elements must follow the `aria-hidden` + `aria-label` pattern (see HTML Rules above)
- `prefers-reduced-motion` must be respected — all transitions and hover transforms disabled for users who request it (see Responsive Organization section)

---

## SEO

The full `<head>` meta block is defined in HTML Rules above. Additional SEO rules:

- Heading hierarchy must be strict: one `<h1>` per page, H2 for sections, H3 for cards
- All images must have descriptive `alt` text — never empty on content images
- Use descriptive, keyword-meaningful anchor text; never "click here" or "read more" alone
- Add a `<link rel="canonical">` on every page
- Internal links must use relative paths; external links use `target="_blank" rel="noopener noreferrer"`

### JSON-LD Structured Data

Include a `<script type="application/ld+json">` block in `<head>` for every page. Match the `@type` to the page content:

```html
<!-- LocalBusiness — use on homepage and contact page -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "<!-- WP: bloginfo('name') -->SolarNest<!-- /WP -->",
  "url": "<!-- WP: home_url() -->#<!-- /WP -->",
  "logo": "<!-- WP: get_custom_logo_url() -->assets/images/logo.svg<!-- /WP -->",
  "telephone": "+91-XXXXXXXXXX",
  "email": "info@example.com",
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "",
    "addressLocality": "<!-- WP: ACF city field -->",
    "addressRegion": "West Bengal",
    "postalCode": "",
    "addressCountry": "IN"
  },
  "openingHours": "Mo-Sa 09:00-18:00",
  "sameAs": [
    "https://www.facebook.com/",
    "https://www.instagram.com/"
  ]
}
</script>

<!-- BreadcrumbList — use on all inner pages -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": "<!-- WP: home_url() -->#<!-- /WP -->"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "<!-- WP: the_title() -->Page Name<!-- /WP -->",
      "item": "<!-- WP: get_permalink() -->#<!-- /WP -->"
    }
  ]
}
</script>

<!-- FAQPage — use when FAQ accordion is present -->
<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "<!-- WP: ACF faq_question -->How much does solar cost?<!-- /WP -->",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "<!-- WP: ACF faq_answer -->Answer text here.<!-- /WP -->"
      }
    }
  ]
}
</script>
```

---

## Performance Optimization

### Images

- Use `loading="lazy"` on all below-the-fold images
- Use `<picture>` with WebP + fallback for all content images:

```html
<picture>
  <source srcset="assets/images/hero.webp" type="image/webp">
  <img src="assets/images/hero.jpg" alt="Hero image" width="1200" height="600" loading="lazy">
</picture>
```

- Always set `width` and `height` attributes to prevent layout shift (CLS)
- Preload the hero/LCP image:

```html
<link rel="preload" as="image" href="assets/images/hero.webp">
```

### Scripts & Styles

Always use this exact `</body>` closing block — order matters:

```html
  <!-- Bootstrap Bundle (includes Popper) -->
  <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>

  <!-- Swiper — only on pages with sliders -->
  <script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>

  <!-- Custom JS — always last -->
  <script src="assets/js/main.js" defer></script>
</body>
```

Font loading rules:
- Always use `font-display: swap` — Google Fonts appends this automatically when `&display=swap` is in the URL
- Preconnect to font origins before the stylesheet `<link>` (already in `<head>` boilerplate)
- Never `@import` fonts inside CSS — it blocks rendering

LCP image rules:
- The above-the-fold hero image must have `fetchpriority="high"` and `loading="eager"` (never `lazy`)
- All other images use `loading="lazy"` and explicit `width` / `height` to prevent CLS

### Core Web Vitals Targets

- LCP < 2.5s: Preload hero image, minimize render-blocking resources
- CLS < 0.1: Always set explicit image dimensions, reserve space for dynamic content
- INP < 200ms: Defer non-critical JS, minimize main thread work

---

## Bootstrap 5.3 Usage

- Use Bootstrap 5.3 utility classes (`d-flex`, `gap-3`, `py-5`, `text-center`, etc.) for all layout and spacing
- Use Bootstrap grid (`container`, `row`, `col-*`) for all multi-column layouts
- Use Bootstrap components (Navbar, Card, Modal, Accordion, Offcanvas) where they match the design
- Only write custom CSS when Bootstrap cannot achieve the design requirement
- Never duplicate Bootstrap utilities in `style.css`
- Use Bootstrap's built-in dark mode support (`data-bs-theme="dark"`) where applicable

---

## Responsive Breakpoints & Organization

### Breakpoint Reference

Follow Bootstrap's breakpoint system:

| Breakpoint | Min-width  | Common use                          |
|------------|-----------|-------------------------------------|
| xs         | < 576px   | Phones (375px base target)          |
| sm         | ≥ 576px   | Large phones                        |
| md         | ≥ 768px   | Tablets                             |
| lg         | ≥ 992px   | Small laptops                       |
| xl         | ≥ 1200px  | Desktops                            |
| xxl        | ≥ 1400px  | Wide screens (1440px base target)   |

Mentally test every section at: **375px · 768px · 1200px · 1440px** before finalizing.

### ⚠️ Responsive Organization Rule — CRITICAL

**All `@media` rules must be consolidated at the very end of `style.css` in a single dedicated block.** Never scatter breakpoints inside component CSS blocks.

**Wrong — scattered (never do this):**
```css
.hero-section { min-height: 100vh; }
@media (max-width: 768px) { .hero-section { padding-top: 120px; } }  /* ❌ */

.stats-col { flex: 0 0 20%; }
@media (max-width: 767px) { .stats-col { flex: 0 0 50%; } }          /* ❌ */
```

**Correct — consolidated at the end:**
```css
/* ---- component styles ---- */
.hero-section { min-height: 100vh; }
.stats-col    { flex: 0 0 20%; max-width: 20%; }

/* ---- ... all other component blocks ... ---- */


/* ==========================================================================
   RESPONSIVE OVERRIDES
   All breakpoints consolidated here — edit this section only for layout fixes
   ========================================================================== */

/* --------------------------------------------------
   ≤ 1199px  (xl breakpoint — large desktop cutoff)
   -------------------------------------------------- */
@media (max-width: 1199px) {
    /* xl-specific overrides */
}

/* --------------------------------------------------
   ≤ 991px  (lg breakpoint — tablet landscape / small laptop)
   -------------------------------------------------- */
@media (max-width: 991px) {
    .hero-section {
        padding-top: 3rem;
        padding-bottom: 3rem;
    }
    .solution-card-body {
        flex-direction: column !important;
        text-align: center;
    }
    .process-line { display: none !important; }
}

/* --------------------------------------------------
   ≤ 767px  (md breakpoint — tablet portrait)
   -------------------------------------------------- */
@media (max-width: 767px) {
    .stats-col {
        flex: 0 0 50%;
        max-width: 50%;
        border-right: none;
    }
    .stats-banner { padding: 0.75rem; }
    .stats-banner .stats-item h3 { font-size: 1.1rem; }
    .stats-icon { width: 46px; height: 46px; }
}

/* --------------------------------------------------
   ≤ 768px  (mobile — phones in landscape / small tablets)
   -------------------------------------------------- */
@media (max-width: 768px) {
    .hero-section {
        min-height: auto;
        padding-top: 120px !important;
        padding-bottom: 3rem;
    }
    .hero-copy { padding-right: 0 !important; }
    .hero-card { margin-top: 2rem; }
    .trust-badges { flex-direction: column; width: 100%; }
}

/* --------------------------------------------------
   ≤ 576px  (xs breakpoint — small phones)
   -------------------------------------------------- */
@media (max-width: 576px) {
    .fixed-whatsapp { right: 0.75rem; bottom: 0.75rem; }
}

/* --------------------------------------------------
   prefers-reduced-motion — WCAG 2.3 compliance
   Must always be the LAST block in this section
   -------------------------------------------------- */
@media (prefers-reduced-motion: reduce) {
    *,
    *::before,
    *::after {
        animation-duration:        0.01ms !important;
        animation-iteration-count: 1      !important;
        transition-duration:       0.01ms !important;
        scroll-behavior:           auto   !important;
    }

    /* Disable specific lift/slide effects */
    .hover-lift:hover        { transform: none; box-shadow: none !important; }
    .solution-card:hover     { transform: none; }
    .stats-item:hover        { transform: none; }
    .header                  { transition: none; }
}
```

**Why this matters:** Scattered breakpoints create maintenance debt — you end up with 3–5 conflicting rules for the same element spread across hundreds of lines. The consolidated block makes every layout change findable in one place and prevents accidental specificity fights.

---

## Cross-Browser Compatibility

- Target: Chrome, Firefox, Safari, Edge (last 2 versions); IE11 not required
- Use `-webkit-` prefixes on properties that need them (e.g., `-webkit-text-size-adjust`)
- Test Flexbox and Grid usage against Can I Use
- Use `@supports` for progressive enhancement of cutting-edge CSS
- Avoid cutting-edge CSS properties without fallbacks
- Include `<meta http-equiv="X-UA-Compatible" content="IE=edge">` in `<head>`

---

## W3C Validation Rules

- Validate against https://validator.w3.org standards before finalizing
- No unclosed tags
- No duplicate `id` attributes on a page
- All attributes must be quoted
- No block elements inside inline elements
- Boolean attributes written correctly (`disabled`, not `disabled="disabled"`)
- `<img>` must always have `alt`
- `aria-*` attributes only used on valid roles
- No deprecated attributes (`border=""` on tables, `align=""`, etc.)

---

## Images (Placeholders)

When image assets are unavailable:

- Use `https://placehold.co/{width}x{height}` with exact design dimensions
- Add descriptive `alt` text even for placeholders
- Comment each placeholder with the intended image description:

```html
<!-- IMAGE: Hero background — full-width landscape photo of city skyline -->
<img src="https://placehold.co/1440x700" alt="City skyline hero image"
     width="1440" height="700" class="img-fluid" loading="eager">
```

---

## WordPress Dynamic-Ready Architecture

### Template File Mapping

Structure every HTML section as a direct WordPress template part:

| HTML Section | WordPress File / Function |
|---|---|
| `<head>` | `header.php` + `wp_head()` |
| `<header>` navbar | `header.php` + `wp_nav_menu()` |
| Hero section | `template-parts/hero.php` |
| Stats banner | `template-parts/stats-banner.php` + ACF options |
| Solar solution cards | `template-parts/solution-card.php` in loop |
| Calculator | `template-parts/calculator.php` (static JS widget) |
| Site survey form | `template-parts/form-survey.php` (Contact Form 7) |
| Project cards | `template-parts/card-project.php` in `WP_Query` loop |
| Testimonials | `template-parts/card-testimonial.php` in loop |
| FAQ accordion | `template-parts/faq-item.php` in loop |
| Sidebar | `get_sidebar()` → `sidebar.php` |
| `<footer>` | `footer.php` + `wp_footer()` |
| Widget areas | `dynamic_sidebar('footer-widgets')` |

### WP Comment Conventions

Every dynamic text node, image, link, or loop needs a comment pair:

```html
<!-- WP: bloginfo('name') -->SolarNest<!-- /WP -->
<!-- WP: the_title() -->Page Title<!-- /WP -->
<!-- WP: the_content() --><!-- /WP -->
<!-- WP: the_post_thumbnail('full') -->
    <img src="https://placehold.co/400x260" alt="Project photo" ...>
<!-- /WP -->

<!-- WP: Loop Start — WP_Query projects, tax: project-type -->
<div class="card card-project">
    <div class="card__image">
        <!-- WP: the_post_thumbnail('project-thumb') -->
        <img src="https://placehold.co/400x260" alt="Project photo" ...>
        <!-- /WP -->
    </div>
    <div class="card__body">
        <h3 class="card__title"><!-- WP: the_title() -->Project Name<!-- /WP --></h3>
        <p><!-- WP: get_field('project_location') -->Location<!-- /WP --></p>
        <span><!-- WP: get_field('annual_savings') -->₹65,000<!-- /WP --></span>
    </div>
</div>
<!-- WP: Loop End -->

<!-- WP: CPT 'sn_testimonial' — register_post_type('sn_testimonial')
     ACF fields: reviewer_name, reviewer_city, reviewer_photo, rating, review_text, system_size -->

<!-- WP: CPT 'sn_faq' — register_post_type('sn_faq')
     ACF fields: faq_question, faq_answer -->
```

### Asset Enqueueing

When converting to a WordPress theme, CDN `<link>` and `<script>` tags in HTML become `wp_enqueue_*` calls in `functions.php`. Mark each CDN line:

```html
<!-- WP: wp_enqueue_style('bootstrap') -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">

<!-- WP: wp_enqueue_style('bootstrap-icons') -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css">

<!-- WP: wp_enqueue_style('swiper') -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.css">

<!-- WP: wp_enqueue_style('solarnest-style') — get_stylesheet_uri() -->
<link rel="stylesheet" href="assets/css/style.css">

<!-- WP: wp_enqueue_script('bootstrap-bundle') -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js" defer></script>

<!-- WP: wp_enqueue_script('swiper') -->
<script src="https://cdn.jsdelivr.net/npm/swiper@11/swiper-bundle.min.js" defer></script>

<!-- WP: wp_enqueue_script('solarnest-main') — get_theme_file_uri('assets/js/main.js') -->
<script src="assets/js/main.js" defer></script>
```

### Additional WP Rules

- Use `id` and `class` names that are WP-hook-friendly — no spaces, no capital letters, hyphens only
- Every hardcoded phone, email, and address must have an ACF Options Page comment
- Contact Form 7 shortcode placeholder: `<!-- WP: do_shortcode('[contact-form-7 id="..."]') -->`
- Google Maps embed: `<!-- WP: ACF google_map field or iframe from options -->`
- Keep every section self-contained — it should be liftable into `get_template_part()` without restructuring

---

## Quality Checklist

Before delivering, verify every item:

**HTML**
- ✅ Pixel Perfect — matches design at all breakpoints (375 · 768 · 1200 · 1440px)
- ✅ Semantic HTML5 — correct elements, single `<h1>`, strict heading hierarchy
- ✅ No Inline Styles — zero `style=""` attributes anywhere in HTML
- ✅ No Deprecated Tags — modern HTML5 only
- ✅ Complete `<head>` — charset, viewport, SEO meta, OG, favicon, manifest, theme-color
- ✅ Icon-only elements — `aria-hidden="true"` on `<i>`, `aria-label` on parent

**CSS**
- ✅ CSS Variables — all tokens defined in `:root` with `--brand-*` prefix
- ✅ Outfit font loaded — `&display=swap` in Google Fonts URL
- ✅ Responsive — all `@media` rules consolidated at end of `style.css`, ordered xl → xs
- ✅ `prefers-reduced-motion` — last block in responsive section, disables all transforms

**JavaScript**
- ✅ `main.js` generated — scrolled header, offcanvas submenu, smooth scroll at minimum
- ✅ Swiper initialized — `autoHeight`, `a11y`, responsive `breakpoints` configured
- ✅ Script load order — Bootstrap Bundle → Swiper → `main.js`, all with `defer`

**WordPress**
- ✅ WP Comments — every dynamic text, image, menu, and loop has `<!-- WP: -->` markers
- ✅ CPT Comments — Projects, Testimonials, FAQ marked with `register_post_type` notes
- ✅ ACF Comments — repeating fields (stats, cards, FAQ) marked with `get_field()` / `get_sub_field()`
- ✅ Asset Comments — every CDN `<link>` and `<script>` tagged with `wp_enqueue_*` equivalent
- ✅ Template Parts — each section self-contained for `get_template_part()` extraction

**Standards**
- ✅ Bootstrap 5.3 — utilities and components used correctly, no duplication in CSS
- ✅ Accessible — WCAG 2.1 AA, ARIA landmarks, keyboard navigable, skip link, focus-visible
- ✅ SEO — meta, OG, Twitter Card, canonical, JSON-LD schema, keyword anchor text
- ✅ Cross-Browser — Chrome, Firefox, Safari, Edge (last 2 versions)
- ✅ Performance — lazy loading, WebP `<picture>`, `fetchpriority="high"` on LCP, explicit dimensions
- ✅ W3C Valid — no unclosed tags, no duplicate IDs, no deprecated attributes
