/* ============================================================
   CREO — theme interactions
   Works in two modes:
   · MOCK (static preview): localStorage cart + drawer rendering
   · SHOPIFY (live theme): native form posts; drawer shows server cart
   Toggle by setting window.CREO_MOCK = true before this script.
   ============================================================ */
(function () {
  'use strict';

  const MOCK = window.CREO_MOCK === true;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = (n) => '$' + n.toFixed(2);

  /* ---------- Drawer / overlay / menu ---------- */
  const overlay = $('#overlay');
  const drawer  = $('#cart-drawer');
  const mobileMenu = $('#mobile-menu');
  const openDrawer  = () => { drawer && drawer.classList.add('open'); overlay && overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeDrawer = () => { drawer && drawer.classList.remove('open'); overlay && overlay.classList.remove('open'); document.body.style.overflow = ''; };
  const openMenu    = () => { mobileMenu && mobileMenu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu   = () => { mobileMenu && mobileMenu.classList.remove('open'); document.body.style.overflow = ''; };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]');
    if (!t) return;
    const a = t.dataset.action;
    if (a === 'open-cart')  { e.preventDefault(); openDrawer(); }
    if (a === 'close-cart') closeDrawer();
    if (a === 'open-menu')  openMenu();
    if (a === 'close-menu') closeMenu();
    if (a === 'checkout' && MOCK) { e.preventDefault(); alert('This is a demo storefront — checkout is mocked. In a live Shopify store this routes to secure checkout.'); }
  });
  overlay && overlay.addEventListener('click', closeDrawer);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeDrawer(); closeMenu(); } });

  /* ============================================================
     MOCK CART (static preview only)
     ============================================================ */
  if (MOCK) {
    const FREE_SHIP = 35, STORE_KEY = 'creo-cart';
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(STORE_KEY)) || []; } catch (e) { cart = []; }
    const saveCart  = () => localStorage.setItem(STORE_KEY, JSON.stringify(cart));
    const cartCount = () => cart.reduce((n, i) => n + i.qty, 0);
    const cartTotal = () => cart.reduce((n, i) => n + i.price * i.qty, 0);

    function bumpCount() {
      const badge = $('.cart-count'); if (!badge) return;
      const c = cartCount(); badge.textContent = c; badge.classList.toggle('show', c > 0);
    }
    function renderCart() {
      bumpCount();
      renderCartPage();
      const body = $('#cart-body'), foot = $('#cart-foot');
      if (!body) return;
      if (!cart.length) {
        body.innerHTML = '<div class="drawer__empty"><p>Your cart is empty.</p><p style="margin-top:.5rem">Time to start the ritual.</p></div>';
        if (foot) foot.style.display = 'none'; return;
      }
      if (foot) foot.style.display = 'block';
      body.innerHTML = cart.map((i, idx) => `
        <div class="drawer__item">
          <div class="drawer__thumb"></div>
          <div class="drawer__item-info">
            <h4>${i.name}</h4>
            <div class="v">${i.variant || ''}</div>
            <div class="drawer__item-foot">
              <div class="drawer__qty">
                <button data-q="-1" data-i="${idx}">−</button>
                <span>${i.qty}</span>
                <button data-q="1" data-i="${idx}">+</button>
              </div>
              <strong>${money(i.price * i.qty)}</strong>
            </div>
            <button class="drawer__remove" data-rm="${idx}">Remove</button>
          </div>
        </div>`).join('');

      const total = cartTotal(), remain = Math.max(0, FREE_SHIP - total), pct = Math.min(100, (total / FREE_SHIP) * 100);
      $('#cart-subtotal').textContent = money(total);
      const fs = $('#free-ship');
      if (fs) fs.innerHTML = remain > 0
        ? `You're <strong>${money(remain)}</strong> away from free shipping<div class="free-ship__bar"><div class="free-ship__fill" style="width:${pct}%"></div></div>`
        : `<strong>✦ You've unlocked free shipping!</strong><div class="free-ship__bar"><div class="free-ship__fill" style="width:100%"></div></div>`;

      $$('[data-q]', body).forEach((b) => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.q; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); saveCart(); renderCart(); }));
      $$('[data-rm]', body).forEach((b) => b.addEventListener('click', () => { cart.splice(+b.dataset.rm, 1); saveCart(); renderCart(); }));
    }
    function addToCart(item) {
      const key = item.id + '|' + (item.variant || '');
      const found = cart.find((i) => i.id + '|' + (i.variant || '') === key);
      if (found) found.qty += item.qty; else cart.push({ ...item });
      saveCart(); renderCart(); openDrawer();
    }

    /* Full cart page (cart.html) */
    function renderCartPage() {
      const items = $('#cart-page-items');
      if (!items) return;
      const empty = $('#cart-page-empty'), summary = $('#cart-page-summary');
      if (!cart.length) {
        items.innerHTML = '';
        if (empty) empty.hidden = false;
        if (summary) summary.style.display = 'none';
        return;
      }
      if (empty) empty.hidden = true;
      if (summary) summary.style.display = '';
      items.innerHTML = cart.map((i, idx) => `
        <div class="cartline">
          <div class="cartline__thumb"></div>
          <div class="cartline__info">
            <h4>${i.name}</h4>
            <div class="v">${i.variant || ''}</div>
            <button class="drawer__remove" data-prm="${idx}">Remove</button>
          </div>
          <div class="drawer__qty">
            <button data-pq="-1" data-i="${idx}">−</button><span>${i.qty}</span><button data-pq="1" data-i="${idx}">+</button>
          </div>
          <div class="cartline__price">${money(i.price * i.qty)}</div>
        </div>`).join('');
      const total = cartTotal();
      const subEl = $('#cart-page-subtotal'); if (subEl) subEl.textContent = money(total);
      const totEl = $('#cart-page-total'); if (totEl) totEl.textContent = money(total);
      $$('[data-pq]', items).forEach((b) => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.pq; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); saveCart(); renderCart(); }));
      $$('[data-prm]', items).forEach((b) => b.addEventListener('click', () => { cart.splice(+b.dataset.prm, 1); saveCart(); renderCart(); }));
    }

    $$('[data-add]').forEach((btn) => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const scope = btn.closest('[data-product]') || document;
      const id = btn.dataset.id || 'item';
      const name = btn.dataset.name || 'CREO Daily Creatine';
      let price = parseFloat(btn.dataset.price || '39'), qty = 1, variant = btn.dataset.variant || '';
      const activeTier = $('.tier.active', scope), qtyInput = $('.qty input', scope);
      const activeOpts = $$('.opt.active[data-variant]', scope).map((o) => o.dataset.variant);
      if (qtyInput) qty = Math.max(1, parseInt(qtyInput.value) || 1);
      if (activeOpts.length) variant = activeOpts.join(' / ');
      if (activeTier) {
        price = parseFloat(activeTier.dataset.price);
        qty = qty * parseInt(activeTier.dataset.qty || '1');
        variant = (variant ? variant + ' · ' : '') + activeTier.dataset.label;
      }
      addToCart({ id, name, price, qty, variant });
    }));

    const drawerFoot = $('#cart-foot');
    if (drawerFoot && !$('#view-cart-link', drawerFoot)) {
      const a = document.createElement('a');
      a.id = 'view-cart-link'; a.href = 'cart.html'; a.className = 'btn btn-ghost btn-block';
      a.style.marginTop = '0.6rem'; a.textContent = 'View full cart';
      drawerFoot.appendChild(a);
    }

    renderCart();
  }

  /* ============================================================
     SHOPIFY free-shipping bar (server-rendered values)
     ============================================================ */
  if (!MOCK) {
    const fs = $('#free-ship');
    if (fs && fs.dataset.threshold) {
      const thr = parseFloat(fs.dataset.threshold), total = parseFloat(fs.dataset.total || '0');
      const remain = Math.max(0, thr - total), pct = Math.min(100, thr ? (total / thr) * 100 : 100);
      fs.innerHTML = remain > 0
        ? `You're <strong>${money(remain)}</strong> away from free shipping<div class="free-ship__bar"><div class="free-ship__fill" style="width:${pct}%"></div></div>`
        : `<strong>✦ You've unlocked free shipping!</strong><div class="free-ship__bar"><div class="free-ship__fill" style="width:100%"></div></div>`;
    }
  }

  /* ---------- PDP: option selectors ---------- */
  $$('.opt-row').forEach((row) => row.addEventListener('click', (e) => {
    const opt = e.target.closest('.opt'); if (!opt) return;
    $$('.opt', row).forEach((o) => o.classList.remove('active'));
    opt.classList.add('active');
    syncShopifyVariant();
  }));

  /* Resolve selected Shopify variant id from active options */
  function syncShopifyVariant() {
    const select = $('#variant-id'); if (!select) return;
    const chosen = $$('.opt-row').map((row) => { const a = $('.opt.active', row); return a ? a.dataset.variant : null; }).filter(Boolean);
    if (!chosen.length) return;
    [...select.options].forEach((o) => {
      const title = o.textContent.trim();
      const match = chosen.every((c) => title.split(' / ').includes(c));
      if (match) select.value = o.value;
    });
  }

  /* ---------- PDP: purchase tiers (mock pricing) ---------- */
  const tiers = $$('.tier');
  function syncTier(active) {
    tiers.forEach((t) => t.classList.toggle('active', t === active));
    const price = parseFloat(active.dataset.price), qty = parseInt(active.dataset.qty || '1'), total = price * qty;
    const priceEl = $('#pdp-price-now'), wasEl = $('#pdp-price-was'), stickyPrice = $('#sticky-price');
    if (priceEl) priceEl.textContent = money(total);
    const compare = parseFloat(active.dataset.compare || '0');
    if (wasEl && compare) { wasEl.style.display = ''; wasEl.textContent = money(compare); }
    else if (wasEl) wasEl.style.display = 'none';
    if (stickyPrice) stickyPrice.textContent = money(total);
  }
  tiers.forEach((t) => t.addEventListener('click', () => syncTier(t)));

  /* ---------- PDP: quantity stepper ---------- */
  $$('.qty').forEach((q) => {
    const input = $('input', q);
    $$('button', q).forEach((b) => b.addEventListener('click', () => {
      let v = parseInt(input.value) || 1; v += b.dataset.step === '+' ? 1 : -1; input.value = Math.max(1, v);
    }));
  });

  /* ---------- PDP: gallery ---------- */
  $$('.gallery__thumb').forEach((thumb) => thumb.addEventListener('click', () => {
    $$('.gallery__thumb').forEach((t) => t.classList.remove('active'));
    thumb.classList.add('active');
    const main = $('#gallery-main'); if (!main) return;
    if (thumb.dataset.full) {                       // Shopify: swap <img>
      main.innerHTML = `<img src="${thumb.dataset.full}" alt="">`;
    } else {                                        // Static: swap SVG art
      const art = $('.art-stage', thumb);
      if (art) main.innerHTML = art.outerHTML;
    }
  }));

  /* ---------- Accordions ---------- */
  $$('.acc__head').forEach((head) => head.addEventListener('click', () => {
    const item = head.closest('.acc__item'), body = $('.acc__body', item), open = item.classList.contains('open');
    item.classList.toggle('open');
    body.style.maxHeight = open ? null : body.scrollHeight + 'px';
  }));

  /* ---------- Header scrolled state ---------- */
  const header = $('.header');
  const onScroll = () => { if (header) header.classList.toggle('scrolled', window.scrollY > 10); };
  window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

  /* ---------- Sticky add bar (PDP) ---------- */
  const stickyBar = $('#sticky-bar'), buyBox = $('#buy-anchor');
  if (stickyBar && buyBox) {
    new IntersectionObserver(([entry]) =>
      stickyBar.classList.toggle('show', !entry.isIntersecting && entry.boundingClientRect.top < 0),
      { threshold: 0 }).observe(buyBox);
  }

  /* ---------- Scroll reveal ---------- */
  const revealIO = new IntersectionObserver((entries) => {
    entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('in'); revealIO.unobserve(en.target); } });
  }, { threshold: 0.12 });
  $$('.reveal').forEach((el) => revealIO.observe(el));

  /* ---------- Newsletter + contact (mock only) ---------- */
  if (MOCK) {
    $$('.signup').forEach((form) => form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.innerHTML = '<p style="font-family:var(--serif);font-size:1.2rem">Welcome to CREO ✦ Check your inbox for 15% off.</p>';
    }));
    const contact = $('#contact-form');
    if (contact) contact.addEventListener('submit', (e) => {
      e.preventDefault();
      contact.innerHTML = '<div class="note-success">Thanks — your message is on its way. We\'ll reply within one business day.</div>';
    });
  }

  /* ---------- Init ---------- */
  if (tiers.length) syncTier(tiers.find((t) => t.classList.contains('active')) || tiers[0]);
})();
