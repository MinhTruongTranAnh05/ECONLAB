import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { stages } from '../data';
import { Reveal } from '../motion';

const positions = [
  [[75, 95, 1], [205, 65, 1], [330, 105, 1], [90, 260, 1], [240, 290, 1], [345, 245, 1]],
  [[115, 120, 1], [210, 100, 1], [290, 135, 1], [125, 225, 1], [225, 250, 1], [305, 230, 1]],
  [[120, 145, 1.4], [285, 145, 1.4], [210, 275, 1.4], [120, 145, .4], [285, 145, .4], [210, 275, .4]],
  [[210, 180, 2.15], [210, 180, .1], [210, 180, .1], [210, 180, .1], [210, 180, .1], [210, 180, .1]],
];

function FormationDiagram({ active }: { active: number }) {
  const nodes = positions[active];
  return <svg className="formation-svg" viewBox="0 0 420 365" role="img" aria-label={`Sơ đồ minh họa: ${stages[active].title}`}>
    <circle className="formation-orbit" cx="210" cy="182" r="145"/>
    <circle className="formation-orbit inner" cx="210" cy="182" r="105"/>
    <path className={`formation-connection ${active > 0 ? 'is-active' : ''}`} d={`M${nodes[0][0]},${nodes[0][1]} L${nodes[1][0]},${nodes[1][1]} L${nodes[2][0]},${nodes[2][1]} L${nodes[3][0]},${nodes[3][1]} L${nodes[4][0]},${nodes[4][1]} L${nodes[5][0]},${nodes[5][1]}`}/>
    {nodes.map(([x, y, scale], index) => <g key={index} className={`enterprise-node ${index < 3 && active > 1 ? 'large-enterprise' : ''}`} style={{ transform: `translate(${x}px, ${y}px) scale(${scale})`, opacity: active === 3 && index > 0 ? 0 : active === 2 && index > 2 ? 0 : 1 }}>
      <rect x="-29" y="-29" width="58" height="58" rx="2"/>
      <path d="M-17 15V-5l11 6V-6L5 0v-11h9v26H-17Zm0-5h31M-9 4v3M0 4v3M8 4v3M-11-12v-10h7v14"/>
    </g>)}
    <path className={`monopoly-enclosure ${active === 3 ? 'is-active' : ''}`} d="M105 75h210v210H105Z"/>
    <text className="diagram-axis-label" x="210" y="350" textAnchor="middle">{['CẠNH TRANH', 'TÍCH TỤ & TẬP TRUNG', 'QUY MÔ LỚN', 'LIÊN KẾT ĐỘC QUYỀN'][active]}</text>
  </svg>;
}

export function FormationStory() {
  const [active, setActive] = useState(0);
  const steps = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) setActive(Number((entry.target as HTMLElement).dataset.step));
      }
    }, { rootMargin: '-25% 0px -40% 0px', threshold: 0 });
    steps.current.forEach(node => { if (node) observer.observe(node); });
    return () => observer.disconnect();
  }, []);

  function select(index: number) {
    setActive(index);
    steps.current[index]?.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
  }

  return <div id="formation-story" className="formation-story">
    <div className="formation-steps">
      {stages.map((stage, index) => <article key={stage.title} data-step={index} ref={node => { steps.current[index] = node; }} className={`formation-step ${active === index ? 'is-active' : ''}`}>
        <Reveal delay={60}>
          <h3><button onClick={() => select(index)} aria-pressed={active === index}><span className="formation-step-number">0{index + 1}</span><span>{stage.title}</span><ArrowRight size={18}/></button></h3>
          <p>{stage.text}</p>
          <div className="formation-mobile-diagram"><FormationDiagram active={index}/></div>
          {index < stages.length - 1 && <span className="formation-step-connector" aria-hidden="true"><ArrowDown size={18}/></span>}
        </Reveal>
      </article>)}
    </div>
    <aside className="formation-visual" aria-label="Sơ đồ hình thành độc quyền">
      <div className="formation-visual-top"><span className="eyebrow">SỰ VẬN ĐỘNG CỦA QUY MÔ</span><span>0{active + 1}<i> / 04</i></span></div>
      <FormationDiagram active={active}/>
      <div className="concept-explanation" aria-live="polite"><span className="eyebrow">GIAI ĐOẠN 0{active + 1}</span><h3>{stages[active].title}</h3></div>
      <div className="formation-controls" aria-label="Chọn giai đoạn">{stages.map((stage, index) => <button key={stage.title} className={active === index ? 'is-active' : ''} aria-label={`Xem giai đoạn ${index + 1}`} aria-pressed={active === index} onClick={() => select(index)}><span>0{index + 1}</span></button>)}</div>
      <p className="diagram-footnote">Sơ đồ minh họa quan hệ lý luận · Chờ đối chiếu</p>
    </aside>
  </div>;
}
