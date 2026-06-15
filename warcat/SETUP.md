# WARCAT — setup guide

Two deliverables are in this folder:

- **`warcat-shopify-theme.zip`** — the uploadable Shopify Online Store 2.0 theme.
- **`warcat-preview.zip`** — a self-contained static preview (open `index.html` in a browser). No build step, no server.

Design language: crisp white, charcoal ink, one fresh teal accent (`#0fb5a6`), Space Grotesk + Inter (self-hosted — no external font calls). Product/refill model: **one-time hardware + bundles** (no subscriptions app required).

---

## 1. Install the theme

1. Shopify admin → **Online Store → Themes → Add theme → Upload zip** → choose `warcat-shopify-theme.zip`.
2. **Customize** to preview. The theme ships with the **WARCAT** preset already applied (colors, free-shipping threshold).
3. After any later asset change, **hard-refresh** the editor (Cmd/Ctrl + Shift + R) so the new `theme.css` isn't cached.

Fonts and placeholder product/app images are bundled in the theme `assets/` (`hero.webp`, `lifestyle.webp`, `detail.webp`, `cat.webp`, `app.webp`). Replace them with real photography by uploading images to the product and via each section's image picker in the editor.

---

## 2. Create the product(s)

**Main product — “WARCAT Smart Self-Cleaning Litter Box”**
- Handle: `warcat-smart-litter-box`
- Price `499.00`, Compare-at `599.00`
- Option **Color**: `Cloud White`, `Graphite`
- Upload the box photos (you can reuse the bundled `hero.webp`, `detail.webp`, `cat.webp`, `app.webp`, `lifestyle.webp`).
- Template: **product** (default). The PDP shows the buy box, spec band, app section, reviews and guarantee out of the box.

**Accessory products** (each its own product; template **product** or a simple one):
`Anti-Tracking Mat` ($39) · `Carbon Filters 6-Pack` ($29) · `Sealed Drawer Liners 50` ($24) · `Replacement Globe` ($89) · `Low Step-In Ramp` ($29).

> The “Complete Kit” and “Multi-Cat Duo” shown in the preview are merchandising bundles. Sell them as **separate products** (a bundle product and a 2-pack product) or with Shopify’s native **Bundles**. No subscriptions app is needed.

---

## 3. Create collections

- **Shop All** (handle `all` exists automatically) — used by “Shop now” / Accessories nav fallback.
- **Accessories** (handle `accessories`) — add the accessory products. Connect it to the **Accessories** nav link.
- (Optional) A **Litter Boxes** collection for the box + bundle products.

The collection template renders a responsive product grid with quick-add. Empty collections show a tidy empty state.

---

## 4. Create the pages

Create each page under **Online Store → Pages**, set the **handle** exactly as below, and assign the **template** in the page’s “Theme template” dropdown. Pages marked *(content)* expect you to paste body copy — the matching file in `warcat-preview.zip` has ready-to-use copy you can paste straight in.

| Page title | Handle | Template | Notes |
|---|---|---|---|
| How It Works | `how-it-works` | `page.how-it-works` | Fully designed (steps + safety + guarantee). |
| Reviews | `reviews` | `page.reviews` | Designed review wall. Swap for a reviews app later if desired. |
| Bundles & Save | `bundles` | `page.bundles` | Designed offer + guarantee. |
| Our Story | `our-story` | `page.our-story` | Designed story + values. |
| FAQ | `faq` | `page.faq` | Designed accordion. |
| Support / Contact | `contact` | `page.contact` | Live Shopify contact form. |
| Tech Specs | `specs` | `page.specs` | *(content)* paste from `specs.html`. |
| 90-Night Trial | `trial` | `page.trial` | *(content)* paste from `trial.html`. |
| 2-Year Warranty | `warranty` | `page.warranty` | *(content)* paste from `warranty.html`. |
| Shipping & Returns | `shipping-returns` | `page.shipping-returns` | *(content)* paste from `shipping.html`. |
| Refund Policy | `refund-policy` | `page.refund-policy` | *(content)* paste from `refund.html`. |
| Privacy Policy | `privacy-policy` | `page.privacy-policy` | *(content)* paste from `privacy.html`. |
| Terms of Service | `terms-of-service` | `page.terms-of-service` | *(content)* paste from `terms.html`. |

> Tip: Shopify’s **Settings → Policies** can also generate refund/privacy/terms; if you use those, point the footer links at them instead.

---

## 5. Build the navigation menus

**Online Store → Navigation.** Create/edit these menus (the header & footer read them by handle):

- **`main-menu`** (header): The Litter Box → `/products/warcat-smart-litter-box`, How It Works → `/pages/how-it-works`, Accessories → `/collections/accessories`, Reviews → `/pages/reviews`.
- **`footer-shop`**: WARCAT Litter Box, Accessories, Bundles & Save, 90-Night Trial.
- **`footer-learn`**: How It Works, Tech Specs, Reviews, Our Story.
- **`footer-support`**: Contact Us, FAQ, Shipping & Returns, 2-Year Warranty.
- **`footer-legal`**: Privacy, Terms, Refund Policy, Shipping.

Then in **Customize → Footer**, confirm each footer column block points at the matching menu, and set the social URLs.

---

## 6. Theme settings to check

- **Theme settings → Cart:** free-shipping threshold (default **$49**) drives the cart-drawer progress bar.
- **Theme settings → Colors / Brand:** accent, ink, background and logo text are editable. Upload a logo image to replace the built-in WARCAT wordmark if you have one.
- **Header → Button:** the “Shop now” label/link.
- **Newsletter** section uses Shopify’s native customer signup (tags new subscribers `newsletter`). Connect your email app (Klaviyo/Shopify Email) to receive them.

---

## 7. Apps (optional)

- **Reviews:** the review sections are static social proof. To show live reviews, install Judge.me / Loox / Yotpo and replace the “Review wall” section content (or add the app’s block).
- **Bundles:** Shopify native **Bundles** (or a bundle app) for the Complete Kit / Multi-Cat Duo if you don’t want separate products.
- **No subscriptions app is required** — WARCAT is sold as one-time hardware plus accessories.

---

## 8. Editing notes

- All home and page sections are editable in the theme editor (headings, copy, images, list items as blocks).
- Every cleaning/quiet/feature claim in the copy is marketing placeholder — review against your real product spec before launch.
- The static preview mirrors the Shopify theme 1:1 (same `theme.css` / `theme.js`); use it to demo the storefront without a dev store.
