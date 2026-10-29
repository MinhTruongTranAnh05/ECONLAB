import type { Ref } from 'react';
import { Reveal } from './motion';

export const artwork = {
  industry: {
    title: 'Nhịp chuyển động của công nghiệp',
    alt: 'Minh họa tranh khắc: quần thể nhà máy, bánh đà, đường sắt và bến sông trong một khung cảnh công nghiệp tưởng tượng.',
    caption: 'Một hình dung về quy mô sản xuất, nhà máy và những kết nối công nghiệp.',
    width: 1024,
    height: 1536,
  },
  finance: {
    title: 'Những bánh răng của tư bản',
    alt: 'Minh họa khái niệm: tòa nhà ngân hàng và nhà máy công nghiệp được kết nối bằng hai bánh răng, phía trước là sổ cái và các chồng tiền xu.',
    caption: 'Hình ảnh ẩn dụ cho mối liên hệ giữa ngân hàng và công nghiệp.',
    width: 1280,
    height: 853,
  },
  networks: {
    title: 'Những kết nối vượt biên giới',
    alt: 'Minh họa khái niệm: tàu container, cần cẩu cảng và nhà máy phía trước một địa cầu có các đường kết nối tượng trưng.',
    caption: 'Hình dung về sản xuất, đầu tư và trao đổi trong những mạng lưới quốc tế.',
    width: 1280,
    height: 853,
  },
  vietnam: {
    title: 'Từ phố nhỏ đến những dòng chảy lớn',
    alt: 'Minh họa tổng hợp về Việt Nam: phố buôn bán, người lao động và thuyền trên sông nối với xưởng sản xuất, cảng hàng hóa và đô thị.',
    caption: 'Một cảnh tổng hợp tưởng tượng về sinh kế, sản xuất và giao thương ở Việt Nam.',
    width: 1280,
    height: 720,
  },
} as const;

export type ArtworkKey = keyof typeof artwork;

export function ArtworkImage({
  name,
  sizes = '(max-width: 900px) 86vw, 860px',
  priority = false,
  decorative = false,
  imageRef,
  className,
}: {
  name: ArtworkKey;
  sizes?: string;
  priority?: boolean;
  decorative?: boolean;
  imageRef?: Ref<HTMLImageElement>;
  className?: string;
}) {
  const image = artwork[name];
  return (
    <img
      ref={imageRef}
      className={className}
      src={`./artwork/${name}.jpg`}
      srcSet={`./artwork/${name}-small.jpg 640w, ./artwork/${name}.jpg ${image.width}w`}
      sizes={sizes}
      width={image.width}
      height={image.height}
      alt={decorative ? '' : image.alt}
      loading={priority ? 'eager' : 'lazy'}
      fetchPriority={priority ? 'high' : 'auto'}
      decoding="async"
    />
  );
}

export function EditorialArtwork({ name, className = '' }: { name: ArtworkKey; className?: string }) {
  const image = artwork[name];
  return (
    <Reveal variant="image" className={`editorial-artwork-reveal ${className}`}>
      <figure className={`editorial-artwork artwork-${name}`}>
        <div className="artwork-frame"><ArtworkImage name={name}/></div>
        <figcaption>
          <div><strong>{image.title}</strong><span>{image.caption}</span></div>
        </figcaption>
      </figure>
    </Reveal>
  );
}
