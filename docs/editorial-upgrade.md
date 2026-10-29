# ECONLAB editorial upgrade

Implemented in the existing React application, retaining the warm ivory, burgundy, espresso and antique gold identity.

## Presentation

- Cinematic magazine cover with masked headline lines, staggered controls, artwork mask, a fine editorial frame, chapter folio and restrained scroll parallax.
- Three distinct chapter introductions: ivory, espresso and burgundy compositions, using existing illustrations and captions.
- Reusable reveal variants for paragraphs, masked headings, images, statements, chapter numbers and dividers. Viewport entry replays in both scroll directions. The cover and overview counter also rearm after leaving view.
- A four-step formation story with normal-flow explanations, an observed active step and a sticky SVG visualization on desktop. Mobile presents all four text/diagram pairs vertically. The simplified diagram remains explicitly illustrative.
- Five-characteristic interactive concept map with animated connections, existing theory text, contextual art, terminology and takeaways. Arrow keys, Home/End and previous/next buttons navigate it. Original individual disclosures remain available below.
- Contextual definition popovers drawn from existing lesson text, with lesson references, Escape dismissal, outside-click dismissal and focus restoration.
- More expressive Vietnamese serif typography, burgundy statement blocks, a compact archive grid, refined navigation, a compact scrolled header and active chapter subcontents with reading progress.
- A calmer revision design, improved flashcards and answer feedback, meaningful number transitions, topic-specific exam accuracy, recommended lesson links and a filter for incorrect/unanswered exam questions.

## Reading typography

- Main lesson text is 17px on desktop and 16px on mobile; supporting paragraphs use 15px and 14px respectively. Image captions and source notes use 13px.
- Main text uses a darker brown (#392d26), with clearer secondary text (#60534b). Dark chapter and application panels use lighter text to preserve contrast.
- Existing compact section spacing and replayable scroll motion remain unchanged. Typography changes were checked with the production build; browser visual QA remains unavailable.

## Preservation

- No new runtime dependencies.
- `src/data.ts` and `src/store.ts` remain unchanged: academic source data, questions, explanations and stored progress format are retained.
- All nine user-supplied source images, original generated illustrations, captions, enlargement controls and hover brightness remain available.
- The issue label and AI illustration badges previously removed by request remain absent from the interface.
- No historical dates, attributions or quotations have been added.
- Reduced-motion support keeps educational content visible. Touch devices do not acquire sticky hover states. Keyboard controls retain visible focus.

## Validation

### Reading-density correction

- Removed the 310px minimum height per formation step and the reserved title height in the sticky diagram. Steps now follow their actual text length; mobile diagrams are capped at 240px wide.
- Reduced chapter-opening typography, artwork proportions, section padding, subsection margins and the gaps around application and revision sections. Body text stays at 14–15px with a 1.85 line height in the main reading columns.
- Replaced oversized archive spans with three desktop columns, two tablet columns and one mobile column. Removed staggered image offsets and capped inline source previews; every image still opens at full size.
- Reveal observation now starts 120px before viewport entry. Shorter transitions and partially visible starting states prevent fully blank reserved blocks while preserving replay in both scroll directions and reduced-motion behavior.
- The correction passed all 22 existing workflow tests and the production build. Browser initialization was retried but the trusted Node process exited, so desktop/mobile visual QA remains unverified.

- TypeScript checking and Vite production build: passed.
- 22 component workflow tests: passed, including study persistence, quizzes, timers, exam submission/review, source viewer, observed diagram steps, knowledge-map keyboard navigation, popovers, subcontents, topic results, replayable headings and cover re-entry.
- Local development HTTP response was verified successfully during the upgrade.
- Browser visual QA remains unverified. Browser access reported unavailable; a later retry failed while initializing its runtime. No desktop/mobile screenshot review or measured animation-frame-rate claim is made. JSDOM tests validate component behavior, not actual CSS layout, font rendering, clipping, sticky positioning or responsive overflow.
