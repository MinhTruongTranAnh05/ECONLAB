import { useEffect, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, Expand, X } from 'lucide-react';
import { Reveal } from './motion';

export const sourceImages = {
  'factory-workshop': {
    title: 'Bên trong một xưởng sản xuất',
    alt: 'Bản khắc đen trắng về công nhân làm việc trong xưởng với nhiều máy móc, bánh đà và hệ thống truyền động.',
    description: 'Quan sát cách máy móc và lao động được bố trí trong cùng một không gian sản xuất.',
    context: 'Sản xuất & lao động', width: 612, height: 350,
  },
  'shipping-clyde': {
    title: 'Cảng biển, nhà xưởng và tàu thuyền',
    alt: 'Bản khắc đen trắng mô tả bến cảng với tàu buồm, thuyền nhỏ, cần cẩu và các nhà xưởng ven sông.',
    description: 'Một góc nhìn trực quan về sự kết nối giữa cơ sở sản xuất, vận tải và lưu thông hàng hóa.',
    context: 'Sản xuất & lưu thông', width: 612, height: 506,
  },
  'bank-interior': {
    title: 'Không gian giao dịch ngân hàng',
    alt: 'Bản khắc chi tiết về một đại sảnh ngân hàng với quầy giao dịch, nhân viên, khách hàng và kiến trúc trần cao.',
    description: 'Quan sát không gian tổ chức hoạt động ngân hàng. Hình ảnh tự nó không xác định quan hệ sở hữu hay mức độ độc quyền.',
    context: 'Ngân hàng & tín dụng', width: 1600, height: 1144,
  },
  'bank-crowd-detail': {
    title: 'Đám đông trước một lối vào',
    alt: 'Ảnh cắt từ một bản khắc: đám đông đội mũ đứng chen trước cửa một tòa nhà, một người đưa tay ra từ cửa.',
    description: 'Chi tiết về đám đông và hoạt động trước lối vào; sự kiện cụ thể chưa được xác minh.',
    context: 'Tư liệu quan sát', width: 640, height: 360,
  },
  'bank-crowd-page': {
    title: 'Bản in về đám đông trước ngân hàng',
    alt: 'Trang bản in dọc về đám đông bên ngoài một tòa nhà có dòng chữ Fourth National Bank; bản ảnh có vết đen ở phần dưới.',
    description: 'Giữ nguyên trang ảnh, dòng chữ và các dấu vết của bản người học cung cấp. Chưa xác nhận sự kiện hoặc niên đại của cảnh trong ảnh.',
    context: 'Ngân hàng & đời sống xã hội', width: 1185, height: 1536,
  },
  'gallery-society': {
    title: 'Sinh hoạt trong một phòng trưng bày',
    alt: 'Tranh màu mô tả nhiều người mặc trang phục trang trọng đứng trong một căn phòng treo dày các tác phẩm hội họa.',
    description: 'Tư liệu mở rộng về không gian sinh hoạt xã hội. Không dùng riêng bức tranh để kết luận về địa vị kinh tế của các nhân vật.',
    context: 'Đời sống xã hội', width: 1600, height: 840,
  },
  'historical-assembly': {
    title: 'Một cảnh hội họp và trình bày',
    alt: 'Bản khắc đen trắng mô tả một người đứng trình bày trước nhiều người ngồi hoặc đứng quanh bàn trong một gian phòng.',
    description: 'Tư liệu mở rộng về một cảnh hội họp. Danh tính nhân vật, tác phẩm và sự kiện chờ bổ sung nguồn xác nhận.',
    context: 'Tư liệu mở rộng', width: 584, height: 323,
  },
  'arts-sciences': {
    title: 'Học thuật, dụng cụ và hoạt động lao động',
    alt: 'Bản khắc toàn cảnh kiến trúc cổ điển, nhiều nhóm người cùng các dụng cụ học tập, đo đạc và lao động.',
    description: 'Quan sát những hình ảnh về học tập và kỹ nghệ trong cùng một bố cục. Chưa xác nhận tên tác phẩm hoặc tác giả.',
    context: 'Tri thức & kỹ nghệ', width: 836, height: 521,
  },
  'factory-belting': {
    title: 'Dây truyền động trong xưởng máy',
    alt: 'Ảnh màu về người lao động vận hành máy móc trong một xưởng với nhiều dây truyền động treo phía trên; bên dưới có dòng chữ A Forest of Belting.',
    description: 'Quan sát hệ thống máy móc và dây truyền động trong không gian lao động. Giữ nguyên khung ảnh và dòng chữ “A Forest of Belting” của bản cung cấp.',
    context: 'Máy móc & tổ chức lao động', width: 612, height: 470,
  },
} as const;

