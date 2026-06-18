/* ============================================================
   GLAZE — interactions
   MOCK mode (static preview: window.GLAZE_MOCK = true) or
   LIVE mode (Shopify: native cart, server-rendered values).
   ============================================================ */
(function () {
  'use strict';
  const MOCK = window.GLAZE_MOCK === true;
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const money = (n) => '$' + (Math.round(n * 100) / 100).toFixed(2);

  /* ---- drawer / menu / overlay ---- */
  const overlay = $('#overlay'), drawer = $('#drawer'), menu = $('#menu');
  // Move off-canvas panels to <body> end so no transformed ancestor can break
  // their fixed positioning (= no phantom page height below the footer).
  [overlay, drawer, menu].forEach(el => { if (el && el.parentElement !== document.body) document.body.appendChild(el); });
  const openCart = () => { drawer && drawer.classList.add('open'); overlay && overlay.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeCart = () => { drawer && drawer.classList.remove('open'); overlay && overlay.classList.remove('open'); document.body.style.overflow = ''; };
  const openMenu = () => { menu && menu.classList.add('open'); document.body.style.overflow = 'hidden'; };
  const closeMenu = () => { menu && menu.classList.remove('open'); document.body.style.overflow = ''; };

  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-action]'); if (!t) return;
    const a = t.dataset.action;
    if (a === 'open-cart')  { e.preventDefault(); openCart(); }
    if (a === 'close-cart') closeCart();
    if (a === 'open-menu')  openMenu();
    if (a === 'close-menu') closeMenu();
    if (a === 'checkout' && MOCK) { e.preventDefault(); alert('Demo storefront — checkout is mocked. In a live Shopify store this routes to secure checkout.'); }
  });
  overlay && overlay.addEventListener('click', closeCart);
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') { closeCart(); closeMenu(); } });

  /* ============================================================
     MOCK CART (static preview only)
     ============================================================ */
  let mockAdd = null;
  if (MOCK) {
    const FREE = parseFloat((drawer && drawer.dataset.free) || '35'), KEY = 'glaze-cart';
    let cart = [];
    try { cart = JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { cart = []; }
    const save  = () => localStorage.setItem(KEY, JSON.stringify(cart));
    const count = () => cart.reduce((n, i) => n + i.qty, 0);
    const total = () => cart.reduce((n, i) => n + i.price * i.qty, 0);
    const PH = 'assets/img/balm.svg';

    function bump() { const b = $('.cartnum'); if (!b) return; const c = count(); b.textContent = c; b.classList.toggle('show', c > 0); }

    function render() {
      bump(); renderPage();
      const body = $('#cart-body'), foot = $('#cart-foot'); if (!body) return;
      if (!cart.length) { body.innerHTML = '<div class="dempty"><p>Your bag is empty.</p><p style="margin-top:.4rem">A good ritual starts here.</p></div>'; if (foot) foot.style.display = 'none'; return; }
      if (foot) foot.style.display = 'block';
      body.innerHTML = cart.map((i, x) => `
        <div class="ditem">
          <div class="ditem__thumb"><img src="${i.img || PH}" alt=""></div>
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
        : `<strong>Free shipping unlocked.</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
      $$('[data-q]', body).forEach(b => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.q; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); save(); render(); }));
      $$('[data-rm]', body).forEach(b => b.addEventListener('click', () => { cart.splice(+b.dataset.rm, 1); save(); render(); }));
    }
    function add(item) {
      const k = item.id + '|' + (item.variant || '');
      const f = cart.find(i => i.id + '|' + (i.variant || '') === k);
      if (f) f.qty += item.qty; else cart.push({ ...item });
      save(); render();
    }
    mockAdd = add;
    function renderPage() {
      const items = $('#cart-page-items'); if (!items) return;
      const empty = $('#cart-page-empty'), sum = $('#cart-page-sum');
      if (!cart.length) { items.innerHTML = ''; if (empty) empty.hidden = false; if (sum) sum.style.display = 'none'; return; }
      if (empty) empty.hidden = true; if (sum) sum.style.display = '';
      items.innerHTML = cart.map((i, x) => `
        <div class="cline">
          <div class="cline__thumb"><img src="${i.img || PH}" alt=""></div>
          <div class="cline__info"><h4>${i.name}</h4><div class="v mono faint" style="font-size:.66rem;letter-spacing:.04em">${i.variant || ''}</div><button class="drm" data-prm="${x}">Remove</button></div>
          <div class="dqty"><button data-pq="-1" data-i="${x}">−</button><span>${i.qty}</span><button data-pq="1" data-i="${x}">+</button></div>
          <div class="cline__price">${money(i.price * i.qty)}</div>
        </div>`).join('');
      const tot = total();
      const s = $('#cart-page-sub'), tt = $('#cart-page-total');
      if (s) s.textContent = money(tot); if (tt) tt.textContent = money(tot);
      $$('[data-pq]', items).forEach(b => b.addEventListener('click', () => { cart[+b.dataset.i].qty += +b.dataset.pq; if (cart[+b.dataset.i].qty <= 0) cart.splice(+b.dataset.i, 1); save(); render(); }));
      $$('[data-prm]', items).forEach(b => b.addEventListener('click', () => { cart.splice(+b.dataset.prm, 1); save(); render(); }));
    }

    // PDP / quick add-to-cart
    $$('[data-add]').forEach(btn => btn.addEventListener('click', (e) => {
      e.preventDefault();
      const scope = btn.closest('[data-product]') || document;
      const id = btn.dataset.id || 'item', name = btn.dataset.name || 'GLAZE';
      let price = parseFloat(btn.dataset.price || '0'), qty = 1, variant = btn.dataset.variant || '';
      const img = btn.dataset.img || PH;
      const opts = $$('.opt.active[data-variant]', scope).map(o => o.dataset.variant);
      const tier = $('.tier.active', scope), qin = $('.qty input', scope);
      if (qin) qty = Math.max(1, parseInt(qin.value) || 1);
      if (opts.length) variant = opts.join(' / ');
      if (tier) { price = parseFloat(tier.dataset.price); qty *= parseInt(tier.dataset.qty || '1'); variant = (variant ? variant + ' · ' : '') + tier.dataset.label; }
      add({ id, name, price, qty, variant, img });
      openCart();
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
        : `<strong>Free shipping unlocked.</strong><div class="freebar__track"><div class="freebar__fill" style="width:100%"></div></div>`;
    }
    if (sessionStorage.getItem('glaze-open-cart') === '1') { sessionStorage.removeItem('glaze-open-cart'); openCart(); }

    // Single quick add-to-cart (no checkout redirect)
    $$('[data-bundle-add]').forEach(btn => btn.addEventListener('click', (e) => {
      const id = Number(btn.dataset.bundleAdd); if (!id) return;
      e.preventDefault();
      const qty = parseInt(btn.dataset.bundleQty || '1', 10) || 1;
      btn.setAttribute('aria-busy', 'true');
      fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify({ items: [{ id, quantity: qty }] }) })
        .then(r => { if (!r.ok) throw new Error('add failed'); return r.json(); })
        .then(() => { sessionStorage.setItem('glaze-open-cart', '1'); window.location.reload(); })
        .catch(() => { window.location.href = btn.getAttribute('href') || '/cart'; });
    }));
  }

  /* ============================================================
     BUILD-A-BUNDLE — "Build your ritual"
     Works in both modes. Cards: .bcard[data-id|name|type|price|img]
     ============================================================ */
  const builder = $('#ritual-builder');
  if (builder) {
    const MIN = parseInt(builder.dataset.min || '3', 10);
    const DISC = parseFloat(builder.dataset.discount || '15') / 100;
    const CODE = builder.dataset.code || '';
    const picked = new Map(); // id -> {id,name,type,price,img}

    const els = {
      count: $('#tray-count'), fill: $('#tray-fill'), body: $('#tray-body'),
      sub: $('#tray-sub'), disc: $('#tray-disc'), discRow: $('#tray-disc-row'),
      total: $('#tray-total'), add: $('#tray-add'), hint: $('#tray-hint'),
    };

    function update() {
      const items = [...picked.values()];
      const n = items.length;
      const sub = items.reduce((s, i) => s + i.price, 0);
      const qualifies = n >= MIN;
      const discount = qualifies ? sub * DISC : 0;
      if (els.count) els.count.textContent = n + (n === 1 ? ' product' : ' products');
      if (els.fill) els.fill.style.width = Math.min(100, n / MIN * 100) + '%';
      if (els.body) {
        els.body.innerHTML = n
          ? items.map(i => `<div class="titem"><div class="titem__thumb"><img src="${i.img}" alt=""></div><div class="titem__name">${i.name}<small>${i.type}</small></div><span class="mono" style="font-size:.74rem">${money(i.price)}</span><button class="titem__rm" data-rm="${i.id}" aria-label="Remove">×</button></div>`).join('')
          : '<div class="tray__empty">No products yet — choose at least ' + MIN + '.</div>';
      }
      if (els.sub) els.sub.textContent = money(sub);
      if (els.discRow) els.discRow.style.display = discount > 0 ? 'flex' : 'none';
      if (els.disc) els.disc.textContent = '–' + money(discount);
      if (els.total) els.total.textContent = money(sub - discount);
      if (els.hint) els.hint.textContent = qualifies ? 'Ritual unlocked — save ' + Math.round(DISC * 100) + '%' : (MIN - n) + ' more to unlock ' + Math.round(DISC * 100) + '% off';
      if (els.add) els.add.toggleAttribute('disabled', !qualifies);

      $$('.titem__rm', els.body).forEach(b => b.addEventListener('click', () => { picked.delete(b.dataset.rm); syncCards(); update(); }));
    }
    function syncCards() {
      $$('.bcard', builder).forEach(card => {
        const on = picked.has(card.dataset.id);
        card.classList.toggle('picked', on);
        const btn = $('.bcard__btn', card); if (btn) btn.innerHTML = on ? '✓ Added' : '+ Add to ritual';
      });
    }

    $$('.bcard', builder).forEach(card => {
      const btn = $('.bcard__btn', card); if (!btn) return;
      btn.addEventListener('click', () => {
        const id = card.dataset.id;
        if (picked.has(id)) picked.delete(id);
        else picked.set(id, { id, name: card.dataset.name, type: card.dataset.type || '', price: parseFloat(card.dataset.price || '0'), img: card.dataset.img });
        syncCards(); update();
      });
    });

    if (els.add) els.add.addEventListener('click', () => {
      const items = [...picked.values()];
      if (items.length < MIN) return;
      if (MOCK && mockAdd) {
        const label = 'Ritual · –' + Math.round(DISC * 100) + '%';
        items.forEach(i => mockAdd({ id: i.id, name: i.name, price: i.price * (1 - DISC), qty: 1, variant: label, img: i.img }));
        picked.clear(); syncCards(); update(); openCart();
      } else {
        els.add.setAttribute('aria-busy', 'true');
        const payload = { items: items.map(i => ({ id: Number(i.id), quantity: 1 })) };
        fetch('/cart/add.js', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }, body: JSON.stringify(payload) })
          .then(r => { if (!r.ok) throw new Error('add failed'); return r.json(); })
          .then(() => { window.location.href = CODE ? ('/discount/' + encodeURIComponent(CODE) + '?redirect=' + encodeURIComponent('/cart')) : '/cart'; })
          .catch(() => { window.location.href = '/cart'; });
      }
    });

    update();
  }

  /* ---- PDP options ---- */
  $$('.opt-row').forEach(row => row.addEventListener('click', (e) => {
    const o = e.target.closest('.opt'); if (!o) return;
    $$('.opt', row).forEach(x => x.classList.remove('active')); o.classList.add('active');
    const lbl = row.previousElementSibling && row.previousElementSibling.querySelector('.pick');
    if (lbl) lbl.textContent = o.textContent.trim();
    syncVariant();
  }));
  function syncVariant() {
    const sel = $('#variant-id'); if (!sel) return;
    const chosen = $$('.opt-row').map(r => { const a = $('.opt.active', r); return a ? a.dataset.variant : null; }).filter(Boolean);
    if (!chosen.length) return;
    [...sel.options].forEach(o => { if (chosen.every(c => o.textContent.trim().split(' / ').includes(c))) sel.value = o.value; });
  }

  /* ---- PDP tiers ---- */
  const tiers = $$('.tier');
  function syncTier(a) {
    tiers.forEach(t => t.classList.toggle('active', t === a));
    const vid = a.dataset.variantId, vsel = document.getElementById('variant-id');
    if (vid && vsel) vsel.value = vid; // LIVE: pack tier -> Shopify variant
    const price = parseFloat(a.dataset.price), qty = parseInt(a.dataset.qty || '1'), tot = price * qty;
    const now = $('#p-now'), was = $('#p-was'), sp = $('#sticky-price');
    if (now) now.textContent = money(tot);
    const cmp = parseFloat(a.dataset.compare || '0');
    if (was && cmp) { was.style.display = ''; was.textContent = money(cmp); } else if (was) was.style.display = 'none';
    if (sp) sp.textContent = money(tot);
  }
  tiers.forEach(t => t.addEventListener('click', () => syncTier(t)));

  /* ---- qty steppers ---- */
  $$('.qty').forEach(q => { const i = $('input', q); $$('button', q).forEach(b => b.addEventListener('click', () => { let v = parseInt(i.value) || 1; v += b.dataset.step === '+' ? 1 : -1; i.value = Math.max(1, v); })); });

  /* ---- gallery (legacy main+thumbs) ---- */
  $$('.pthumb').forEach(t => t.addEventListener('click', () => {
    $$('.pthumb').forEach(x => x.classList.remove('active')); t.classList.add('active');
    const main = $('#pg-main'), thumb = $('img', t), mainImg = main && main.querySelector('img');
    if (mainImg && thumb) mainImg.src = thumb.dataset.full || thumb.src;
  }));

  /* ---- PDP marketing carousel ---- */
  const car = $('#pcarousel');
  if (car) {
    const track = $('#pcar-track', car), dots = $('#pcar-dots', car);
    const slides = track ? [...track.children] : [];
    if (track && dots && slides.length) {
      slides.forEach((_, i) => {
        const b = document.createElement('button');
        b.setAttribute('aria-label', 'Go to slide ' + (i + 1));
        if (i === 0) b.classList.add('active');
        b.addEventListener('click', () => track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' }));
        dots.appendChild(b);
      });
      const sync = () => { const i = Math.round(track.scrollLeft / track.clientWidth); [...dots.children].forEach((d, x) => d.classList.toggle('active', x === i)); };
      let raf; track.addEventListener('scroll', () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(sync); });
      $$('[data-car]', car).forEach(b => b.addEventListener('click', () => {
        const cur = Math.round(track.scrollLeft / track.clientWidth);
        const i = Math.max(0, Math.min(slides.length - 1, cur + (b.dataset.car === 'next' ? 1 : -1)));
        track.scrollTo({ left: track.clientWidth * i, behavior: 'smooth' });
      }));
    }
  }

  /* ---- accordions ---- */
  $$('.acc__head').forEach(h => h.addEventListener('click', () => {
    const it = h.closest('.acc__item'), b = $('.acc__body', it), open = it.classList.contains('open');
    it.classList.toggle('open'); b.style.maxHeight = open ? null : b.scrollHeight + 'px';
  }));

  /* ---- sticky add-to-cart bar ---- */
  const sb = $('#stickybar'), anchor = $('#buy-anchor');
  if (sb && anchor) new IntersectionObserver(([e]) => sb.classList.toggle('show', !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);

  /* Reveal handled by pure CSS; strip any leftover inline hiding just in case */
  $$('.reveal').forEach(el => { el.style.opacity = ''; el.style.transform = ''; });

  /* ---- forms (mock only) ---- */
  if (MOCK) {
    $$('.signup').forEach(f => f.addEventListener('submit', (e) => { e.preventDefault(); f.innerHTML = '<p class="serif" style="font-size:1.2rem">Welcome — check your inbox for 10% off your first ritual.</p>'; }));
    const cf = $('#contact-form'); if (cf) cf.addEventListener('submit', (e) => { e.preventDefault(); cf.innerHTML = '<div class="note-ok">Thanks — we\'ll reply within one business day.</div>'; });
  }

  if (tiers.length) syncTier(tiers.find(t => t.classList.contains('active')) || tiers[0]);
})();
