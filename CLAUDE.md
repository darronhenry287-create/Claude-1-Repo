# CLAUDE.md — brand-build playbook

Lessons banked from the SOMNA, PRAIRIE FAT CO. and WARCAT builds. Read before starting a new brand build, and before reaching for a "band-aid" fix on an existing one.

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

## Working style — non-negotiables (the user has had to repeat these)

These are about *how to operate*, not the code. Each has been corrected more than once. Don't make them say it again.

- **Act, don't pause.** When the user is experienced and says "build it / fix it / go," stop narrating options and asking permission for obvious next steps — make the call and ship. "Why are you always pausing?" means: decide and move.
- **Get the on-screen error before iterating — one screenshot beats ten re-uploads.** On any "it's broken in Shopify" report, the first move is to see the *actual* editor/storefront error (ask for a screenshot or the exact text). The WARCAT homepage 404 burned ~10 re-ships of locally-"valid" themes; the editor's literal error — *"'hero' is not a valid section type"* — pinpointed it in one read. Local theme-check / Liquid passing does **not** mean Shopify is happy.
- **Trust the user's domain knowledge.** They know Shopify cold. Don't ask them to "check the template dropdown" or second-guess their setup ("are you sure there's a product?"). If they say the homepage 404s, it 404s — find the cause, don't re-explain their own store to them.
- **"Do it like [prior brand]" = match its quality bar, then push past it.** Study the referenced build (creo / SOMNA / a known-good one) for sure — don't claim it's inaccessible — and treat what works there as the proven baseline. But the goal is to **develop further and improve on it, not clone it**: take the standard as the floor, bring genuinely better/newer execution each build, and move the bar forward. Reference it, then advance — don't reskin it and don't stand still.
- **Ship the complete store, not just the hero product.** "Finished" means the full lineup — bundles + accessories with real imagery, a populated catalog, a populated footer — plus baked fallbacks (gallery images when a product has none, footer fallback links when menus aren't set, a catalog showcase) so nothing looks empty before the merchant provisions products/menus/pages. Don't make the user ask for the obvious missing pieces.
- **Read what the user actually asked, especially about images.** "Callouts/USPs on the carousel pictures" means *baked onto the carousel images*, not the same content moved into separate sections. Re-read the request before building; don't pattern-match to what's convenient.
- **Always deliver both zips, together.** Every delivery ships the Shopify theme **and** the static preview in the *same* `SendUserFile` call — every time, even if only one of them changed. The user always wants the pair; never send just one. (This means: after any theme fix, re-sync `src/` + rebuild the preview so the two match, then send both.)

## Shopify hard rules

### Schema & defaults
- Never set `"default": ""` on a schema setting. An empty string can be interpreted as "missing" and silently breaks page templates that expect a value. Either omit `default` or set a real default string.
- Don't use `"type": "header"` for schema info dividers — it collides with the section type `header`. Use `"type": "paragraph"`.
- Don't ship blank `templates/page.<handle>.json` — design the page (rich-text head + designed sections + newsletter). A blank `{ "sections": {} }` is worse than no template.

### Section groups & tags
- Header/footer use **plural** `{% sections 'header-group' %}` (section groups, JSON file). The singular `{% section 'header' %}` (single section) throws *"'header' is not a valid section type"* when paired with a `*-group.json`.
- Guard every `{% paginate %}`. `{% paginate collection.products by N %}` throws *"Array 'collection.products' is not paginateable"* the instant a `main-collection`-style section renders on a template where no collection is connected (e.g. a generic page template). Wrap in `{% if collection != blank and collection.products_count > 0 %}` and render an empty-state otherwise.
- Don't gate sections on `forloop`-internal `{% else %}` for "no products yet" — the paginate error fires before the for loop ever runs.

### A JSON template 404s / "'X' is not a valid section type" (custom sections not registering)
- **Symptom (WARCAT):** the homepage JSON template 404s — or, as a `templates/index.liquid` with `{% section 'hero' %}`, prints *"'hero' is not a valid section type"* in the editor; and **a `page.<x>.json` template that references these sections cannot be saved** when assigned to a Shopify Page (e.g. `page.our-story` won't save, `page.privacy-policy` — which uses only `main-page` — saves fine). Meanwhile **every local check passes** (theme-check 0/0/0, schemas valid, files present in the zip, and the section files even parse clean under Shopify's own Ruby `liquid` gem in strict mode). The failure is Shopify-side **section registration**, which no local tool can see.
- **The tell:** sections that **register** are the preset-free `main-*` sections (`main-page`, `main-contact`, `main-product`, `main-collection`) and the header/footer groups; the sections that **don't** are the custom content sections that carry `"presets"`. So the templates that break are exactly the ones mixing in a preset-having custom section. (Map it fast: list each template's section types and diff the failing ones against a working one.)
- **Get the editor's literal error first** — it names the offending section type. Don't re-validate locally cycle after cycle; the files are valid.
- **Robust fix: inline the affected template into `.liquid`.** Ship `templates/index.liquid` (or `templates/page.<x>.liquid`) with the markup baked in so it renders through the same plain-Liquid path as `layout/theme.liquid` and the 404 template — **zero dependence on section registration.** Transpile each section + its `{% schema %}` *defaults* to static HTML (Ruby `liquid` render works well), keep `asset_url` / `routes` / `{% form 'customer' %}` / `{% form 'contact' %}` / `{{ page.title }}` / `{{ page.content }}` as live Liquid, and inline `{% render 'icon' %}` SVGs. Escape any setting value containing `<` (e.g. `"<40 dB"`) — a raw `<` before a space/digit is invalid HTML; in the transpile, `gsub(/<(?=[\s\d])/, '&lt;')`. The merchant still picks `page.<x>` in the template dropdown (same handle). Leave templates that use only `main-*` as JSON — they work. Tradeoff: inlined sections are no longer customizer-editable — say so. (For a product/collection template whose *dynamic* `main-*` section renders but whose trailing preset sections silently drop, fold that content **into** the `main-*` `.liquid` rather than inlining the whole template.)
- **Verify with the real compiler, not just liquidjs/theme-check:** `gem install liquid`, register the theme tags (`form`/`paginate`/`section`/`sections`/`style`/`javascript`/`stylesheet`) as no-op blocks, strip `{% schema %}`, then `Liquid::Template.parse(src, error_mode: :strict)`. This catches Shopify-strict parse errors the JS tools accept.

