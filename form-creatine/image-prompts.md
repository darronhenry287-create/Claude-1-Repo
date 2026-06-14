# CREO — product image prompt pack (for Higgsfield "Generate Image")

Generate these in a Claude chat where Higgsfield is connected, then drop the
files into `form-creatine/assets/img/` (and `form-creatine/shopify/assets/`)
using the **filenames below**, or send them over and they'll be wired in.

Style target: clean, bright, premium modern-wellness studio product photography
(think a high-end DTC supplement brand). The 3 jars + bundle look best as
**transparent PNGs** so they float like the current renders; the rest can be
normal JPG/PNG. Export ~1600px+ on the long edge.

---

## Paste at the START of every prompt

**Style:**
> Bright, clean commercial product photography, premium modern wellness brand. Soft natural daylight from the side, gentle diffused contact shadows, seamless background, lots of negative space, photorealistic, ultra-sharp focus on the product, subtle shallow depth of field. No added text, captions, or graphics. Color world: warm cream (#fdf3e7) and off-white backgrounds with small pops of coral (#ff5d3a) and deep navy (#11253f).

**Product (keep identical in every prompt):**
> A short, wide matte-white plastic supplement jar with a smooth deep-navy screw lid and a clean minimalist front label: "CREO" in a bold rounded sans-serif at the top, "DAILY CREATINE" smaller beneath, and "5g CREATINE · 120 GUMMIES" along the bottom. Inside are rounded-square fruit gummies.

---

## The shots

| Filename | Aspect | Format | Prompt (append to Style + Product) |
|---|---|---|---|
| `jar-berry` | 1:1 | PNG (transparent) | …jar filled with deep berry-red gummies, 3/4 front angle, floating just above a soft cream surface with a soft contact shadow. |
| `jar-peach` | 1:1 | PNG (transparent) | …the same jar filled with soft peach/coral gummies, 3/4 front angle, floating with a soft shadow. |
| `jar-citrus` | 1:1 | PNG (transparent) | …the same jar filled with golden-yellow citrus gummies, 3/4 front angle, floating with a soft shadow. |
| `gummies` | 1:1 | JPG/PNG | Macro close-up of a small pile of glossy berry gummies scattered on a clean cream surface, a few catching the light, soft shadows. |
| `inside` | 1:1 | JPG/PNG | Flat-lay from above: an open CREO jar tipped over with gummies spilling out beside a few fresh berries, on a clean off-white surface, bright and airy. |
| `lifestyle` | 3:2 | JPG/PNG | The CREO jar on a sunlit kitchen counter next to a cup of coffee and a small plant, soft morning light and shadows, warm and inviting, shallow depth of field. |
| `bundle` | 1:1 | PNG (transparent) | Three CREO jars (berry, peach, citrus) grouped together, soft studio light, premium e-commerce hero shot. |
| `hero-wide` *(optional)* | 16:9 | JPG/PNG | The Wild Berry jar centered with a few gummies scattered around it on a soft cream-to-white gradient, generous empty space on the left for a headline. |
| `hand` *(optional)* | 1:1 | JPG/PNG | A hand holding four berry gummies in the open palm, close up, clean bright background. |

---

## After you have the images
Send them to me (or commit to the repo). I'll:
1. place them in `assets/img/` + `shopify/assets/`,
2. update the theme/preview to use the photos instead of the SVG placeholders,
3. rebuild the preview and re-zip both deliverables.
