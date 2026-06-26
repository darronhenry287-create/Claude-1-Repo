#!/usr/bin/env node
/* Strict Shopify section-schema audit. theme-check 3.26 does NOT catch these,
 * and they 404 the storefront ("Lost the glow" / "No templates found").
 * Run from the brand folder:  node tools/check-schemas.cjs
 * Exits non-zero if any violation is found. */
const fs = require('fs');
const path = require('path');
const DIR = path.join(__dirname, '..', 'shopify', 'sections');
const INLINE_ALLOW = ['a', 'em', 'strong', 'b', 'i', 'u', 'span'];
let problems = [];

for (const f of fs.readdirSync(DIR).filter(f => f.endsWith('.liquid'))) {
  const name = f.replace('.liquid', '');
  const src = fs.readFileSync(path.join(DIR, f), 'utf8');
  const m = src.match(/{%\s*schema\s*%}([\s\S]*?){%\s*endschema\s*%}/);
  if (!m) continue;
  let schema;
  try { schema = JSON.parse(m[1]); }
  catch (e) { problems.push(`${name}: schema is not valid JSON — ${e.message}`); continue; }

  const audit = (settings, where) => {
    const ids = [];
    for (const s of (settings || [])) {
      if (s.id) { if (ids.includes(s.id)) problems.push(`${name}${where}: duplicate id "${s.id}"`); ids.push(s.id); }
      if (s.default === '') problems.push(`${name}${where}: empty-string default on "${s.id}" (omit the default instead)`);
      if (s.type === 'image_picker' && 'default' in s) problems.push(`${name}${where}: image_picker "${s.id}" must not have a default`);
      if (s.type === 'url' && 'default' in s) {
        const okRoutes = ['/', '/collections', '/collections/all', '/products', '/blogs/news', '/search', '/cart', '/account'];
        if (!okRoutes.includes(s.default)) problems.push(`${name}${where}: url "${s.id}" default "${s.default}" is invalid (url-type defaults must be a Shopify route; use a text setting for arbitrary paths)`);
      }
      if (s.type === 'richtext' && s.default != null && !/^\s*<(p|ul|ol|h[1-6])[\s>]/i.test(s.default))
        problems.push(`${name}${where}: richtext "${s.id}" default must be wrapped in <p>/<ul>/<ol>/<h*>`);
      if (s.type === 'inline_richtext' && s.default != null) {
        const tags = [...String(s.default).matchAll(/<\s*\/?\s*([a-z0-9]+)/gi)].map(x => x[1].toLowerCase());
        const bad = [...new Set(tags.filter(t => !INLINE_ALLOW.includes(t)))];
        if (bad.length) problems.push(`${name}${where}: inline_richtext "${s.id}" default has disallowed tag(s) <${bad.join('>, <')}> (allowed: ${INLINE_ALLOW.join(', ')})`);
      }
    }
  };
  audit(schema.settings, '');
  for (const blk of (schema.blocks || [])) audit(blk.settings, ` block:${blk.type}`);
}

if (problems.length) {
  console.error('SCHEMA AUDIT FAILED — these would 404 the storefront:');
  problems.forEach(p => console.error('  ✗ ' + p));
  process.exit(1);
}
console.log('Schema audit clean — ' + fs.readdirSync(DIR).filter(f => f.endsWith('.liquid')).length + ' sections OK.');
