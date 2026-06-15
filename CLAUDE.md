# CLAUDE.md — brand-build playbook

Lessons banked from the SOMNA and PRAIRIE FAT CO. builds. Read before starting a new brand build, and before reaching for a "band-aid" fix on an existing one.

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

## Validate before delivery

Before sending the zip, in order:

1. **Mirror & rebuild** — every CSS/JS edit applied to both `shopify/assets/` and `assets/`; then `node tools/build.js`.
2. **Run theme-check**: `@shopify/cli theme check` (or `theme-check-node`) on `shopify/`. `ImgWidthAndHeight` is cosmetic; everything else must be clean. False-positives (e.g. `qr_url`) can be noted and waived.
3. **Render the real Liquid** — use `/tmp/render.cjs` + headless Chromium to render the actual section files (not just the static preview) and measure: page height vs footer bottom (`GAP` must be 0), mobile menu computed `position` must be `fixed`, drawer must be off-screen when closed. **Always verify the CSS file actually loaded** (`document.styleSheets[].cssRules.length` > 0) — a wrong href silently turns every layout measurement into a false negative.
4. **Real test-upload** — upload the zip to a dev Shopify store, click through home / PDP / cart / collection / all footer pages, and resize to mobile. Theme-check passing is necessary, not sufficient; the editor preview catches transformed-ancestor and section-group bugs that static analysis misses.
5. **Repackage both zips** from the current files (never edit-in-zip): `rm -f *.zip && (cd shopify && zip -rq ../<brand>-shopify-theme.zip assets config layout locales sections snippets templates) && zip -rq <brand>-preview.zip *.html assets`.
6. **SETUP.md must list**: Shopify Pages the merchant needs to create (with handles), which sections to connect to which collections, discount codes the upsell expects, and any required apps (subscriptions, reviews).

## Debugging

- **When stuck on a visual bug across two or more re-send cycles, stop layering CSS and diff against a known-working brand.** The empty-space-below-footer bug burned ~7 theme uploads of band-aids before diffing against SOMNA exposed the cause (fixed grain overlay + body layering + panel hacks) in one read. If brand A works and brand B doesn't, the diff is the answer — find it before shipping another zip.
- **Don't trust your test harness's measurements unless the CSS is provably loaded.** Add an assertion (`document.styleSheets.length > 0 && document.styleSheets[0].cssRules.length > 0`) at the top of every measurement script. An unstyled page reports gap=0 because everything is in-flow with no positioning at all — completely misleading.
- **One piece of ground truth beats five zip re-sends.** Before re-shipping, get one decisive measurement (headless render, computed-style dump of the broken element, screenshot of the live storefront — not the editor) that confirms the bug exists *or* is gone. Re-sending without verification wastes the user's time and your own.
- **`reveal` / IntersectionObserver gotcha**: an observer with `threshold: 0.12` (or any value > 0) never fires on a section taller than the viewport, leaving the section permanently invisible. Prefer pure-CSS keyframe reveal animations that always complete, or `threshold: 0` + `rootMargin`.
- **Shopify editor selection chrome** (the blue "+" buttons and section outlines) can resemble layout bugs — confirm against the storefront eye icon ("View store") before debugging a "gap" that only the editor shows. But if the user says it's also visible on the live storefront, believe them and find the real cause.

## Tools / environment

- Static-preview builder: `node tools/build.js` from inside the brand folder. Re-runs are cheap; rerun after every CSS/JS/HTML edit.
- Theme-check: `@shopify/cli theme check` or `theme-check-node` (installed at `/opt/node22/lib/node_modules/@shopify/theme-check-node/`).
- Headless render harness: `/tmp/render.cjs` (uses `liquidjs` + a small filter mock to compile real Liquid sections), `/tmp/measure.cjs` (Playwright headless Chromium at `/opt/pw-browsers/chromium-1194/chrome-linux/chrome`). Both copy the brand's real `theme.css` / `theme.js` into `/tmp/assets/` before measuring — otherwise the page renders unstyled and every measurement lies.
- Git: feature branch is the source of truth. Push with `git push -u origin <branch>`, retry on network errors with exponential backoff (2s, 4s, 8s, 16s) up to 4 times. Never `--no-verify`.
- Delivery: prefer sending the built zip directly via `SendUserFile` rather than asking the user to clone. They'll re-upload the theme into Shopify's admin; remind them to **hard-refresh** (Cmd/Ctrl+Shift+R) so the new `theme.css` isn't cached.
