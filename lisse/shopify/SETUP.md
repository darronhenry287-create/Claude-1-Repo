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
- (Optional) If you sell the trio as its own product, create a **3-Bottle Ritual**
  product at **$120.00** and point the upsell/bundle button at it (see step 4).

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
| Bundles             | `bundles`            | `bundles`            |
| FAQ                 | `faq`                | `faq`                |
| 90-Day Promise      | `guarantee`          | `guarantee`          |
| Contact             | `contact`            | `contact`            |
| Shipping & Returns  | `shipping-returns`   | `shipping-returns`   |
| Refund Policy       | `refund-policy`      | `refund-policy`      |
| Privacy Policy      | `privacy-policy`     | `privacy-policy`     |
| Terms of Service    | `terms-of-service`   | `terms-of-service`   |

(If a title produces a different handle, just edit the handle field to match.)
The **Bundles** page uses a collection — connect one in step 4 so products show.

## 4. Subscriptions, bundles & collections
- **Subscribe & Save ($38/bottle):** the tier selector on the product page is
  **display-only UI**. It does **not** create a real recurring subscription unless a
  subscriptions app is installed and the product is added to a selling plan. Install
  **Shopify Subscriptions** (free) or **Recharge**, create a subscription plan for the
  Firming Body Oil, then the "Subscribe & Save" option will sell as a true sub.
  Without an app, leave it as marketing UI or hide it.
- **3-Bottle Ritual ($120 / $40 each):** this is an upsell/bundle. Fulfil it one of
  two ways: (a) a **bundle app** (Shopify Bundles, or a 3rd-party builder) that
  groups 3 bottles into one purchasable item, or (b) an automatic **discount** — e.g.
  create a discount code `RITUAL3` (or an automatic "buy 3, price $120") under
  Discounts. Point the bundle/upsell button at the matching product or cart link.
- **Collections:** create an **All** collection (`/collections/all` is used by the
  "Shop All" links) and, if you want the Bundles page populated, a **Bundles**
  collection — then connect it in the theme editor (Bundles page → collection section).

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
