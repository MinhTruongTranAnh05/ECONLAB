import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
export type RevealStyle = 'rise' | 'heading' | 'image' | 'quote' | 'chapter' | 'line';
export function Reveal({ children, delay = 0, className = '', variant = 'rise' }: { children: ReactNode; delay?: number; className?: string; variant?: RevealStyle }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const preference = matchMedia('(prefers-reduced-motion: reduce)');
    if (preference.matches) return;
    node.classList.add('will-reveal');
    const observer = new IntersectionObserver(entries => {
      for (const entry of entries) {
        node.classList.toggle('revealed', preference.matches || entry.isIntersecting);
      }
    // Begin before entry so fast scrolling never exposes a hidden content block.
    }, { rootMargin: '120px 0px', threshold: 0 });
    const onPreferenceChange = () => {
      if (preference.matches) node.classList.add('revealed');
      else { observer.unobserve(node); observer.observe(node); }
    };
    observer.observe(node);
    preference.addEventListener('change', onPreferenceChange);
    return () => { observer.disconnect(); preference.removeEventListener('change', onPreferenceChange); };
  }, []);
  return <div ref={ref} data-reveal={variant} className={`reveal reveal-${variant} ${className}`} style={{ '--delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}
export function AnimatedHeading({ children, as = 'h2', className = '' }: { children: string; as?: 'h1' | 'h2' | 'h3'; className?: string }) {
  const Tag = as;
  return <Tag aria-label={children} className={`animated-heading ${className}`}>{children.split(' ').map((word, index) => <span key={`${index}-${word}`}><span className="heading-mask"><span className="heading-word" style={{ '--word-delay': `${Math.min(index * 32, 280)}ms` } as CSSProperties}>{word}</span></span>{' '}</span>)}</Tag>;
}
export function SectionDivider() { return <Reveal variant="line"><div className="motion-divider" aria-hidden="true"/></Reveal>; }
export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current; if (!node || !('IntersectionObserver' in window)) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      cancelAnimationFrame(frame);
      if (!entries[0].isIntersecting || matchMedia('(prefers-reduced-motion: reduce)').matches) {
        node.textContent = String(value).padStart(2, '0');
        return;
      }
      node.textContent = '00';
      const start = performance.now();
      const tick = (now: number) => { const t = Math.min((now - start) / 900, 1); node.textContent = String(Math.round(value * (1 - (1 - t) ** 3))).padStart(2, '0'); if (t < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{String(value).padStart(2, '0')}</span>;
}
export function AnimatedNumber({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const previous = useRef(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) { previous.current = value; return; }
    const from = previous.current;
    const start = performance.now();
    let frame = 0;
    const tick = (now: number) => {
      const t = Math.min((now - start) / 650, 1);
      node.textContent = String(Math.round(from + (value - from) * (1 - (1 - t) ** 3)));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    previous.current = value;
    return () => cancelAnimationFrame(frame);
  }, [value]);
  return <span ref={ref}>{value}</span>;
}
