/* ============================================================
   CREO static-site builder (single product)
   Wraps body partials in src/ with shared header/footer chrome
   and writes the final *.html pages to the repo root.
   Run:  node tools/build.js
   ============================================================ */
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const NAV = [
  ['product.html', 'Shop'],
  ['how-to.html', 'How it works'],
  ['reviews.html', 'Reviews'],
  ['faq.html', 'FAQ'],
];
const MOBILE_NAV = [...NAV, ['about.html', 'Our Story'], ['contact.html', 'Contact']];

const FOOTER_COLS = [
  ['Shop', [['product.html', 'Daily Creatine'], ['product.html', 'Subscribe & Save'], ['reviews.html', 'Reviews']]],
  ['Learn', [['how-to.html', 'How to Take Creatine'], ['faq.html', 'FAQ'], ['quality.html', 'Our Quality'], ['guarantee.html', '30-Day Guarantee']]],
  ['Company', [['about.html', 'Our Story'], ['contact.html', 'Contact'], ['shipping.html', 'Shipping & Returns']]],
];
const LEGAL = [['privacy.html', 'Privacy'], ['terms.html', 'Terms'], ['refund.html', 'Refunds'], ['shipping.html', 'Shipping']];

const icon = {
  menu: '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  search: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  cart: '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  close: '<svg width="20" height="20" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  ig: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg>',
  tt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><path d="M9 12a4 4 0 1 0 4 4V4c1 2 3 3 5 3"/></svg>',
  yt: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="2" y="5" width="20" height="14" rx="4"/><path d="m10 9 5 3-5 3Z" fill="currentColor"/></svg>',
};

const navLinks = (arr) => arr.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n        ');

function chrome() {
  return {
    head: `  <div class="announce">Free shipping over $35 · <strong>Subscribe &amp; save 20%</strong> · Lab-tested every batch</div>

  <header class="header">
    <div class="header__inner">
      <button class="icon-btn burger" data-action="open-menu" aria-label="Menu">${icon.menu}</button>
      <a href="index.html" class="logo">CREO<span>.</span></a>
      <nav class="nav">
        ${navLinks(NAV)}
      </nav>
      <div class="header__actions">
        <button class="icon-btn desktop-only" aria-label="Search">${icon.search}</button>
        <button class="icon-btn" data-action="open-cart" aria-label="Cart">${icon.cart}<span class="cart-count"></span></button>
        <a href="product.html" class="btn btn-coral header__cta">Get CREO</a>
      </div>
    </div>
  </header>`,
    foot: `  <footer class="foot">
    <div class="foot__cta">
      <a href="product.html" class="wordmark">CREO<span>.</span></a>
    </div>
    <div class="foot__top">
      <div class="foot__brand">
        <span class="logo" style="color:#fff">CREO<span style="color:var(--coral)">.</span></span>
        <p>Creatine made effortless. 5g a day in a gummy you'll actually look forward to. Formulated in the USA, third-party tested.</p>
        <form class="signup"><input type="email" placeholder="Email for 15% off" required aria-label="Email"><button class="btn btn-coral" type="submit">Join</button></form>
      </div>
      ${FOOTER_COLS.map(([h, links]) => `<div class="foot__col"><h4>${h}</h4>${navLinks(links)}</div>`).join('\n      ')}
    </div>
    <div class="foot__bottom">
      <p>© 2026 CREO Nutrition. These statements have not been evaluated by the FDA.</p>
      <div class="foot__legal">${LEGAL.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      <div class="foot__socials">
        <a href="#" aria-label="Instagram">${icon.ig}</a>
        <a href="#" aria-label="TikTok">${icon.tt}</a>
        <a href="#" aria-label="YouTube">${icon.yt}</a>
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
      <button class="btn btn-coral btn-block btn-lg" data-action="checkout">Checkout</button>
    </div>
  </aside>

  <div class="mobile-menu" id="mobile-menu">
    <div class="mobile-menu__head"><span class="logo">CREO<span>.</span></span><button class="icon-btn" data-action="close-menu" aria-label="Close">${icon.close}</button></div>
    <nav>
      ${navLinks(MOBILE_NAV)}
    </nav>
    <a href="product.html" class="btn btn-coral btn-lg btn-block" style="margin-top:1.5rem">Get CREO — $39</a>
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

  <script>window.CREO_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html', 'home.html', 'CREO — 5g Creatine Gummies, Made Effortless', 'CREO Daily Creatine Gummies: the full 5g clinical dose of creatine monohydrate in a daily gummy. No chalk, no shaker. Subscribe & save, free shipping over $35.'],
  ['product.html', 'product.html', 'CREO Daily Creatine Gummies', '5g creatine monohydrate per serving in three flavors. No mixing, no clumps, third-party tested. Subscribe & save 20%.'],
  ['about.html', 'about.html', 'Our Story — CREO', 'Why we built CREO — the simplest way to actually take your creatine every day.'],
  ['contact.html', 'contact.html', 'Contact — CREO', 'Questions about CREO creatine gummies? Get in touch with our team.'],
  ['cart.html', 'cart.html', 'Your Cart — CREO', 'Your CREO cart.'],
  ['reviews.html', 'reviews.html', 'Reviews — CREO', '9,000+ five-star reviews of CREO creatine gummies.'],
  ['faq.html', 'faq.html', 'FAQ — CREO', 'Frequently asked questions about CREO creatine gummies, dosing, shipping and returns.'],
  ['how-to.html', 'how-to.html', 'How to Take Creatine — CREO', 'How to take creatine the easy way: four CREO gummies a day for your full 5g dose.'],
  ['guarantee.html', 'guarantee.html', '30-Day Guarantee — CREO', 'Love it or it is on us. The CREO 30-day money-back guarantee, explained.'],
  ['quality.html', 'quality.html', 'Our Quality — CREO', 'How CREO is made: clinically dosed, third-party tested, vegan and clean.'],
  ['shipping.html', 'shipping.html', 'Shipping & Returns — CREO', 'Shipping and returns policy for CREO.'],
  ['refund.html', 'refund.html', 'Refund Policy — CREO', 'CREO refund policy.'],
  ['privacy.html', 'privacy.html', 'Privacy Policy — CREO', 'How CREO collects and uses your data.'],
  ['terms.html', 'terms.html', 'Terms of Service — CREO', 'CREO terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  const body = fs.readFileSync(path.join(SRC, src), 'utf8');
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body }));
  n++;
}
console.log(`Built ${n} pages.`);
