// Single source of copy + facts. Framer canvas copy is the composition
// authority for section text (see docs/FRAMER-DESIGN-AUDIT.md); annotation
// strings stay here so placeholder handwriting can be swapped for real scans.

export const identity = {
  // "Indus River Camp × Anastasiia" replaced "India-Khan × Natura Illustrata"
  // at the client's instruction (2026-08-19): no India-Khan mentions anywhere
  // on the page. Spelled "Anastasiia" to match her name everywhere else on
  // the site — the client wrote "Anastasia", flagged in case that spelling
  // was deliberate.
  producers: "Indus River Camp × Anastasiia",
  title: "Drawn at Altitude",
  kicker: "Ladakh · Indian Himalaya",
  coverSub: "Ladakh · September 2027",
};

// THE FIRST SKETCHBOOK, page by page.
//
// THE PAGES ARE THE FILM'S PAGES. Each plate is a frame lifted out of book-a /
// book-b at the moment its caption was on screen, and each carries the line the
// film carried there. Arrows turn them; the wheel is left alone.
//
// Two kinds of page, and the difference is the point of the section:
//
//   DRAWN   a finished spread. It appears when the leaf lands, at once, with no
//           staged materialising -- the client asked for the drawing to arrive
//           without animation.
//
//   SCENE   the real place, and the only pages that scroll. Each is a segment
//           of the film in which the camera travels between the place and the
//           sketchbook: the bed rising to the window and the valley, the
//           mountains coming down to the chairs and the open book, the picker
//           down to the drawn branch. Scrolling one of those pages is literally
//           looking up and down between what is in front of you and what is on
//           your page. The scroll is a real nested scroll container, not a
//           hijacked wheel, so when it runs out the landing page carries on.
export const sketchbookPages = [
  {
    // The book opens on its own cover (client, 2026-08-19) — the "Travel
    // Sketching Retreat" lockup — and the first arrow-turn opens it onto
    // Thiksey. Standing flag unchanged: this cover's sketches are Kinnaur
    // Valley, Himachal Pradesh (with a Manali stamp), not Ladakh — client-
    // directed, unresolved.
    key: "cover",
    title: "Travel Sketching Retreat",
    note: "Indian Himalayas, 2027.",
    line: "Nine days in the Indus Valley, gathered one page at a time.",
    alt: "The sketchbook's cover: Travel Sketching Retreat, Indian Himalayas 2027, laid over a map with brushes and open sketchbooks around it",
    scene: null,
  },
  {
    key: "thiksey",
    title: "Thiksey",
    note: "Light, geometry, and silence.",
    line: "Do not draw what you see. Draw what the mountain does to you as it comes through the cloud.",
    alt: "A watercolour of Thiksey monastery rising on its hill above prayer flags",
    scene: null,
  },
  {
    key: "camp",
    title: "The Indus River Camp",
    note: "Nine days. One sketchbook. No hurry.",
    line: "A journey through the Ladakhi Himalaya, gathered one page at a time.",
    alt: "A watercolour of the camp on the bank of the Indus, poplars behind low white buildings",
    scene: null,
  },
  {
    key: "room",
    title: "Your room",
    note: "The bed, the page, and the window above it.",
    line: "From the quiet of your room, the landscape becomes something to pause over, sketch, and reflect on.",
    alt: "A room at the camp: an open sketchbook on the bed, and a wall of windows onto the valley above it",
    // from = the drawing, close and legible. to = pure window, no book in
    // frame at all -- scrolling trades the page for the view above it.
    scene: { clip: "a", from: 6.4, to: 8.8 },
  },
  {
    key: "river",
    title: "The riverbank",
    note: "Three chairs, and the same three drawn.",
    line: "Do not just sketch the riverbank. Sketch the contemplation it invites — the silence, the wonder, the smallness of standing before it.",
    alt: "An open sketchbook showing the Indus and its three wicker chairs drawn, and the real riverbank above it",
    // Reversed from the first cut: from = the sketchbook filling the frame,
    // to = the real bank with no book at all. Scrolling now takes the book
    // away rather than bringing it in.
    scene: { clip: "b", from: 2.6, to: 0.0 },
  },
  {
    key: "buckthorn",
    title: "Sea buckthorn",
    note: "Colour gathered by hand, never chosen from a chart.",
    line: "The page remembers what the eye alone would lose.",
    alt: "An open sketchbook showing sea buckthorn drawn, and the real branch it was picked from above it",
    // Reversed from the first cut, same reason as the riverbank.
    scene: { clip: "b", from: 6.0, to: 4.0 },
  },
  {
    key: "keyplaces",
    title: "Key places",
    note: "Arrival · Thiksey · Leh · Hemis · Alchi · Igoo · Pangong",
    line: "Thiksey. Alchi. Hemis. Pangong. Each place leaves its own trace.",
    alt: "A sketchbook spread headed KEY PLACES: five painted vignettes of the Indus River Camp, Thiksey, Hemis, Pangong Lake and Alchi, each annotated by hand",
    scene: null,
  },
  {
    key: "bluethroat",
    // Included at the client's explicit instruction (2026-08-17), having been
    // left out and flagged. It carries a dated record in a convincing hand
    // whose provenance is unconfirmed, so it stays PoC-only and must not be
    // presented anywhere as a genuine field observation.
    title: "Bluethroat",
    note: "Gone in a moment. Held on the page.",
    line: "Look long enough, and even what was about to leave can be kept.",
    alt: "A sketchbook spread of a bluethroat on a tamarix branch, with a second study of the bird and a river view, annotated by hand",
    scene: null,
  },
  {
    key: "momos",
    title: "Momos in Ladakh",
    note: "The evening meal at camp.",
    line: "You came to see Ladakh. You leave able to make someone else feel it.",
    alt: "A sketchbook spread of a steamer of momos with a bowl of chutney beside a bowl of apricots and yogurt, annotated by hand",
    scene: null,
  },
] as const;

// Said on the pages that scroll, and only on those. The scene line is the
// client's own instruction rewritten as an invitation (2026-08-19): the
// finger holds the sketch, and moving up shows what the sketcher was looking
// at when they drew it.
export const sketchbookCues = {
  scene: "Hold the sketch with your finger and move up — see what the sketcher saw to draw what they drew",
  down: "Sketch from the river",
} as const;

// Turning the pages by hand, or scrolling the whole film: the same sketchbook,
// the same pictures, two ways of moving through it.
export const sketchbookModes = {
  turn: "Turn the pages",
  scroll: "Scroll the film",
  turnHint: "Use the arrows — scrolling still moves you down the page.",
  scrollHint: "Scroll up and down — the film follows you both ways.",
} as const;

export const nav = {
  links: [
    { label: "Journey", href: "#journey" },
    { label: "Details", href: "#details" },
    { label: "Enquire", href: "#enquire" },
  ],
};

export const hero = {
  headline: "A sketchbook practice returns to a painted valley.",
  sub: "A nine-day travel sketching immersion in the Indus Valley.",
  metaSeason: "September 2027",
  meta: "8 guests · 9 days · one riverside base",
};

// Pins on the card, before the visitor crosses into it — the sketchbook
// equivalent of the reference site's "The Coast · The Stay · The Walks". They
// name three places while the page is still fogged, and fade as it opens; the
// first thing the cloud gives back is one of them. Positions are percentages
// over the plate.
export const bookPins = [
  { label: "Thiksey", x: 29, y: 33 },
  { label: "The Indus", x: 67, y: 51 },
  { label: "The room", x: 45, y: 73 },
] as const;

