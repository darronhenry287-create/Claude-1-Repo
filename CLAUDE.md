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

### PDP / conversion essentials (ALWAYS — don't skip these)
- **Every product page ships with a marketing image carousel beside the buy box**, not a bare photo gallery. The slides are real product pictures with **USP callouts and text baked into the images** — a set like: hero + rating, key benefits, ingredients/actives, how-to (3 steps), guarantee/trust seals, and a 5-star social-proof quote. Generate them with a text-capable model (e.g. `nano_banana_pro`) and pass ONE canonical product image as a reference (`medias:[{value:<job_id>,role:"image"}]`) so the product stays identical across every slide. Verify the rendered text is correctly spelled before shipping.
- **Put a USP callout row in the buy box too** (e.g. free shipping over $X · money-back guarantee · cruelty-free · ships fast), with little icons — in addition to the in-image USPs.
- This was requested repeatedly and forgotten — treat it as a default deliverable for any product/landing build, the same way the cart drawer and sticky add-to-cart are.

### Schema & defaults
- Never set `"default": ""` on a schema setting. An empty string can be interpreted as "missing" and silently breaks page templates that expect a value. Either omit `default` or set a real default string.
- **`url`-type settings can't have an arbitrary `default`.** A `url` default must be a Shopify route (`/`, `/collections`, `/collections/all`, `/products`, `/blogs/news`, `/search`, `/cart`, `/account`) — a path like `/pages/terms-of-service` is rejected, which invalidates the section and makes it **disappear** (GLAZE: the whole footer vanished when the legal links were `url` settings defaulting to `/pages/...`). For editable links that default to a page/arbitrary path, use a `text` setting and render it straight into `href`. The `url` *picker* is fine with **no default** (values set in the section-group/template JSON are lenient). `check-schemas.cjs` now flags non-route `url` defaults.
- **Never put a disallowed tag in an `inline_richtext` / `richtext` setting `default`.** This is the recurring "homepage shows the 404 page" bug across SOMNA, HIDE & HONEY/PRAIRIE and GLAZE. Shopify validates richtext setting **defaults** when the section loads; an invalid default makes that section **invalid**, and *every* JSON template that references it **fails to render → Shopify serves `404.json`** ("Lost the glow") and the editor shows "No templates found." **theme-check 3.26 and a liquidjs render do NOT catch this** — you must run a schema audit.
  - `inline_richtext` defaults may contain ONLY `<a> <em> <strong> <b> <i> <u> <span>`. `<br>`, `<sup>`, `<sub>`, `<small>`, `<p>` and all block tags are rejected. (GLAZE hit this twice: a `<br>` in the `hero` heading default broke the homepage *only* — hero lives only in `index.json`; then a `<sup>★</sup>` in a `proof` stat default broke the homepage **and** the PDP, because `proof` is shared by `index.json` and `product.json`. A shared broken section 404s every page that uses it.)
  - `richtext` defaults MUST be wrapped in a block tag (`<p>…</p>`, `<ul>`, `<ol>`, `<h1>`–`<h6>`).
  - Fix: for line breaks use two `text` settings + `<br>` in the *template markup* (`<h1>{{ line1 }}<br>{{ line2 }}</h1>`); for superscripts/special markup keep it in the template and feed plain `text` settings.
  - **Always run a strict schema audit before shipping** (theme-check is not enough): parse each `sections/*.liquid` `{% schema %}` and assert every `inline_richtext` default uses only the allow-list above, every `richtext` default is block-wrapped, no `"default": ""`, and no duplicate setting ids. Quick grep backstops: `"default":.*<br`, `"default":.*<sup`, `inline_richtext` defaults — expect zero disallowed tags.
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