export type SourceImageKey = keyof typeof sourceImages;
const allImages = Object.keys(sourceImages) as SourceImageKey[];

export function SourceGallery({ images = allImages, single = false }: { images?: SourceImageKey[]; single?: boolean }) {
  const [selected, setSelected] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLButtonElement | null>(null);
  const current = selected === null ? null : sourceImages[images[selected]];
  const close = () => setSelected(null);

  useEffect(() => {
    const element = dialog.current;
    if (selected !== null && element && !element.open) element.showModal();
    if (selected === null && element?.open) { element.close(); opener.current?.focus(); }
  }, [selected]);

  return <>
    <div className={`source-gallery ${single ? 'source-gallery-single' : ''}`}>
      {images.map((id, index) => {
        const image = sourceImages[id];
        return <Reveal key={id} delay={(index % 3) * 90}>
          <figure className="source-figure">
            <button className="source-image-button" aria-label={`Phóng to: ${image.title}`} onClick={event => { opener.current = event.currentTarget; setSelected(index); }}>
              <img src={`./sources/${id}.jpg`} srcSet={`./sources/${id}-small.jpg 480w, ./sources/${id}.jpg ${image.width}w`} sizes={single ? '(max-width: 900px) 86vw, 860px' : '(max-width: 600px) 86vw, (max-width: 900px) 43vw, 400px'} width={image.width} height={image.height} alt={image.alt} loading="lazy" decoding="async"/>
              <span className="source-zoom" aria-hidden="true"><Expand size={15}/> Xem ảnh</span>
            </button>
            <figcaption><span className="eyebrow">{image.context}</span><h3>{image.title}</h3><p>{image.description}</p><small>Ảnh do người học cung cấp</small></figcaption>
          </figure>
        </Reveal>;
      })}
    </div>
    <dialog ref={dialog} className="source-viewer" aria-label="Xem ảnh tư liệu" onCancel={event => { event.preventDefault(); close(); }} onClose={close} onClick={event => { if (event.target === event.currentTarget) close(); }} onKeyDown={event => {
      if (event.key === 'ArrowRight') { event.preventDefault(); setSelected(index => index === null ? null : (index + 1) % images.length); }
      if (event.key === 'ArrowLeft') { event.preventDefault(); setSelected(index => index === null ? null : (index - 1 + images.length) % images.length); }
    }}>
      {current && selected !== null && <>
        <div className="source-viewer-toolbar"><span>TƯ LIỆU {selected + 1} / {images.length}</span><button className="icon-button" aria-label="Đóng ảnh tư liệu" onClick={close}><X size={22}/></button></div>
        <img className="source-viewer-image" src={`./sources/${images[selected]}.jpg`} width={current.width} height={current.height} alt={current.alt}/>
        <div className="source-viewer-caption"><h3>{current.title}</h3><p>{current.description}</p><small>Người học cung cấp · Thông tin xuất xứ chưa được xác minh.</small></div>
        {images.length > 1 && <div className="source-viewer-controls"><button className="button outline" aria-label="Ảnh tư liệu trước" onClick={() => setSelected((selected - 1 + images.length) % images.length)}><ArrowLeft size={16}/> Ảnh trước</button><span>← → để chuyển ảnh · Esc để đóng</span><button className="button outline" aria-label="Ảnh tư liệu tiếp theo" onClick={() => setSelected((selected + 1) % images.length)}>Ảnh tiếp <ArrowRight size={16}/></button></div>}
      </>}
    </dialog>
  </>;
}

export function SourcesSection() {
  return <section id="tu-lieu" className="sources-section page-section">
    <Reveal><div className="sources-section-heading"><div><span className="eyebrow">GÓC NHÌN QUA HÌNH ẢNH</span><h2>Những lát cắt<br/><em>của một thời đại.</em></h2></div><p>Bộ ảnh do người học cung cấp: xưởng máy, cảng biển, ngân hàng và những không gian sinh hoạt. Chọn từng ảnh để quan sát trọn vẹn.</p></div>
    <div className="source-notice"><span className="notice-dot"/><p>Tên ảnh ở đây là mô tả nội dung nhìn thấy. Tác giả, xuất xứ và sự kiện lịch sử cụ thể chờ bổ sung nguồn xác nhận. Các ảnh mở rộng không được dùng làm bằng chứng trực tiếp cho lý luận về độc quyền.</p></div></Reveal>
    <SourceGallery/>
  </section>;
}
