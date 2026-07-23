'use client';

import { useMemo, useState } from 'react';
import Image from 'next/image';
import { ProductImage } from '@/types';

interface ProductGalleryProps {
  images: ProductImage[];
  selectedColor: string;
}

export function ProductGallery({ images, selectedColor }: ProductGalleryProps) {
  const filteredImages = useMemo(() => {
    const matched = images.filter(
      (img) => img.color_tag && img.color_tag.toLowerCase() === selectedColor.toLowerCase()
    );
    return matched.length > 0 ? matched : images;
  }, [images, selectedColor]);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const currentImage = filteredImages[activeImageIndex] || filteredImages[0];

  return (
    <div className="flex flex-col gap-4">
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-gray-100 rounded-lg">
        {currentImage && (
          <Image
            src={currentImage.image_url}
            alt="Product display image"
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover object-center"
            priority
          />
        )}
      </div>

      {filteredImages.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
          {filteredImages.map((img, idx) => (
            <button
              key={img.id}
              onClick={() => setActiveImageIndex(idx)}
              className={`relative h-20 w-16 flex-shrink-0 overflow-hidden rounded-md border-2 bg-gray-50 ${
                activeImageIndex === idx ? 'border-black' : 'border-transparent'
              }`}
            >
              <Image
                src={img.image_url}
                alt="Product thumbnail"
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
