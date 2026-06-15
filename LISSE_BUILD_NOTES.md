# LISSE — build notes / resume file

> Resume context for the LISSE storefront build. If you're a fresh session: read this,
> confirm Higgsfield CDN egress works (`curl -sI https://d8j0ntlcm91z4.cloudfront.net/...`),
> then continue from **Build steps** below. Branch: `claude/affectionate-goldberg-l6o4qw`.

## Brand
- **Name:** LISSE — tagline "The daily firming ritual"
- **Product (single hero):** LISSE Firming Body Oil — an anti-cellulite / firming massage oil
- **Reference / vibe:** drinkag1.com — ultra clean, ONE hero product, subscription-first,
  science-backed, tons of whitespace, premium minimal.
- **Scope:** Full brand = static preview site **+** importable Shopify theme, mirroring the
  `hide-and-honey/` structure, in a new **`lisse/`** folder.
- **Imagery:** ALL store images generated with Higgsfield (standing user rule), incl. the
  product render. No stock/placeholder in final.

## Design direction (deliberately unlike the honey brand)
- **Palette:** bone/cream paper (`#F4EFE8`), near-white card (`#FBF8F3`), warm **clay/terracotta
  accent** (`#B26F4C` / deep `#9A5C3C`), ink (`#25211D`), soft sand (`#C9B69D`), subtle sage
  (`#79806B`) for "natural/verified" cues, hairline lines (`#E6DDD0`).
- **Type:** `Fraunces` (serif display) + `Inter` (sans body/UI). `.hand` = Fraunces italic in
  clay (elegant, NOT script).
- **Remove the rustic treatments:** kill the kraft-paper grain, the hard offset box-shadows,
  the chunky stacked-shadow buttons, and Caveat. Go airy: generous whitespace, 1px hairline
  borders, soft diffuse shadows, pill buttons, restrained radii (`--r:12px; --r-lg:22px`).
- **Keep the existing component class names** (`.split .card .pdp .tier .acc .poster .dark`
  etc.) so the mode-aware `theme.js` and section markup keep working — just restyle.

## Pipeline (same as hide-and-honey)
- `lisse/tools/build.js` wraps `lisse/src/*.html` partials in shared chrome → writes
  `lisse/*.html`, using `lisse/assets/theme.css` + `theme.js`.
- Shopify theme in `lisse/shopify/` (sections, snippets, templates, layout, config, locales,
  assets). `assets/theme.css` is identical in both locations.
- `theme.js` is mode-aware: `window.LISSE_MOCK=true` (static preview) vs LIVE (Shopify cart).
  Rename keys from the honey copy: `HH_MOCK`→`LISSE_MOCK`, `hh-cart`→`lisse-cart`,
  `pf-open-cart`→`lisse-open-cart`. Set free-ship threshold + default product name/price for the oil.

## Higgsfield
- Account: **ultra** plan, ~2951 credits at start.
- Models: **`nano_banana_pro`** (product/still-life, strong label TEXT, up to 4k; ratios incl
  4:5, 3:2, 1:1) and **`soul_2`** (editorial/UGC people; ratios 3:4, 1:1, 16:9).
- `generate_image` returns **async jobs**; the MCP call may hit a 60s tool-timeout even when the
  job DID submit — always check `show_generations` before re-firing to avoid double-charging.
- Download the raw PNG from `results.rawUrl` (CloudFront). CDN base:
  `https://d8j0ntlcm91z4.cloudfront.net/user_3EjdbfcZ1iL1EgIRQolpTZ92b71/`
- Egress: container must allow `*.cloudfront.net` (+ `cdn.higgsfield.ai`, `higgsfield.ai`).
  User added it 2026-06-15; needs a fresh session to take effect.

## Images already generated (✅ complete, just need download once egress is live)
| Job ID | File on CDN | → save as | ratio | use |
|---|---|---|---|---|
| `9272bd40-4cc8-459a-b238-b7db27987bee` | `hf_20260615_134938_9272bd40-...png` | `lisse/assets/img/product-hero.png` | 4:5 | PDP main / hero |
| `4d5011fd-568c-4ca5-9f39-7a6118d3cbdc` | `hf_20260615_134948_4d5011fd-...png` | `product-hero-b.png` | 4:5 | hero alt |
| `807ac71d-2e06-405f-8208-acc55e345b65` | `hf_20260615_135029_807ac71d-...png` | `texture-skin.png` | 3:2 | sensory band |
| `2c366181-42a5-4ca2-9145-2cf7f6a5720e` | `hf_20260615_135143_2c366181-...png` | `botanicals.png` | 3:2 | actives/ingredients |
| `31aba8f4-f87f-492b-9a9c-942ddae60a90` | `hf_20260615_135259_31aba8f4-...png` | `massage-thigh.png` | 3:4 | lifestyle/hero |

## Images still to generate (reference the hero job_id for a consistent bottle)
- dropper-in-hand, golden drop falling (4:5) — how-to / split
- bottle on marble/stone bathroom shelf, morning light (4:5) — lifestyle / collection card
- bottle + minimal carton box (1:1) — packaging
- results portrait: calm woman, towel, glowing skin (soul_2, 3:4) — the one that timed out
- optional: dry-brush + bottle flat-lay (1:1) — ritual kit

## Page set (mirror hide-and-honey, re-themed for the oil)
home · product(PDP) · ingredients→"actives/science" · how-to→"the ritual" · about/our-story ·
reviews · collection · bundles · faq · contact · cart · guarantee(trial) · shipping · refund ·
privacy · terms

## Build steps (order)
1. Recreate `lisse/` from `hide-and-honey/` and prune (`*.zip`, `assets/img/*`, `shopify/assets/hh-*.svg`, built `*.html`).
2. Write clean `theme.css` (palette/type above) → copy to `lisse/assets/` and `lisse/shopify/assets/`.
3. Rebrand chrome: `tools/build.js` (logo "LISSE", nav, footer, announce), `theme.js` keys, `layout/theme.liquid` tokens/fonts.
4. Download the 5 images; generate the remaining shots; wire into markup + `theme.js` default product img.
5. Rewrite `src/*.html` + `shopify/sections/*` + `shopify/templates/*` content for the firming oil.
6. `node lisse/tools/build.js` to render the static pages.
7. Zip the preview site and the importable Shopify theme.
8. Commit + push to `claude/affectionate-goldberg-l6o4qw`.