// Captions written on the page under the tipped-in film. Two registers only
// (§14): one editorial line, and small notes in the handwritten face.
//
// Windows are scroll progress across the whole FilmBook section, which opens
// on a closed book and shuts it again at the end:
//   0.00–0.04  the card — straight, front on, cover facing the reader
//   0.04–0.13  the cover swings open as the card grows
//   0.13–0.17  the fogged spread beneath; the pins name three places
//   0.17–0.46  book-a scrubs (cloud → monastery → the page → the room)
//   0.46–0.52  the leaf turns
//   0.52–0.90  book-b scrubs (river → plant → the finished spreads)
//   0.90–1.00  the cover closes over the world, and the closing line arrives
// Windows never overlap, so only one caption is ever written on the paper.
export const bookBeatsA = [
  {
    at: 0.18,
    to: 0.245,
    line: "Do not draw what you see. Draw what the mountain does to you as it comes through the cloud.",
    notes: ["Thiksey — light, geometry, and silence."],
  },
  {
    at: 0.265,
    to: 0.335,
    line: "A journey through the Ladakhi Himalaya, gathered one page at a time.",
    notes: ["Nine days. One sketchbook. No hurry."],
  },
  {
    at: 0.355,
    to: 0.45,
    line: "From the quiet of your room, the landscape becomes something to pause over, sketch, and reflect on.",
    notes: [
      "A place to rest. A place to look. A place to draw.",
      "Look longer, and the valley gives you more than it gave the first time.",
    ],
  },
] as const;

export const bookBeatsB = [
  {
    at: 0.53,
    to: 0.6,
    line: "Do not just sketch the riverbank. Sketch the contemplation it invites — the silence, the wonder, the smallness of standing before it.",
    notes: ["What a place makes you feel is half of what it looks like."],
  },
  {
    at: 0.62,
    to: 0.7,
    line: "The page remembers what the eye alone would lose.",
    notes: [
      "Sea buckthorn, sour and bright. Apricot. Dust on the fingertips.",
      "Colour gathered by hand, never chosen from a chart.",
    ],
  },
  {
    at: 0.715,
    to: 0.765,
    line: "Thiksey. Alchi. Hemis. Pangong. Each place leaves its own trace.",
    notes: [
      "Arrival · Thiksey · Leh · Hemis · Alchi · Igoo · Pangong · Apricot · Tea",
      "Not merely visited. Observed, felt, and carried onto the page.",
    ],
  },
  {
    at: 0.775,
    to: 0.815,
    line: "Look long enough, and even what was about to leave can be kept.",
    notes: ["Gone in a moment. Held on the page."],
  },
  {
    at: 0.825,
    to: 0.87,
    line: "You came to see Ladakh. You leave able to make someone else feel it.",
    notes: ["A drawing stops being a record the moment it carries what you felt."],
  },
] as const;

// Superseded by bookBeatsA/B when the film moved into the sketchbook. Kept
// because FilmHero still reads it and remains swappable.
export const filmBeats = [
  {
    at: 0.0,
    to: 0.09,
    line: "Do not draw what you see. Draw what the mountain does to you as it comes through the cloud.",
    notes: ["Thiksey — light, geometry, and silence."],
  },
  {
    at: 0.11,
    to: 0.21,
    line: "A journey through the Ladakhi Himalaya, gathered one page at a time.",
    notes: ["Nine days. One sketchbook. No hurry."],
  },
  {
    at: 0.23,
    to: 0.35,
    line: "From the quiet of your room, the landscape becomes something to pause over, sketch, and reflect on.",
    notes: ["A place to rest. A place to look. A place to draw."],
  },
  {
    at: 0.37,
    to: 0.45,
    line: "Look longer, and the valley gives you more than it gave the first time.",
    notes: ["The window does the framing. You do the noticing."],
  },
  {
    at: 0.47,
    to: 0.6,
    line: "Do not just sketch the riverbank. Sketch the contemplation it invites — the silence, the wonder, the smallness of standing before it.",
    notes: ["What a place makes you feel is half of what it looks like."],
  },
  {
    at: 0.62,
    to: 0.73,
    line: "The page remembers what the eye alone would lose.",
    notes: [
      "Sea buckthorn, sour and bright. Apricot. Dust on the fingertips.",
      "Colour gathered by hand, never chosen from a chart.",
    ],
  },
  {
    at: 0.75,
    to: 0.83,
    line: "Thiksey. Alchi. Hemis. Pangong. Each place leaves its own trace.",
    notes: [
      "Arrival · Thiksey · Leh · Hemis · Alchi · Igoo · Pangong · Apricot · Tea",
      "Not merely visited. Observed, felt, and carried onto the page.",
    ],
  },
  {
    at: 0.85,
    to: 0.91,
    line: "Look long enough, and even what was about to leave can be kept.",
    notes: ["Gone in a moment. Held on the page."],
  },
  {
    at: 0.93,
    to: 1.0,
    line: "You came to see Ladakh. You leave able to make someone else feel it.",
    notes: ["A drawing stops being a record the moment it carries what you felt."],
  },
] as const;

export const filmHandover = {
  statement: "Nine days. A landscape felt slowly. A journey recorded by hand.",
  label: "Leh → Leh · September 2027 · 8 guests · The Indus River Camp",
};

// The rooms slider — the camp's own photography, from the Drive folder
// "Indus River Camp - Ladakh Pictures" (full-resolution masters; the earlier
// slides came from 1920px phone copies). Slides are 3:2 at 1800×1200 in
// /public/img/photos/rooms/, built by scripts/build-photos.py, which records
// the master and crop behind each one. Add or reorder freely; the component
// reads the length.
//
// 3:2 rather than the portrait frame of the original reference: most of the
// photography is landscape, and the frames that carry the place — the
// veranda over the river, the window onto the Indus — are wide.
export const rooms = [
  {
    src: "/img/photos/rooms/cottage.webp",
    title: "The cottage",
    alt: "A cottage veranda on timber posts under a thatched roof, wicker chairs behind glass, a poplar grove and the snow range beyond",
  },
  {
    src: "/img/photos/rooms/chalet.webp",
    title: "The chalet",
    alt: "A timber chalet with a thatched veranda and glazed front, two wicker chairs on the porch and pale reeds around it",
  },
  {
    src: "/img/photos/rooms/chalet-room.webp",
    title: "A chalet room",
    alt: "A bright chalet room with a timber-beamed ceiling, a bed under a block-printed quilt, blue rugs on a wooden floor and a wall of windows",
  },
  {
    src: "/img/photos/rooms/suite.webp",
    title: "The suite",
    alt: "A suite in late afternoon light: a beamed ceiling, a bed with a printed quilt, a bench at its foot and rugs on a wooden floor",
  },
  {
    src: "/img/photos/rooms/bed.webp",
    title: "The bed",
    alt: "A bed seen through a doorway in warm lamplight, made up with white linen and a block-printed quilt",
  },
  {
    src: "/img/photos/rooms/window.webp",
    title: "The window",
    alt: "From inside a room, a wall of timber-framed windows opening onto the Indus and the mountains beyond",
  },
  {
    src: "/img/photos/rooms/veranda.webp",
    title: "The veranda",
    alt: "Two wicker chairs with blue cushions on a cottage veranda, the mountains reflected in the window glass behind them",
  },
  {
    src: "/img/photos/rooms/bathroom.webp",
    title: "The bathroom",
    alt: "A bathroom with a blue wall, a basin on a timber counter and a slatted wooden floor, low sun through a high window",
  },
] as const;

