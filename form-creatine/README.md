# FORM — Daily Creatine Gummies

A **single-product** DTC brand kit: a production-ready **Shopify theme** plus a browsable **static preview**, sharing one bespoke design system.

- **Brand:** FORM — *"5g creatine. One simple ritual."*
- **Product:** ONE product — FORM Daily Creatine Gummies (5g creatine monohydrate per 4-gummy serving, 120 gummies / 30-day supply). Flavors Wild Berry / Peach / Citrus are **variants of the one product**; plans are One-time / Subscribe & Save 20% / 3-month supply.
- **Design language (all-original — shares nothing with the older Somna/Prairie templates):** bright, friendly, color-blocked. White + warm-cream + sky/mint tint blocks, a coral accent (`#ff5d3a`) and deep navy (`#11253f`), big rounded cards, soft shadows. Type pairing: **Bricolage Grotesque** (display) + **Plus Jakarta Sans** (body).
- **Signature sections:** layered hero with floating proof chips · press strip · **bento** benefits grid · oversized **statement** · 3-step **ritual** timeline · **Supplement Facts** panel + "what's not in it" · **results** bar chart · **old-way-vs-FORM** versus block · **review wall** · on-page **plan selector** · FAQ · giant-wordmark footer.

## What's in here

```
form-creatine/
├── shopify/                       ← the Shopify theme (upload this)
│   ├── assets/  (theme.css, theme.js, 6 brand SVGs)
│   ├── config/  layout/  locales/  snippets/  templates/
│   └── sections/  (hero, press, bento, statement, ritual, ingredients,
│                   results, versus, review-wall, buy-block, promise,
│                   faq, main-product, header, footer …)
├── src/                           ← preview page bodies (edited by humans)
├── tools/build.js                 ← wraps src/ bodies in shared chrome
├── assets/                        ← preview copy of theme.css/js + img/*.svg
├── *.html                         ← 14 generated preview pages (open index.html)
├── form-creatine-shopify-theme.zip
└── form-creatine-preview.zip
```

## Use the Shopify theme

1. Shopify admin → **Online Store → Themes → Add theme → Upload zip file** → `form-creatine-shopify-theme.zip`. Click **Customize**.
2. Make it yours:
   - **Create the product** "FORM Daily Creatine Gummies" with a **Flavor** option (Wild Berry / Peach / Citrus) and add your photos. Point the homepage **Buy block** section at it (Customize → Buy block → Product).
   - **Menus:** set `main-menu` (header) + footer columns under **Navigation**.
   - **Colors / logo:** Theme settings → Colors / Brand (the FORM coral/navy palette and free-shipping threshold are pre-set).
   - Every homepage block (hero, bento cells, ritual steps, versus points, reviews, plans, FAQ) is editable in the theme editor.
   - **Subscribe & Save:** the plan selector and pricing are built in; to make the recurring charge live, install a Shopify subscriptions app and attach a selling plan. The plan tiers drive the displayed price — for live one-time orders the cart adds the selected variant × quantity.

Until you connect a real product, sections fall back to bundled FORM illustrations and demo content, so nothing looks empty.

## View / rebuild the preview

- **View:** open `index.html` in a browser (cart drawer, plan selector pricing, accordions, sticky add bar and reveals all work in a mocked demo mode — checkout is stubbed).
- **Rebuild** after editing anything in `src/`:
  ```bash
  node tools/build.js
  ```

## Notes

- The product art (`assets/img/*.svg`) is clean placeholder illustration so the store looks finished without photography — swap in real photos when ready.
- `theme.css` / `theme.js` are intentionally identical in `shopify/assets/` and `assets/` — edit one, copy to the other.
- Compliance: copy includes the standard supplement disclaimer ("These statements have not been evaluated by the FDA…"). Review claims and the privacy/terms/shipping/refund pages with your own counsel before launch.
