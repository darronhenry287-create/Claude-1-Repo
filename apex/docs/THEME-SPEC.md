# APEX — theme build spec (for contributors/agents)

A flagship, universal DTC Shopify **Online Store 2.0** theme. This spec is the
contract every section/template must follow so the theme stays coherent.

## Philosophy
- **Tokens + colour schemes drive everything.** Never hard-code colours, fonts,
  radii or spacing. Use the CSS variables below. Every section is re-themeable
  per-instance via a colour scheme.
- **Sections are self-contained**: markup + `{% schema %}` (with `presets`) +
  optional scoped `{% stylesheet %}` + optional `{% javascript %}`. They must
  render fine with default settings and in isolation.
- **No dependencies.** Vanilla JS only; `base.js` already covers drawers,
  reveal, sliders, tabs, accordions, quantity, quick-add, variant picker,
  countdown, predictive search. Reuse it; add a small `{% javascript %}` only
  when a section needs unique behaviour.
- **A11y + performance**: semantic tags, labelled controls, `loading="lazy"`
  for below-fold media, `prefers-reduced-motion` respected by `.reveal`.

## Canonical reference
`sections/hero.liquid` is the gold-standard pattern — copy its structure
(scheme wrapper, blocks, `{% stylesheet %}`, schema + presets).

## Every section MUST
1. Wrap its root in a colour-scheme class:
   `<section class="apex-NAME color-{{ section.settings.color_scheme }}" ...>`
2. Include a `color_scheme` setting:
   `{ "type": "color_scheme", "id": "color_scheme", "label": "Color scheme", "default": "scheme-1" }`
3. Constrain content with `<div class="page-width">…</div>` (or `page-width--narrow`).
4. Offer padding controls:
   `padding_top` & `padding_bottom` ranges (min 0, max 160, step 4, default 72),
   applied as `style="padding-top:{{ st.padding_top }}px;padding-bottom:{{ st.padding_bottom }}px"`.
5. Add `class="reveal"` to the main content group for scroll-in animation.
6. End with a valid `{% schema %}` that includes a `presets` array.

## Design tokens (CSS variables — from base.css / settings)
Colours (per scheme): `--bg --bg-alt --card --text --text-muted --border --accent --accent-text --btn --btn-text`.
Type: `--font-heading --font-body`. Layout: `--page-width --gutter --section-gap`.
Shape: `--radius --radius-card --radius-btn --radius-input --radius-pill --border-width`.
Effects: `--shadow-card --shadow-pop --ease --dur`.

## Component classes available (base.css) — REUSE, don't reinvent
- Layout: `.page-width(.--narrow/.--full) .section(.--tight) .section-head(.--center) .grid(.--2/3/4/auto) .stack .cluster .center`
- Type: `.h1–.h5 .subtitle .lede .eyebrow(.--pill) .muted .balance .rte`
- Buttons: `.btn .btn--accent .btn--secondary .btn--ghost .btn--block .btn--lg .btn--sm .btn--pill` · `.link`
- Cards/products: `.card .card--hover .product-card .price .badge(.--sale/.--sold-out) .rating .swatches`
- Media: `.media(.--square/.--portrait/.--landscape/.--wide/.--round/.--contain) .ratio .placeholder-svg`
- Forms: `.field .input .input-group .qty`
- UI: `.accordion .accordion__item/.__head/.__icon/.__body` · `.tabs [data-tabs] [role=tab] [role=tabpanel]` · `.slider [data-slider] [data-slider-prev/next]` · `.drawer .modal .overlay` · `.badge .marquee/.__track`
- Animation: `.reveal(.--delay-1/2/3 / --zoom)`

## Snippet APIs (call these; don't duplicate)
- `{% render 'icon', icon: 'cart' %}` — icons: menu close search cart bag user chevron-down chevron-right arrow-left arrow-right plus minus check star truck shield leaf return instagram tiktok facebook youtube x
- `{% render 'price', product: product %}` (or `price: 1999, compare_at: 2499`)
- `{% render 'rating', product: product %}` (or `value: 4.8, count: 120`)
- `{% render 'product-card', product: product %}` — honours product-card theme settings
- `css-variables` — DO NOT edit; it injects tokens + scheme classes.

## JS hooks provided by base.js
- Drawers/modals: trigger `data-open="ID"`, close `data-close="ID"`; panel needs `id`, class `.drawer`/`.modal`.
- Slider: `[data-slider]` wrapper with `.slider` track + `[data-slider-prev]`/`[data-slider-next]`.
- Tabs: `[data-tabs]` with `[role=tab]` + `[role=tabpanel]`.
- Accordion: `.accordion__head` toggles `.accordion__item[open]`; wrap in `[data-accordion-single]` for one-open.
- Quantity: `.qty` with `<input>` and +/- buttons.
- Countdown: `<apex-countdown data-end="2025-12-31T23:59">` with `[data-unit=days|hours|mins|secs]`.
- Quick add: `<button data-quick-add="{{ variant.id }}">`.
- Variant picker: wrap product form in `<apex-product-form>` with `[data-variants]` JSON, `[data-option-index]` inputs, `[name=id]`, `[data-price]`, `[data-atc]`.
- Sticky bar: `[data-sticky-atc="ANCHOR_ID"]` + an element `id="ANCHOR_ID"` (or `[data-atc-anchor]`).

## Constraints
- Valid OS 2.0 Liquid; valid JSON in schemas + templates; `presets` on every section.
- Don’t modify base.css/base.js/css-variables/snippets owned by the foundation
  unless explicitly asked; add new files only at your assigned paths.
- No AI/model identifiers anywhere.
