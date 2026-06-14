# CREO — ultra-high-quality product image prompt pack (Higgsfield)

Ad-grade prompts for a bright, premium modern-wellness brand. Generate in a
Higgsfield-connected chat, then drop the files into `form-creatine/assets/img/`
+ `form-creatine/shopify/assets/` using the **filenames below**, or send them to
me and I'll wire them in.

---

## How to get consistent, ad-grade results (read first)

1. **Build every prompt as:** `MASTER STYLE` + `MASTER PRODUCT` + the shot's own
   `COMPOSITION / LIGHTING / LENS` block. Always include the `NEGATIVE PROMPT`.
2. **Lock consistency:** generate `jar-berry` first. Then **reuse the same seed**
   and feed that render back as an **image/style reference** for `jar-peach`,
   `jar-citrus`, `bundle`, and `hero-wide` so the jar shape, lid, and label stay
   identical across the line.
3. **Label text:** diffusion models mangle small text. Either (a) keep the label
   wording in the prompt and accept minor imperfection, or (b) prompt a **clean
   blank label panel** and I'll composite the real crisp "CREO" label on top.
   Option (b) looks the most professional — say the word and I'll do the overlay.
4. **Resolution:** render at the max Higgsfield offers, then upscale 2×. Aim for
   ≥2000px on the long edge.
5. **Format:** the 3 jars + bundle → request **transparent PNG / background
   removed** (or a pure-white seamless I can cut out). Macro / lifestyle → JPG.

---

## MASTER STYLE  (paste at the top of every prompt)
> Ultra-high-quality commercial product photography for a premium modern wellness brand — bright, clean, editorial and minimal. Soft, even natural daylight with a large diffused key light, gentle realistic contact shadows, no harsh highlights. Immaculate surfaces, color-accurate, true-to-life materials, photorealistic, shot for a high-end e-commerce hero. Calm, confident, aspirational. Color world: warm cream (#fdf3e7) and clean off-white, with restrained pops of coral (#ff5d3a) and deep navy (#11253f). Generous negative space. 8k, razor-sharp on the product, professional color grade.

## MASTER PRODUCT  (paste in every prompt — keep identical)
> The product is a short, wide matte-white plastic supplement jar with a smooth deep-navy screw lid and a clean, minimalist front label. The label reads "CREO" in a bold rounded sans-serif at the top, "DAILY CREATINE" smaller beneath, and "5g CREATINE · 120 GUMMIES" along the bottom. Inside are rounded-square fruit gummies with a light matte sugar finish.

## NEGATIVE PROMPT  (paste into the negative field every time)
> harsh shadows, blown-out highlights, cluttered background, distracting props, extra text, gibberish or misspelled text, duplicate or warped logos, watermark, CGI/3D-render look, plastic sheen, oversaturated colors, lens distortion, fingerprints, dust, scratches, reflections of a photographer, low resolution, jpeg artifacts, busy patterns, tilted horizon, clipping

---

## THE SHOTS

### 1 · `jar-berry`  — hero packshot · 1:1 · transparent PNG / white seamless
> [STYLE] [PRODUCT] Three-quarter front hero view at label height, jar filled with deep berry-red gummies, label accent in berry tone. Centered on a clean seamless background that falls from warm cream at the base to soft white at the top. Lighting: a large softbox key from upper-left creating a smooth gradient on the white jar and a soft, realistic shadow pooling gently to the right; subtle white-bounce fill; a faint rim light separating the navy lid from the background. Two or three loose gummies rest at the base, one tipped to catch a soft specular highlight. Medium-format camera, 100mm macro, f/8, ISO 100. Pristine, premium, airy.

### 2 · `jar-peach` — flavor packshot · 1:1 · transparent PNG / white seamless
> [STYLE] [PRODUCT] Identical jar, lighting, angle and framing as the hero shot, but filled with soft peach/coral gummies and a peach-tone label accent. Same seamless cream-to-white background and soft contact shadow. (Use the berry hero as a reference image + same seed for an identical jar.)

### 3 · `jar-citrus` — flavor packshot · 1:1 · transparent PNG / white seamless
> [STYLE] [PRODUCT] Identical jar, lighting, angle and framing as the hero shot, but filled with golden-yellow citrus gummies and a citrus-tone label accent. Same background and shadow. (Reference the berry hero + same seed.)

### 4 · `gummies` — macro texture · 1:1 · JPG
> [STYLE] A tight macro close-up of a small cluster of glossy berry-red gummies scattered on a smooth cream surface, a few overlapping, one in razor-sharp focus catching a soft window-light highlight, the rest melting into a creamy shallow-depth-of-field blur. Visible soft sugar-matte texture, appetizing but clean and premium. 100mm macro, f/2.8, ISO 100, natural soft daylight.

### 5 · `inside` — ingredient flat-lay · 1:1 · JPG
> [STYLE] [PRODUCT] Overhead flat-lay on a clean off-white surface: the open CREO jar lying on its side, gummies spilling out in a loose, intentional arc, styled beside a few fresh berries and a scatter of single gummies. Soft top-down daylight, gentle shadows, lots of clean negative space around the arrangement. Crisp, bright, editorial styling. 50mm, f/5.6, shot straight down.

### 6 · `lifestyle` — morning ritual · 3:2 (wide) · JPG
> [STYLE] [PRODUCT] An inviting lifestyle scene: the CREO jar on a sunlit light-oak or pale-marble kitchen counter, next to a ceramic cup of coffee and a small potted plant slightly out of focus. Warm morning light rakes in from a window on the right, casting soft long shadows and a faint glow. Calm, premium, lived-in but tidy. 35mm, f/2.8, shallow depth of field, natural light, airy color grade.

### 7 · `bundle` — three-jar hero · 1:1 · transparent PNG / white seamless
> [STYLE] [PRODUCT] The three CREO jars (berry, peach, citrus) grouped together — one slightly forward and two staggered behind — on a seamless cream-to-white background. Soft studio key light from upper-left, cohesive soft shadows beneath the group, a faint reflection on the surface. Premium e-commerce trio hero. (Reference the single-jar renders + same seed so all three jars match.)

### 8 · `hero-wide` — homepage banner · 16:9 · JPG (optional)
> [STYLE] [PRODUCT] The Wild Berry jar positioned in the right third of the frame with a few gummies scattered nearby, on a soft cream-to-white gradient. Deliberately large, clean empty space on the left for headline text. Soft directional daylight, gentle shadow, premium and airy. 50mm, f/4.

### 9 · `hand` — human moment · 1:1 · JPG (optional, very "hears.com")
> [STYLE] A close, warm lifestyle shot of an open hand holding four berry-red CREO gummies in the palm, soft natural window light, skin and gummies in crisp focus against a clean, softly blurred bright background. Candid, authentic, premium, inclusive. 50mm, f/2.0.

---

## TECHNICAL SETTINGS (Higgsfield)
- Aspect ratios as noted per shot; resolution maxed then 2× upscale (≥2000px long edge).
- Reuse one **seed** across the jar shots + bundle; attach the berry hero as a **reference image** for the others.
- Always fill the **negative prompt** field above.
- Export jars/bundle with **background removed** (transparent PNG) if Higgsfield supports it; otherwise pure-white seamless and I'll cut them out.

## Handoff
Send me the finished files (or commit them). I'll place them, switch the theme +
preview from the SVG placeholders to your photos, rebuild, and re-zip both
deliverables — no code on your end.
