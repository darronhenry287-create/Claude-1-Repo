# Apex — Universal DTC Shopify Theme

A flagship Shopify Online Store 2.0 theme engineered for direct-to-consumer brands of every category. Apex ships with a deep section library, an unlimited colour-scheme system, and zero external dependencies — so stores load fast and look exactly the way merchants intend.

---

## Why Apex beats the competition

### Customisation architecture

**Unlimited colour schemes, applied per section.** Every section accepts a `color_scheme` setting that re-themes its entire subtree using CSS custom-property inheritance. Switch any section between five built-in schemes (or create new ones) from the Shopify customizer without writing a line of CSS. Competitors hard-code colours into sections or limit schemes to two or three.

**Per-section padding controls.** Every content section exposes `padding_top` and `padding_bottom` range controls (0–160 px). Merchants compose tight, breathing, or flush layouts without workarounds.

**Multi-preset sections.** Every section ships with sensible default presets so dropping it onto a page takes one click.

### Section library

Apex ships 45+ purpose-built sections covering every DTC page type. See the full catalog below.

### Performance

- **No jQuery.** `base.js` is vanilla ES2021 (~8 kb gzip) covering drawers, modals, sliders, accordions, tabs, quantity steppers, quick-add, variant picker, countdown, and predictive search.
- **Lazy media.** All below-fold images carry `loading="lazy"` with correct `widths`/`sizes` attributes.
- **Section Rendering API ready.** Sections are self-contained (markup + schema + scoped `{% stylesheet %}`) so Shopify's Section Rendering API can re-render individual sections without full page reloads.
- **`prefers-reduced-motion` respected.** The `.reveal` scroll animation system respects the media query; users who prefer reduced motion see no layout shift.

### Accessibility

- Semantic HTML throughout (`<section>`, `<article>`, `<nav>`, `<header>`, `<aside>`, `<address>`).
- All interactive elements have visible focus styles (`box-shadow: var(--focus)`).
- Icon buttons carry `aria-label`; decorative icons use `aria-hidden="true"`.
- Forms use `<label>` for every control; errors use `role="alert"`.

---

## Section catalog

### Layout & navigation
| Section | Description |
|---------|-------------|
| `header` | Sticky/static top bar with logo, mega-menu, search, cart, account icons |
| `footer` | Block-based footer: brand column, menu columns, newsletter, payment icons |
| `announcement-bar` | Slim top bar for promos, free-shipping thresholds, or site notices |
| `cart-drawer` | Slide-in cart with free-shipping progress bar, upsell slot, and note field |
| `sticky-add-to-cart` | Scrolls into view once the main ATC button leaves the viewport |
| `predictive-search` | Instant-search overlay powered by the Storefront Search API |

### Heroes & media
| Section | Description |
|---------|-------------|
| `hero` | Full-bleed hero with video/image background, overlay, blocks (heading, text, buttons, rating) |
| `slideshow` | Multi-slide hero carousel with auto-play, swipe, and per-slide blocks |
| `image-banner` | Single image or video banner, text overlay, height options |
| `video` | Cover-image poster + play-button opening a modal for YouTube, Vimeo, or MP4 |
| `collage` | Pinterest-style mosaic of image, product, and video tiles in a 12-column grid |
| `gallery` | Configurable image grid (2–4 cols) with optional captions and lightbox-style link overlay |
| `before-after` | Drag-slider comparing two images — perfect for transformation results |

### Products & collections
| Section | Description |
|---------|-------------|
| `featured-collection` | Grid or carousel of products from a chosen collection, with view-all CTA |
| `featured-product` | Full product form on any page: images, variant picker, ATC, description |
| `main-collection` | Collection page: filtering sidebar, sort bar, product grid with pagination |
| `main-product` | Product detail page with media gallery, variant picker, ATC, reviews, tabs |
| `main-search` | Search results page with filtering and grid layout |
| `main-cart` | Full cart page with line items, qty steppers, notes, and checkout |
| `main-list-collections` | All-collections grid with collection images and titles |
| `collection-list` | Curated collection tiles — highlight categories on any page |
| `related-products` | Algorithm-driven or manual related-products row |
| `bundle` | Side-by-side bundle builder: image + item list + combined price + CTA |
| `pricing-table` | Comparison pricing tiers with feature lists and CTA per plan |