// Four more chapters from the same photography, each a PeekSlider, placed
// where a guest would meet them: the country the itinerary crosses (after the
// journey), the camp around the rooms and its table (after the rooms), and
// the neighbours (after the dye workshop — they are drawing subjects).
//
// HONESTY OF CAPTIONS: Tso Kar is not on the itinerary, and black-necked
// cranes are birds of the high lakes, not of the camp. Neither is captioned
// as something the week visits or something seen from the room, and the
// support lines say so in plain words.
export type Gallery = {
  readonly id: string;
  readonly kicker: string;
  readonly heading: string;
  readonly support: string;
  readonly label: string;
  readonly slides: readonly { readonly src: string; readonly title: string; readonly alt: string }[];
};

export const ladakh: Gallery = {
  id: "ladakh",
  kicker: "Ladakh",
  heading: "The country around the week.",
  support:
    "Hemis and Gotsang are day four, Basgo and Alchi day five, Shey is across the river from camp. Tso Kar is simply Ladakh.",
  label: "place",
  slides: [
    {
      src: "/img/photos/ladakh/hemis.webp",
      title: "Hemis",
      alt: "Hemis monastery, white walls and tiered roofs at the foot of a steep striated mountainside under a blue sky",
    },
    {
      src: "/img/photos/ladakh/gotsang.webp",
      title: "Gotsang",
      alt: "The Gotsang hermitage, a small white building with red window frames clinging to a bare rock face above Hemis",
    },
    {
      src: "/img/photos/ladakh/basgo.webp",
      title: "Basgo",
      alt: "The ruined fort and temples of Basgo on eroded ochre ridges, a green valley and mountains behind",
    },
    {
      src: "/img/photos/ladakh/shey.webp",
      title: "Shey, in the haze",
      alt: "Shey palace on its ridge, a silhouette against layer after layer of pale blue mountains",
    },
    {
      src: "/img/photos/ladakh/khardung-la.webp",
      title: "Snow towards Khardung La",
      alt: "Snow and cloud on the range towards Khardung La, brown ridges and a line of green poplars below",
    },
    {
      src: "/img/photos/ladakh/tso-kar-horses.webp",
      title: "Tso Kar",
      alt: "Horses grazing on the shore of Tso Kar, a rust and violet mountain rising behind the lake",
    },
    {
      src: "/img/photos/ladakh/tso-kar-herd.webp",
      title: "A herd at Tso Kar",
      alt: "A herd of goats grazing on the flats by Tso Kar, the salt lake and snow-dusted mountains behind",
    },
  ],
};

export const campLife: Gallery = {
  id: "camp",
  kicker: "Life at the camp",
  heading: "Days by the river.",
  support:
    "Between sessions there is the bank, the paths through the reeds, and a long view in every direction.",
  label: "photograph",
  slides: [
    {
      src: "/img/photos/camp/from-above.webp",
      title: "The camp from above",
      alt: "An aerial view of the camp among willows and reeds, the braided Indus spreading across the valley towards the mountains",
    },
    {
      src: "/img/photos/camp/paths.webp",
      title: "The paths",
      alt: "A narrow path between tall golden reeds, bare willows and low sun overhead",
    },
    {
      src: "/img/photos/camp/reading-river.webp",
      title: "Reading by the river",
      alt: "A woman reading, silhouetted against a wide window onto the river, reeds and mountains",
    },
    {
      src: "/img/photos/camp/window-seat.webp",
      title: "A window seat",
      alt: "A woman with a cup on a deep window seat under a thatched roof, the river and clouds outside",
    },
    {
      src: "/img/photos/camp/two-chairs.webp",
      title: "Two chairs on the bank",
      alt: "Two people in wicker chairs on the riverbank, facing a snow-covered range",
    },
    {
      src: "/img/photos/camp/riverside-picnic.webp",
      title: "Tea on the bank",
      alt: "Two men at a low table on a riverside deck, a white curtain lifting in the wind, the river and mountains behind",
    },
    {
      src: "/img/photos/camp/still-water.webp",
      title: "Still water",
      alt: "Mountains and clouds reflected in a perfectly still arm of the river",
    },
    {
      src: "/img/photos/camp/towards-shey.webp",
      title: "Towards Shey",
      alt: "A woman standing at the water's edge, looking across the river towards Shey and the snow peaks",
    },
    {
      src: "/img/photos/camp/library.webp",
      title: "The library",
      alt: "The library and sitting room: low sofas, a red rug, a carved wall and a long run of windows",
    },
    {
      src: "/img/photos/camp/milky-way.webp",
      title: "After dark",
      alt: "The Milky Way over the camp at night, a single lit chalet among the trees below",
    },
    {
      src: "/img/photos/camp/moon.webp",
      title: "Through the camp telescope",
      alt: "The moon photographed through the camp's telescope, its craters sharp along the shadow line",
    },
  ],
};

export const table: Gallery = {
  id: "table",
  kicker: "The table",
  heading: "Grown nearby, eaten outside.",
  support: "Most meals are taken at the camp, from its garden and the valley around it.",
  label: "dish",
  slides: [
    {
      src: "/img/photos/table/lunch-by-the-water.webp",
      title: "Lunch by the water",
      alt: "A table laid by the river with bowls of salads and dishes and a jar of cosmos flowers, mountains across the water",
    },
    {
      src: "/img/photos/table/supper-by-the-river.webp",
      title: "Supper by the river",
      alt: "A wooden table set at dusk with grey plates, pink napkins and small bowls, the river dark behind",
    },
    {
      src: "/img/photos/table/breakfast.webp",
      title: "Breakfast",
      alt: "A blue bowl of watermelon, dragon fruit, pomegranate and grapes on a wooden table in morning sun",
    },
    {
      src: "/img/photos/table/watermelon-salad.webp",
      title: "Watermelon, mint and feta",
      alt: "A dark bowl of watermelon, mint and feta on a blue placemat with a pink napkin",
    },
    {
      src: "/img/photos/table/garden-spinach.webp",
      title: "From the garden",
      alt: "Hands in red and white bangles slicing a heap of fresh spinach on a white board",
    },
    {
      src: "/img/photos/table/sea-buckthorn.webp",
      title: "Sea buckthorn, September",
      alt: "Branches heavy with orange sea buckthorn berries at the September harvest",
    },
    {
      src: "/img/photos/table/wood-oven.webp",
      title: "The wood oven",
      alt: "A pizza baking inside a wood-fired oven, flames and embers along its walls",
    },
    {
      src: "/img/photos/table/brownie.webp",
      title: "Something sweet",
      alt: "A chocolate brownie with a scoop of ice cream, chocolate sauce and a mint leaf in a speckled ceramic bowl",
    },
  ],
};

