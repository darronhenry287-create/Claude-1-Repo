/* ============================================================
   PRAIRIE FAT CO. — interactions
   Runs in MOCK mode (static preview: window.HH_MOCK = true) or
   LIVE mode (Shopify: native cart, server-rendered values).
   ============================================================ */
(function () {
  'use strict';
  const MOCK = window.HH_MOCK === true;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = (n) => '$' + n.toFixed(2);

  /* drawer / menu */
  const overlay = $('#overlay'), drawer = $('#drawer'), menu = $('#menu');
  // Relocate off-canvas panels to the end of <body> so no section wrapper or
  // transformed ancestor can break their fixed positioning (= no phantom height).
  [overlay, drawer, menu].forEach(el => { if (el && el.parentElement !== document.body) document.body.appendChild(el); });
  const openCart = () => { drawer && drawer.classList.add('open'); overlay && overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { drawer && drawer.classList.remove('open'); overlay && overlay.classList.remove('open'); document.body.style.overflow = ''; };
  const openMenu = () => { menu && menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { menu && menu.classList.remove('open'); document.body.style.overflow = ''; };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    const a = t.dataset.action;
    if (a === 'open-cart') { e.preventDefault(); openCart(); }
    if (a === 'close-cart') closeCart();
    if (a === 'open-menu') openMenu();
    if (a === 'close-menu') closeMenu();
    if (a === 'checkout' && MOCK) { e.preventDefault(); alert('Demo storefront — checkout is mocked. In a live Shopify store this routes to secure checkout.'); }
  });
  overlay && overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });

  /* ============================================================
     MOCK CART (static preview only)
     ============================================================ */
  if (MOCK) {
    const FREE = 35, KEY = 'hh-cart';
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
    const save = () => localStorage.setItem(KEY, JSON.stringify(cart));
    const count = () => cart.reduce((n, i) => n + i.qty, 0);
    const total = () => cart.reduce((n, i) => n + i.price * i.qty, 0);

    function bump() { const b = $('.cartnum'); if (!b) return; const c = count(); b.textContent = c; b.classList.toggle('show', c > 0); }

    function render() {
      bump(); renderPage();
      const body = $('#cart-body'), foot = $('#cart-foot'); if (!body) return;
      if (!cart.length) { body.innerHTML = '<div class="dempty"><p>Your basket is empty.</p><p style="margin-top:.4rem">Good skin starts here.</p></div>'; if (foot) foot.style.display = 'none'; return; }
      if (foot) foot.style.display = 'block';
      body.innerHTML = cart.map((i, x) => `
        <div class="ditem">
          <div class="ditem__thumb"><img src="${i.img || 'assets/img/jar.svg'}" alt="" style="width:100%;height:100%;object-fit:cover"></div>
          <div class="ditem__info"><h4>${i.name}</h4><div class="v">${i.variant || ''}</div>
            <div class="ditem__foot">
              <div class="dqty"><button data-q="-1" data-i="${x}">−</button><span>${i.qty}</span><button data-q="1" data-i="${x}">+</button></div>
              <strong>${money(i.price * i.qty)}</strong>
            </div>
            <button class="drm" data-rm="${x}">Remove</button>
          </div>
        </div>`).join('');
      const tot = total(), rem = Math.max(0, FREE - tot), pct = Math.min(100, tot / FREE * 100);
      $('#cart-sub').textContent = money(tot);
      const fb = $('#freebar');
      if (fb) fb.innerHTML = rem > 0
        ? `You're <strong>${money(rem)}</strong> from free shipping<div class="freebar__track"><div class="freebar__fill" style="width:${pct}%"></div></div>`
        : `<strong>✦ Free shipping unlocked!</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
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
          <div class="cline__thumb"><img src="${i.img || 'assets/img/jar.svg'}" alt="" style="width:100%;height:100%;object-fit:cover"></div>
          <div class="cline__info"><h4 style="font-family:var(--slab)">${i.name}</h4><div class="v muted" style="font-size:.82rem">${i.variant || ''}</div><button class="drm" data-prm="${x}">Remove</button></div>
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
      const id = btn.dataset.id || 'item', name = btn.dataset.name || 'The Tallow Balm';
      let price = parseFloat(btn.dataset.price || '24'), qty = 1, variant = btn.dataset.variant || '';
      const img = btn.dataset.img || 'assets/img/jar.svg';
      const opts = $$('.opt.active[data-variant]', scope).map(o => o.dataset.variant);
      const tier = $('.tier.active', scope), qin = $('.qty input', scope);
      if (qin) qty = Math.max(1, parseInt(qin.value) || 1);
      if (opts.length) variant = opts.join(' / ');
      if (tier) { price = parseFloat(tier.dataset.price); qty *= parseInt(tier.dataset.qty || '1'); variant = (variant ? variant + ' · ' : '') + tier.dataset.label; }
      add({ id, name, price, qty, variant, img });
    }));

    render();
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
        : `<strong>✦ Free shipping unlocked!</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
    }
  }

  /* options */
  $$('.opt-row').forEach(row => row.addEventListener('click', (e) => {
    const o = e.target.closest('.opt'); if (!o) return;
    $$('.opt', row).forEach(x => x.classList.remove('active')); o.classList.add('active');
    syncVariant();
  }));
  function syncVariant() {
    const sel = $('#variant-id'); if (!sel) return;
    const chosen = $$('.opt-row').map(r => { const a = $('.opt.active', r); return a ? a.dataset.variant : null; }).filter(Boolean);
    if (!chosen.length) return;
    [...sel.options].forEach(o => { if (chosen.every(c => o.textContent.trim().split(' / ').includes(c))) sel.value = o.value; });
  }

  /* tiers */
  const tiers = $$('.tier');
  function syncTier(a) {
    tiers.forEach(t => t.classList.toggle('active', t === a));
    const price = parseFloat(a.dataset.price), qty = parseInt(a.dataset.qty || '1'), tot = price * qty;
    const now = $('#p-now'), was = $('#p-was'), sp = $('#sticky-price');
    if (now) now.textContent = money(tot);
    const cmp = parseFloat(a.dataset.compare || '0');
    if (was && cmp) { was.style.display = ''; was.textContent = money(cmp); } else if (was) was.style.display = 'none';
    if (sp) sp.textContent = money(tot);
  }
  tiers.forEach(t => t.addEventListener('click', () => syncTier(t)));

  /* qty steppers */
  $$('.qty').forEach(q => { const i = $('input', q); $$('button', q).forEach(b => b.addEventListener('click', () => { let v = parseInt(i.value) || 1; v += b.dataset.step === '+' ? 1 : -1; i.value = Math.max(1, v); })); });

  /* gallery */
  $$('.pthumb').forEach(t => t.addEventListener('click', () => {
    $$('.pthumb').forEach(x => x.classList.remove('active')); t.classList.add('active');
    const main = $('#pg-main'), thumb = $('img', t), mainImg = main && main.querySelector('img');
    if (mainImg && thumb) mainImg.src = thumb.dataset.full || thumb.src;
  }));

  /* accordions */
  $$('.acc__head').forEach(h => h.addEventListener('click', () => {
    const it = h.closest('.acc__item'), b = $('.acc__body', it), open = it.classList.contains('open');
    it.classList.toggle('open'); b.style.maxHeight = open ? null : b.scrollHeight + 'px';
  }));

  /* sticky bar */
  const sb = $('#stickybar'), anchor = $('#buy-anchor');
  if (sb && anchor) new IntersectionObserver(([e]) => sb.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);

  /* Reveal is handled by pure CSS animation now — no JS needed.
     Belt + suspenders: force-strip any leftover hiding inline styles. */
  $$('.reveal').forEach(el => { el.style.opacity = ''; el.style.transform = ''; });

  /* forms (mock only) */
  if (MOCK) {
    $$('.signup').forEach(f => f.addEventListener('submit', (e) => { e.preventDefault(); f.innerHTML = '<p class="hand" style="font-size:1.4rem">Welcome to the family ✦ Check your inbox for 10% off.</p>'; }));
    const cf = $('#contact-form'); if (cf) cf.addEventListener('submit', (e) => { e.preventDefault(); cf.innerHTML = '<div class="note-ok">Thanks — we\'ll write back within one business day.</div>'; });
  }

  /* init */
  if (tiers.length) syncTier(tiers.find(t => t.classList.contains('active')) || tiers[0]);
})();
