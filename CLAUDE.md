# CLAUDE.md — brand-build playbook

Lessons banked from the SOMNA, PRAIRIE FAT CO., and LISSE builds. Read before starting a new brand build, and before reaching for a "band-aid" fix on an existing one.

Each rule is **what went wrong → what to do instead.** Don't ship around these; fix the root cause.

---

## How brands are organized

- One brand = one top-level folder (`somna/`, `hide-and-honey/`, etc.). Never mix brand assets across folders.
- Inside each brand folder:
  - `shopify/` — the uploadable Online Store 2.0 theme (`assets/`, `config/`, `layout/`, `locales/`, `sections/`, `snippets/`, `templates/`).
  - `src/` — HTML partials for the static preview.
  - `assets/` — shared CSS/JS/images served by the static preview.
  - `tools/build.js` — wraps `src/` partials in shared chrome → root `*.html`.
  - `SETUP.md` — merchant-facing setup (page handles to create, sections to connect, apps to install).
  - `<brand>-shopify-theme.zip` + `<brand>-preview.zip` — built deliverables.
- `theme.css` and `theme.js` exist in **both** `shopify/assets/` and `assets/` (static preview). Every change to one MUST be mirrored to the other, then `node tools/build.js` must be rerun. Drift between the two is the most common avoidable bug.
- For **GitHub-connected themes** (Shopify Online Store → Themes → Connect from GitHub), the theme files must sit at the **repo root of the connected branch**. If the theme lives in a subfolder (`hide-and-honey/shopify/`), use zip uploads or move the theme to a dedicated branch where `assets/`, `sections/`, etc. are at the root.

## Ask up front

Before writing a single line, lock down:

1. **Brand name + visual direction** in one sentence (e.g. "warm organic kraft, looks nothing like SOMNA"). If the user says "make it different from X," that's a hard constraint — invent genuinely distinct section concepts, not reskins.
2. **Reference stores** the user wants inspiration from.
3. **Deliverable shape**: static preview only, Shopify theme only, or both? Confirm before building.
4. **Apps/integrations assumed** — subscriptions (Recharge / Shopify Subscriptions / Bold), reviews (Judge.me / Yotpo / Loox), bundles (Shopify native or app). If the user mentions Subscribe & Save / build-a-bundle / loyalty, ask whether the matching app is installed. **Subscribe & Save UI on a PDP is display-only without a subscriptions app** — document this explicitly in SETUP.md, don't ship a button that does nothing.
5. **Merchant setup expected** — which Shopify Pages they must create, which collections to connect, which discount codes to set up.

If the user says "you choose" — choose, but state the choice in one line so they can redirect.

## Information architecture

- **Single-product brands: one product, one place to buy.** Don't present the same product as several "products" in a collection grid, and don't duplicate a multi-pack as both a PDP plan tier *and* a separate upsell band *and* a bundles page. It confuses people ("why are there 3 of the same thing?"). Make **"Shop" link straight to the PDP**; put every purchase option (one-time / Subscribe & Save / multi-pack) **only** in the PDP plan selector. Drop the fake collection grid and any standalone bundles page — remove them from nav, mobile menu, footer, and templates, then grep for dangling links (`collection.html`, `bundles.html`, `/pages/bundles`, "Shop All") afterward.
- Confirm the catalog shape up front: one hero product vs. a real range. It decides whether "Shop" is a collection or the product, and whether a bundles page earns its place.

## Shopify hard rules

### Schema & defaults
- Never set `"default": ""` on a schema setting. An empty string can be interpreted as "missing" and silently breaks page templates that expect a value. Either omit `default` or set a real default string.
- Don't use `"type": "header"` for schema info dividers — it collides with the section type `header`. Use `"type": "paragraph"`.
- Don't ship blank `templates/page.<handle>.json` — design the page (rich-text head + designed sections + newsletter). A blank `{ "sections": {} }` is worse than no template.

### Section groups & tags
- Header/footer use **plural** `{% sections 'header-group' %}` (section groups, JSON file). The singular `{% section 'header' %}` (single section) throws *"'header' is not a valid section type"* when paired with a `*-group.json`.
- Guard every `{% paginate %}`. `{% paginate collection.products by N %}` throws *"Array 'collection.products' is not paginateable"* the instant a `main-collection`-style section renders on a template where no collection is connected (e.g. a generic page template). Wrap in `{% if collection != blank and collection.products_count > 0 %}` and render an empty-state otherwise.
- Don't gate sections on `forloop`-internal `{% else %}` for "no products yet" — the paginate error fires before the for loop ever runs.

