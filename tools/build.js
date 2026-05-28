/* ============================================================
   SOMNA static-site builder
   Wraps body partials in src/ with the shared header/footer chrome
   and writes the final *.html pages to the repo root.
   Run:  node tools/build.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const NAV = [
  ['product.html', 'The Cloud Pillow'],
  ['collection.html', 'Shop All'],
  ['about.html', 'Our Story'],
  ['reviews.html', 'Reviews'],
];
const MOBILE_NAV = [...NAV, ['contact.html', 'Contact'], ['faq.html', 'FAQ']];

const FOOTER_COLS = [
  ['Shop', [['product.html', 'The Cloud Pillow'], ['collection.html', 'Shop All'], ['bundles.html', 'Bundles'], ['reviews.html', 'Reviews']]],
  ['Help', [['contact.html', 'Contact'], ['faq.html', 'FAQ'], ['trial.html', '100-Night Trial'], ['shipping.html', 'Shipping & Returns'], ['warranty.html', 'Warranty']]],
  ['Company', [['about.html', 'Our Story'], ['index.html#science', 'The Science'], ['sustainability.html', 'Sustainability'], ['contact.html', 'Wholesale']]],
];
const LEGAL = [['privacy.html', 'Privacy Policy'], ['terms.html', 'Terms of Service'], ['refund.html', 'Refund Policy'], ['shipping.html', 'Shipping Policy']];

const icon = {
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.6"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  tt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M9 12a4 4 0 1 0 4 4V4c1 2 3 3 5 3"/></svg>',
  pin: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M12 2a10 10 0 0 0-4 19l1-5M9 11a3 3 0 1 1 6 0c0 3-2 5-4 5"/></svg>',
};

const navLinks = (arr) => arr.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n        ');

function chrome() {
  return {
    head: `  <div class="announce">Free shipping over $75 · <strong>100-night risk-free trial</strong> · Ships in 24h</div>

  <header class="header">
    <div class="header__inner">
      <button class="icon-btn burger" data-action="open-menu" aria-label="Menu">${icon.menu}</button>
      <a href="index.html" class="logo">SOMNA</a>
      <nav class="nav">
        ${navLinks(NAV)}
      </nav>
      <div class="header__actions">
        <button class="icon-btn desktop-only" aria-label="Search">${icon.search}</button>
        <button class="icon-btn" data-action="open-cart" aria-label="Cart">${icon.cart}<span class="cart-count"></span></button>
      </div>
    </div>
  </header>`,
    foot: `  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="logo">SOMNA</span>
          <p>Sleep, engineered. Premium rest essentials designed in California, loved in 40+ countries.</p>
        </div>
        ${FOOTER_COLS.map(([h, links]) => `<div class="footer__col"><h4>${h}</h4>${navLinks(links)}</div>`).join('\n        ')}
      </div>
      <div class="footer__bottom">
        <p>© 2026 SOMNA Sleep Co. All rights reserved.</p>
        <div class="footer__legal">${LEGAL.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
        <div class="footer__socials">
          <a href="#" aria-label="Instagram">${icon.ig}</a>
          <a href="#" aria-label="TikTok">${icon.tt}</a>
          <a href="#" aria-label="Pinterest">${icon.pin}</a>
        </div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="cart-drawer" aria-label="Shopping cart">
    <div class="drawer__head"><h3>Your Cart</h3><button class="icon-btn" data-action="close-cart" aria-label="Close">${icon.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="free-ship" id="free-ship"></div>
      <div class="drawer__subtotal"><span>Subtotal</span><span id="cart-subtotal">$0.00</span></div>
      <p class="drawer__note">Shipping & taxes calculated at checkout</p>
      <button class="btn btn-primary btn-block btn-lg" data-action="checkout">Checkout</button>
    </div>
  </aside>

  <div class="mobile-menu" id="mobile-menu">
    <div class="mobile-menu__head"><span class="logo">SOMNA</span><button class="icon-btn" data-action="close-menu" aria-label="Close">${icon.close}</button></div>
    <nav>
      ${navLinks(MOBILE_NAV)}
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

${c.head}

  <main>
${body}
  </main>

${c.foot}

  <script>window.SOMNA_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html', 'home.html', 'SOMNA — Sleep, engineered. The Cloud Pillow.', 'The Cloud Pillow by SOMNA. Adaptive cervical alignment for deeper, cooler sleep. 100-night trial, free shipping.'],
  ['product.html', 'product.html', 'The Cloud Pillow — SOMNA', 'The Cloud Pillow: adaptive cervical alignment, CloudCool gel, dual-height. 100-night trial.'],
  ['collection.html', 'collection.html', 'Shop All — SOMNA', 'Shop the full SOMNA collection of premium sleep essentials.'],
  ['about.html', 'about.html', 'Our Story — SOMNA', 'Why we built SOMNA — a premium sleep brand obsessed with the science of rest.'],
  ['contact.html', 'contact.html', 'Contact — SOMNA', 'Get in touch with the SOMNA team.'],
  ['cart.html', 'cart.html', 'Your Cart — SOMNA', 'Your SOMNA cart.'],
  ['reviews.html', 'reviews.html', 'Reviews — SOMNA', '12,400+ five-star reviews of The Cloud Pillow.'],
  ['bundles.html', 'bundles.html', 'Bundles — SOMNA', 'Save more with SOMNA sleep bundles.'],
  ['faq.html', 'faq.html', 'FAQ — SOMNA', 'Frequently asked questions about SOMNA products, shipping, and returns.'],
  ['trial.html', 'trial.html', '100-Night Trial — SOMNA', 'Sleep on it for 100 nights, risk-free.'],
  ['warranty.html', 'warranty.html', '5-Year Warranty — SOMNA', 'The SOMNA 5-year warranty, explained.'],
  ['shipping.html', 'shipping.html', 'Shipping & Returns — SOMNA', 'Shipping and returns policy for SOMNA.'],
  ['refund.html', 'refund.html', 'Refund Policy — SOMNA', 'SOMNA refund policy.'],
  ['privacy.html', 'privacy.html', 'Privacy Policy — SOMNA', 'How SOMNA collects and uses your data.'],
  ['terms.html', 'terms.html', 'Terms of Service — SOMNA', 'SOMNA terms of service.'],
  ['sustainability.html', 'sustainability.html', 'Sustainability — SOMNA', 'How SOMNA makes rest more responsible.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  const body = fs.readFileSync(path.join(SRC, src), 'utf8');
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body }));
  n++;
}
console.log(`Built ${n} pages.`);
