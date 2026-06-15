/* LISSE static-site builder — wraps src/ partials in shared chrome */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const MOBILE = [
  ['product.html','Shop the Oil'],['how-to.html','The Ritual'],
  ['ingredients.html','Actives'],['about.html','Our Story'],['reviews.html','Reviews'],
  ['faq.html','FAQ'],['contact.html','Contact'],
];
const FOOT = [
  ['Shop', [['product.html','Firming Body Oil'],['product.html','Subscribe & Save'],['trial.html','90-Day Promise']]],
  ['Discover', [['ingredients.html','The Actives'],['how-to.html','The Ritual'],['about.html','Our Story'],['reviews.html','Reviews']]],
  ['Help', [['contact.html','Contact'],['faq.html','FAQ'],['shipping.html','Shipping & Returns']]],
];
const LEGAL = [['privacy.html','Privacy'],['terms.html','Terms'],['refund.html','Refund Policy'],['shipping.html','Shipping']];

const links = (a) => a.map(([h,t]) => `<a href="${h}">${t}</a>`).join('\n        ');
const ic = {
  menu:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  bag:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  search:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  close:'<svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  drop:'<svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3s7 8 7 13a7 7 0 0 1-14 0c0-5 7-13 7-13Z"/></svg>',
  user:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>',
};
const NAV_LEFT = [['product.html','Shop'],['how-to.html','The Ritual']];
const NAV_RIGHT = [['ingredients.html','Actives'],['reviews.html','Reviews']];

function chrome() {
  return {
    head:`  <div class="topbar">Free shipping over $50 · <strong>90-day money-back promise</strong> · Cruelty-free &amp; vegan</div>
  <header class="header header--center">
    <div class="header__inner">
      <div class="nav--left">
        <button class="iconbtn burger" data-action="open-menu" aria-label="Menu">${ic.menu}</button>
        <nav class="nav">${links(NAV_LEFT)}</nav>
      </div>
      <a href="index.html" class="logo">LISSE</a>
      <div class="header__right">
        <nav class="nav nav--right">${links(NAV_RIGHT)}</nav>
        <button class="iconbtn desk" aria-label="Search">${ic.search}</button>
        <button class="iconbtn desk" aria-label="Account">${ic.user}</button>
        <button class="iconbtn" data-action="open-cart" aria-label="Bag">${ic.bag}<span class="cartnum"></span></button>
      </div>
    </div>
  </header>`,
    foot:`  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="logo">LISSE</span>
          <p>The daily firming ritual — a clean, plant-powered body oil that visibly firms, smooths and nourishes. One bottle, one minute, every day.</p>
        </div>
        ${FOOT.map(([h,l]) => `<div class="footer__col"><h4>${h}</h4>${links(l)}</div>`).join('\n        ')}
      </div>
      <div class="footer__bot">
        <p>© 2026 LISSE. All rights reserved.</p>
        <div class="footer__legal">${LEGAL.map(([h,t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer" aria-label="Bag">
    <div class="drawer__head"><h3>Your Bag</h3><button class="iconbtn" data-action="close-cart" aria-label="Close">${ic.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="freebar" id="freebar"></div>
      <div class="dsub"><span>Subtotal</span><span id="cart-sub">$0.00</span></div>
      <p class="dnote">Shipping &amp; taxes calculated at checkout</p>
      <button class="btn btn-honey btn-block btn-lg" data-action="checkout">Checkout</button>
      <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:.6rem">View full bag</a>
    </div>
  </aside>

  <div class="mobile" id="menu">
    <div class="mobile__head"><span class="logo">LISSE</span><button class="iconbtn" data-action="close-menu" aria-label="Close">${ic.close}</button></div>
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
  <script>document.documentElement.classList.add('js');</script>
  <link rel="stylesheet" href="assets/theme.css">
</head>
<body>
  <a class="skip" href="#main">Skip to content</a>
${c.head}
  <main id="main">
${body}
  </main>
${c.foot}
  <script>window.LISSE_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html','home.html','LISSE — The Daily Firming Ritual','A clean, plant-powered firming body oil that visibly smooths, firms and nourishes in one daily minute. 90-day money-back promise.'],
  ['product.html','product.html','Firming Body Oil — LISSE','Lightweight, fast-absorbing firming body oil with green coffee, guarana, bitter orange & ivy. Visibly firmer, smoother, more nourished skin.'],
  ['ingredients.html','ingredients.html','The Actives — LISSE','The botanicals inside LISSE: caffeine-rich green coffee & guarana, bitter orange and ivy, in a base of squalane and jojoba.'],
  ['about.html','about.html','Our Story — LISSE','Why we made firming feel like a ritual, not a chore.'],
  ['reviews.html','reviews.html','Reviews — LISSE','Thousands of five-star reviews for the LISSE Firming Body Oil.'],
  ['how-to.html','how-to.html','The Ritual — LISSE','How to use LISSE in 60 seconds a day for visibly firmer, smoother skin.'],
  ['faq.html','faq.html','FAQ — LISSE','Questions about the LISSE firming ritual, ingredients, shipping and returns.'],
  ['contact.html','contact.html','Contact — LISSE','Talk to a real human on the LISSE team.'],
  ['cart.html','cart.html','Your Bag — LISSE','Your bag.'],
  ['trial.html','trial.html','90-Day Promise — LISSE','Love it or your money back, for 90 days.'],
  ['shipping.html','shipping.html','Shipping & Returns — LISSE','How we ship and how returns work.'],
  ['refund.html','refund.html','Refund Policy — LISSE','Our refund policy.'],
  ['privacy.html','privacy.html','Privacy Policy — LISSE','How we handle your data.'],
  ['terms.html','terms.html','Terms of Service — LISSE','Terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body: fs.readFileSync(path.join(SRC, src), 'utf8') }));
  n++;
}
console.log(`Built ${n} pages.`);
