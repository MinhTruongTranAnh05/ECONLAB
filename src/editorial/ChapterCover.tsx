import { useEffect, useRef, type Ref } from 'react';
import { ArrowDown, ArrowRight, ArrowUpRight } from 'lucide-react';
import { ArtworkImage } from '../Artwork';

export function ChapterCover({ imageRef }: { imageRef: Ref<HTMLImageElement> }) {
  const cover = useRef<HTMLElement>(null);
  useEffect(() => {
    const node = cover.current;
    if (!node || !('IntersectionObserver' in window)) return;
    const observer = new IntersectionObserver(entries => {
      node.classList.toggle('cover-offscreen', !entries[0].isIntersecting);
    }, { threshold: 0 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <section ref={cover} className="hero cinematic-cover" id="trang-chu">
    <div className="cover-folio" aria-hidden="true">04</div>
    <div className="hero-copy">
      <div className="hero-topline"><span>CHUYÊN SAN KINH TẾ CHÍNH TRỊ</span><span className="cover-ornament" aria-hidden="true">✳</span></div>
      <div className="hero-body">
        <div className="hero-kicker"><span className="gold-line"/> CHƯƠNG 04 — MÁC – LÊNIN</div>
        <h1 className="cover-title"><span className="cover-line"><span>Cạnh tranh</span></span><span className="cover-line second-title"><span><em>&</em> Độc quyền<span className="title-dot">.</span></span></span></h1>
        <p className="hero-description">Khám phá bản chất, nguyên nhân hình thành và những đặc điểm kinh tế của chủ nghĩa tư bản độc quyền.</p>
        <div className="hero-buttons"><a href="#lo-trinh" className="button">Bắt đầu khám phá <ArrowRight size={18}/></a><a href="#on-tap/overview" className="hero-secondary">Ôn tập kiến thức <ArrowUpRight size={17}/></a></div>
      </div>
      <div className="hero-bottom"><a href="#lo-trinh"><span className="scroll-icon"><ArrowDown size={15}/></span> CUỘN ĐỂ KHÁM PHÁ</a><span>ĐỌC. SUY NGẪM. KẾT NỐI.</span></div>
    </div>
    <figure className="hero-art">
      <ArtworkImage name="industry" imageRef={imageRef} sizes="(max-width: 700px) 100vw, 52vw" priority/>
      <div className="cover-art-frame" aria-hidden="true"/>
      <div className="art-top"><span>MỘT GÓC NHÌN VỀ<br/>LỊCH SỬ KINH TẾ</span><span className="issue-seal">04</span></div>
      <div className="art-overlay"><span className="eyebrow">TỪ SẢN XUẤT ĐẾN QUYỀN LỰC THỊ TRƯỜNG</span><p>Khi quy mô thay đổi,<br/><em>cục diện cũng đổi thay.</em></p></div>
      <figcaption><span>Nhịp chuyển động của công nghiệp · Minh họa ý niệm</span></figcaption>
    </figure>
    <div className="cover-spine" aria-hidden="true"><span>ECONLAB</span><span>CHƯƠNG BỐN</span></div>
  </section>;
}
