/* ============================================================================
   APEX — base.js
   Dependency-free runtime. Progressive-enhancement: every module no-ops if its
   markup is absent, so sections stay independent. Works in the live theme
   (Shopify cart / Section Rendering API) and degrades gracefully in the static
   style-guide demo.
   ========================================================================== */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const on = (el, ev, fn, o) => el && el.addEventListener(ev, fn, o);
  const money = (cents) => {
    if (window.Shopify && Shopify.formatMoney) return Shopify.formatMoney(cents, window.APEX?.moneyFormat);
    return '$' + (cents / 100).toFixed(2);
  };
  const debounce = (fn, t = 250) => { let h; return (...a) => { clearTimeout(h); h = setTimeout(() => fn(...a), t); }; };
  document.documentElement.classList.remove('no-js');
  document.documentElement.classList.add('js');

  /* ---------------------------------------------------------------- reveal */
  const io = 'IntersectionObserver' in window
    ? new IntersectionObserver((es, o) => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); o.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' })
    : null;
  const bindReveal = (root = document) => { if (!io) { $$('.reveal', root).forEach(e => e.classList.add('in')); return; } $$('.reveal', root).forEach(e => io.observe(e)); };

  /* --------------------------------------------------------------- marquee */
  const bindMarquee = (root = document) => $$('.marquee__track', root).forEach(t => {
    if (t.dataset.cloned) return; t.dataset.cloned = '1'; t.innerHTML += t.innerHTML;
  });

  /* ---------------------------------------------------- overlay + drawers  */
  let overlay = $('#apex-overlay');
  if (!overlay) { overlay = document.createElement('div'); overlay.id = 'apex-overlay'; overlay.className = 'overlay'; document.body.appendChild(overlay); }
  const openEls = new Set();
  let lastFocus = null;
  const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
  const lock = () => { document.documentElement.style.overflow = 'hidden'; };
  const unlock = () => { document.documentElement.style.overflow = ''; };
  function openPanel(el) {
    if (!el || el.classList.contains('is-open')) return;
    lastFocus = document.activeElement;
    el.classList.add('is-open'); el.setAttribute('aria-hidden', 'false');
    overlay.classList.add('is-open'); openEls.add(el); lock();
    const f = el.querySelector(FOCUSABLE); (f || el).focus({ preventScroll: true });
  }
  function closePanel(el) {
    if (!el) return;
    el.classList.remove('is-open'); el.setAttribute('aria-hidden', 'true'); openEls.delete(el);
    if (!openEls.size) {
      overlay.classList.remove('is-open'); unlock();
      if (lastFocus && lastFocus.focus) { lastFocus.focus({ preventScroll: true }); }
      lastFocus = null;
    }
  }
  function closeAll() { [...openEls].forEach(closePanel); }
  on(overlay, 'click', closeAll);
  on(document, 'keydown', e => {
    if (e.key === 'Escape') { closeAll(); return; }
    if (e.key !== 'Tab' || !openEls.size) return;
    // focus trap within the topmost open panel
    const panel = [...openEls].pop();
    const items = [...panel.querySelectorAll(FOCUSABLE)].filter(x => x.offsetParent !== null);
    if (!items.length) return;
    const first = items[0], last = items[items.length - 1];
    if (!panel.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
    else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
    else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
  });
  on(document, 'click', e => {
    const o = e.target.closest('[data-open]'); if (o) { e.preventDefault(); openPanel($('#' + o.dataset.open)); }
    const c = e.target.closest('[data-close]'); if (c) { e.preventDefault(); closePanel(c.closest('.drawer,.modal') || $('#' + c.dataset.close)); }
  });

  /* ------------------------------------------------------------- accordion */
  // native <details> needs no JS; this supports button-driven .accordion__head
  on(document, 'click', e => {
    const h = e.target.closest('.accordion__head'); if (!h) return;
    const item = h.closest('.accordion__item'); const body = item.querySelector('.accordion__body');
    const open = item.hasAttribute('open');
    if (h.closest('[data-accordion-single]')) $$('.accordion__item[open]', h.closest('[data-accordion-single]')).forEach(i => { if (i !== item) { i.removeAttribute('open'); const b = i.querySelector('.accordion__body'); if (b) b.style.maxHeight = ''; } });
    item.toggleAttribute('open'); h.setAttribute('aria-expanded', String(!open));
    if (body) body.style.maxHeight = open ? '' : body.scrollHeight + 'px';
  });

  /* ----------------------------------------------------------------- tabs  */
  $$('[data-tabs]').forEach(group => {
    const tabs = $$('[role=tab]', group), panels = $$('[role=tabpanel]', group);
    const select = i => { tabs.forEach((t, x) => t.setAttribute('aria-selected', String(x === i))); panels.forEach((p, x) => p.hidden = x !== i); };
    tabs.forEach((t, i) => on(t, 'click', () => select(i)));
    select(0);
  });

  /* --------------------------------------------------------------- slider  */
  $$('[data-slider]').forEach(wrap => {
    const track = $('.slider', wrap) || wrap.querySelector('[data-slider-track]');
    if (!track) return;
    const prev = $('[data-slider-prev]', wrap), next = $('[data-slider-next]', wrap);
    const step = () => (track.firstElementChild ? track.firstElementChild.getBoundingClientRect().width + 16 : track.clientWidth * .8);
    const upd = () => { if (!prev || !next) return; prev.disabled = track.scrollLeft < 8; next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 8; };
    on(prev, 'click', () => track.scrollBy({ left: -step(), behavior: 'smooth' }));
    on(next, 'click', () => track.scrollBy({ left: step(), behavior: 'smooth' }));
    on(track, 'scroll', debounce(upd, 80)); upd();
  });

  /* ------------------------------------------------------------- quantity  */
  on(document, 'click', e => {
    const b = e.target.closest('.qty button'); if (!b) return;
    const input = b.parentElement.querySelector('input'); if (!input) return;
    const dir = b.dataset.dir === 'up' || b.textContent.trim() === '+' ? 1 : -1;
    const min = parseInt(input.min) || 1;
    input.value = Math.max(min, (parseInt(input.value) || min) + dir);
    input.dispatchEvent(new Event('change', { bubbles: true }));
  });

  /* ----------------------------------------------------- sticky add to cart */
  $$('[data-sticky-atc]').forEach(bar => {
    const anchor = $('#' + (bar.dataset.stickyAtc || '')) || $('[data-atc-anchor]');
    if (!anchor || !io) return;
    new IntersectionObserver(([e]) => bar.classList.toggle('is-visible', !e.isIntersecting && e.boundingClientRect.top < 0), { threshold: 0 }).observe(anchor);
  });

  /* ----------------------------------------------------------- countdown   */
  customElements.define('apex-countdown', class extends HTMLElement {
    connectedCallback() {
      const end = new Date(this.dataset.end).getTime(); if (isNaN(end)) return;
      const out = this; const tick = () => {
        let d = Math.max(0, end - Date.now()); const D = 864e5, H = 36e5, M = 6e4;
        const days = Math.floor(d / D); d %= D; const h = Math.floor(d / H); d %= H; const m = Math.floor(d / M); const s = Math.floor((d % M) / 1000);
        const set = (k, v) => { const el = out.querySelector(`[data-unit=${k}]`); if (el) el.textContent = String(v).padStart(2, '0'); };
        set('days', days); set('hours', h); set('mins', m); set('secs', s);
        if (end - Date.now() <= 0) { clearInterval(this._t); this.dispatchEvent(new CustomEvent('ended')); if (this.dataset.hideOnEnd) this.closest('.shopify-section')?.classList.add('hidden'); }
      };
      tick(); this._t = setInterval(tick, 1000);
    }
    disconnectedCallback() { clearInterval(this._t); }
  });

  /* --------------------------------------------------------- variant picker */
  customElements.define('apex-product-form', class extends HTMLElement {
    connectedCallback() {
      this.form = $('form[action*="/cart/add"]', this);
      this.idInput = this.form && this.form.querySelector('[name=id]');
      try { this.variants = JSON.parse($('[data-variants]', this)?.textContent || '[]'); } catch { this.variants = []; }
      this.optionInputs = $$('[data-option-index]', this);
      this.optionInputs.forEach(i => on(i, 'change', () => this.onChange()));
      on(this.form, 'submit', e => this.addToCart(e));
      this.onChange(true);
    }
    selectedOptions() {
      const map = {};
      this.optionInputs.forEach(i => { if (i.type === 'radio' || i.tagName === 'SELECT') { if (i.type === 'radio' && !i.checked) return; map[i.dataset.optionIndex] = i.value; } });
      return map;
    }
    onChange(initial) {
      const sel = this.selectedOptions();
      const match = this.variants.find(v => Object.keys(sel).every(k => v.options[k] === sel[k]));
      const evt = new CustomEvent('variant:change', { bubbles: true, detail: { variant: match } });
      if (match && this.idInput) this.idInput.value = match.id;
      // price
      const priceEl = $('[data-price]', this);
      if (priceEl && match) { priceEl.innerHTML = match.compare_at_price > match.price
        ? `<span class="price__current">${money(match.price)}</span> <span class="price__compare">${money(match.compare_at_price)}</span>`
        : `<span class="price__current">${money(match.price)}</span>`; }
      // availability
      const btn = $('[data-atc]', this);
      if (btn) { const ok = match && match.available; btn.disabled = !ok; btn.querySelector('[data-atc-label]') && (btn.querySelector('[data-atc-label]').textContent = !match ? 'Unavailable' : ok ? (btn.dataset.label || 'Add to cart') : 'Sold out'); }
      if (match && !initial && window.history?.replaceState) { const u = new URL(location.href); u.searchParams.set('variant', match.id); history.replaceState({}, '', u); }
      this.dispatchEvent(evt);
    }
    async addToCart(e) {
      if (!this.form.action.includes('/cart/add')) return; // demo / no backend
      e.preventDefault();
      const btn = $('[data-atc]', this); btn && btn.setAttribute('aria-busy', 'true');
      try {
        const body = new FormData(this.form);
        body.append('sections', 'cart-drawer');
        const r = await fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body });
        if (!r.ok) throw new Error('add'); const data = await r.json();
        document.dispatchEvent(new CustomEvent('cart:added', { detail: data }));
        refreshCart(); openPanel($('#cart-drawer'));
      } catch (err) { location.href = '/cart'; }
      finally { btn && btn.removeAttribute('aria-busy'); }
    }
  });

  /* --------------------------------------------- cart drawer refresh (live) */
  async function refreshCart() {
    const drawer = $('#cart-drawer'); if (!drawer) return;
    try {
      const r = await fetch('/?sections=cart-drawer'); const data = await r.json();
      if (data['cart-drawer']) { const tmp = document.createElement('div'); tmp.innerHTML = data['cart-drawer']; const fresh = tmp.querySelector('#cart-drawer-content'); const cur = $('#cart-drawer-content', drawer); if (fresh && cur) cur.replaceWith(fresh); }
    } catch {}
    try { const c = await (await fetch('/cart.js')).json(); $$('[data-cart-count]').forEach(n => { n.textContent = c.item_count; n.hidden = c.item_count === 0; }); } catch {}
  }
  // quick add (single-variant product cards)
  on(document, 'click', async e => {
    const q = e.target.closest('[data-quick-add]'); if (!q) return;
    const id = q.dataset.quickAdd; if (!id) return; e.preventDefault();
    q.setAttribute('aria-busy', 'true');
    try { const b = new FormData(); b.append('id', id); b.append('quantity', 1); const r = await fetch('/cart/add.js', { method: 'POST', headers: { Accept: 'application/json' }, body: b }); if (!r.ok) throw 0; document.dispatchEvent(new CustomEvent('cart:added')); refreshCart(); openPanel($('#cart-drawer')); }
    catch { location.href = '/cart'; } finally { q.removeAttribute('aria-busy'); }
  });
  // cart line qty/remove via /cart/change.js
  on(document, 'click', async e => {
    const a = e.target.closest('[data-cart-change]'); if (!a) return; e.preventDefault();
    try { await fetch('/cart/change.js', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify({ line: +a.dataset.line, quantity: +a.dataset.cartChange }) }); if (document.body.classList.contains('template-cart')) { location.reload(); } else { refreshCart(); } }
    catch { location.href = '/cart'; }
  });

  /* ------------------------------------------------------ predictive search */
  customElements.define('apex-search', class extends HTMLElement {
    connectedCallback() {
      this.input = $('input[type=search]', this); this.results = $('[data-results]', this);
      if (!this.input) return;
      on(this.input, 'input', debounce(() => this.run(), 250));
    }
    async run() {
      const q = this.input.value.trim(); if (!this.results) return;
      if (q.length < 2) { this.results.innerHTML = ''; return; }
      try {
        const url = `/search/suggest?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=6&section_id=predictive-search`;
        const r = await fetch(url); const html = await r.text();
        const tmp = document.createElement('div'); tmp.innerHTML = html;
        const inner = tmp.querySelector('[data-results]') || tmp;
        this.results.innerHTML = inner.innerHTML;
      } catch {}
    }
  });

  /* ----------------------------------------------- header on-scroll shadow  */
  const header = $('[data-header-sticky]');
  if (header) { const onScroll = () => header.classList.toggle('is-scrolled', window.scrollY > 8); onScroll(); on(window, 'scroll', onScroll, { passive: true }); }

  /* ---------------------------------------------------------------- init    */
  const init = (root) => { bindReveal(root); bindMarquee(root); };
  init(document);
  // Re-init content injected by the Theme Editor
  document.addEventListener('shopify:section:load', e => init(e.target));
  document.addEventListener('shopify:section:select', e => { const d = e.target.querySelector('.drawer'); });
})();
