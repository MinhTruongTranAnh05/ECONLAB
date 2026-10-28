import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';
export function Reveal({ children, delay = 0, className = '' }: { children: ReactNode; delay?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window)) return;
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    node.classList.add('will-reveal');
    const observer = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) { node.classList.add('revealed'); observer.unobserve(node); }
    }, { threshold: 0.08 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={`reveal ${className}`} style={{ '--delay': `${delay}ms` } as CSSProperties}>{children}</div>;
}
export function Counter({ value }: { value: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const node = ref.current; if (!node) return;
    let frame = 0;
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const start = performance.now();
      const tick = (now: number) => { const t = Math.min((now - start) / 900, 1); node.textContent = String(Math.round(value * (1 - (1 - t) ** 3))).padStart(2, '0'); if (t < 1) frame = requestAnimationFrame(tick); };
      frame = requestAnimationFrame(tick);
    });
    observer.observe(node);
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [value]);
  return <span ref={ref}>{String(value).padStart(2, '0')}</span>;
}
