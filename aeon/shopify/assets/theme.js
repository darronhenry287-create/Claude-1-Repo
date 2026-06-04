/* ============================================================
   AEON — interactions
   MOCK mode (static preview: window.AEON_MOCK = true) uses a
   localStorage cart. LIVE mode (Shopify) uses the native cart.
   ============================================================ */
(function () {
  'use strict';
  const MOCK = window.AEON_MOCK === true;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = (n) => '$' + n.toFixed(2);

  /* ---- relocate off-canvas panels to <body> (no phantom height) ---- */
  const overlay = $('#overlay'), drawer = $('#drawer'), menu = $('#menu'), modal = $('#coa-modal');
  [overlay, drawer, menu, modal].forEach(el => { if (el && el.parentElement !== document.body) document.body.appendChild(el); });

  const lock = () => { document.body.style.overflow = 'hidden'; };
  const unlock = () => { document.body.style.overflow = ''; };
  const openCart = () => { drawer && drawer.classList.add('open'); overlay && overlay.classList.add('open'); lock(); };
  const closeCart = () => { drawer && drawer.classList.remove('open'); overlay && overlay.classList.remove('open'); unlock(); };
  const openMenu = () => { menu && menu.classList.add('open'); lock(); };
  const closeMenu = () => { menu && menu.classList.remove('open'); unlock(); };
  const openModal = () => { modal && modal.classList.add('open'); lock(); };
  const closeModal = () => { modal && modal.classList.remove('open'); unlock(); };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    const a = t.dataset.action;
    if (a === 'open-cart')  { e.preventDefault(); openCart(); }
    if (a === 'close-cart')  closeCart();
    if (a === 'open-menu')   openMenu();
    if (a === 'close-menu')  closeMenu();
    if (a === 'open-coa')   { e.preventDefault(); openModal(); }
    if (a === 'close-coa')   closeModal();
    if (a === 'checkout' && MOCK) { e.preventDefault(); alert('Demo storefront — checkout is mocked. A live Shopify store routes this to secure checkout.'); }
  });
  overlay && overlay.addEventListener('click', closeCart);
  modal && $('.modal__bg', modal) && $('.modal__bg', modal).addEventListener('click', closeModal);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeMenu(); closeModal(); } });

  /* ============================================================
     MOCK CART
     ============================================================ */
  if (MOCK) {
    const FREE = 50, KEY = 'aeon-cart';
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
    const save  = () => localStorage.setItem(KEY, JSON.stringify(cart));
    const count = () => cart.reduce((n, i) => n + i.qty, 0);
    const total = () => cart.reduce((n, i) => n + i.price * i.qty, 0);
    const FALLBACK_IMG = 'assets/img/bottle.svg';

    function bump() { const b = $('.cartnum'); if (!b) return; const c = count(); b.textContent = c; b.classList.toggle('show', c > 0); }

    function render() {
      bump(); renderPage();
      const body = $('#cart-body'), foot = $('#cart-foot'); if (!body) return;
      if (!cart.length) { body.innerHTML = '<div class="dempty"><p>Your cart is empty.</p><p style="margin-top:.4rem;font-size:.85rem">Longevity starts with one capsule.</p></div>'; if (foot) foot.style.display = 'none'; return; }
      if (foot) foot.style.display = 'block';
      body.innerHTML = cart.map((i, x) => `
        <div class="ditem">
          <div class="ditem__thumb"><img src="${i.img || FALLBACK_IMG}" alt=""></div>
          <div class="ditem__info"><h4>${i.name}</h4><div class="v">${i.variant || ''}</div>
            <div class="ditem__foot">
              <div class="dqty"><button data-q="-1" data-i="${x}">−</button><span>${i.qty}</span><button data-q="1" data-i="${x}">+</button></div>
              <strong style="font-family:var(--mono)">${money(i.price * i.qty)}</strong>
            </div>
            <button class="drm" data-rm="${x}">Remove</button>
          </div>
        </div>`).join('');
      const tot = total(), rem = Math.max(0, FREE - tot), pct = Math.min(100, tot / FREE * 100);
      $('#cart-sub').textContent = money(tot);
      const fb = $('#freebar');
      if (fb) fb.innerHTML = rem > 0
        ? `You're <strong>${money(rem)}</strong> from free shipping<div class="freebar__track"><div class="freebar__fill" style="width:${pct}%"></div></div>`
        : `<strong>✓ Free shipping unlocked</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
      $$('[data-q]', body).forEach(b => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.q; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); save(); render(); }));
      $$('[data-rm]', body).forEach(b => b.addEventListener('click', () => { cart.splice(+b.dataset.rm, 1); save(); render(); }));
    }
    function add(item) {
      const k = item.id + '|' + (item.variant || '');
      const f = cart.find(i => i.id + '|' + (i.variant || '') === k);
      if (f) f.qty += item.qty; else cart.push({ ...item });
      save(); render(); openCart();
    }
    function renderPage() {
      const items = $('#cart-page-items'); if (!items) return;
      const empty = $('#cart-page-empty'), sum = $('#cart-page-sum');
      if (!cart.length) { items.innerHTML = ''; if (empty) empty.hidden = false; if (sum) sum.style.display = 'none'; return; }
      if (empty) empty.hidden = true; if (sum) sum.style.display = '';
      items.innerHTML = cart.map((i, x) => `
        <div class="cline">
          <div class="cline__thumb"><img src="${i.img || FALLBACK_IMG}" alt=""></div>
          <div class="cline__info"><h4 style="font-family:var(--display)">${i.name}</h4><div class="v muted" style="font-size:.78rem;font-family:var(--mono)">${i.variant || ''}</div><button class="drm" data-prm="${x}">Remove</button></div>
          <div class="dqty"><button data-pq="-1" data-i="${x}">−</button><span>${i.qty}</span><button data-pq="1" data-i="${x}">+</button></div>
          <div class="cline__price">${money(i.price * i.qty)}</div>
        </div>`).join('');
      const tot = total();
      const s = $('#cart-page-sub'), tt = $('#cart-page-total');
      if (s) s.textContent = money(tot); if (tt) tt.textContent = money(tot);
      $$('[data-pq]', items).forEach(b => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.pq; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); save(); render(); }));
      $$('[data-prm]', items).forEach(b => b.addEventListener('click', () => { cart.splice(+b.dataset.prm, 1); save(); render(); }));
    }

    $$('[data-add]').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const scope = btn.closest('[data-product]') || document;
      const id = btn.dataset.id || 'aeon-nmn', name = btn.dataset.name || 'AEON NMN 1000';
      let price = parseFloat(btn.dataset.price || '68'), qty = 1, variant = btn.dataset.variant || '';
      const img = btn.dataset.img || FALLBACK_IMG;
      const tier = $('.tier.active', scope), qin = $('.qty input', scope);
      if (qin) qty = Math.max(1, parseInt(qin.value) || 1);
      if (tier) { price = parseFloat(tier.dataset.price); variant = tier.dataset.label || variant; }
      add({ id, name, price, qty, variant, img });
    }));

    render();

    $$('.signup').forEach(f => f.addEventListener('submit', (e) => { e.preventDefault(); f.innerHTML = '<div class="note-ok">✓ You\'re in. Check your inbox for your protocol guide + 10% off.</div>'; }));
    const cf = $('#contact-form'); if (cf) cf.addEventListener('submit', (e) => { e.preventDefault(); cf.innerHTML = '<div class="note-ok">Received — our team will reply within one business day.</div>'; });
  }

  /* ============================================================
     LIVE free-shipping bar (Shopify server values)
     ============================================================ */
  if (!MOCK) {
    const fb = $('#freebar');
    if (fb && fb.dataset.threshold) {
      const thr = parseFloat(fb.dataset.threshold), tot = parseFloat(fb.dataset.total || '0');
      const rem = Math.max(0, thr - tot), pct = Math.min(100, thr ? tot / thr * 100 : 100);
      fb.innerHTML = rem > 0
        ? `You're <strong>${money(rem)}</strong> from free shipping<div class="freebar__track"><div class="freebar__fill" style="width:${pct}%"></div></div>`
        : `<strong>✓ Free shipping unlocked</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
    }
    if (sessionStorage.getItem('aeon-open-cart') === '1') { sessionStorage.removeItem('aeon-open-cart'); openCart(); }
    $$('[data-bundle-add]').forEach(btn => btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.bundleAdd); if (!id) return;
      e.preventDefault();
      const qty = parseInt(btn.dataset.bundleQty || '1', 10) || 1;
      const sell = btn.dataset.bundleSelling;
      btn.setAttribute('aria-busy', 'true');
      const item = { id, quantity: qty };
      if (sell) item.selling_plan = Number(sell);
      fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ items: [item] }) })
        .then(r => { if (!r.ok) throw new Error('add failed'); return r.json(); })
        .then(() => { sessionStorage.setItem('aeon-open-cart', '1'); window.location.reload(); })
        .catch(() => { window.location.href = btn.getAttribute('href') || '/cart'; });
    }));
  }

  /* ---- purchase tiers ---- */
  const tiers = $$('.tier');
  function syncTier(a) {
    tiers.forEach(t => t.classList.toggle('active', t === a));
    const price = parseFloat(a.dataset.price), cmp = parseFloat(a.dataset.compare || '0');
    const now = $('#p-now'), was = $('#p-was'), sp = $('#sticky-price');
    if (now) now.textContent = money(price);
    if (was) { if (cmp) { was.style.display = ''; was.textContent = money(cmp); } else was.style.display = 'none'; }
    if (sp) sp.textContent = money(price);
    const sel = $('#variant-id'); if (sel && a.dataset.variantId) sel.value = a.dataset.variantId;
  }
  tiers.forEach(t => t.addEventListener('click', () => syncTier(t)));
  if (tiers.length) syncTier(tiers.find(t => t.classList.contains('active')) || tiers[0]);

  /* ---- qty steppers ---- */
  $$('.qty').forEach(q => { const i = $('input', q); $$('button', q).forEach(b => b.addEventListener('click', () => { let v = parseInt(i.value) || 1; v += b.dataset.step === '+' ? 1 : -1; i.value = Math.max(1, v); })); });

  /* ---- gallery ---- */
  $$('.pthumb').forEach(t => t.addEventListener('click', () => {
    $$('.pthumb').forEach(x => x.classList.remove('active')); t.classList.add('active');
    const main = $('#pg-main'); if (!main) return;
    main.innerHTML = t.innerHTML;
  }));

  /* ---- accordions ---- */
  $$('.acc__head').forEach(h => h.addEventListener('click', () => {
    const it = h.closest('.acc__item'), b = $('.acc__body', it), open = it.classList.contains('open');
    it.classList.toggle('open'); b.style.maxHeight = open ? null : b.scrollHeight + 'px';
  }));

  /* ---- sticky add-to-cart bar ---- */
  const sb = $('#stickybar'), anchor = $('#buy-anchor');
  if (sb && anchor && 'IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => sb.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);
  }

  /* ---- scroll reveal + chart draw + gauge count-up ---- */
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        en.target.classList.add('in');
        if (en.target.dataset.countup) animateGauge(en.target);
        io.unobserve(en.target);
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -8% 0px' });
    $$('.reveal, .chart, [data-countup]').forEach(el => io.observe(el));
  } else {
    $$('.reveal, .chart').forEach(el => el.classList.add('in'));
  }

  function animateGauge(el) {
    const to = parseFloat(el.dataset.countup) || 100;
    const fill = $('.gauge__fill', el), val = $('.gauge__val', el);
    if (fill) requestAnimationFrame(() => { fill.style.width = to + '%'; });
    if (val) {
      const dur = 1500, t0 = performance.now();
      const suffix = el.dataset.suffix || '%';
      const step = (now) => {
        const p = Math.min(1, (now - t0) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        val.textContent = Math.round(eased * to) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }
})();
