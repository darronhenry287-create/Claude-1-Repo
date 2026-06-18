# GLAZE — store setup (~15 minutes)

A single-product Shopify store fronting the **medicube PDRN Pink Collagen Volume Multi Balm**, sold as **1 / 2 / 3-pack multipacks** (buy more, save more). The theme ships with baked-in copy and pink art so it looks complete the moment you upload it.

> **Please read first — this is a reseller/affiliate store.** The balm is made by **medicube**, which owns the product and trademark. GLAZE is presented as an *independent retailer*. Before you sell:
> 1. Make sure you're **authorised to sell** (authorised reseller, official dropship/affiliate program, or your own stock).
> 2. **Review every marketing claim** for your market's advertising/cosmetics rules. Copy uses "look of / appearance of" language on purpose — adjust as needed.
> 3. The **ratings and reviews in the theme are illustrative placeholders.** Replace them with real reviews (see step 7) before launch.

---

## 1. Upload the theme
Online Store → Themes → **Add theme → Upload zip file** → `glaze-shopify-theme.zip`.
Click **Customize** to preview, then **Publish** when ready. (Hard-refresh with Cmd/Ctrl+Shift+R after any re-upload so the new CSS isn't cached.)

## 2. Add the product (this powers the whole store)
Products → **Add product**
- **Title:** `PDRN Pink Collagen Volume Multi Balm`
- **Vendor:** `medicube` (shown as "by medicube" on the page)
- **Media:** upload your real product photos. Until you do, the theme shows the bundled pink balm artwork.
- **Variants** — add one option called **Pack** with three values. These render as the pack selector and create the "buy more, save more" pricing automatically (no app or discount code needed):

  | Pack | Price | Compare-at price |
  |------|-------|------------------|
  | Single | `$18.00` | — |
  | Duo (2-pack) | `$32.00` | `$36.00` |
  | Trio (3-pack) | `$45.00` | `$54.00` |

  (Or map these to the three real medicube SKUs. Adjust prices to yours — the page reads them live.)

## 3. Point "Shop" at the product
The header/footer "Shop" links go to **/collections/all**, which lists your one product. That's enough for a single-product store. (Optional: create a collection and feature the product, or edit the links in `sections/header.liquid`.)

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
- **Brand** — favicon, and **Free shipping threshold** (default `35`). This drives the cart/drawer free-shipping bar.
- **Social** — your TikTok and Instagram URLs (shown in the footer).
- **Announcement bar** — edit the top strip in the Header group.

> The free-shipping *bar* is just messaging. To actually offer free shipping over $35, set it in **Settings → Shipping and delivery**.

## 6. Payments & launch
- Settings → **Payments** — activate Shopify Payments / PayPal. Add-to-cart and Checkout already route to Shopify's secure checkout.
- Online Store → **Preferences** — uncheck "Restrict access with a password" to go live.

## 7. (Optional) Real reviews
The theme shows static testimonials and a 4.4 rating as placeholders. To collect/display real reviews, install **Judge.me**, **Loox**, or **Yotpo** and replace the content in `sections/reviews.liquid` with the app's block. Update the rating text on the product page in the **Product** section settings.

---

## What's in the box
- `glaze-shopify-theme.zip` — the uploadable Online Store 2.0 theme (theme-check clean).
- `glaze-preview.zip` — a standalone static preview (open `index.html`) to click through the whole store without Shopify.

## Editing the design
- One brand = the `glaze/` folder. `src/` holds static-preview partials; `node tools/build.js` wraps them into the root `*.html`.
- `theme.css` / `theme.js` exist in **both** `assets/` (preview) and `shopify/assets/` (theme). Change one, mirror to the other, then rerun `node tools/build.js`. Keep them in sync.
- Section copy is editable in the Shopify editor (headings, buttons, announcement, product accordions); deeper copy edits live in each `sections/*.liquid`.
