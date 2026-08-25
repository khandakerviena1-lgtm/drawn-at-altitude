"""Build the interactive sketchbook's page plates.

THE PAGES ARE THE FILM'S PAGES. Every plate is a frame lifted out of
`book-a.mp4` / `book-b.mp4` at the moment its caption was on screen, so the
book you leaf through shows exactly what the scrubbed film showed.

Two kinds of page:

  DRAWN   a finished spread. It simply appears when the leaf lands -- no
          staged materialising, at the client's instruction.

  SCENE   the real place, and the only pages that scroll. Each is a segment of
          the film where the camera travels between the place and the
          sketchbook: the bed rising to the window and the valley, the
          mountains coming down to the chairs and the open book, the picker
          down to the drawn branch. Scrolling one of those pages is literally
          looking up and down between what is in front of you and what is on
          your page, which is what the section is about. They ship as a poster
          still (for the turning leaf) plus the video segment itself.

    python scripts/make-sketchbook-pages.py
"""

import pathlib
import subprocess

from PIL import Image

W, H = 1500, 900  # the film's own aspect, so nothing is cropped
PAPER = (242, 235, 221)
OUT = pathlib.Path("public/img/sketchbook")

# Poster/plate time = the segment's own "from": every scene opens on the
# drawing, so the plate used on the leaf and as the video poster is the
# same drawn instant the pane defaults to. Fine-sampled at 0.4s steps to
# find each one clean -- see implementation-log.md.
# (key, clip, poster_seconds, segment) -- segment None means a drawn page.
PAGES = [
    ("thiksey", "a", 2.6, None),
    ("camp", "a", 5.0, None),
    ("room", "a", 6.4, (6.4, 8.80)),
    ("river", "b", 2.6, (2.6, 0.00)),
    ("buckthorn", "b", 6.0, (6.0, 4.00)),
    ("keyplaces", "b", 8.0, None),
    ("bluethroat", "b", 9.8, None),
    ("momos", "b", 12.0, None),
]


def grab(key: str, clip: str, t: float) -> Image.Image:
    tmp = OUT / f"_{key}.png"
    subprocess.run(
        ["ffmpeg", "-loglevel", "error", "-ss", str(t),
         "-i", f"public/video/book-{clip}.mp4", "-frames:v", "1", "-y", str(tmp)],
        check=True,
    )
    im = Image.open(tmp).convert("RGB").copy()
    tmp.unlink()
    return im


def fit_to_page(src: Image.Image) -> Image.Image:
    page = Image.new("RGB", (W, H), PAPER)
    s = min(W / src.width, H / src.height)
    w, h = int(round(src.width * s)), int(round(src.height * s))
    page.paste(src.resize((w, h), Image.LANCZOS), ((W - w) // 2, (H - h) // 2))
    return page


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    # Stale layers from the staged-reveal version, which no longer exists.
    for old in OUT.glob("*-ink.webp"):
        old.unlink()
    for old in OUT.glob("*-pencil.webp"):
        old.unlink()

    for key, clip, t, seg in PAGES:
        fit_to_page(grab(key, clip, t)).save(
            OUT / f"{key}-colour.webp", "WEBP", quality=90, method=6
        )
        kind = f"scene {seg[0]}-{seg[1]}s of book-{clip}" if seg else "drawn"
        print(f"  {key}: {kind}")

    print(f"\n{len(PAGES)} plates written to {OUT}")


if __name__ == "__main__":
    main()