export const wildlife: Gallery = {
  id: "wildlife",
  kicker: "Drawn from life",
  heading: "The neighbours.",
  support:
    "The fox, the heron and the ibisbill were all photographed at the camp. Blue sheep keep to the slopes on the walk to Gotsang; the cranes to the high lakes.",
  label: "photograph",
  slides: [
    {
      src: "/img/photos/wildlife/red-fox.webp",
      title: "Red fox",
      alt: "A Himalayan red fox standing on the stony ground of the camp, looking straight at the camera",
    },
    {
      src: "/img/photos/wildlife/grey-heron.webp",
      title: "Grey heron",
      alt: "A grey heron in flight against a blue sky, wings spread",
    },
    {
      src: "/img/photos/wildlife/ibisbill.webp",
      title: "Ibisbill",
      alt: "An ibisbill in flight, its long down-curved bill clear against the sky",
    },
    {
      src: "/img/photos/wildlife/citrine-wagtail.webp",
      title: "Citrine wagtail",
      alt: "A citrine wagtail, bright yellow head and grey back, perched in a sea buckthorn bush",
    },
    {
      src: "/img/photos/wildlife/white-wagtail.webp",
      title: "White wagtail",
      alt: "A white wagtail perched on a sea buckthorn branch with an insect in its beak",
    },
    {
      src: "/img/photos/wildlife/rosefinch.webp",
      title: "Common rosefinch",
      alt: "A crimson male common rosefinch perched on a silvery shrub against soft green",
    },
    {
      src: "/img/photos/wildlife/blue-sheep.webp",
      title: "Blue sheep",
      alt: "A blue sheep with curved horns standing among the rocks of a scree slope",
    },
    {
      src: "/img/photos/wildlife/black-necked-cranes.webp",
      title: "Black-necked cranes",
      alt: "Two black-necked cranes standing together on green marsh grass",
    },
  ],
};

// The dye workshop. The spreads follow the process, so the slider IS the
// process rather than a gallery: gathering the dyestuffs (henna off the tree,
// then in the bowl, marigold, myrobalan — whose own caption calls itself "the
// beginning of the dyeing process"), the undyed silk, the baths, the iron
// that darkens them, and the range that comes out.
//
// NOTE ON THE COPY: the client wrote "Tye & Dye" and "when traditional crafts
// meets" — the first is the French rendering of tie-dye and the second does
// not agree in number. Set correctly here; flagged rather than silently
// changed, so it can be put back if "Tie & Dye" is the house spelling.
export const dye = {
  kicker: "Immersive tie & dye and textile workshops",
  heading: "When traditional craft meets the sketchbook.",
  slides: [
    {
      src: "/img/dye/dye-01.webp",
      title: "Henna",
      alt: "A sketchbook spread of a man reaching up into a henna tree to strip leaves, palms behind him — captioned HENNA, fresh leaves from the garden",
    },
    {
      src: "/img/dye/dye-02.webp",
      title: "Henna leaves",
      alt: "A sketchbook spread looking down into a steel bowl heaped with bright green henna leaves — captioned HENNA LEAVES, freshly picked",
    },
    {
      src: "/img/dye/dye-03.webp",
      title: "Marigolds",
      alt: "A sketchbook spread of a wide bowl of dried marigold heads, ochre and brown — captioned MARIGOLDS, dried flowers for dye",
    },
    {
      src: "/img/dye/dye-04.webp",
      title: "Myrobalan",
      alt: "A sketchbook spread of myrobalan nuts being crushed on the ground beside a bowl of the broken kernels — captioned MYROBALAN, the beginning of the dyeing process",
    },
    {
      src: "/img/dye/spinning-wool.webp",
      title: "Spinning the wool",
      alt: "A sketchbook spread of two hands working a drop spindle over a wide steel bowl, the spun thread running from the spindle up to the fingers, a patterned cloth beneath",
    },
    {
      src: "/img/dye/dye-05.webp",
      title: "Raw silk",
      alt: "A sketchbook spread of undyed silk skeins hanging to dry on a woven rack, one indigo bundle among the cream ones — captioned RAW SILK, undyed skeins drying",
    },
    {
      src: "/img/dye/dye-06.webp",
      title: "Onion skins",
      alt: "A sketchbook spread of magenta onion skins being tipped from a bowl into a steel dye pot — captioned ONION SKINS, for a bright dye bath",
    },
    {
      src: "/img/dye/dye-07.webp",
      title: "The dye pot",
      alt: "A sketchbook spread of a dyer stirring a deep red bath with a wooden pole, drying racks and a chair behind — captioned DYE POT, stirring the bath",
    },
    {
      src: "/img/dye/dye-08.webp",
      title: "Jackfruit bark",
      alt: "A sketchbook spread of hands tying a bundle of shredded jackfruit bark into a cloth over a dye pot — captioned JACKFRUIT BARK, mixed with manjistha",
    },
    {
      src: "/img/dye/dye-09.webp",
      title: "Iron bath",
      alt: "A sketchbook spread of two skeins, one blue-grey and one plum, suspended over a black iron bath — captioned IRON BATH, darker shades appear",
    },
    {
      src: "/img/dye/dye-10.webp",
      title: "The final palette",
      alt: "A sketchbook spread of the finished range of dyed silk skeins hung across a timber rack: indigos, teals, orange, ochre, olive, plum and rose — captioned FINAL PALETTE, the dyed silk range",
    },
  ],
} as const;

// One room, two media, one camera. The copy has to survive the whole move,
// so it is deliberately short: the picture is doing the talking.
export const morph = {
  kicker: "The same window, twice",
  altWc: "A watercolour of a room at the Indus River Camp: the bed in the foreground, curtains drawn back, and a wall of windows onto the river, the chairs on the grass and the ridge beyond",
  altReal: "A photograph of that same room through that same window: the same curtains, the same chairs on the grass, the same river below the same ridge",
  annotation: "You draw it, and then you look up.",
  note: "The Indus River Camp · the window you wake up to",
} as const;

// The method sheet, travelled rather than cut. Ten stages of one drawing —
// the camp room's window onto the Indus — taken from big shapes to a finished,
// annotated page. Titles are the ones printed on the panels, so the rail and
// the artwork always say the same thing.
// Each stage's position in the page's own construction, 0 → 1. This is the
// hinge of the merged section: the method sheet's ten stages ARE the build
// stages of a drawing, so stepping the deck can drive the page being made.
// Values line up with the pencil / ink / wash windows the reveal already
// used (pencil 0.08–0.30, ink 0.30–0.56, wash 0.56–0.86), so 04 CONTOUR is
// where ink starts and 07 FIRST WASHES is where colour does — as printed.
// 05 and 06 are deliberately 0.52 and 0.56, not 0.56 and 0.60: at 0.60 the
// wash had already crept onto the page by 2% at 06 PALETTE LADAKH, and that
// stage is about *choosing* colour, not laying it. 0.56 sits exactly on the
// wash threshold — ink completes there and no paint is down until 07 FIRST
// WASHES, as printed. Every stage still changes something.
// 01 is 0.16, not 0.1 (2026-10-05): at 0.1 the pencil edge sat off the page,
// so the section opened on blank paper. 0.16 shows the first third of the
// big shapes in graphite — which is what "see & simplify" asks for — and
// pencil still completes exactly at 03.
// UNUSED since 2026-10-05: DrawingProcess now shows one built image per
// stage (scripts/build-process-stages.py) instead of masking three layers.
// Kept only as the record of the earlier mapping.
export const STAGE_BUILD = [
  0.16, 0.2, 0.3, 0.45, 0.52, 0.56, 0.72, 0.82, 0.92, 1,
] as const;

