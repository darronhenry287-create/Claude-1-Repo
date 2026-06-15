# PRAIRIE FAT CO. — Shopify setup checklist (~10 minutes)

The theme ships with **default menus and baked-in page content**, so it looks
complete the moment you upload it. These steps connect the real Shopify pages
so every link resolves perfectly.

## 1. Upload the theme
Online Store → Themes → **Add theme → Upload zip file** → `prairie-fat-co-shopify-theme.zip`.
Click **Customize** to preview, then **Publish** when ready.

## 2. Add your product
Products → **Add product**
- Title: **The Tallow Balm** (this gives the URL `/products/the-tallow-balm` that the
  header/footer default links point to — keep this handle, or update the links)
- Price `$24`, Compare-at price `$32` (shows the "Save 25%" badge)
- Options (optional): **Scent** → Unscented / Honey / Lavender
- **Media:** upload your jar photos here (the theme falls back to bundled art until you do)

## 3. Create the content pages
Online Store → **Pages → Add page**. For each, set the **Title** below, then on the
right under **Theme template** choose the matching template. Leave the body blank —
the design + copy are already in the template. The page **handle** (auto-made from the
title) must match, so use these exact titles:

| Page title          | Handle (auto)        | Template to choose   |
|---------------------|----------------------|----------------------|
| Our Story           | `our-story`          | `our-story`          |
| Ingredients         | `ingredients`        | `ingredients`        |
| Reviews             | `reviews`            | `reviews`            |
| How to Use          | `how-to-use`         | `how-to-use`         |
| Bundles             | `bundles`            | `bundles`            |
| FAQ                 | `faq`                | `faq`                |
| 90-Day Guarantee    | `guarantee`          | `guarantee`          |
| Contact             | `contact`            | `contact`            |
| Shipping & Returns  | `shipping-returns`   | `shipping-returns`   |
| Refund Policy       | `refund-policy`      | `refund-policy`      |
| Privacy Policy      | `privacy-policy`     | `privacy-policy`     |
| Terms of Service    | `terms-of-service`   | `terms-of-service`   |

(If a title produces a different handle, just edit the handle field to match.)

## 4. (Optional) Customise menus
The header and footer already show sensible default links. To edit them:
Online Store → **Navigation** → create a menu and pick it in the theme editor
(Header section → Menu; Footer columns → Menu). Until you do, the built-in
defaults are used automatically.

## 5. Turn on payments & launch
- Settings → **Payments** → activate Shopify Payments / PayPal. The Checkout and
  Buy-it-now buttons already route to Shopify's secure checkout.
- Settings → **Policies** can auto-generate legal policies (these override the
  baked-in policy pages in the footer if set).
- Online Store → **Preferences** → uncheck "Restrict access with a password" to go live.

That's it — everything else (cart drawer, sticky add-to-cart, reviews, sections)
works out of the box.
