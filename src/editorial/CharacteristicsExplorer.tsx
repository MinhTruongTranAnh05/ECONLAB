import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { characteristics } from '../data';
import { ArtworkImage, type ArtworkKey } from '../Artwork';
import { Reveal } from '../motion';

const labels = ['Tổ chức độc quyền', 'Tư bản tài chính', 'Xuất khẩu tư bản', 'Phân chia kinh tế', 'Phân chia lãnh thổ'];
const anchors = [[50, 10], [83, 38], [71, 81], [29, 81], [17, 38]];
const images: ArtworkKey[] = ['industry', 'finance', 'networks', 'networks', 'networks'];

export function CharacteristicsExplorer() {
  const [active, setActive] = useState(0);
  const diagram = useRef<HTMLDivElement>(null);
  const item = characteristics[active];

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.characteristic));
      }
    }, { rootMargin: '-20% 0px -45% 0px', threshold: 0 });
    document.querySelectorAll<HTMLElement>('.characteristic').forEach((node, index) => {
      node.dataset.characteristic = String(index);
      observer.observe(node);
    });
    return () => observer.disconnect();
  }, []);

  function select(index: number) { setActive((index + characteristics.length) % characteristics.length); }

  return <Reveal variant="chapter"><section id="lenin-explorer" className="knowledge-explorer" aria-label="Bản đồ năm đặc điểm kinh tế">
    <div className="knowledge-topline"><span className="eyebrow">MỘT CÁCH ĐỌC CÓ KẾT NỐI</span><span>05 ĐẶC ĐIỂM / 01 HỆ THỐNG</span></div>
    <div className="knowledge-layout">
      <div className="knowledge-map" ref={diagram} onKeyDown={event => {
        if (['ArrowRight', 'ArrowDown', 'ArrowLeft', 'ArrowUp', 'Home', 'End'].includes(event.key)) {
          event.preventDefault();
          const next = event.key === 'Home' ? 0 : event.key === 'End' ? 4 : (active + (event.key === 'ArrowLeft' || event.key === 'ArrowUp' ? 4 : 1)) % 5;
          select(next);
          diagram.current?.querySelectorAll<HTMLButtonElement>('button')[next]?.focus();
        }
      }}>
        <svg viewBox="0 0 500 500" aria-hidden="true"><circle className="knowledge-orbit" cx="250" cy="250" r="178"/><circle className="knowledge-orbit inner" cx="250" cy="250" r="92"/>{anchors.map(([x, y], index) => <path key={index} className={`knowledge-path ${active === index ? 'is-active' : ''}`} d={`M250 250 Q${250 + (x - 50) * 2} ${y < 50 ? 180 : 325} ${x * 5} ${y * 5}`}/>)}</svg>
        <div className="knowledge-hub"><span>V. I. LÊNIN</span><strong>4.2</strong><small>ĐẶC ĐIỂM KINH TẾ</small></div>
        {labels.map((label, index) => <button key={label} aria-label={`Đặc điểm ${index + 1}: ${characteristics[index].title}`} aria-pressed={active === index} className={`knowledge-node ${active === index ? 'is-active' : ''}`} style={{ '--node-x': `${anchors[index][0]}%`, '--node-y': `${anchors[index][1]}%` } as CSSProperties} onClick={() => select(index)}><span>0{index + 1}</span><strong>{label}</strong></button>)}
      </div>
      <div className="knowledge-detail" aria-live="polite" aria-atomic="true">
        <div key={active} className="knowledge-detail-content"><span className="eyebrow">ĐẶC ĐIỂM 0{active + 1}</span><h3>{item.title}</h3><p>{item.text}</p><div className="knowledge-art"><ArtworkImage name={images[active]} decorative sizes="(max-width: 760px) 80vw, 400px"/></div><span className="term-label">THUẬT NGỮ TRỌNG TÂM</span><p className="knowledge-terms">{item.term}</p><div className="knowledge-takeaway"><span>GHI NHỚ</span><p>{item.takeaway}</p></div></div>
        <div className="knowledge-controls"><button className="icon-button" aria-label="Đặc điểm trước" onClick={() => select(active - 1)}><ChevronLeft size={18}/></button><span>{active + 1} / 5</span><button className="icon-button" aria-label="Đặc điểm tiếp theo" onClick={() => select(active + 1)}><ChevronRight size={18}/></button></div>
      </div>
    </div>
    <a className="knowledge-reading-link" href="#nam-dac-diem">Đọc lần lượt năm đặc điểm <ArrowRight size={15}/></a>
  </section></Reveal>;
}