export const drawingProcess = {
  kicker: "How a page is made",
  heading: "One page, ten stages.",
  sub: "The method sheet beside the page it builds. Step through, and the drawing is made the way the sheet describes.",
  // One line per stage, shown under its title — the sheet's own instruction
  // for that panel, closely paraphrased, because the drawing now shows each
  // one happening (see DrawingProcess / scripts/build-process-stages.py).
  notes: [
    "Break the scene into five big shapes: sky, mountains, river, vegetation, foreground.",
    "Check the horizon, the focal point, balance and negative space. Leave room for the story.",
    "Establish the horizon line, set the vanishing lines of the window, check proportions in pencil.",
    "Micron pen: stronger lines in the foreground, lighter in the distance. Leave the mountains light.",
    "A quick value study in four or five tones — light, shadow and contrast before any colour.",
    "A limited palette taken from the landscape: mineral and Pangong blues, mauve grey, warm earth, ochre.",
    "Wet-on-wet for the sky and the distant mountains. Keep it very light; let the paper show.",
    "Distant mountains light and cool, the middle warmer, the foreground warm and strongest.",
    "Water, vegetation, stone, wood — the textures and details, only where the eye lands.",
    "Bring everything together: small objects, handwritten notes, a place and a date.",
  ],
  alt: "Anastasiia's ten-stage method sheet: the same view from the camp room window drawn from simplified shapes, through composition, perspective, ink contour, value study, a Ladakh palette, first washes, depth, textures, to a finished annotated page",
  stages: [
    { n: "01", title: "See & simplify" },
    { n: "02", title: "Composition" },
    { n: "03", title: "Perspective & proportions" },
    { n: "04", title: "Contour with Micron" },
    { n: "05", title: "Value study" },
    { n: "06", title: "Palette Ladakh" },
    { n: "07", title: "First washes" },
    { n: "08", title: "Depth & atmosphere" },
    { n: "09", title: "Textures & details" },
    { n: "10", title: "Tell the journey" },
  ],
} as const;

// One page making itself, in the order the method sheet teaches. The last two
// notes are the ones actually written on the drawing.
export const sketchReveal = {
  kicker: "One page, from nothing",
  alt: "A room at the Indus River Camp: the bed, a curtain, and a wall of windows onto the river and the mountains beyond, drawn in ink and watercolour",
  stages: [
    {
      at: 0.09,
      to: 0.28,
      line: "Begin with five big shapes, drawn lightly enough to still be wrong.",
      note: "Sky. Mountains. River. Vegetation. The terrace.",
    },
    {
      at: 0.32,
      to: 0.54,
      line: "Then the line commits — stronger in the foreground, lighter in the distance.",
      note: "Don't draw everything. Leave the mountains light.",
    },
    {
      at: 0.58,
      to: 0.84,
      line: "Wet-on-wet for the sky and the far mountains. Keep it very light, and let the paper show.",
      note: "Colour gathered by hand, never chosen from a chart.",
    },
    {
      at: 0.88,
      to: 1.0,
      line: "A quiet afternoon by the Indus.",
      note: "Leh, Ladakh · September 2027",
    },
  ],
} as const;

export const folioOpening = {
  kicker: "Colour, and where it comes from",
  alt: "Ground madder pigment warming into a sand watercolour wash, then the whole finished sketchbook page",
};

export const intro = {
  statement:
    "Come to Ladakh and learn to look slowly enough to make something from it.",
  support:
    "A daily sketchbook practice led by Anastasiia Morozova, moving through architecture, mineral colour, cloth, clay, botany and the landscapes of the Indus Valley.",
};

export const vision = {
  kicker: "Learning to look",
  headline: "The valley, observed.",
  support:
    "Where the Zanskar meets the Indus, the water runs grey-green with glacier silt. Before it is painted, it is watched.",
  note: "grey-green — glacier water, moves fast",
  swatchLabel: "Indus grey-green",
  hint: "move across the film to observe",
  hintMobile: "keep scrolling — the observation moves",
};

export const pillars = [
  {
    number: "01",
    title: "Line",
    eyebrow: "Architecture of the Indus",
    support:
      "Thiksey's twelve stacked storeys at first light, Leh Palace, the village of Stakna. Structure, proportion and shadow, drawn on site.",
    result: "A set of architectural line studies",
    media: "/video-posters/still-line-architecture.webp",
    mediaAlt:
      "Timber-framed cottage of The Indus River Camp among willows — architecture study subject",
  },
  {
    number: "02",
    title: "Colour",
    eyebrow: "Mineral and water",
    support:
      "Pangong at 4,000 metres, the Chang La pass, the confluence where the Zanskar's grey-green water meets the Indus. A full day given to colour alone.",
    result: "A personal Ladakh colour chart",
    media: "/video-posters/v02-indus-river-study.webp",
    mediaAlt:
      "Aerial of the braided grey-green channels of the Indus river between arid hills",
  },
  {
    number: "03",
    title: "Texture",
    eyebrow: "Cloth and clay",
    support:
      "A dyeing or weaving morning at the We Are Kal studio in Leh, and a lesson with one of the two remaining traditional potters of Ladakh, in the village of Igoo.",
    result: "Pattern studies and a hand-formed vessel",
    media: null, // no textile/clay source footage yet — labelled placeholder
    mediaAlt: "",
  },
  {
    number: "04",
    title: "Botany & Table",
    eyebrow: "The naturalist's Ladakh",
    support:
      "Apricots, wild herbs, high-altitude grains. A tea and perfume blending workshop with Makoii Apothecary, and a historical lunch narrated by food historian Kunzes Angmo.",
    result: "Botanical plates in the natural history tradition",
    media: "/video-posters/still-botany-seabuckthorn.webp",
    mediaAlt:
      "Sea buckthorn berries in silver-green foliage at the camp — botanical study subject",
  },
];

// Signature scene: four to eight visible words, per the immersive-moment rule
// in the spec — the image carries the argument, not the copy.
export const signature = {
  kicker: "The window, and the page",
  annotation: "Indus River Camp\nLadakh · 2 Sept",
  artAlt:
    "A watercolour and ink study of the same window, drawn in a sketchbook held against the real view",
};

export const camp = {
  heading: "One place to return to.",
  support: "Settle once. Draw every day.",
  details: [
    "The Indus River Camp",
    "Individual rooms",
    "Riverside setting",
    "Library",
    "September skies",
  ],
  mediaAlt:
    "Film from inside the camp's glass dining pavilion, looking over the Indus to the mountains",
};

// ⚠️ DISTANCES AND DRIVE TIMES ARE STILL INDICATIVE. Everything else here now
// comes from India-Khan's own itinerary (indiakhananastasiialadakh.pdf):
// the activities, the day titles, and the altitudes it states — Leh and the
// camp at 3,200 m (updated by the camp 2026-10-05, was 3,500), Pangong at
// 4,000 m, Chang La at 5,360 m (the camp wrote 5,200 and the deck 5,300; 5,360 is the published figure, kept for the insurance advice), and the Pangong
// drive at three hours. Earlier guesses of 4,350 m and five hours were wrong
// and are corrected.
//
// September temperatures remain researched, not sourced from the operator.
export const NINE_DAYS_STATUS =
  "Activities and altitudes follow the confirmed itinerary. Road distances and September temperatures are indicative and confirmed at contracting.";

export type DayMove = "arrive" | "drive" | "walk" | "sketch" | "stay" | "depart";