### Cart / checkout buttons
- `<a href="/cart/{variant_id}:{qty}">` is Shopify's **quick-checkout permalink** — it sends users to checkout, not the cart. For "add to cart" buttons (bundle upsells, quick-adds), use AJAX `POST /cart/add.js` and either reload + open the drawer or update the drawer in place. Use `/cart` (or `/discount/<code>?redirect=/cart`) as the no-JS fallback.
- `{{ form | payment_button }}` renders Shopify's dynamic-checkout button (blue "Buy it now" / Shop Pay). Remove it when the brief calls for a single Add-to-cart CTA.

### Images
- Every `<img>` should have explicit `width` and `height` attributes — theme-check flags `ImgWidthAndHeight` and missing dims cause CLS in real storefronts. Even when using `image_url` with a width filter, also emit the attribute.
- **The global `img` reset MUST include `height: auto`.** `img { max-width:100% }` alone is a trap: an image carrying `width`/`height` attributes (for CLS) but constrained by CSS `width` (e.g. a 190px shelf thumbnail or logo) honors the `height` *attribute* and stretches to that pixel height with `object-fit: fill` — a 1289×1600 bottle rendered 190×2304, a giant smeared column down the page. Always `img { max-width:100%; height:auto; display:block }`. Boxed crops that need a fixed height (`.has-photo`, card/split media) set `height:100%; object-fit:cover` and override it, so this is safe everywhere. (Cost us a "PDP image stretches across the whole site" round.)
- PDP gallery: never hardcode `limit: N` on `{% for image in product.images %}`. Render all images and let CSS wrap (`grid-template-columns: repeat(auto-fill, minmax(72px, 1fr))`).
- When a gallery frame is designed for illustrations (heavy kraft border, offset shadow, image at 76%), give real photos a separate variant (`.has-photo` modifier: `width:100%`, `height:100%`, `object-fit:cover`, soft drop shadow, no kraft border). Don't make photos sit inside an illustration frame.
- Don't put decorative overlays (seal stamps, badges) on top of real product photos — they look great on illustrations, bad on photography. Leave them in a separate trust-row beneath the buy box.
- Thumbnail click should swap the main image's `src` in place — never `innerHTML = <img ...>` (it wipes overlay siblings like the seal badge).

### Positioning & layout
- Don't put `position: fixed` pseudo-elements (`body::before { position: fixed; inset: 0 }`) for paper/grain overlays. A transformed ancestor in the Shopify editor (and on real storefronts using certain apps) defeats `position: fixed` — fixed elements then fall back into normal flow and add phantom document height (the "huge empty space below the footer" symptom). Bake textures into `body { background-image: url(...) }` instead — backgrounds can never affect layout.
- Don't add `body { position: relative }` + `body > * { position: relative; z-index: 2 }` to control layering — same root cause as above; it creates new containing blocks that break `position: fixed` on descendants.
- Off-canvas drawer / mobile menu / overlay: keep them dead simple — plain `position: fixed; inset: 0` (or `top:0; right:0; bottom:0`), `transform: translateX(100%)` closed → `translateX(0)` open. No `!important`, no `height: 100vh` on `.open`, no `:not(.open) { height: 0 !important }` band-aids. The band-aid only hides the symptom that the panels rendered in-flow; fix the cause (a transformed ancestor or pseudo-element overlay) instead.

### Rebrands & renames
- Brand renames (e.g. HIDE & HONEY → PRAIRIE FAT CO.) must be **case-sensitive whole-word** replacements, never substring. A naive global replace can chew through unrelated tokens (e.g. brand "Form" colliding with `<form>`, `.form`, `{% form %}`, `form.payment_button`) and silently break the cart. Use an editor's "match case + whole word" or scripted boundaries (`\b<TOKEN>\b`), and grep for the old name across all extensions afterward.

## Imagery & AI image generation (Higgsfield)

