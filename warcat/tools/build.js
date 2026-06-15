/* WARCAT static-site builder — wraps src/ partials in shared chrome → root *.html */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

/* ---- navigation model ---- */
const NAV = [
  ['product.html', 'The Litter Box'],
  ['how-it-works.html', 'How It Works'],
  ['collection.html', 'Accessories'],
  ['reviews.html', 'Reviews'],
];
const MOBILE = [...NAV, ['about.html', 'Our Story'], ['faq.html', 'FAQ'], ['contact.html', 'Support']];
const FOOT = [
  ['Shop', [['product.html', 'WARCAT Litter Box'], ['collection.html', 'Accessories'], ['bundles.html', 'Bundles & Save'], ['trial.html', '90-Night Trial']]],
  ['Learn', [['how-it-works.html', 'How It Works'], ['specs.html', 'Tech Specs'], ['reviews.html', 'Reviews'], ['about.html', 'Our Story']]],
  ['Support', [['contact.html', 'Contact Us'], ['faq.html', 'FAQ'], ['shipping.html', 'Shipping & Returns'], ['warranty.html', '2-Year Warranty']]],
];
const LEGAL = [['privacy.html', 'Privacy'], ['terms.html', 'Terms'], ['refund.html', 'Refund Policy'], ['shipping.html', 'Shipping']];

const links = (a) => a.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n          ');

/* ---- icons ---- */
const ic = {
  menu: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  search: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4-4"/></svg>',
  user: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6.5 7-6.5s7 2.5 7 6.5"/></svg>',
  bag: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 8h12l1 12a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1Z"/><path d="M9 8a3 3 0 0 1 6 0"/></svg>',
  close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  ig: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none"/></svg>',
  tiktok: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M16 3c.3 2.1 1.6 3.8 3.7 4.1v2.7c-1.3.1-2.6-.3-3.7-1v5.9a5.6 5.6 0 1 1-5.6-5.6c.3 0 .6 0 .9.1v2.8a2.8 2.8 0 1 0 2 2.7V3Z"/></svg>',
  yt: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9"><rect x="2.5" y="5.5" width="19" height="13" rx="4"/><path d="m10 9.5 5 2.5-5 2.5Z" fill="currentColor"/></svg>',
};

const LOGO = `<svg class="logo__mark" viewBox="0 0 32 32" fill="none" aria-hidden="true"><rect width="32" height="32" rx="9" fill="#0fb5a6"/><path d="M9 13.5 8 8.5l4 3.2a8.5 8.5 0 0 1 8 0l4-3.2-1 5" stroke="#04332e" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/><circle cx="12.5" cy="17" r="1.4" fill="#04332e"/><circle cx="19.5" cy="17" r="1.4" fill="#04332e"/><path d="M16 19.5v1.4m0 0-1.6.8m1.6-.8 1.6.8" stroke="#04332e" stroke-width="1.6" stroke-linecap="round"/></svg>`;
const wordmark = `<a href="index.html" class="logo">${LOGO}<span>WARCAT</span></a>`;
const wordmarkPlain = `<span class="logo">${LOGO}<span>WARCAT</span></span>`;

