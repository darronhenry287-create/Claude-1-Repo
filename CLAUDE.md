# CLAUDE.md — DTC brand website playbook

Project memory for building **DTC brand storefronts** (Shopify themes + a static
preview) in this repo. Read this BEFORE starting any new brand build. These rules
come from real mistakes made on past builds (SOMNA, Prairie Fat Co, CREO) — some
of which repeated. Do not repeat them.

## How brands are organized
- Each brand lives in its **own top-level folder** (e.g. `form-creatine/` = CREO,
  `hide-and-honey/` = Prairie Fat Co). A new brand → a new folder, never clobber
  an existing one.
- Each brand folder is **dual-target**:
  - `shopify/` — the real Shopify theme (assets, config, layout, locales,
    sections, snippets, templates).
  - `src/*.html` + `tools/build.js` — a static browsable preview; `build.js`
    wraps the `src` partials in shared header/footer chrome → root `*.html`.
  - `assets/theme.css` + `assets/theme.js` are **duplicated** from
    `shopify/assets/`. Edit once, copy to BOTH, then rebuild the preview.
- Deliverables: `<brand>-shopify-theme.zip` (theme folders at the ZIP root) and
  `<brand>-preview.zip` (html + assets). Send both via the file tool.

## Ask the user up front (don't assume)
- "Match a previous brand's layout, or a fully original design?" (CREO had to be
  rebuilt once because I reused the SOMNA layout without asking.)
- Let the user pick brand name / direction / palette from options — they like
  choosing.

## SHOPIFY HARD RULES — these silently break things
1. **Never use `"default": ""` (empty string) on a `text`, `textarea`, or
   `richtext` setting** in a section `{% schema %}`. Shopify's theme *importer*
   silently rejects the whole section, which makes **every page template that
   uses it disappear** from the page Template dropdown. Offline linters do NOT
   catch this. → Omit the `default` key entirely. (Empty `""` is fine only on a
   `select` whose options include a `""` value.) *This cost ~2 hours on CREO.*
2. **`richtext` defaults must be wrapped** in a block tag, e.g. `<p>…</p>`.
3. **Setting `id`s**: lowercase letters / numbers / underscores only; unique per
   section/block. Informational types (`header`, `paragraph`) must NOT have an
   `id`.
4. **`range`**: `(max-min)/step` must be a whole number ≤ 101 and the `default`
   must land on a step.
5. **Every `<img>` needs `width` and `height`** (theme-check flags missing ones).
6. **Ship designed page templates** — `templates/page.<name>.json` composed from
   sections (About, FAQ, How-to, Guarantee, Quality, Reviews, policies). The
   merchant then just creates a page and picks the template. Don't hand them a
   blank generic page. (Prairie did this; match it.)
7. **Brand rename = case-sensitive whole-word only** (`\bOLDNAME\b`). A blind
   replace breaks `<form>`, `class="form"`, `{% form %}`, `#…-form`, and JS flags
   like `OLD_MOCK`.
8. Subscribe-&-Save tiers are **display-only**; real recurring billing needs a
   Shopify subscriptions app + selling plan. Say so.
9. Pages, products, policies, and menus are **store data**, not theme files —
   the merchant adds them in admin. Policies live in Settings → Policies (footer
   auto-links them).

## VALIDATE before every delivery (do all of these)
- `npx @shopify/cli theme check --path <brand>/shopify` → fix real errors.
- All standalone `*.json` parse; every `{% schema %}` block parses.
- Every section `type` referenced in `templates/*.json` and `*-group.json` exists
  as a `sections/<type>.liquid` file.
- `node tools/build.js` rebuilds the preview with no broken internal links or
  missing `assets/img/*` references.
- Keep the git tree clean: commit + push after changes (a stop hook enforces it).
  Rebuild the zips so the committed artifacts match the source.

## When something breaks in Shopify (debugging)
- Get **one piece of ground truth fast** (a screenshot, or a yes/no like "does
  the live homepage look designed?") instead of re-sending zips and guessing.
  That single question isolated the CREO page-template bug instantly.
- **Compare against the last known-good brand** (Prairie) when something that
  worked there fails now.
- An uploaded theme isn't live until **published**; the page Template dropdown
  reads the published theme.

## Tools / environment notes
- This is a Claude Code session in a cloud container; MCP connectors added in the
  Claude *app* (e.g. Higgsfield image gen) don't automatically appear here —
  re-check with ToolSearch before saying a tool is unavailable.
- For reliable Shopify deploys, a **GitHub-connected** theme needs the theme at
  the **repo root of a branch** (Shopify's GitHub integration can't read a
  subfolder) — e.g. the `creo-theme` branch.
