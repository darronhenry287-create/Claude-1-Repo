/* AEON static-site builder — wraps src/ partials in shared chrome.
   Mirrors the PRAIRIE/HIDE&HONEY build pattern: unique page bodies live
   in src/, this injects header/ticker/footer/cart/menu/COA modal + scripts. */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');
const SRC = path.join(ROOT, 'src');

const NAV_LEFT  = [['collection.html', 'Shop'], ['science.html', 'The Science']];
const NAV_RIGHT = [['reviews.html', 'Reviews'], ['about.html', 'About']];
const MOBILE = [
  ['collection.html', 'Shop'], ['product.html', 'AEON NMN 1000'], ['science.html', 'The Science'],
  ['bundles.html', 'Subscribe & Save'], ['reviews.html', 'Reviews'], ['about.html', 'About'],
  ['faq.html', 'FAQ'], ['contact.html', 'Contact'],
];
const FOOT = [
  ['Shop',    [['product.html', 'AEON NMN 1000'], ['collection.html', 'Shop All'], ['bundles.html', 'Subscribe & Save'], ['guarantee.html', '60-Night Guarantee']]],
  ['Science', [['science.html', 'How NMN Works'], ['science.html', 'The Research'], ['faq.html', 'FAQ'], ['about.html', 'Our Standards']]],
  ['Support', [['contact.html', 'Contact'], ['shipping.html', 'Shipping & Returns'], ['guarantee.html', 'Guarantee'], ['cart.html', 'Cart']]],
];
const LEGAL = [['privacy.html', 'Privacy'], ['terms.html', 'Terms'], ['refund.html', 'Refund Policy'], ['shipping.html', 'Shipping']];

const TICKER = [
  ['≥99%', 'purity β-NMN'], ['1000MG', 'per serving'], ['', 'Third-party tested'],
  ['FREE', 'shipping over $50'], ['60-NIGHT', 'money-back guarantee'], ['', 'Vegan · Non-GMO · No fillers'],
];

const links = (a) => a.map(([h, t]) => `<a href="${h}">${t}</a>`).join('\n        ');
const ic = {
  menu:'<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><path d="M3 6h18M3 12h18M3 18h18"/></svg>',
  bag:'<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/></svg>',
  search:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>',
  close:'<svg width="22" height="22" viewBox="0 0 24 24" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',
  user:'<svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"><circle cx="12" cy="8" r="4"/><path d="M5 21c0-4 3-6 7-6s7 2 7 6"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>',
};
const LOGO_MARK = '<svg class="logo__mark" viewBox="0 0 24 24" fill="none" aria-hidden="true"><polygon points="12,2.5 20,7 20,17 12,21.5 4,17 4,7" stroke="#2bf0c4" stroke-width="1.6" stroke-linejoin="round"/><circle cx="12" cy="2.5" r="1.7" fill="#2bf0c4"/><circle cx="20" cy="17" r="1.7" fill="#2bf0c4"/><circle cx="4" cy="17" r="1.7" fill="#2bf0c4"/></svg>';
const LOGO = `<a href="index.html" class="logo">${LOGO_MARK}AEON</a>`;

function tickerHTML() {
  const one = TICKER.map(([b, t]) => `<span>${b ? `<b>${b}</b> ` : ''}${t}</span>`).join('');
  return `  <div class="ticker" aria-hidden="true"><div class="ticker__track">${one}${one}</div></div>`;
}