function chrome() {
  return {
    head: `  <div class="topbar"><div class="topbar__in">
      <span><strong>Free shipping</strong> &amp; 2-year warranty</span>
      <span class="tb-extra"><span class="tb-dot">•</span> 90-night risk-free home trial</span>
      <span class="tb-extra"><span class="tb-dot">•</span> Pay over time with Shop Pay</span>
    </div></div>
  <header class="header">
    <div class="header__in">
      <button class="iconbtn burger" data-action="open-menu" aria-label="Open menu">${ic.menu}</button>
      ${wordmark}
      <nav class="nav">
          ${links(NAV)}
      </nav>
      <div class="header__spacer"></div>
      <div class="header__right">
        <button class="iconbtn desk" aria-label="Search">${ic.search}</button>
        <button class="iconbtn desk" aria-label="Account">${ic.user}</button>
        <button class="iconbtn" data-action="open-cart" aria-label="Cart">${ic.bag}<span class="cartnum">0</span></button>
        <a href="product.html" class="btn btn-primary btn-sm cta-mini">Shop now</a>
      </div>
    </div>
  </header>`,
    foot: `  <footer class="footer">
    <div class="wrap wrap-wide">
      <div class="footer__top">
        <div class="footer__brand">
          ${wordmarkPlain}
          <p>The self-cleaning litter box that runs itself — whisper-quiet, app-controlled, and built for multi-cat homes.</p>
          <div class="social">
            <a href="#" aria-label="Instagram">${ic.ig}</a>
            <a href="#" aria-label="TikTok">${ic.tiktok}</a>
            <a href="#" aria-label="YouTube">${ic.yt}</a>
          </div>
        </div>
        ${FOOT.map(([h, l]) => `<div class="footer__col"><h5>${h}</h5>${links(l)}</div>`).join('\n        ')}
      </div>
      <div class="footer__bot">
        <p>© 2026 WARCAT Pet Technologies. All rights reserved.</p>
        <div class="footer__legal">${LEGAL.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
        <div class="footer__pay"><span>VISA</span><span>MC</span><span>AMEX</span><span>Shop Pay</span><span>Klarna</span></div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>

  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="drawer__head"><h3>Your cart</h3><button class="iconbtn" data-action="close-cart" aria-label="Close">${ic.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="freebar" id="freebar"></div>
      <div class="dsub"><span>Subtotal</span><span id="cart-sub">$0.00</span></div>
      <p class="dnote">Shipping &amp; taxes calculated at checkout</p>
      <button class="btn btn-primary btn-block btn-lg" data-action="checkout">Checkout</button>
      <a href="cart.html" class="btn btn-outline btn-block" style="margin-top:.6rem">View cart</a>
    </div>
  </aside>

  <div class="mobile" id="menu">
    <div class="mobile__head">${wordmarkPlain}<button class="iconbtn" data-action="close-menu" aria-label="Close">${ic.close}</button></div>
    <nav>
      ${links(MOBILE)}
    </nav>
    <div class="mobile__foot"><a href="product.html" class="btn btn-primary btn-block btn-lg">Shop the WARCAT</a></div>
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
  <meta name="theme-color" content="#ffffff">
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
  <script>window.WC_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html', 'home.html', 'WARCAT — The Self-Cleaning Litter Box That Runs Itself', 'WARCAT is the whisper-quiet, app-controlled, auto-cleaning 90L litter box built for multi-cat homes. Never scoop again. 90-night home trial.'],
  ['product.html', 'product.html', 'WARCAT Smart Self-Cleaning Litter Box', 'Whisper-quiet auto-cleaning, 90L XL capacity, weight & health tracking, app control. 90-night trial, 2-year warranty.'],
  ['how-it-works.html', 'how-it-works.html', 'How WARCAT Works — Self-Cleaning, Explained', 'From the moment your cat steps out, WARCAT detects, cleans, and seals odor automatically. Here is exactly how.'],
  ['specs.html', 'specs.html', 'Tech Specs — WARCAT Smart Litter Box', 'Dimensions, capacity, noise level, sensors, app features and what is in the box.'],
  ['collection.html', 'collection.html', 'Shop WARCAT — Litter Box & Accessories', 'The WARCAT smart litter box plus mats, liners, carbon filters and replacement parts.'],
  ['bundles.html', 'bundles.html', 'Bundles & Save — WARCAT', 'Save when you bundle your WARCAT with accessories, or kit out a multi-cat home with two boxes.'],
  ['reviews.html', 'reviews.html', 'Reviews — WARCAT Self-Cleaning Litter Box', 'Real reviews from 12,000+ cat homes who retired the scoop.'],
  ['about.html', 'about.html', 'Our Story — WARCAT', 'We are cat people and engineers who got tired of scooping. So we built the box that does it for you.'],
  ['faq.html', 'faq.html', 'FAQ — WARCAT', 'Answers on cleaning, noise, multi-cat use, litter type, setup, the app, trial and warranty.'],
  ['contact.html', 'contact.html', 'Support — WARCAT', 'Talk to a real human on the WARCAT care team.'],
  ['cart.html', 'cart.html', 'Your Cart — WARCAT', 'Your cart.'],
  ['trial.html', 'trial.html', '90-Night Home Trial — WARCAT', 'Try WARCAT for 90 nights. If your cats do not love it, send it back for a full refund.'],
  ['warranty.html', 'warranty.html', '2-Year Warranty — WARCAT', 'Every WARCAT is covered by a 2-year warranty and lifetime support.'],
  ['shipping.html', 'shipping.html', 'Shipping & Returns — WARCAT', 'Fast, free shipping and easy returns.'],
  ['refund.html', 'refund.html', 'Refund Policy — WARCAT', 'How refunds work.'],
  ['privacy.html', 'privacy.html', 'Privacy Policy — WARCAT', 'How we handle your data and your cat data.'],
  ['terms.html', 'terms.html', 'Terms of Service — WARCAT', 'Terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  const file = path.join(SRC, src);
  if (!fs.existsSync(file)) { console.warn('  ! missing src/' + src + ' — skipped'); continue; }
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body: fs.readFileSync(file, 'utf8') }));
  n++;
}
console.log(`Built ${n} pages.`);
