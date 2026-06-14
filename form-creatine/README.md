# FORM — Daily Creatine Gummies

A complete DTC brand kit for a creatine-gummies store: a production-ready **Shopify theme** plus a **browsable static preview** of the whole site. Same design system powers both.

- **Brand:** FORM — *"5g creatine. One simple ritual."*
- **Product:** FORM Daily Creatine Gummies — 5g creatine monohydrate per serving (4 gummies), 120 gummies / 30-day supply, in three flavors: **Wild Berry, Peach, Citrus**
- **Look:** warm neutral-luxe wellness — oat background, deep ink text, terracotta accent, deep-sage bands. Fraunces (headings) + Hanken Grotesk (body)
- **Conversion:** subscribe-and-save tiers, multi-pack bundles, comparison table, social proof, 30-day guarantee

## What's in here

```
form-creatine/
├── shopify/                       ← the Shopify theme (upload this)
│   ├── assets/  (theme.css, theme.js, 8 brand SVGs)
│   ├── config/  (settings_schema.json, settings_data.json — FORM preset)
│   ├── layout/  locales/  sections/  snippets/  templates/
├── src/                           ← preview page bodies (edited by humans)
├── tools/build.js                 ← wraps src/ bodies in shared header/footer
├── assets/                        ← preview copy of theme.css/js + img/*.svg
├── *.html                         ← generated preview pages (open index.html)
├── form-creatine-shopify-theme.zip  ← ready to upload to Shopify
└── form-creatine-preview.zip        ← the static preview, zipped
```

## Use the Shopify theme

1. In Shopify admin: **Online Store → Themes → Add theme → Upload zip file** and choose `form-creatine-shopify-theme.zip`.
2. Click **Customize** to preview. Everything renders out of the box using bundled illustrations and demo content.
3. Then make it yours:
   - **Create the product** "FORM Daily Creatine Gummies" with a **Flavor** option (Wild Berry / Peach / Citrus). Add your real product photos.
   - **Create a collection** (e.g. *All Flavors*) and point the homepage *Featured collection* section at it.
   - **Menus:** set `main-menu` (header) and footer menu columns under **Navigation**.
   - **Colors / logo:** **Theme settings → Colors / Brand** (palette + free-shipping threshold are pre-set for FORM).
   - **Subscribe & Save:** install a Shopify subscriptions app and attach a selling plan to the product. The PDP, pricing and copy are already built around a monthly subscribe-and-save offer.

Until you connect a real product/collection, sections fall back to bundled FORM illustrations and demo copy, so nothing looks empty.

## View / rebuild the preview

- **View:** open `index.html` in a browser (cart, drawer, accordions, and the PDP plan selector all work in a mocked demo mode — checkout is stubbed).
- **Rebuild** after editing anything in `src/`:
  ```bash
  node tools/build.js
  ```
  It re-wraps every `src/*.html` body in the shared header/footer and writes the final pages to this folder.

## Notes

- The product art (`assets/img/*.svg`, `shopify/assets/*.svg`) is clean placeholder illustration so the store looks finished without photography — swap in real photos when ready.
- Compliance: copy includes a standard supplement disclaimer ("These statements have not been evaluated by the FDA…"). Review claims and the privacy/terms/shipping/refund pages with your own counsel before launch.
- `theme.css` and `theme.js` are intentionally identical in `shopify/assets/` and `assets/` — if you edit one, copy it to the other.
