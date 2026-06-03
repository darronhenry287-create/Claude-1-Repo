/* HIDE & HONEY static-site builder — wraps src/ partials in shared chrome */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const NAV = [['product.html','The Balm'],['ingredients.html','Ingredients'],['about.html','Our Story'],['reviews.html','Reviews']];
const MOBILE = [...NAV, ['contact.html','Contact'], ['faq.html','FAQ']];
const FOOT = [
  ['Shop', [['product.html','The Tallow Balm'],['collection.html','Shop All'],['bundles.html','Bundles & Save'],['reviews.html','Reviews']]],
  ['Learn', [['ingredients.html','Ingredients'],['about.html','Our Story'],['faq.html','FAQ'],['how-to.html','How to Use']]],
  ['Help', [['contact.html','Contact'],['shipping.html','Shipping & Returns'],['trial.html','90-Day Guarantee']]],
];
const LEGAL = [['privacy.html','Privacy'],['terms.html','Terms'],['refund.html','Refund Policy'],['shipping.html','Shipping']];

const links = (a) => a.map(([h,t]) => `<a href="${h}">${t}</a>`).join('\n        ');
const ic = {
  menu:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  bag:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  search:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  close:'<svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  drop:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/></svg>',
  user:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>',
};
const NAV_LEFT = [['collection.html','Shop'],['ingredients.html','Ingredients']];
const NAV_RIGHT = [['about.html','Our Story'],['reviews.html','Reviews']];

function chrome() {
  return {
    head:`  <div class="topbar">Free shipping over $35 · <strong>90-day money-back guarantee</strong> · Made in small batches</div>
  <header class="header header--center">
    <div class="header__inner">
      <div class="nav--left">
        <button class="iconbtn burger" data-action="open-menu" aria-label="Menu">${ic.menu}</button>
        <nav class="nav">${links(NAV_LEFT)}</nav>
      </div>
      <a href="index.html" class="logo">${ic.drop} HIDE <span class="amp">&amp;</span> HONEY</a>
      <div class="header__right">
        <nav class="nav nav--right">${links(NAV_RIGHT)}</nav>
        <button class="iconbtn desk" aria-label="Search">${ic.search}</button>
        <button class="iconbtn desk" aria-label="Account">${ic.user}</button>
        <button class="iconbtn" data-action="open-cart" aria-label="Cart">${ic.bag}<span class="cartnum"></span></button>
      </div>
    </div>
  </header>`,
    foot:`  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="logo">${ic.drop} HIDE <span class="amp">&amp;</span> HONEY</span>
          <p>Honest skin food, made from four simple things. Small-batch, grass-fed, and good for every kind of skin.</p>
        </div>
        ${FOOT.map(([h,l]) => `<div class="footer__col"><h4>${h}</h4>${links(l)}</div>`).join('\n        ')}
      </div>
      <div class="footer__bot">
        <p>© 2026 Hide &amp; Honey Co. All rights reserved.</p>
        <div class="footer__legal">${LEGAL.map(([h,t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="drawer__head"><h3>Your Basket</h3><button class="iconbtn" data-action="close-cart" aria-label="Close">${ic.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="freebar" id="freebar"></div>
      <div class="dsub"><span>Subtotal</span><span id="cart-sub">$0.00</span></div>
      <p class="dnote">Shipping &amp; taxes calculated at checkout</p>
      <button class="btn btn-honey btn-block btn-lg" data-action="checkout">Checkout</button>
      <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:.6rem">View full basket</a>
    </div>
  </aside>

  <div class="mobile" id="menu">
    <div class="mobile__head"><span class="logo">${ic.drop} HIDE <span class="amp">&amp;</span> HONEY</span><button class="iconbtn" data-action="close-menu" aria-label="Close">${ic.close}</button></div>
    <nav>
      ${links(MOBILE)}
    </nav>
  </div>`,
  };
}

function shell({ title, desc, body }) {
  const c = chrome();
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <meta name="description" content="${desc}">
  <link rel="stylesheet" href="assets/theme.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
${c.head}
  <main id="main">
${body}
  </main>
${c.foot}
  <script>window.HH_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html','home.html','HIDE & HONEY — Beef Tallow Honey Balm. Four ingredients, nothing else.','Whipped grass-fed beef tallow & raw honey balm. Four ingredients, nothing else. 90-day money-back guarantee.'],
  ['product.html','product.html','The Tallow Balm — HIDE & HONEY','Grass-fed beef tallow, raw honey, beeswax & olive oil. Deeply nourishing, bioidentical skin food.'],
  ['ingredients.html','ingredients.html','Ingredients — HIDE & HONEY','The four simple, traceable ingredients in every jar.'],
  ['about.html','about.html','Our Story — HIDE & HONEY','Why we render skincare back down to four honest things.'],
  ['reviews.html','reviews.html','Reviews — HIDE & HONEY','Thousands of five-star reviews for The Tallow Balm.'],
  ['collection.html','collection.html','Shop All — HIDE & HONEY','Shop the full HIDE & HONEY range.'],
  ['bundles.html','bundles.html','Bundles & Save — HIDE & HONEY','Stock up and save on the balm your skin loves.'],
  ['how-to.html','how-to.html','How to Use — HIDE & HONEY','Get the most from your Tallow Balm.'],
  ['faq.html','faq.html','FAQ — HIDE & HONEY','Questions about tallow, honey, shipping and returns.'],
  ['contact.html','contact.html','Contact — HIDE & HONEY','Talk to a real human on our team.'],
  ['cart.html','cart.html','Your Basket — HIDE & HONEY','Your basket.'],
  ['trial.html','trial.html','90-Day Guarantee — HIDE & HONEY','Love it or your money back.'],
  ['shipping.html','shipping.html','Shipping & Returns — HIDE & HONEY','How we ship and how returns work.'],
  ['refund.html','refund.html','Refund Policy — HIDE & HONEY','Our refund policy.'],
  ['privacy.html','privacy.html','Privacy Policy — HIDE & HONEY','How we handle your data.'],
  ['terms.html','terms.html','Terms of Service — HIDE & HONEY','Terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body: fs.readFileSync(path.join(SRC, src), 'utf8') }));
  n++;
}
console.log(`Built ${n} pages.`);
