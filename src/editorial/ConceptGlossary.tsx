import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Plus, X } from 'lucide-react';
import { characteristics, stages } from '../data';

const terms = [
  { title: 'Tích tụ & tập trung', definition: stages[1].text, chapter: '4.1', href: '#chuong-41' },
  { title: 'Tư bản tài chính', definition: characteristics[1].text, chapter: '4.2', href: '#chuong-42' },
  { title: 'Xuất khẩu tư bản', definition: characteristics[2].text, chapter: '4.2', href: '#chuong-42' },
];

export function ConceptGlossary() {
  const [active, setActive] = useState<number | null>(null);
  const root = useRef<HTMLDivElement>(null);
  const panel = useRef<HTMLDivElement>(null);
  const buttons = useRef<(HTMLButtonElement | null)[]>([]);
  function close() { if (active !== null) buttons.current[active]?.focus(); setActive(null); }
  useEffect(() => {
    if (active === null) return;
    panel.current?.focus();
    const outside = (event: PointerEvent) => { if (!root.current?.contains(event.target as Node)) setActive(null); };
    document.addEventListener('pointerdown', outside);
    return () => document.removeEventListener('pointerdown', outside);
  }, [active]);
  return <div id="concept-glossary" className="concept-glossary" ref={root}>
    <span className="eyebrow">TRA CỨU KHÁI NIỆM</span>
    <div className="glossary-terms">{terms.map((term, index) => <button key={term.title} ref={node => { buttons.current[index] = node; }} aria-expanded={active === index} aria-controls="glossary-definition" onClick={() => setActive(active === index ? null : index)}>{term.title}<Plus size={14}/></button>)}</div>
    {active !== null && <div ref={panel} id="glossary-definition" className="glossary-definition" role="dialog" aria-label={terms[active].title} tabIndex={-1} onKeyDown={event => { if (event.key === 'Escape') { event.stopPropagation(); close(); } }}><div><span className="eyebrow">KHÁI NIỆM / CHƯƠNG {terms[active].chapter}</span><button className="icon-button" aria-label="Đóng định nghĩa" onClick={close}><X size={17}/></button></div><h3>{terms[active].title}</h3><p>{terms[active].definition}</p><small>Diễn giải học tập · Chờ đối chiếu giáo trình</small><a className="text-link" href={terms[active].href} onClick={() => setActive(null)}>Đọc bài {terms[active].chapter}<ArrowUpRight size={15}/></a></div>}
  </div>;
}
