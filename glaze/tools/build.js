/* GLAZE static-site builder — wraps src/ partials in shared chrome */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const NAV_LEFT  = [['product.html','Shop'], ['how-to.html','How to Use']];
const NAV_RIGHT = [['ingredients.html','Ingredients'], ['reviews.html','Reviews']];
const MOBILE = [
  ['product.html','Shop the Balm'], ['how-to.html','How to Use'], ['ingredients.html','Ingredients'],
  ['reviews.html','Reviews'], ['about.html','About'], ['faq.html','FAQ'], ['contact.html','Contact'],
];
const FOOT = [
  ['Shop',  [['product.html','The Glow Balm'], ['product.html','Multipacks & Save'], ['how-to.html','How to Use']]],
  ['Learn', [['ingredients.html','Ingredients'], ['reviews.html','Reviews'], ['about.html','About'], ['faq.html','FAQ']]],
  ['Help',  [['contact.html','Contact'], ['shipping.html','Shipping & Returns'], ['refund.html','Refund Policy']]],
];
const LEGAL = [['privacy.html','Privacy'], ['terms.html','Terms'], ['refund.html','Refund'], ['shipping.html','Shipping']];

const links = (a) => a.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n        ');
const ic = {
  menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  bag:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 4 6v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6l-2-4Z"/><path d="M4 6h16M15 10a3 3 0 0 1-6 0"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>',
};

function chrome() {
  return {
    head:`  <div class="topbar">★ 4.4 · the viral pink collagen balm · Free shipping over $35 · <strong>Buy 3, save 17%</strong></div>
  <header class="header">
    <div class="header__inner">
      <div class="header__left">
        <button class="iconbtn burger" data-action="open-menu" aria-label="Menu">${ic.menu}</button>
        <nav class="nav">${links(NAV_LEFT)}</nav>
      </div>
      <a href="index.html" class="logo">GLAZE</a>
      <div class="header__right">
        <nav class="nav">${links(NAV_RIGHT)}</nav>
        <button class="iconbtn" aria-label="Search">${ic.search}</button>
        <button class="iconbtn" aria-label="Account">${ic.user}</button>
        <button class="iconbtn" data-action="open-cart" aria-label="Cart">${ic.bag}<span class="cartnum"></span></button>
      </div>
    </div>
  </header>`,
    foot:`  <footer class="footer">
    <div class="wrap">
      <div class="footer__top">
        <div class="footer__brand">
          <span class="logo">GLAZE</span>
          <p>The glazed-skin shop. We hunt the K-beauty that actually goes viral — starting with medicube's PDRN Pink Collagen Volume Multi Balm.</p>
        </div>
        ${FOOT.map(([h, l]) => `<div class="footer__col"><h4>${h}</h4>${links(l)}</div>`).join('\n        ')}
      </div>
      <div class="footer__bot">
        <p>© 2026 GLAZE. PDRN Pink Collagen Volume Multi Balm is a product of medicube. GLAZE is an independent retailer.</p>
        <div class="footer__legal">${LEGAL.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>
  <aside class="drawer" id="drawer" data-free="35" aria-label="Cart">
    <div class="drawer__head"><h3>Your bag</h3><button class="iconbtn" data-action="close-cart" aria-label="Close">${ic.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="freebar" id="freebar"></div>
      <div class="dsub"><span>Subtotal</span><span id="cart-sub">$0.00</span></div>
      <p class="dnote">Shipping &amp; taxes calculated at checkout</p>
      <button class="btn btn-pink btn-block btn-lg" data-action="checkout">Checkout</button>
      <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:.6rem">View bag</a>
    </div>
  </aside>

  <div class="mobile" id="menu">
    <div class="mobile__head"><span class="logo">GLAZE</span><button class="iconbtn" data-action="close-menu" aria-label="Close">${ic.close}</button></div>
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
  <script>window.GLAZE_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html','home.html','GLAZE — The viral PDRN Pink Collagen glow balm','Glazed-skin in one swipe. The medicube PDRN Pink Collagen Volume Multi Balm — PDRN, 5% Volufiline & collagen in a mess-free stick. Buy 3, save 17%.'],
  ['product.html','product.html','PDRN Pink Collagen Volume Multi Balm — GLAZE','The viral pink collagen glow stick by medicube. Plumps, smooths fine lines and glazes skin anywhere — under-eyes, smile lines, neck. From $18.'],
  ['how-to.html','how-to.html','How to Use — GLAZE','Swipe, pat, glow. How to get the most from your PDRN Pink Collagen balm.'],
  ['ingredients.html','ingredients.html','Ingredients — GLAZE','PDRN salmon DNA, 5% Volufiline, collagen, NAD, caffeine & vitamin E — what each one does.'],
  ['reviews.html','reviews.html','Reviews — GLAZE','4.4 stars and thousands of glazed-skin fans.'],
  ['about.html','about.html','About — GLAZE','Why we built a shop around one viral pink balm.'],
  ['faq.html','faq.html','FAQ — GLAZE','PDRN, skin types, how to use, shipping and returns.'],
  ['contact.html','contact.html','Contact — GLAZE','Talk to a real person on our team.'],
  ['cart.html','cart.html','Your Bag — GLAZE','Your bag.'],
  ['shipping.html','shipping.html','Shipping & Returns — GLAZE','How we ship and how returns work.'],
  ['refund.html','refund.html','Refund Policy — GLAZE','Our refund policy.'],
  ['privacy.html','privacy.html','Privacy Policy — GLAZE','How we handle your data.'],
  ['terms.html','terms.html','Terms of Service — GLAZE','Terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body: fs.readFileSync(path.join(SRC, src), 'utf8') }));
  n++;
}
console.log(`Built ${n} pages.`);
