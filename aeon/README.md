# AEON — cellular longevity (NMN / NAD⁺)

Store #3. A (fictional) longevity-supplement brand selling **AEON NMN 1000** —
1000 mg of β-Nicotinamide Mononucleotide per serving, 120 veggie capsules,
≥99% purity, third-party tested.

Deliberately unlike the other two stores in this repo:

| | SOMNA | PRAIRIE FAT CO. | **AEON** |
|---|---|---|---|
| Niche | Sleep / bedding | Tallow skincare | **Longevity supplement** |
| Mood | Calm neutral-luxe | Warm earthy artisan | **Dark clinical "lab instrument"** |
| Background | Light cream | Light kraft | **Near-black, cool** |
| Type | Fraunces + Hanken | Bitter + Mulish | **Space Grotesk + Inter + JetBrains Mono** |
| Accent | Clay + twilight | Honey + olive | **Aqua-mint + electric lime** |
| Signature sections | hero-split, steps | story-timeline, recipe | **NAD⁺ decline chart, molecular pathway, lab COA, spec sheet** |

## What's here

```
aeon/
├── index.html, product.html, science.html, …   ← built static preview (15 pages)
├── assets/
│   ├── theme.css        ← the dark-biotech design system (self-contained)
│   ├── theme.js         ← cart, NAD⁺ gauge, scroll-reveal, COA modal, sticky bar
│   └── img/             ← brand vector art (bottle, capsule, NAD⁺ molecule, lab seal)
├── src/                 ← page-body partials (edit these)
├── tools/build.js       ← wraps src/ partials in shared chrome → writes the *.html
├── shopify/             ← full Shopify Online Store 2.0 theme (same design)
├── aeon-preview.zip     ← the static site, zipped
└── aeon-shopify-theme.zip ← the Shopify theme, zipped (upload to Shopify)
```

## Static preview

The `*.html` files are pre-built. To rebuild after editing anything in `src/`:

```bash
cd aeon && node tools/build.js
```

Open `aeon/index.html` in a browser. The cart, COA modal, accordions, tier
selector and animations all run client-side in a mocked mode
(`window.AEON_MOCK = true`) — no backend needed.

## Shopify theme

`aeon/shopify/` is a complete OS 2.0 theme (35 sections, JSON templates,
customer account pages, policies, blog, gift card). The look is driven entirely
by `assets/theme.css` (colours are hard-coded in `:root`, so it renders
correctly with zero theme settings). `theme.js` auto-switches to **live mode**
in Shopify (native cart / `/cart/add` form / AJAX line changes).

Install: upload **`aeon-shopify-theme.zip`** in *Shopify admin → Online Store →
Themes → Add theme → Upload zip*. The homepage, product, collection, cart,
pages, and customer templates are all preconfigured.

> † AEON is a fictional brand for design/demo purposes. The supplement claims
> use structure/function language and carry the standard FDA disclaimer; nothing
> here is medical advice.
