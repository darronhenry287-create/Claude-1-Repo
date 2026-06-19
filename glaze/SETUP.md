# GLAZE — store setup (~15 minutes)

A single-product Shopify store for the **Pink Collagen Glow Balm**, sold as **1 / 2 / 3-pack multipacks** (buy more, save more). The theme ships with baked-in copy and original pink imagery, so it looks complete the moment you upload it.

> **Before you launch — a few honest notes:**
> 1. **You supply the product.** This store is brand-neutral ("GLAZE", your own label). Make sure you can source and fulfil the balm (own stock, white-label/private-label, or a supplier).
> 2. **Imagery is original AI-generated placeholder art** created for this build — fine to launch with, but swap in real photos of your actual product when you can (especially the product shots).
> 3. **Reviews, ratings and stats are illustrative placeholders.** Replace them with real ones before launch (see step 7).
> 4. **Check your claims.** Copy uses "look of / appearance of" language on purpose. Review it against your market's cosmetics/advertising rules before going live.

---

## ⚠️ A fresh upload looks "unfinished" until you do steps 2 & 4 — this is expected

When you first connect the theme to a brand-new store, Shopify attaches a placeholder **"Default product"** (£0.00, one variant) and you have **no Pages yet**. So before setup you'll see:

| You see… | Why | Fixed by |
|----------|-----|----------|
| Price shows **£0.00** / "From $18" | The placeholder product has no price | **Step 2** — add the product with prices |
| **No pack selector** (1/2/3-pack) in the buy box | The placeholder product has only one variant | **Step 2** — add the `Pack` option with 3 variants |
| **Logo says "My Store"** | That's the default store name | **Step 5** — set Brand name / upload a logo (now defaults to **GLAZE**) |
| Header has **no "How to Use / Ingredients / Reviews"** links | Those Pages don't exist yet | **Step 4** — create the Pages; links appear automatically |

**The home page works** — click the logo or the new **Home** link to reach it. Nav links to pages you haven't created **stay hidden on purpose** so the storefront never shows a broken (404) link. As you create each Page in step 4, its link appears by itself.

---

## 1. Upload the theme
Online Store → Themes → **Add theme → Upload zip file** → `glaze-shopify-theme.zip`.
Click **Customize** to preview, then **Publish** when ready. Hard-refresh (Cmd/Ctrl+Shift+R) after any re-upload so new CSS isn't cached.

## 2. Add the product (this powers the whole store)
Products → **Add product**
- **Title:** `Pink Collagen Glow Balm`
- **Vendor:** `GLAZE`
- **Media:** upload your real product photos. Until you do, the theme uses the bundled pink artwork.
- **Variants** — add one option called **Pack** with three values. These render as the pack selector and create the "buy more, save more" pricing automatically (no app or discount code needed):

  | Pack | Price | Compare-at price |
  |------|-------|------------------|
  | Single | `$18.00` | — |
  | Duo (2-pack) | `$32.00` | `$36.00` |
  | Trio (3-pack) | `$45.00` | `$54.00` |

  Adjust prices to yours — the page reads them live.

## 3. Point "Shop" at the product
The header/footer "Shop" links go to **/collections/all**, which lists your one product. That's enough for a single-product store. (Optional: feature the product in a collection, or edit the links in `sections/header.liquid`.)

## 4. Create the content pages
Online Store → **Pages → Add page**. Use these exact **titles** (the handle auto-matches) and pick the matching **Theme template** on the right. Leave the body **blank** for the first six — the design + copy live in the template.

| Page title | Handle | Template | Body |
|------------|--------|----------|------|
| How to Use | `how-to` | `how-to` | leave blank |
| Ingredients | `ingredients` | `ingredients` | leave blank |
| Reviews | `reviews` | `reviews` | leave blank |
| About | `about` | `about` | leave blank |
| FAQ | `faq` | `faq` | leave blank |
| Contact | `contact` | `contact` | leave blank |
| Shipping & Returns | `shipping-returns` | `shipping-returns` | paste your policy* |
| Refund Policy | `refund-policy` | `refund-policy` | paste your policy* |
| Privacy Policy | `privacy-policy` | `privacy-policy` | paste your policy* |
| Terms of Service | `terms-of-service` | `terms-of-service` | paste your policy* |

\* The four policy pages render a styled heading + whatever you paste in the page body. Starter copy is in the static preview (`shipping.html`, `refund.html`, `privacy.html`, `terms.html`) — copy/paste and edit, or use Shopify **Settings → Policies**.

## 5. Theme settings
Customize → **Theme settings**:
- **Colours** — blush background, brand pink, button pink, ink. (Defaults match the design.)
- **Brand** — **Logo image** (optional; replaces the text logo), **Brand name** (the text logo & footer name — defaults to **GLAZE**, change it here instead of renaming your store), **Logo height**, favicon, and **Free shipping threshold** (default `35`) which drives the cart/drawer free-shipping bar.
- **Social** — your TikTok and Instagram URLs (shown in the footer).
- **Announcement bar** + each home **section** (hero, lifestyle banner, multipack, gallery, guarantee, etc.) are editable in the editor — headings, buttons, and links.

> The free-shipping *bar* is just messaging. To actually offer free shipping over $35, set it in **Settings → Shipping and delivery**.

## 6. Payments & launch
- Settings → **Payments** — activate Shopify Payments / PayPal. Add-to-cart and Checkout already route to Shopify's secure checkout.
- Online Store → **Preferences** — uncheck "Restrict access with a password" to go live.

## 7. (Optional) Real reviews
The theme shows static testimonials and a 4.9 rating as placeholders. To collect/display real reviews, install **Judge.me**, **Loox**, or **Yotpo** and replace the content in `sections/reviews.liquid`. Update the rating text on the product page in the **Product** section settings.

---

## What's in the box
- `glaze-shopify-theme.zip` — the uploadable Online Store 2.0 theme (theme-check clean).
- `glaze-preview.zip` — a standalone static preview (open `index.html`) to click through the whole store without Shopify.

## Editing the design
- One brand = the `glaze/` folder. `src/` holds static-preview partials; `node tools/build.js` wraps them into the root `*.html`.
- `theme.css` / `theme.js` and the images live in **both** `assets/` (preview) and `shopify/assets/` (theme). Change one, mirror to the other, then rerun `node tools/build.js`.
- Section copy is editable in the Shopify editor; deeper copy/layout edits live in each `sections/*.liquid`.
- To replace the AI imagery with your own, drop new files over the matching names in `shopify/assets/` and `assets/img/` (e.g. `hero-product.jpg`, `texture.jpg`, `model-glow.jpg`), or upload product photos to the product in admin.