### Cart / checkout buttons
- `<a href="/cart/{variant_id}:{qty}">` is Shopify's **quick-checkout permalink** — it sends users to checkout, not the cart. For "add to cart" buttons (bundle upsells, quick-adds), use AJAX `POST /cart/add.js` and either reload + open the drawer or update the drawer in place. Use `/cart` (or `/discount/<code>?redirect=/cart`) as the no-JS fallback.
- `{{ form | payment_button }}` renders Shopify's dynamic-checkout button (blue "Buy it now" / Shop Pay). Remove it when the brief calls for a single Add-to-cart CTA.

### Images
- Every `<img>` should have explicit `width` and `height` attributes — theme-check flags `ImgWidthAndHeight` and missing dims cause CLS in real storefronts. Even when using `image_url` with a width filter, also emit the attribute.
- PDP gallery: never hardcode `limit: N` on `{% for image in product.images %}`. Render all images and let CSS wrap (`grid-template-columns: repeat(auto-fill, minmax(72px, 1fr))`).
- When a gallery frame is designed for illustrations (heavy kraft border, offset shadow, image at 76%), give real photos a separate variant (`.has-photo` modifier: `width:100%`, `height:100%`, `object-fit:cover`, soft drop shadow, no kraft border). Don't make photos sit inside an illustration frame.
- Don't put decorative overlays (seal stamps, badges) on top of real product photos — they look great on illustrations, bad on photography. Leave them in a separate trust-row beneath the buy box.
- Thumbnail click should swap the main image's `src` in place — never `innerHTML = <img ...>` (it wipes overlay siblings like the seal badge).
- **The global image reset MUST be `img,svg,video{max-width:100%;height:auto}`.** Omitting `height:auto` while constraining only the width of an `<img>` that carries `width`/`height` HTML attributes makes the browser keep the literal attribute height → a stretched/squished image (the "horrible stretched app phone" bug). Images that fill a fixed frame must set `height:100%;object-fit:cover` explicitly (that overrides the reset).

### Feature images & callouts — brand standard (do this on every build)
The merchant wants the **gummies-style** treatment: premium, baked-in marketing imagery, not just bare product shots. On every brand, generate and place:
- **USP feature images** — product on one side; on the other a small brand-colored pill badge, a bold headline, 3–4 benefit rows each with a brand-color check icon, and a star rating + review count (e.g. WARCAT `usp-hero.webp`, `app-feature.webp`).
- **Annotated callout diagrams** — the product centered with thin brand-color leader lines + dots pointing to 4 labelled parts/specs, Apple-keynote style (e.g. WARCAT `callout.webp`).
- Generate with `nano_banana_pro` (best text rendering) at 2k; **put the exact text and brand hex in the prompt**, and **always open and visually verify the rendered text** before using — regenerate if a word is garbled.
- Frame them simply (`.featimg`: rounded card, hairline border, soft shadow, `max-width ~1060px`, `img{width:100%;height:auto}`) inside a normal alternating-background section. Keep baked text short/high-contrast — it doesn't reflow on mobile.
- In Shopify, expose via a reusable **`feature-image`** section (image_picker override + built-in asset fallback + ratio select) so it's swappable.

