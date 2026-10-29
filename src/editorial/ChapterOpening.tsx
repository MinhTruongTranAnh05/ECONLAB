import { EditorialArtwork, type ArtworkKey } from '../Artwork';
import { AnimatedHeading, Reveal, SectionDivider } from '../motion';

export function ChapterOpening({ number, label, title, intro, artwork }: {
  number: string; label: string; title: string; intro: string; artwork: ArtworkKey;
}) {
  return <div className={`chapter-opening chapter-opening-${number}`}>
    <Reveal variant="chapter" className="chapter-opening-copy">
      <span className="chapter-opening-number" aria-hidden="true">{number}</span>
      <span className="eyebrow">{label}</span>
      <SectionDivider/>
      <AnimatedHeading>{title}</AnimatedHeading>
      <p>{intro}</p>
    </Reveal>
    <EditorialArtwork name={artwork} className="chapter-opening-art"/>
    <div className="chapter-opening-edge" aria-hidden="true"><span>ECONLAB / KINH TẾ CHÍNH TRỊ</span><span>{number}</span></div>
  </div>;
}