export const nineDays = {
  heading: "Nine days. Nine observations.",
  subheading:
    "One riverside base throughout. The line below is the week's real altitude profile — two days at 4,000 m, one down at 3,100.",
  // The ridge is the data, not decoration: y is altitude across the range
  // 3,100–4,000 m, x is the day. Gotsang and Pangong are the two peaks and
  // Alchi is the low day, because that is what the itinerary does. Computed
  // once from the altitudes below and pasted here so nothing re-derives it
  // at runtime.
  ridge:
    "M 50 128.9 C 66.7 134.8 116.7 164.4 150 164.4 C 183.3 164.4 216.7 149.6 250 128.9 C 283.3 108.2 316.7 28.1 350 40 C 383.3 51.9 416.7 185.2 450 200 C 483.3 214.8 516.7 155.6 550 128.9 C 583.3 102.2 616.7 40.0 650 40 C 683.3 40.0 716.7 114.1 750 128.9 C 783.3 143.7 833.3 128.9 850 128.9",
  ridgeFill:
    "M 50 128.9 C 66.7 134.8 116.7 164.4 150 164.4 C 183.3 164.4 216.7 149.6 250 128.9 C 283.3 108.2 316.7 28.1 350 40 C 383.3 51.9 416.7 185.2 450 200 C 483.3 214.8 516.7 155.6 550 128.9 C 583.3 102.2 616.7 40.0 650 40 C 683.3 40.0 716.7 114.1 750 128.9 C 783.3 143.7 833.3 128.9 850 128.9 L 850 240 L 50 240 Z",
  ridgeViewBox: "0 0 900 240",
  // The pass is crossed on day 7 and is higher than any night — worth its own
  // mark, since it is the number a guest should see before booking.
  pass: { day: 7, x: 650, label: "Chang La 5,360 m" },
  // Itinerary as rewritten by the camp, 2026-10-05. Its working notes on
  // modularity are kept to what a guest can act on (`flexible`); booking and
  // supplier details stay out of the page. Day 8 is genuinely unconfirmed.
  // x/y feed only the unwired NineDays ridge; JourneyTimeline derives its own
  // geometry from `altitude`.
  days: [
    { number: "01", place: "Arrival", fragment: "Indus River Camp", move: "arrive" as DayMove, km: 15, minutes: 20, altitude: 3200, x: 50, y: 128.9, tempDay: 22, tempNight: 7, tools: ["Sketchbook", "Pencil"], summary: "Morning flights, twenty minutes to the camp, a day to acclimatise. Warm-up lines by the river, a bonfire, the telescope.", long: "We arrive in Leh on morning flights and transfer to the camp, twenty minutes away. The first day is kept for acclimatising to the altitude: the Indus River Camp sits at 3,200 m, about 200 m lower than Leh, and is a restful place to adjust in nature. In the afternoon Anastasiia runs a short session on materials and some warm-up drawing by the river, followed by an easy walk around the grounds. In the evening there is a bonfire and, if the sky is clear, the telescope comes out.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "camp", note: "Lunch at the camp" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "02", place: "Leh & Textiles", fragment: "We Are Kal", move: "drive" as DayMove, km: 15, minutes: 20, altitude: 3400, x: 150, y: 164.4, tempDay: 22, tempNight: 7, tools: ["Sketchbook", "Watercolour"], summary: "Early light on the river, then dyeing or weaving at We Are Kal, Leh Palace, the old town, and sunset from Shanti Stupa.", long: "The day can open with an early painting session as the sun comes up over the river. After breakfast we head into Leh for a dyeing or weaving session at the We Are Kal studio, drawing pattern and texture from the loom. A longer session ends with lunch at the studio; after a shorter session or a studio visit, lunch is at Namza, one of the best kitchens for Ladakhi food. In the afternoon, Leh Palace and the Central Asian Museum place Ladakh on the Silk Road, then a walk through the old town and a sunset study from Shanti Stupa. All day there are landscapes, architecture and people to photograph and paint from later, at the camp.", flexible: "The afternoon in Leh can bend to the group.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "out", note: "At We Are Kal, or at Namza in Leh" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "03", place: "Indus Lines", fragment: "Thiksey, Matho, Stakna", move: "drive" as DayMove, km: 8, minutes: 15, altitude: 3300, x: 250, y: 128.9, tempDay: 23, tempNight: 8, tools: ["Sketchbook", "Micron pen"], summary: "Conch shells at dawn over Thiksey, a picnic below Matho, and Stakna on its rock above the Indus.", long: "Morning prayers at Thiksey begin at around 6:15, when the monks sound conch-shell trumpets from the rooftop as the first sun crosses the mountains and reaches the monastery. Its thirteen storeys climb the hillside in tiers and house a 15-metre Maitreya Buddha; between the prayers, the architecture and the landscape, the work is line, structure and character. Back at the camp for breakfast, then a guided walk through the village to the black tree and the camels, and a picnic lunch by the streams below Matho monastery. In the afternoon, Stakna, on a rock that juts out of the valley floor with the Indus curving round it. In the evening, a painting class with Anastasiia to take stock of the day's places.", flexible: "Modular: more monasteries or fewer, and anyone can stay at the camp instead.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp, after the dawn prayers" }, lunch: { kind: "picnic", note: "Picnic by the streams below Matho" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "04", place: "Hemis Path", fragment: "Gotsang cave", move: "walk" as DayMove, km: 3, minutes: 90, altitude: 4000, x: 350, y: 40, tempDay: 19, tempNight: 5, tools: ["Sketchbook", "Neutral tint"], summary: "Hemis, then the hidden path behind it — a steep hour or so up to the 13th-century Gotsang meditation cave.", long: "A thirty-minute drive to Hemis, one of the largest and most revered monasteries in Ladakh and home to the Drukpa order. It is a busy place, but behind it an unmarked path climbs to the Gotsang meditation cave, where the monk Gotsangpa came in the 13th century and painted the murals that made it a place of meditation. It sits on the edge of Hemis National Park, and monks still come here to meditate for months at a time. The walk up is steep but not technical, an hour to an hour and a half. A panorama session at the top, then back down and along the Indus to the camp. In the evening there is the option of a conversation with a monk from Thiksey about monastic life in the valley.", flexible: "Can swap with day 3. The climb is optional — stay at the camp, or do something else entirely.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "camp", note: "Lunch at the camp" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "05", place: "Alchi Murals", fragment: "Basgo & the confluence", move: "drive" as DayMove, km: 85, minutes: 135, altitude: 3100, x: 450, y: 200, tempDay: 25, tempNight: 9, tools: ["Sketchbook", "Limited palette"], summary: "Down the Indus into the Sham Valley: the Sangam confluence, Basgo fort, and the murals of Alchi.", long: "West into the Sham Valley, the one valley reachable from ours without crossing a 5,000 m pass. The road follows the Indus downstream to the Sangam, where the two colours of the Indus and the Zanskar meet and run on together towards Pakistan. Close by stands the ancient fort of Basgo. Further on is Alchi, whose murals were painted in the Kashmiri Buddhist tradition — earthier in palette, with a symbolism closer to Hinduism — and have survived the centuries thanks to the dry air of the region.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "out", note: "Lunch at Alchi Kitchen" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "06", place: "Earth & Clay", fragment: "Igoo", move: "drive" as DayMove, km: 12, minutes: 20, altitude: 3500, x: 550, y: 128.9, tempDay: 22, tempNight: 6, tools: ["Sketchbook", "Hands"], summary: "Over the marmot burrows to the Kaspang cave, a pottery session in Igoo, and a quiet studio afternoon.", long: "Twenty minutes by road to the remote village of Igoo and beyond it to the Kaspang meditation cave. A short walk over marmot burrows opens a panorama across the Indus Valley and Sakti village. Back in Igoo, a pottery session with one of the few remaining traditional potters in Ladakh, then lunch at the camp and a quiet studio afternoon to work on the folio.", flexible: "A quieter day, with more time to paint.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "camp", note: "Lunch at the camp" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "07", place: "Pangong Colour", fragment: "Chang La 5,360 m", move: "drive" as DayMove, km: 160, minutes: 180, altitude: 4000, x: 650, y: 40, tempDay: 14, tempNight: -2, tools: ["Full palette", "Warm layers"], summary: "An early start over the pass to Pangong, and a day of landscape painting as the lake changes colour.", long: "An early start over the Chang La pass, at 5,360 m, to reach Pangong — a brackish lake more than 130 km long that stretches on into China. As the sun moves across the sky the lake's colours change through the day, and the work is landscape painting. Lunch is packed and eaten by the water, and we are back at the camp in the evening for a hearty dinner.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "picnic", note: "Packed lunch by the water" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "08", place: "To be confirmed", fragment: "Programme to come", move: "stay" as DayMove, km: 0, minutes: 0, altitude: 3200, x: 750, y: 128.9, tempDay: 23, tempNight: 8, tools: ["To be confirmed"], summary: "Programme to be confirmed.", long: "The programme for this day is still being confirmed.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "camp", note: "To be confirmed" }, dinner: { kind: "camp", note: "Dinner at the camp" } } },
    { number: "09", place: "Thangka & Folio", fragment: "Closing the folio", move: "sketch" as DayMove, km: 0, minutes: 0, altitude: 3200, x: 850, y: 128.9, tempDay: 23, tempNight: 8, tools: ["Everything, once more"], summary: "Thangka pigments and style, a relaxed day of painting, and a closing dinner with the week's work on show.", long: "The day begins either with a visit to a thangka restoration artist or with a thangka painter coming to the camp to demonstrate the pigments and style of traditional Buddhist painting. Otherwise it is a relaxed day, given to consolidating the week's landscapes and characters and to painting. It ends with a closing dinner and a showing of the work made over the week.", flexible: "The thangka session depends on the artists' availability.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "picnic", note: "Picnic lunch" }, dinner: { kind: "camp", note: "Closing dinner at the camp" } } },
    { number: "10", place: "Departure", fragment: "Leh airport", move: "depart" as DayMove, km: 15, minutes: 20, altitude: 3200, x: 950, y: 128.9, tempDay: 22, tempNight: 7, tools: ["The folio, packed"], summary: "Breakfast, then the transfer to Leh airport.", long: "After breakfast, the transfer to Leh airport — the folio bound, the palette used up. The programme ends on day 9; the group sleeps nine nights at the camp.", meals: { breakfast: { kind: "camp", note: "Breakfast at the camp" }, lunch: { kind: "none", note: "Not included — you are travelling" }, dinner: { kind: "none", note: "Not included — you are travelling" } } },
  ],
};

export const folio = {
  heading: "The Ladakh Folio",
  support: "Nine days of observation, distilled into one final plate.",
  labels: [
    "Thiksey line study",
    "Pangong / Indus pigment",
    "Botanical study",
    "Handwritten notes",
  ],
  // Handwritten marks on the plate. Kept to a few words each: at this point
  // in the page the drawing is doing the arguing, not the copy.
  notes: {
    pigment: "Indus grey-green,\nafter the confluence",
    botany: "Hippophae rhamnoides\nsea buckthorn · 2 Sept",
    arch: "twelve storeys,\nfirst light",
  },
  // Shown while the plate is development scaffolding rather than her work.
  placeholder: "Development plate — not the artist's work",
};

// Sourced, not invented. Biography from anastasiiamorozova.com; the book is
// confirmed independently (Page Street Publishing, ISBN 9798890033383) and
// both sources agree it covers all seven continents — which is also the line
// India-Khan's own brief uses about her.
//
// The middle paragraph is the one that matters: it answers why she turned to
// travel sketching, and the answer is specific rather than a sentiment — a
// five-month journey through Asia where the sketchbook did the recording. It
// is the same argument this retreat makes, which is why she is the right host
// for it rather than a name attached to it.
export const host = {
  name: "Anastasiia Morozova",
  studio: "Natura Illustrata",
  quote:
    "“I explore this beautiful planet sketchbook in hand, and share my adventures with others.”",
  portraitAlt:
    "Anastasiia Morozova sketching outdoors, board in hand, among tall reeds in low autumn light",
  // ⚠️ WRITTEN IN HER VOICE, FROM SOURCED FACTS — NOT HER OWN WORDS.
  // Every fact below comes from anastasiiamorozova.com and her publisher, but
  // the phrasing is ours. Putting sentences in a real person's mouth on her
  // own page needs her sign-off before this is published. If she would rather
  // write it herself, this is a good brief for what it has to cover.
  bioFirstPerson: [
    "I trained in applied arts and took a master's in art management in Paris, and for a while I ran galleries — there, then in New York. I left all of it for a small town in southern Italy, and started drawing the natural world for a living instead.",
    "Travel sketching found me later, and it found me on a journey. Five months across Asia with my husband Fabrizio, and every day of it went into a sketchbook rather than a camera roll. That trip turned a habit into a subject. What I teach now is simply what I worked out on the road: observe slowly, draw daily, and let the page do the remembering.",
    "My book crosses all seven continents. The Indian Himalaya is the one plate it has never painted — which is why I want to draw it with eight people rather than alone.",
  ],
  facts: [
    { label: "Studio", value: "Natura Illustrata" },
    { label: "Based", value: "Southern Italy, half the year" },
    { label: "Book", value: "Capture the Natural World in Watercolour" },
    { label: "Teaches", value: "Travel Sketching Academy" },
  ],
};

export const facts = [
  { label: "Season", value: "September 2027" },
  { label: "Duration", value: "9 days" },
  { label: "Route", value: "Leh → Leh" },
  { label: "Group", value: "8 guests" },
  { label: "Rooms", value: "Individual rooms" },
  { label: "Base", value: "The Indus River Camp" },
  { label: "Price", value: "Up to €4,000 per guest" },
  { label: "Scope", value: "Land only" },
];

// ---------------------------------------------------------------------------
// THE CONTRACT.
//
// Sourced from India-Khan's own itinerary (indiakhananastasiialadakh.pdf).
//
// ⚠️ THAT DOCUMENT IS A PARTNER DECK, NOT A CLIENT DOCUMENT. Its sections 03–05
// carry the host's 30% partnership share, the 12,000 paid to the host, and the
// per-participant cost breakdown (2,150 ground operations, 1,500 host share,
// 1,000 host flights, and so on). NONE of that belongs on a public page, and
// none of it is reproduced here. Only what is addressed to a guest is.
//
// PRICE (client, 2026-10-05): the final price is CAPPED at €4,000 per guest —
// a ceiling, not a quote, so the page says "up to" and the note says it will
// not be exceeded. Replaces the provisional €5,000 from the partner deck.
//
// Still from the source: individual rooms are INCLUDED in the price, and it
// would fall if the group chose to share — so there is no single supplement.
const TO_CONFIRM = "TO CONFIRM" as const;

export const booking = {
  heading: "Dates, price and holding a place",
  // Anastasiia's own 2027 waiting list offers the full programme and a presale
  // rather than taking a deposit. Same mechanic here: it suits a departure a
  // year out and matches this page's stated "no urgency, no countdowns".
  lead: "Places are held through the waiting list. Joining it gets you the full day-by-day programme and first refusal when booking opens — no payment is taken now.",
  rows: [
    {
      label: "Season",
      value: "Mid-September 2027",
      hint: "Set on the partner property's advice: greenery at its fullest, produce in season, early snow returning to the peaks, and fewer visitors",
    },
    {
      label: "Exact dates",
      value: TO_CONFIRM,
      hint: "The one field a guest cannot act without — flights into Leh sell out",
    },
    { label: "Duration", value: "9 days, Leh to Leh" },
    { label: "Price", value: "Up to €4,000 per guest", hint: "Land only, Leh arrival to Leh departure. The final price will not exceed this" },
    {
      label: "Rooms",
      value: "Individual rooms, included",
      hint: "No single supplement. The price would fall if the group chose to share",
    },
    { label: "Group", value: "8 guests" },
    { label: "Base", value: "The Indus River Camp", hint: "Forty riverside acres, a library and a motorised telescope — one base throughout, so no repacking" },
    { label: "Deposit", value: "None taken at this stage", hint: "Waiting list only" },
    { label: "Balance", value: TO_CONFIRM, hint: "Set a due date once booking opens" },
    { label: "Cancellation", value: TO_CONFIRM, hint: "Required before any money is taken" },
  ],
  // The exact figure is set at contracting, under the €4,000 ceiling.
  priceNote:
    "The final price is confirmed at contracting and is capped at €4,000 per guest — it can come in lower, never higher.",
  // ⚠️ The French operator's name and its APST/RC/HISCOX registration line
  // were removed together at the client's instruction (2026-08-19, "no
  // India-Khan mentions"). They travel together on purpose: those numbers are
  // the operator's own registrations, and showing them detached from their
  // holder — or reattached to another name — would be a false statement on a
  // commercial page. Consequence to review before publication: the page now
  // carries NO licensed-operator disclosure or financial-protection line,
  // which the previous version had.
  operator: {
    label: "Ground operations",
    // Client, 2026-10-05: the camp itself runs the ground operations.
    name: "The Indus River Camp",
    line: "",
    ground: "",
  },
};

export const included = {
  heading: "What is included",
  items: [
    // Nine, not eight. The costing sheet bills day 1 arrival to day 10
    // departure, and the itinerary's own "fly out the following morning"
    // agrees — the page was a night short.
    "Nine nights at The Indus River Camp, in an individual room",
    "A guided sketching session every day, led by Anastasiia Morozova, who is with the group throughout",
    // 2026-10-05 itinerary: Namza is now a LUNCH option on day 2 (or lunch at
    // We Are Kal), Alchi Kitchen is lunch on day 5. Both are included meals.
    // Historical note — Namza was DINNER on day 3 — confirmed by the client 2026-08-17, settling
    // a conflict with the older itinerary, which called it a lunch and named
    // it the one meal not covered. The costing sheet prices it as a dinner
    // and pays for it, so every meal is included; if the intention is still
    // that guests settle Namza themselves, this line is the one to change.
    "All meals, from breakfast on day 1 to breakfast on day 10",
    // Guides: the camp no longer budgets one every day — a specialist art or
    // cultural guide on two or three days is being looked into. Not promised
    // here until it is confirmed.
    "All ground transport, permits and entry fees",
    "Every session named in the itinerary: We Are Kal, the potter at Igoo, and the thangka session on day 9",
    "The Ladakh Folio and a welcome kit",
    "Vegetarian and halal accommodated with notice",
  ],
};

export const excluded = {
  heading: "What is not included",
  items: [
    "International flights to Leh, booked by you — routing assistance provided",
    "Drawing materials. Bring your own kit; the list below is what the week's work needs",
    "Travel insurance and health insurance, both required and paid by you — check that cover extends to 5,360 m",
    "Visa for India",
    "Personal expenses, tips, and anything not named in the itinerary",
  ],
};

// The one section this page needs and a Rajasthan itinerary does not.
export const altitude = {
  heading: "Altitude, and being ready for it",
  lead: "The camp sits at 3,200 m, about 200 m below Leh. Pangong is 4,000 m, and the Chang La pass on the way there is 5,360 m — higher than any point in the Alps. This is the one part of the week that is not optional to read.",
  points: [
    "Day one is deliberately light. You fly in, transfer, and rest to acclimatise — the only drawing is a materials session and some warm-up lines by the river.",
    "The week returns to the river every night rather than sleeping high, which is the safest shape a Ladakh itinerary can have.",
    "Pangong is a single long day out and back, so the highest ground is crossed twice in daylight and never slept on.",
    "Your insurance must cover altitude to 5,360 m and medical evacuation. Standard policies often stop lower.",
    `Fitness and medical guidance: ${TO_CONFIRM} — say whether a doctor's sign-off is required and which conditions need declaring. Walking distances are short, but the walk up to Gotsang above Hemis is steep — an hour to an hour and a half, and optional.`,
  ],
};

export const materials = {
  heading: "What to bring",
  lead: "Materials are not included, so the kit is yours. This is what the nine days actually ask for.",
  kit: [
    { label: "Sketchbook", detail: "Cold-press, at least 200gsm — thinner paper cockles under a wash" },
    { label: "Watercolours", detail: "A small pan set is enough; the Ladakh palette is mixed on site at Pangong and the confluence" },
    { label: "Brushes", detail: "One large wash, one fine, and a water brush for the road" },
    { label: "Micron pens", detail: "For the contour work at Thiksey — 0.1 and 0.3" },
    { label: "Pencil and eraser", detail: "For the big shapes, before anything else" },
    { label: "A limited palette", detail: "Alchi is drawn from its own mineral pigments — a restricted set is the exercise" },
    { label: "Warm layers", detail: "Pangong sits below freezing at night, even in September" },
    { label: "Sun protection", detail: "At 3,200 m and above the sun is fierce even when the air is cold" },
  ],
};

export const factsSmall = [
  "International flights separate.",
  "Nearly all meals included per final itinerary.",
  "Vegetarian / halal accommodated with notice.",
  "All ground operations are handled for you.",
];

export const cta = {
  closing: "Draw your way through Ladakh.",
  meta: "September 2027 · 9 days · 8 guests",
  primary: "Request a place",
  secondary: "View the full journey",
  // Requests for a place go to Anastasiia (client, 2026-10-05).
  mailto:
    "mailto:info@anastasiiamorozova.com?subject=Drawn%20at%20Altitude%20%E2%80%94%20Request%20a%20place",
  // The group webinar (client, 2026-10-05): "Travel Sketching — Webinar",
  // Saturday 24 October 2026, 18:00–19:00. The client's Google Meet link is
  // the sign-up: the button goes straight to it. Time shown as Paris time —
  // the invitation gave no zone. ⚠️ Once the date has passed, update or
  // remove this block, or the page will advertise a webinar that is over.
  webinar: {
    label: "Join the group webinar",
    date: "Travel Sketching · Saturday 24 October, 18:00–19:00 (Paris time)",
    note: "An online session on Google Meet to talk through the trip and the project.",
    href: "https://meet.google.com/otk-xsdr-gsz",
  },
  // Who to write to, by subject (client, 2026-10-05). The client supplied the
  // india-khan.fr address for this list themselves, which is the one
  // deliberate exception to the "no India-Khan" rule — it is a contact, not a
  // brand mention. A line with both a name and an email shows the name with
  // the address as its link.
  contactsHeading: "Who to write to",
  contacts: [
    { topic: "Host", name: "Anastasiia Morozova", email: "info@anastasiiamorozova.com" },
    { topic: "Project & concept", email: "contact@india-khan.fr" },
    { topic: "Logistics & operations", email: "theindusrivercamp@gmail.com" },
  ] as { topic: string; email?: string; name?: string }[],
};