### Editorial & brand
| Section | Description |
|---------|-------------|
| `image-with-text` | 50/50 image + rich-text block with block system (heading, text, buttons, badges) |
| `rich-text` | Centered or left text block for brand statements, announcements, body copy |
| `multicolumn` | 2–5 icon-or-image columns for features, USPs, or category links |
| `icon-bar` | Horizontal trust bar (shipping, returns, guarantee, eco) with icons + text |
| `steps` | Numbered how-it-works flow with step connectors and optional icons/images |
| `countdown` | Urgency countdown timer block |
| `tabbed-content` | Tabs with rich-text or product content per panel |
| `quote` | Pull-quote or editorial blockquote with attribution |

### Social proof
| Section | Description |
|---------|-------------|
| `testimonials` | Slider or grid of customer review cards with rating stars and verified badge |
| `review-wall` | Masonry/grid wall of short review quotes |
| `stats` | Key metric counters (250K customers, 4.9 stars, 98% recommend…) |
| `logo-list` | "As seen in" press logo row or marquee |
| `rating` (snippet) | Star-rating display, reused across sections |

### Conversion
| Section | Description |
|---------|-------------|
| `comparison` | Feature-comparison table: your brand vs up to two competitors |
| `faq` | Accordion-style FAQ with optional two-column layout |
| `newsletter` | Two-column email capture with Klaviyo/Shopify customer form |
| `contact-form` | Contact form with optional info column (email, phone, address, map embed) |

### Blog
| Section | Description |
|---------|-------------|
| `main-blog` | Blog index: article card grid with pagination, tag filters |
| `main-article` | Article page: hero image, meta, content, tags, share, prev/next, comments |
| `blog-posts` | Featured articles from a chosen blog — use on any page |

### Marquees
| Section | Description |
|---------|-------------|
| `marquee-text` | Infinite-scroll text ticker for social proof messages or brand slogans |

---

## Install instructions

1. Download or export the theme as a `.zip` file.
2. In your Shopify admin, go to **Online Store > Themes**.
3. Click **Upload theme** and select the zip.
4. Once uploaded, click **Customize** to open the editor, or **Publish** to make it live.

---

## Customisation guide

### Colour schemes

Navigate to **Theme settings > Colors**. Apex ships with five named schemes:

| Scheme | Character |
|--------|-----------|
| Scheme 1 | Clean white — default sections |
| Scheme 2 | Light grey — alternate sections for visual rhythm |
| Scheme 3 | Dark navy — high-contrast, premium feel |
| Scheme 4 | Deep black with amber accent |
| Scheme 5 | Full accent (brand colour background) |

Each section has a **Color scheme** setting in the sidebar. Mix schemes across sections to create a dynamic page rhythm — a common pattern is 1 / 2 / 1 / 3 / 1 / 2.

### Typography

Go to **Theme settings > Typography** to pick heading and body fonts from Shopify's font library. Adjust weight, size, line height, and the modular scale ratio that controls heading hierarchy automatically.

### Layout & shape

**Theme settings > Layout** controls max page width (1000–1600 px) and side gutters. **Shape & style** controls button radius, card radius, input radius, border width, and shadow strength — change them once and every component updates.

### Presets

Each section ships with at least one preset (some have more). When adding a section from the **Add section** panel, Apex's presets pre-populate sensible default blocks and settings so you never start from a blank slate.

---

## Static demo

A standalone HTML preview of the Apex homepage (no Shopify server required) lives at:

```
apex/demo/index.html
```

Open it in any browser to see the design system, colour schemes, and component classes in action.

---

## Developer notes

- All section-specific CSS ships inside `{% stylesheet %}` blocks — scoped to that section and de-duplicated by Shopify.
- Token variables (`--bg`, `--accent`, `--radius-card`, etc.) are documented in `assets/base.css` and injected per scheme by `snippets/css-variables.liquid`.
- `base.js` JS hook points are documented in `docs/THEME-SPEC.md`.
- Do not modify `assets/base.css`, `assets/base.js`, or `snippets/css-variables.liquid` unless you intend to affect every section globally.
