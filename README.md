# ECONLAB

Tạp chí học thuật tương tác cho MLN122, Chương 4 — Cạnh tranh và độc quyền trong nền kinh tế thị trường.

## Run locally

Requires Node.js 22.12+ (developed with Node 24).

```sh
npm install
npm run dev
```

Open the Local URL printed by Vite, usually http://127.0.0.1:5173.

```sh
npm run build
npm test
npm run preview
```

The production output is `dist/`. Serve it through HTTP. Vite's relative base supports deployment under a subdirectory; copy `dist/` to a static host. There is no backend or account requirement.

## Experience

- Editorial cover, three academic chapters, interactive explanatory flow, five expandable characteristics, historical/contemporary comparisons, and a Vietnam application essay.
- One-time IntersectionObserver reveals, staggered cards, animated counter, transform-based reading progress, subtle cover parallax, active table of contents, hash-based navigation and browser history.
- Separate revision center: dashboard, 13 flashcards, 12 explained practice questions, incorrect-answer review, essay draft and checklists, oral preparation/answer timers, configurable randomized mock exams with automatic submission, answer review and score history.
- Progress is stored under `econlab-progress-v1` in LocalStorage. The dashboard offers an explicit two-step reset. Data stays in the current browser; there is no synchronization across devices. Storage failures show a notice. Exam sessions are temporary: remain on the exam tab until submitting; only submitted results persist.
- Keyboard controls, native disclosure widgets and modal search, Vietnamese search with or without accents, responsive navigation, reduced-motion support.

## Academic status

No textbook PDF, verified existing content, course schedule, or `econlab-ui-demo.html` was present in the supplied workspace. The academic architecture and official practice prompt follow the supplied brief. All explanatory content, diagrams, flashcards, quiz explanations, comparison material and suggested essay answers are explicitly marked as **pending verification against the course textbook**. They are draft supplementary study material, not official quotations, official answers, or assessed course content. No textbook page references, economic statistics or invented quotations are included.

Before educational publication, compare each draft against the instructor's exact textbook edition, especially sections 4.1–4.3, state monopoly capitalism and Vietnam application. Add verified edition metadata and citations in `src/data.ts` and the corresponding lesson text in `src/App.tsx`; do not transfer page references between 2019 and 2021 editions.

## Design and attribution

The brief's ivory, paper, burgundy, espresso and antique gold palette controls the design. Fonts are Playfair Display, Be Vietnam Pro and Inter, requested through Google Fonts with local serif/sans-serif fallbacks. The app works with fallbacks if the font service is unavailable.

The current cover and chapter art are four original images generated with the built-in `image_gen.imagegen` tool for ECONLAB: industrial production, banking and industry, international production networks, and an imagined Vietnam production/trade scene. Their shared art direction uses copperplate-style engraving, warm ivory paper, espresso linework, burgundy fields and antique gold highlights. Displayed captions contain subject titles and descriptions; generation provenance is documented here and in the prompt manifest. These are conceptual compositions, not archival photographs, historical evidence or verified depictions of specific places.

Final website assets are `public/artwork/industry.jpg`, `finance.jpg`, `networks.jpg` and `vietnam.jpg`, with corresponding `-small.jpg` responsive variants. Original generated PNGs are preserved in `artwork/originals/`. The full prompt set and tool provenance are in `docs/artwork-prompts.json`; exported dimensions and byte counts are in `docs/artwork-manifest.json`. Four primary JPEGs total approximately 1.8 MB. Images use explicit dimensions, responsive `srcSet`/`sizes`, meaningful alt text and lazy loading, except the priority cover image. Thumbnail images inside labeled chapter links have empty alt text to avoid repeated announcements.

`scripts/prepare-artwork.ps1` contains the Windows System.Drawing export routine for regenerating the JPEG variants from the originals. Its file execution depends on the host's PowerShell execution policy; no execution-policy settings were changed during preparation.

The previous cover, **Coalbrookdale by Night**, Philip James de Loutherbourg, 1801, remains preserved at `public/coalbrookdale.jpg` and is no longer displayed. Its source is [Wikimedia Commons](https://commons.wikimedia.org/wiki/File:Philipp_Jakob_Loutherbourg_d._J._002.jpg), identified there as a public-domain reproduction.

Nine distinct user-supplied source images are also integrated into the lessons and the `#tu-lieu` collection. The first ten-image message contained exact duplicates of the port and workshop images; those two duplicates are represented once each. An additional workshop image captioned “A Forest of Belting” brings the collection to nine. Unchanged original PNG files are preserved in `artwork/sources/`, including the full 2200 px painting and 3893 px bank-interior image. `docs/source-images-manifest.json` records the original dimensions, SHA-256 hashes, supplied ordering and duplicate mappings. Responsive JPEGs under `public/sources/` preserve the source composition and visible markings, with a 1600 px maximum width and 480 px small variants, never upscaled. Export metadata is recorded in `docs/source-images-exports.json`.

The workshop and port images accompany section 4.1; bank interiors and crowd scenes accompany section 4.2. All nine appear in a separate source collection with a keyboard-accessible enlargement dialog. Their captions describe visible content without asserting unverified artists, dates, events or theoretical conclusions. These images are labeled as user-provided sources and are distinguished from the AI illustrations. Names of specific works, publication provenance and historical identification remain pending source confirmation.

Image components brighten subtly to 108% on desktop pointer hover with a 240 ms transition. This applies to the cover, chapter thumbnails, editorial figures, supplied-image figures and enlarged images. Interactive thumbnails also brighten on keyboard focus. Hover is limited to fine pointers to avoid sticky touch states, and reduced-motion preferences disable the transition.

The requested [MLN111 interaction reference](https://github.com/letuankiet-04/MLN111) was inspected (HTML, CSS and JavaScript). Its one-time reveals, viewport counters, section tracking, smooth anchors, search and quiz patterns informed the interaction approach. ECONLAB's implementation, styling and academic content are independently written; the source is not imported or reused.

## Code map

- `src/App.tsx`: editorial reading experience, navigation and search.
- `src/Revision.tsx`: study tools and timers.
- `src/data.ts`: structured draft learning/practice material.
- `src/store.ts`: validated local progress and persistence.
- `src/motion.tsx`: reusable reveal and counter primitives.
- `src/Artwork.tsx` and `src/artwork.css`: original illustration metadata, responsive image components and editorial figure styling.
- `src/SourceGallery.tsx` and `src/sources.css`: supplied source-image collection, inline lesson figures, and accessible enlargement viewer.
- `src/image-interactions.css`: shared pointer-hover and keyboard-focus image exposure effects.
- `src/styles.css`: editorial design and responsive/reduced-motion rules.
- `tests/`: component workflow and storage recovery tests.

Browser visual QA depends on an available browser-control session. Component tests validate behavior in JSDOM, which does not validate actual CSS layout, rendering, parallax performance or responsive overflow.
