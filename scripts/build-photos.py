"""Build the photo slides from the Indus River Camp photography.

Source: the Drive folder "Indus River Camp - Ladakh Pictures"
(id 1DdRaA5QHBX_EC2Blsbn3u50wI2GcQSCk), downloaded to SRC below. Masters are
not kept in the repo — this script is the record of which master became
which slide, and how it was cropped.

Every slide is 3:2 (the PeekSlider frame), cropped around a focal point given
as fractions of the oriented image, then resized to at most 1800x1200 — the
slider is 1000 CSS px wide at most, so 1800 holds on a 2x screen — and written
as WebP q80. Nothing is upscaled: a crop smaller than 1800 wide stays its size.

    C:\\Python314\\python.exe scripts/build-photos.py
"""

import os
from PIL import Image, ImageOps

Image.MAX_IMAGE_PIXELS = None

SRC = r"C:\Users\diana\Documents\Indus River Camp - Ladakh Pictures"
OUT = os.path.join(os.path.dirname(__file__), "..", "public", "img", "photos")
W, H = 1800, 1200

# group -> [(slug, master filename, focal x, focal y[, zoom])]
# zoom < 1 crops tighter than the largest 3:2 box — for small subjects such
# as a bird in flight against open sky.
PLAN = {
    "rooms": [
        ("cottage", "Verandah.jpg", 0.5, 0.5),
        ("chalet", "Chalet Exterior.jpg", 0.5, 0.5),
        ("chalet-room", "Chalet Room.jpg", 0.5, 0.55),
        ("suite", "Suite Interior.jpg", 0.5, 0.5),
        ("bed", "Interior detail.jpg", 0.5, 0.55),
        ("window", "Chalet View Out to the River.jpg", 0.5, 0.5),
        ("veranda", "Mountain Reflection on Cabin Window.JPG", 0.5, 0.5),
        ("bathroom", "Cottage Bathroom.jpg", 0.5, 0.5),
    ],
    "camp": [
        ("from-above", "Dining and Garden Seen from Above.jpg", 0.5, 0.5),
        ("paths", "Pathways.jpg", 0.5, 0.5),
        ("reading-river", "Reading by the River.JPG", 0.5, 0.5),
        ("window-seat", "Reading with the View.jpg", 0.5, 0.5),
        ("two-chairs", "Couple Sitting by the Riverside.jpg", 0.5, 0.5),
        ("riverside-picnic", "Riverside Picnic.jpg", 0.5, 0.5),
        ("still-water", "River and Reflection of Mountains.jpg", 0.5, 0.5),
        ("towards-shey", "View to Shey Palace from the Camp.JPG", 0.5, 0.5),
        ("library", "Library and Living Area 2.jpg", 0.5, 0.5),
        ("milky-way", "Chalet Under the Milky Way.jpg", 0.5, 0.5),
        ("moon", "Moon Photographed Through Telescope.jpg", 0.5, 0.5),
    ],
    "table": [
        ("lunch-by-the-water", "Meal With A View.jpg", 0.5, 0.55),
        ("supper-by-the-river", "Riverside Meal.jpg", 0.5, 0.55),
        ("breakfast", "Breakfast Fruits.jpg", 0.5, 0.5),
        ("watermelon-salad", "Watermelon Mint and Feta Salad.jpg", 0.5, 0.5),
        ("garden-spinach", "Fresh Spinach from the Garden.JPG", 0.5, 0.5),
        ("sea-buckthorn", "Seabuckthorn at September Harvest.jpg", 0.5, 0.5),
        ("wood-oven", "Traditional Italian Pizza Oven in Action.jpg", 0.5, 0.5),
        ("brownie", "Chocolate Brownie Ice Cream.JPG", 0.5, 0.5),
    ],
    "wildlife": [
        ("red-fox", "Himalayan Red Fox at Camp.jpg", 0.5, 0.5),
        ("grey-heron", "Heron Photographed from Camp.JPG", 0.5, 0.5, 0.6),
        ("ibisbill", "Rare Ibisbill Seen at Camp.JPG", 0.55, 0.5, 0.6),
        ("citrine-wagtail", "Citrine Wagtail.JPG", 0.5, 0.5),
        ("white-wagtail", "White Wagtail.jpg", 0.5, 0.5),
        ("rosefinch", "Common rosefinch.jpg", 0.5, 0.5),
        ("blue-sheep", "Blue Sheep.JPG", 0.5, 0.5),
        ("black-necked-cranes", "black necked crane.JPG", 0.5, 0.55),
    ],
    "ladakh": [
        ("hemis", "edited Hemis.jpg", 0.5, 0.5),
        ("gotsang", "edited Gotsang.jpg", 0.5, 0.62),
        ("basgo", "Basgo Overvierw.jpg", 0.5, 0.5),
        ("shey", "Pastel Shey .jpg", 0.5, 0.5),
        ("khardung-la", "Shanti Stupa and Khardung La from Camp.jpg", 0.5, 0.5),
        ("tso-kar-horses", "TSOKAR HORSES.jpg", 0.5, 0.5),
        ("tso-kar-herd", "TSOKAR KASHMIR GOATS.jpg", 0.5, 0.5),
    ],
}


def crop_32(im, fx, fy, zoom=1.0):
    w, h = im.size
    if w / h > 1.5:
        cw, ch = round(h * 1.5 * zoom), round(h * zoom)
    else:
        cw, ch = round(w * zoom), round(w / 1.5 * zoom)
    x = min(max(round(fx * w - cw / 2), 0), w - cw)
    y = min(max(round(fy * h - ch / 2), 0), h - ch)
    return im.crop((x, y, x + cw, y + ch))


def main():
    total = 0
    for group, items in PLAN.items():
        os.makedirs(os.path.join(OUT, group), exist_ok=True)
        for slug, name, fx, fy, *zoom in items:
            im = Image.open(os.path.join(SRC, name))
            im.draft("RGB", (W * 2, H * 2))  # fast JPEG decode, still >= 2x target
            im = ImageOps.exif_transpose(im).convert("RGB")
            im = crop_32(im, fx, fy, *zoom)
            if im.width > W:
                im = im.resize((W, H), Image.LANCZOS)
            dst = os.path.join(OUT, group, slug + ".webp")
            im.save(dst, "WEBP", quality=80, method=6)
            kb = os.path.getsize(dst) // 1024
            total += kb
            print(f"{group}/{slug}.webp  {im.width}x{im.height}  {kb} KB")
    print(f"total {total / 1024:.1f} MB")


if __name__ == "__main__":
    main()