function chrome() {
  return {
    head: `${tickerHTML()}
  <header class="header">
    <div class="header__inner">
      <div class="header__left">
        <button class="iconbtn burger" data-action="open-menu" aria-label="Menu">${ic.menu}</button>
        <nav class="nav">${links(NAV_LEFT)}</nav>
      </div>
      ${LOGO}
      <div class="header__right">
        <nav class="nav">${links(NAV_RIGHT)}</nav>
        <button class="iconbtn desk" aria-label="Search">${ic.search}</button>
        <button class="iconbtn desk" aria-label="Account">${ic.user}</button>
        <button class="iconbtn" data-action="open-cart" aria-label="Cart">${ic.bag}<span class="cartnum"></span></button>
      </div>
    </div>
  </header>`,
    foot: `  <footer class="footer">
    <div class="wrap wrap--wide">
      <div class="footer__top">
        <div class="footer__brand">
          ${LOGO}
          <p>Pharmaceutical-grade NMN to rebuild the NAD⁺ your cells run on. Third-party tested, nothing hidden.</p>
          <form class="signup footer__newsletter" style="margin-top:1.2rem">
            <input type="email" placeholder="Email for the protocol guide" aria-label="Email" required>
            <button class="btn btn-mint" type="submit">Join</button>
          </form>
        </div>
        ${FOOT.map(([h, l]) => `<div class="footer__col"><h4>${h}</h4>${links(l)}</div>`).join('\n        ')}
      </div>
      <p class="footer__disclaimer">† These statements have not been evaluated by the Food and Drug Administration. This product is not intended to diagnose, treat, cure, or prevent any disease. Consult your physician before beginning any supplement, especially if pregnant, nursing, or taking medication. AEON is a fictional demo storefront created for design purposes.</p>
      <div class="footer__bot">
        <p>© 2026 AEON Labs. All rights reserved.</p>
        <div class="footer__legal">${LEGAL.map(([h, t]) => `<a href="${h}">${t}</a>`).join('')}</div>
      </div>
    </div>
  </footer>

  <div class="overlay" id="overlay"></div>

  <aside class="drawer" id="drawer" aria-label="Cart">
    <div class="drawer__head"><h3>Your Cart</h3><button class="iconbtn" data-action="close-cart" aria-label="Close">${ic.close}</button></div>
    <div class="drawer__body" id="cart-body"></div>
    <div class="drawer__foot" id="cart-foot">
      <div class="freebar" id="freebar"></div>
      <div class="dsub"><span>Subtotal</span><span id="cart-sub">$0.00</span></div>
      <p class="dnote">Shipping &amp; taxes calculated at checkout</p>
      <button class="btn btn-mint btn-block btn-lg" data-action="checkout">Secure checkout</button>
      <a href="cart.html" class="btn btn-ghost btn-block" style="margin-top:.6rem">View full cart</a>
    </div>
  </aside>

  <div class="mobile" id="menu">
    <div class="mobile__head">${LOGO}<button class="iconbtn" data-action="close-menu" aria-label="Close">${ic.close}</button></div>
    <nav>
      ${links(MOBILE)}
    </nav>
    <div class="mobile__foot"><a href="product.html" class="btn btn-mint btn-block btn-lg">Shop AEON NMN</a></div>
  </div>

  <div class="modal" id="coa-modal" aria-label="Certificate of Analysis">
    <div class="modal__bg" data-action="close-coa"></div>
    <div class="modal__card">
      <div class="modal__head">
        <div><div class="kicker">Certificate of Analysis</div></div>
        <button class="iconbtn" data-action="close-coa" aria-label="Close">${ic.close}</button>
      </div>
      <div class="coa__body" style="padding:.5rem 0 1rem">
        <div class="assay" style="grid-template-columns:1fr auto"><div class="name mono" style="color:var(--muted)">Batch</div><div class="res">AE-NMN-2026-0418</div></div>
        <div class="assay"><div class="name">NMN identity (HPLC)</div><div class="res">Conforms</div><div class="tick">${ic.check}</div></div>
        <div class="assay"><div class="name">NMN purity (assay)</div><div class="res">99.6%</div><div class="tick">${ic.check}</div></div>
        <div class="assay"><div class="name">Heavy metals (Pb, As, Cd, Hg)</div><div class="res">&lt; limits</div><div class="tick">${ic.check}</div></div>
        <div class="assay"><div class="name">Microbial (TPC, yeast/mold)</div><div class="res">Pass</div><div class="tick">${ic.check}</div></div>
        <div class="assay"><div class="name">Residual solvents</div><div class="res">Not detected</div><div class="tick">${ic.check}</div></div>
        <div class="assay"><div class="name">Allergens / gluten</div><div class="res">None</div><div class="tick">${ic.check}</div></div>
      </div>
      <div style="padding:0 1.4rem 1.4rem"><p class="faint" style="font-size:.78rem">Representative sample COA. Every batch is tested by an ISO 17025-accredited lab; scan the QR on your bottle for that lot's full report.</p></div>
    </div>
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
  <meta name="theme-color" content="#07080b">
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
  <script>window.AEON_MOCK = true;</script>
  <script src="assets/theme.js"></script>
</body>
</html>
`;
}

const PAGES = [
  ['index.html', 'home.html', 'AEON — NMN 1000mg. Rebuild the NAD⁺ your cells run on.', 'AEON NMN 1000mg per serving — pharmaceutical-grade β-Nicotinamide Mononucleotide, ≥99% pure, third-party tested. Restore NAD⁺ for cellular energy and healthy aging.'],
  ['product.html', 'product.html', 'AEON NMN 1000 — β-Nicotinamide Mononucleotide | AEON', '1000mg NMN per serving, 120 veggie capsules, ≥99% purity, third-party tested. Subscribe & save. 60-night money-back guarantee.'],
  ['science.html', 'science.html', 'The Science — NMN, NAD⁺ & cellular longevity | AEON', 'How NMN raises NAD⁺ to power mitochondria, activate sirtuins and support DNA repair — with the peer-reviewed research behind it.'],
  ['about.html', 'about.html', 'Our Standards — AEON', 'Why we built AEON: pharmaceutical-grade NMN, radical testing transparency, and nothing you don\'t need.'],
  ['reviews.html', 'reviews.html', 'Reviews — AEON NMN', 'Verified reviews from the AEON community.'],
  ['collection.html', 'collection.html', 'Shop All — AEON', 'Shop the AEON longevity stack: NMN, Resveratrol, and the NAD⁺ bundle.'],
  ['bundles.html', 'bundles.html', 'Subscribe & Save — AEON', 'Lock in your protocol. Subscribe and save up to 25% on AEON NMN, shipped on your schedule.'],
  ['faq.html', 'faq.html', 'FAQ — AEON', 'Questions about NMN, NAD⁺, dosing, testing, shipping and returns.'],
  ['contact.html', 'contact.html', 'Contact — AEON', 'Talk to our team — real humans, fast answers.'],
  ['cart.html', 'cart.html', 'Your Cart — AEON', 'Your cart.'],
  ['guarantee.html', 'guarantee.html', '60-Night Guarantee — AEON', 'Try AEON NMN for 60 nights. Don\'t feel the difference? Full refund, no questions.'],
  ['shipping.html', 'shipping.html', 'Shipping & Returns — AEON', 'How AEON ships and how returns work.'],
  ['refund.html', 'refund.html', 'Refund Policy — AEON', 'Our refund policy.'],
  ['privacy.html', 'privacy.html', 'Privacy Policy — AEON', 'How we handle your data.'],
  ['terms.html', 'terms.html', 'Terms of Service — AEON', 'Terms of service.'],
];

let n = 0;
for (const [out, src, title, desc] of PAGES) {
  const body = fs.readFileSync(path.join(SRC, src), 'utf8');
  fs.writeFileSync(path.join(ROOT, out), shell({ title, desc, body }));
  n++;
}
console.log(`Built ${n} AEON pages.`);
