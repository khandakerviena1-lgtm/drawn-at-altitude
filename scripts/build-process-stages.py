"""Build the ten states of the "How a page is made" drawing.

Every state is derived from ONE plate (public/img/room-plate.webp) and its two
line layers (room-line-pencil / room-line-ink, themselves extracted from the
plate), so all states register pixel for pixel and the section can crossfade
between them while the camera pushes in.

What each printed stage of the method sheet asks for, and what is built:

  01 See & simplify      five big shapes, flat and light      -> s01-shapes
  02 Composition         thumbnail/pencil, focal point        -> s02-sketch  (+ SVG thirds & focal ring)
  03 Perspective         pencil construction                  -> s03-pencil  (+ SVG horizon & vanishing lines)
  04 Contour with Micron ink line, graphite ghost under it    -> s04-ink
  05 Value study         4-5 grey tones under the ink         -> s05-value
  06 Palette Ladakh      same page, palette swatches added    -> s05-value   (+ HTML swatches)
  07 First washes        wet-on-wet sky + far mountains only  -> s07-washes
  08 Depth & atmosphere  colour everywhere, still soft        -> s08-depth
  09 Textures & details  the finished, crisp plate            -> s09-final
  10 Tell the journey    plate + handwritten notes            -> s09-final   (+ HTML notes)

    C:\\Python314\\python.exe scripts/build-process-stages.py
"""

import os
from PIL import Image, ImageChops, ImageEnhance, ImageFilter, ImageOps

ROOT = os.path.join(os.path.dirname(__file__), "..", "public", "img")
OUT = os.path.join(ROOT, "process")
PAPER = (244, 238, 226)  # matches .processWindow's background

plate = Image.open(os.path.join(ROOT, "room-plate.webp")).convert("RGB")
pencil = Image.open(os.path.join(ROOT, "room-line-pencil.webp")).convert("RGBA")
ink = Image.open(os.path.join(ROOT, "room-line-ink.webp")).convert("RGBA")
W, H = plate.size
paper = Image.new("RGB", (W, H), PAPER)


def over(base, layer, opacity=1.0):
    if opacity < 1:
        a = layer.getchannel("A").point(lambda v: int(v * opacity))
        layer = layer.copy()
        layer.putalpha(a)
    out = base.convert("RGBA")
    out.alpha_composite(layer)
    return out.convert("RGB")


def toward_paper(img, amount):
    """Lighten an image toward the paper colour — a dilute wash."""
    return Image.blend(img, paper, amount)


def multiply(a, b):
    return ImageChops.multiply(a, b)


def soft_mask(fn):
    m = Image.new("L", (W, H))
    m.putdata([fn(x, y) for y in range(H) for x in range(W)])
    return m


# 01 — five big shapes, as the sheet numbers them: sky, mountains, river,
# vegetation, foreground. Hand-placed polygons over the window view (the
# ridge traced off the plate), each filled flat with the plate's own mean
# colour for that region, diluted, edges softened. The room is shape 5 too.
RIDGE = [(512, 250), (560, 232), (600, 245), (660, 262), (720, 248), (780, 240),
         (840, 265), (900, 300), (960, 265), (1040, 240), (1100, 232), (1160, 255),
         (1250, 225), (1330, 205), (1400, 195), (1510, 200)]
SHAPES = [  # (polygon, colour) — the sheet's own Ladakh palette, painted flat
    ([(510, 125), (1510, 60)] + RIDGE[::-1], (176, 198, 222)),             # 1 sky
    (RIDGE + [(1510, 410), (510, 410)], (178, 164, 184)),                  # 2 mountains
    ([(510, 410), (1510, 410), (1510, 530), (510, 530)], (160, 196, 200)),  # 3 river
    ([(510, 530), (1510, 530), (1510, 700), (510, 690)], (168, 172, 112)),  # 4 vegetation
    ([(500, 690), (1510, 700), (1536, 800), (1536, 1024), (760, 1024), (840, 790)], (214, 182, 138)),  # 5 foreground
]
from PIL import ImageDraw

# Ragged, not ruled: each mask is blurred then re-thresholded against noise,
# so the edge wanders the way a loaded brush does.
noise = Image.effect_noise((W // 8, H // 8), 60).resize((W, H), Image.BICUBIC)
blocks = paper.copy()
for poly, colour in SHAPES:
    m = Image.new("L", (W, H)); ImageDraw.Draw(m).polygon(poly, fill=255)
    m = m.filter(ImageFilter.GaussianBlur(9))
    near = m.point(lambda v: 255 if v > 24 else 0)  # noise only where the edge is
    m = ImageChops.add(m, noise, scale=1.0, offset=-128).point(lambda v: 255 if v > 110 else 0)
    m = ImageChops.multiply(m, near)
    m = m.filter(ImageFilter.GaussianBlur(2.5))
    blocks = Image.composite(Image.new("RGB", (W, H), colour), blocks, m)
# Pigment never lies flat: a little of the paper's own mottling through it.
blocks = multiply(blocks, toward_paper(Image.merge("RGB", [noise] * 3).filter(ImageFilter.GaussianBlur(6)), 0.86))
s01 = over(toward_paper(blocks, 0.35), pencil, 0.16)

# 02 — composition: the shapes fading back under a first, light pencil.
s02 = over(toward_paper(blocks, 0.62), pencil, 0.62)

# 03 — full pencil construction on clean paper.
s03 = over(paper, pencil, 1.0)

# 04 — ink commits over a graphite ghost.
s04 = over(over(paper, pencil, 0.3), ink, 1.0)

# 05 — value study: the plate in grey, posterised to five tones, diluted,
# with the ink on top.
grey = ImageOps.grayscale(plate.filter(ImageFilter.GaussianBlur(3)))
grey = ImageOps.posterize(grey, 3)  # 8 levels max; dilution below merges to ~5
values = toward_paper(Image.merge("RGB", (grey, grey, grey)), 0.45)
s05 = over(multiply(values, paper), ink, 1.0)

# 07 — first washes: wet-on-wet colour in the sky and the far mountains
# only (above the river line, inside the window), very light, edges soft.
wet = toward_paper(plate.filter(ImageFilter.GaussianBlur(5)), 0.38)
def wash_region(x, y):
    top = 255 if y < 360 else (0 if y > 440 else int(255 * (440 - y) / 80))
    side = 255 if x > 560 else (0 if x < 480 else int(255 * (x - 480) / 80))
    return min(top, side)
mask07 = soft_mask(wash_region).filter(ImageFilter.GaussianBlur(14))
s07 = over(Image.composite(wet, paper, mask07), ink, 1.0)

# 08 — depth & atmosphere: colour everywhere, still soft and lighter than
# the finished page — the layers built, the detail not yet in.
s08 = over(toward_paper(plate.filter(ImageFilter.GaussianBlur(1.6)), 0.2), ink, 0.85)

# 09 — textures & details: the finished plate, slightly sharpened.
s09 = plate.filter(ImageFilter.UnsharpMask(radius=1.4, percent=60, threshold=2))

os.makedirs(OUT, exist_ok=True)
for name, img in [
    ("s01-shapes", s01),
    ("s02-sketch", s02),
    ("s03-pencil", s03),
    ("s04-ink", s04),
    ("s05-value", s05),
    ("s07-washes", s07),
    ("s08-depth", s08),
    ("s09-final", s09),
]:
    dst = os.path.join(OUT, name + ".webp")
    img.save(dst, "WEBP", quality=82, method=6)
    print(name, os.path.getsize(dst) // 1024, "KB")
