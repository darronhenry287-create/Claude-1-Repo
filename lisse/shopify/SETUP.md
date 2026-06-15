# LISSE — Shopify setup checklist (~10 minutes)

The theme ships with **default menus and baked-in section content**, so it looks
complete the moment you upload it. These steps connect the real Shopify product,
pages and apps so every link, price and button resolves perfectly.

> Tip: after you upload or re-upload the theme, **hard-refresh** the storefront
> (Cmd/Ctrl + Shift + R) so the new `theme.css` / `theme.js` aren't served from cache.

## 1. Upload the theme
Online Store → Themes → **Add theme → Upload zip file** → `lisse-shopify-theme.zip`.
Click **Customize** to preview, then **Publish** when ready.

## 2. Add your product
Products → **Add product**
- Title: **Firming Body Oil** — this gives the URL `/products/firming-body-oil`,
  which the header, footer and "Shop the Oil" buttons point to. Keep this handle
  (or update the links in the theme editor / footer fallback if you change it).
- Price **$48.00**, Compare-at price **$58.00** (this shows the "Save 17%" badge).
- Size: **100 ml**.
- **Media:** upload your real product photos here. Until you do, the theme falls
  back to the bundled images (`product-hero.png`, etc.). The product gallery shows
  all images you upload — no need to limit how many.
- The product page's **plan selector** is the single place to buy: One bottle ($48),
  Subscribe & Save ($38), and the 3-Bottle Ritual ($120). There is no separate bundle
  product or page — see step 4 to make the subscription and trio charge correctly.

## 3. Create the content pages
Online Store → **Pages → Add page**. For each, set the **Title** below, then on the
right under **Theme template** choose the matching template. Leave the body blank —
the design + LISSE copy already live in the template. The page **handle** (auto-made
from the title) must match these exactly, so use these titles:

| Page title          | Handle (auto)        | Template to choose   |
|---------------------|----------------------|----------------------|
| Our Story           | `our-story`          | `our-story`          |
| Ingredients         | `ingredients`        | `ingredients`        |
| Reviews             | `reviews`            | `reviews`            |
| How to Use          | `how-to-use`         | `how-to-use`         |
| FAQ                 | `faq`                | `faq`                |
| 90-Day Promise      | `guarantee`          | `guarantee`          |
| Contact             | `contact`            | `contact`            |
| Shipping & Returns  | `shipping-returns`   | `shipping-returns`   |
| Refund Policy       | `refund-policy`      | `refund-policy`      |
| Privacy Policy      | `privacy-policy`     | `privacy-policy`     |
| Terms of Service    | `terms-of-service`   | `terms-of-service`   |

(If a title produces a different handle, just edit the handle field to match.)

## 4. Subscriptions, bundles & collections
- **Subscribe & Save ($38/bottle):** the tier selector on the product page is
  **display-only UI**. It does **not** create a real recurring subscription unless a
  subscriptions app is installed and the product is added to a selling plan. Install
  **Shopify Subscriptions** (free) or **Recharge**, create a subscription plan for the
  Firming Body Oil, then the "Subscribe & Save" option will sell as a true sub.
  Without an app, leave it as marketing UI or hide it.
- **3-Bottle Ritual ($120 / $40 each):** this is a **plan option in the product
  page's selector**, not a separate product or page. To make it charge correctly,
  fulfil it with a **bundle app** (Shopify Bundles or similar) that groups 3 bottles
  into one item, or an automatic **discount** (a "buy 3 for $120" rule, or code
  `RITUAL3`) under Discounts.
- **Shop link & collections:** the header/footer **"Shop"** links point straight to
  `/products/firming-body-oil` — this is a one-product store, so no collection is
  needed for navigation. Create an **All** collection only if you want a
  `/collections/all` browse page.

## 5. Free shipping threshold
The cart drawer's "free shipping over $50" progress bar reads a theme setting.
Theme editor → **Theme settings → Cart / Shipping** → set the free-shipping
threshold to **50** (so the bar math matches the $50 free-shipping promise). Then
set the matching real shipping rate in Settings → **Shipping and delivery**
(free over $50; flat rate under).

## 6. Reviews (optional)
The theme displays **4.9★ / 6,400+ reviews** as baked-in social proof. To show live,
verified reviews, install a reviews app (**Judge.me**, **Loox**, or **Okendo**). The
product card reads `product.metafields.reviews.rating` / `rating_count` if present,
so most apps that write those metafields will light up the star counts automatically.

## 7. (Optional) Customise menus
The header and footer already show sensible default links. To edit them:
Online Store → **Navigation** → create a menu and pick it in the theme editor
(Header section → Menu; Footer columns → Menu). Until you do, the built-in
defaults are used automatically.

## 8. Turn on payments & launch
- Settings → **Payments** → activate Shopify Payments / PayPal. Checkout and the
  Add-to-bag flow already route to Shopify's secure checkout.
- Settings → **Policies** can auto-generate legal policies (these override the
  baked-in Privacy / Terms / Refund / Shipping pages in the footer if set).
- Update the support email used in the policy pages if it isn't **hello@lisse.com**.
- Online Store → **Preferences** → uncheck "Restrict access with a password" to go live.

That's it — the cart drawer, sticky add-to-bag, ingredient diagram, results timeline
and reviews all work out of the box once the product and pages are connected.