- **Model choice:** people / skin / lifestyle → Soul (`soul_2`); product, still-life, packaging, botanicals, anything needing readable label text → `nano_banana_2`.
- **Lock product consistency** across shots by passing the hero render's `job_id` as a reference: `medias:[{ role:'image', value:'<job_id>' }]` on `nano_banana_2`, and restate the exact bottle/label in the prompt ("keep the identical bottle; label reads 'LISSE'").
- **Prompt like a photographer:** name camera/lens/aperture, the light (soft diffused window / silk scrim), surface + palette, generous negative space, and a hard **Avoid:** list (deformed/extra/fused fingers, warped or misspelled label, plastic/airbrushed skin, CGI, 3D render, oversaturation).
- **"Oil/serum on skin" renders as honey.** Generators read "golden oil" as thick amber syrup/wax → instantly fake (the leg shot looked like sugaring wax). Prompt for a *sheer, fast-absorbing* film with a soft **dewy sheen, NOT thick liquid**, and add negatives: honey, syrup, wax, sugaring paste, sticky drips, goo.
- **Generate options, then curate:** `count: 3–4`, download, build a labeled montage (Pillow), pick the most realistic — never ship the first. Use distinct imagery per item; never reuse one flat-lay for N ingredient cards (reads as a bug) — generate one image per active or go text-only.
- **A flat-lay must contain what the labels claim** and read correctly (brown guarana *seeds*, not tomato-like berries; don't crop the orange off-frame). Match the aspect to the frame (4:5 for portrait media) so `object-fit:cover` doesn't crop awkwardly.
- **Async + format:** `generate_image` returns async jobs; the MCP call can hit a ~60s timeout even though the job submitted — check `show_generations` before re-firing to avoid double-charging. Download the raw file from `results.rawUrl`; it may be `.jpeg` even when you expect PNG, so normalize to a true PNG (Pillow) so the extension is honest for Shopify's image pipeline.
- **Deliver a logo, proactively.** Render the brand wordmark from its *real* font (install `@fontsource/<font>` from npm — Google Fonts is blocked offline) in headless Chromium and screenshot with `omitBackground:true` → a transparent `assets/logo.png` (+ optional tagline lockup). It's for Shopify **Settings → Checkout → Branding** and the header logo image_picker. Don't AI-generate wordmark text — it garbles.

## Validate before delivery

Before sending the zip, in order:

1. **Mirror & rebuild** — every CSS/JS edit applied to both `shopify/assets/` and `assets/`; then `node tools/build.js`.
2. **Run theme-check**: `@shopify/cli theme check` (or `theme-check-node`) on `shopify/`. `ImgWidthAndHeight` is cosmetic; everything else must be clean. False-positives (e.g. `qr_url`) can be noted and waived.
3. **Render headless and measure** — load the built pages (and the real Liquid when feasible) in headless Chromium and assert: page height vs footer bottom (`GAP` must be 0), mobile menu computed `position` is `fixed`, drawer off-screen when closed, no horizontal overflow, every image decoded (`naturalWidth > 0`), and **no aspect-distorted images** (rendered aspect ≠ natural aspect while `object-fit` isn't cover/contain — catches the `height:auto` stretch bug). **Verify the CSS actually applied via a computed style, not `cssRules.length`**: a cross-origin `@import` (Google Fonts) makes `cssRules` *throw* (caught → 0 → false "CSS not loaded"). Assert e.g. `getComputedStyle(document.body).backgroundColor === '<brand paper hex>'` instead.
4. **Real test-upload** — upload the zip to a dev Shopify store, click through home / PDP / cart / collection / all footer pages, and resize to mobile. Theme-check passing is necessary, not sufficient; the editor preview catches transformed-ancestor and section-group bugs that static analysis misses.
5. **Repackage both zips** from the current files (never edit-in-zip): `rm -f *.zip && (cd shopify && zip -rq ../<brand>-shopify-theme.zip assets config layout locales sections snippets templates) && zip -rq <brand>-preview.zip *.html assets`.
6. **SETUP.md must list**: Shopify Pages the merchant needs to create (with handles), which sections to connect to which collections, discount codes the upsell expects, and any required apps (subscriptions, reviews).

## Debugging

- **When stuck on a visual bug across two or more re-send cycles, stop layering CSS and diff against a known-working brand.** The empty-space-below-footer bug burned ~7 theme uploads of band-aids before diffing against SOMNA exposed the cause (fixed grain overlay + body layering + panel hacks) in one read. If brand A works and brand B doesn't, the diff is the answer — find it before shipping another zip.
- **Don't trust your test harness's measurements unless the CSS is provably loaded.** Add an assertion (`document.styleSheets.length > 0 && document.styleSheets[0].cssRules.length > 0`) at the top of every measurement script. An unstyled page reports gap=0 because everything is in-flow with no positioning at all — completely misleading.
- **One piece of ground truth beats five zip re-sends.** Before re-shipping, get one decisive measurement (headless render, computed-style dump of the broken element, screenshot of the live storefront — not the editor) that confirms the bug exists *or* is gone. Re-sending without verification wastes the user's time and your own.
- **`reveal` / IntersectionObserver gotcha**: an observer with `threshold: 0.12` (or any value > 0) never fires on a section taller than the viewport, leaving the section permanently invisible. Prefer pure-CSS keyframe reveal animations that always complete, or `threshold: 0` + `rootMargin`.
- **Shopify editor selection chrome** (the blue "+" buttons and section outlines) can resemble layout bugs — confirm against the storefront eye icon ("View store") before debugging a "gap" that only the editor shows. But if the user says it's also visible on the live storefront, believe them and find the real cause.
- **Cross-origin `@import` breaks `cssRules` checks.** If `theme.css` opens with `@import url('https://fonts.googleapis.com/...')`, reading `styleSheets[0].cssRules` throws a SecurityError (caught → 0 → false "unstyled"). Gate "CSS loaded" on a computed style the sheet sets, not on rule count.
- **Google Fonts don't load in the offline sandbox** (`ERR_CERT_AUTHORITY_INVALID`); headings render in the serif/sans *fallback* and that one console error is expected — filter it from the error gate. Fonts load fine on real hosting; a screenshot showing fallback type is not a bug.
- **A passing render check ≠ a good-looking image.** Layout asserts (gap, overflow, decode) won't catch a fake-looking or distorted photo — eyeball the actual screenshots, and add a distortion assert for the mechanical cases.

## Tools / environment

- Static-preview builder: `node tools/build.js` from inside the brand folder. Re-runs are cheap; rerun after every CSS/JS/HTML edit.
- **The remote container is ephemeral — tooling is NOT preinstalled.** A fresh session won't have the old `/opt/.../theme-check-node` or `/tmp/*.cjs` paths. Install on demand (package-manager registries are allowlisted): `npm i playwright-core` (the Chromium binary *is* present at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`), `npm i @shopify/theme-check-node`, `pip install Pillow` (resize / format-normalize / montages), and `@fontsource/<font>` to render brand fonts.
- Theme-check: `@shopify/theme-check-node` is **programmatic only** (no CLI bin) — `const { themeCheckRun } = require('@shopify/theme-check-node'); (await themeCheckRun(shopifyRoot)).offenses`. Treat `ImgWidthAndHeight` / asset-size as cosmetic and `qr_url` (gift-card) as a known false-positive; everything else must be clean.
- Headless harness: a small `playwright-core` script with `executablePath` → the chromium above, loading built pages over `file://`. Serve/inline the brand's real `theme.css`/`theme.js` so the page isn't unstyled and measurements don't lie.
- **CDN egress** (Higgsfield CloudFront `*.cloudfront.net`, `cdn.higgsfield.ai`, `higgsfield.ai`) must be on the env allowlist as **bare hosts**. A **running container freezes its egress ruleset at boot** — allowlist edits only take effect in a fresh session. A genuine CloudFront `403 AccessDenied` (XML body, `server: AmazonS3`, `via: …cloudfront.net`) means reachable-but-no-object-key, NOT blocked.
- Git: feature branch is the source of truth. Push with `git push -u origin <branch>`, retry on network errors with exponential backoff (2s, 4s, 8s, 16s) up to 4 times. Never `--no-verify`.
- Delivery: prefer sending the built zip directly via `SendUserFile` rather than asking the user to clone. They'll re-upload the theme into Shopify's admin; remind them to **hard-refresh** (Cmd/Ctrl+Shift+R) so the new `theme.css` isn't cached.