### The PDP image carousel IS infographics — not plain product shots
The product-page gallery (top of the PDP, next to the buy box) is the #1 thing the user judges. The user corrected this **twice** on WARCAT.
- The carousel must **lead with annotated / USP slides — the callouts and benefit text baked ON each carousel image** (creo-style), generated **square 1:1** so they don't crop in the gallery frame (`object-fit:cover`). A good set: USP hero (product + headline + benefit checks + star rating), anatomy callouts (leader lines to 4 parts), a big-spec slide (e.g. a huge `<40 dB` + sound waves), a scale/capacity slide (product + cat silhouette), an app/dashboard slide — plus **one** clean studio shot and **one** lifestyle shot to round it out.
- **Do NOT** make the carousel plain product photos and move the callouts/USPs into separate sections below the buy box. The annotations belong **on the carousel pictures**. (Plain studio shots are the *fallback* the gallery uses only when real product images exist.)
- Distinguish the two image kinds explicitly: **carousel/PDP-gallery images** (square, annotated, the buyer's first look) vs **section/marketing bands** (landscape feature images for content rows). Don't blur them.

### Generating product imagery — consistency & text (nano_banana)
- **Generate every angle/slide from one canonical reference image** so the product is identical across the whole set — a different shape/finish on one slide reads as "horrible product pictures." The higgsfield **upload host is egress-blocked** in this env, so push the canonical shot to the repo and `media_import_url` its **raw GitHub URL** to get a reference `media_id` (download/cloudfront hosts *are* reachable), or pass a prior generation's `job_id` as the reference. Then prompt only for the new angle/overlay.
- **nano_banana duplicates text** — it will render a headline twice or mirror a line. Put *"render every text element exactly once — never repeat, mirror or duplicate any text"* in the prompt, and **open and read every generated slide before using it**; regenerate any with duplicated or garbled copy. Verify, every single time — never ship an unread generation.
- Square slides for the carousel; landscape (3:2) for section bands. Optimize to webp (`fit:inside`, quality ~86) and mirror into both `shopify/assets/` and `assets/img/`.

### Baked fallbacks so an un-provisioned store looks complete
A fresh store has no product images, no prices, no nav menus, no created Pages. Ship fallbacks so nothing looks broken before the merchant provisions it, and list the real setup in SETUP.md:
- **PDP gallery:** `{% if product.images.size > 0 %}` use the real images, `{% else %}` render the baked square infographic carousel.
- **product-card:** when `product.featured_image` is blank, fall back to a baked studio shot so collection cards aren't empty boxes.
- **Footer columns / legal:** when a `link_list` menu isn't connected, render a `links_fallback` richtext of `<a>` links (the PRAIRIE FAT CO. pattern) instead of blank columns.
- **Catalog:** bake a "complete the system" showcase (bundles + accessories with imagery + prices, linking to the product) below the real products, so the full lineup shows before those become real Shopify products.

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
- **Strict Shopify Liquid parse:** `gem install liquid` gives the real storefront compiler. Register theme tags (`form`/`paginate`/`section`/`sections`/`style`/`javascript`/`stylesheet`) as no-op blocks, strip `{% schema %}`, then `Liquid::Template.parse(src, error_mode: :strict)` over `sections/`, `snippets/`, `layout/`. Catches Shopify-strict parse errors that liquidjs and theme-check accept. (Force UTF-8: `Encoding.default_external = Encoding::UTF_8`.)
- **Image generation (higgsfield/nano_banana):** the **upload host is egress-blocked** — to use a local asset as a reference, push it to the repo and `media_import_url` its raw GitHub URL (cloudfront download hosts are reachable), or reuse a prior generation's `job_id`. Always download the result, **open it to verify text**, then `sharp`-optimize to webp into both asset dirs.
- Git: feature branch is the source of truth. Push with `git push -u origin <branch>`, retry on network errors with exponential backoff (2s, 4s, 8s, 16s) up to 4 times. Never `--no-verify`.
- Delivery: prefer sending the built zips directly via `SendUserFile` rather than asking the user to clone. **Always send BOTH the theme zip and the preview zip in the same `SendUserFile` call, every time — even when only the theme changed** (re-sync `src/` + rebuild the preview first so the pair matches). They'll re-upload the theme into Shopify's admin; remind them to **hard-refresh** (Cmd/Ctrl+Shift+R) so the new `theme.css` isn't cached.
