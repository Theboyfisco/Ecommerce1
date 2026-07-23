'use client';

import React, { useState } from 'react';
import { X, Star, Heart, ShoppingBag, Eye, Ruler, Check } from 'lucide-react';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';
import { WhatsAppOrderModal } from './WhatsAppOrderModal';
import { SizeGuideModal } from './SizeGuideModal';

interface QuickViewModalProps {
  product: DummyProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (product: DummyProduct, color: string, size: string) => void;
}

export function QuickViewModal({ product, isOpen, onClose, onAddToCart }: QuickViewModalProps) {
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState<number>(0);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [addedToast, setAddedToast] = useState(false);

  if (!isOpen || !product) return null;

  const currentColor = selectedColor || product.colors[0]?.name || 'Natural';
  const currentSize = selectedSize || product.sizes[0] || 'Standard';

  const handleAddToCart = () => {
    if (onAddToCart) {
      onAddToCart(product, currentColor, currentSize);
      setAddedToast(true);
      setTimeout(() => setAddedToast(false), 2000);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
        <div 
          className="bg-[#F9F8F3] border border-sage/20 rounded-3xl p-6 sm:p-8 max-w-4xl w-full shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar"
          onClick={(e) => e.stopPropagation()}
        >
          <button 
            onClick={onClose}
            className="absolute top-6 right-6 z-10 p-2 rounded-full bg-sand/60 hover:bg-sand text-sage transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Gallery Section */}
            <div className="flex flex-col gap-4">
              <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-sand/20 border border-sage/10">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.product_images[activeImageIdx]?.image_url || product.product_images[0]?.image_url} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
                <span className="absolute top-4 left-4 px-3 py-1 bg-white/90 backdrop-blur text-sage text-xs font-semibold rounded-full shadow-sm">
                  {product.tag}
                </span>
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-1 custom-scrollbar">
                {product.product_images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIdx(idx)}
                    className={`w-16 h-20 rounded-xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activeImageIdx === idx ? 'border-sage scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* Details Section */}
            <div className="flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2 text-xs text-sage/70 font-semibold uppercase tracking-wider">
                  <span>{product.category_name}</span>
                  <span>•</span>
                  <div className="flex items-center gap-1 text-amber-700">
                    <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                    <span>{product.rating} ({product.review_count} reviews)</span>
                  </div>
                </div>

                <h2 className="serif text-3xl sm:text-4xl italic text-sage mb-2">{product.title}</h2>
                <p className="text-2xl font-semibold text-sage mb-4">{formatNaira(product.base_price)}</p>

                <p className="text-sm text-sage/80 leading-relaxed mb-6">
                  {product.description}
                </p>

                {/* Color Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-sage uppercase tracking-wider">
                      Color: <span className="font-bold">{currentColor}</span>
                    </span>
                  </div>
                  <div className="flex gap-3">
                    {product.colors.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${
                          currentColor === c.name ? 'border-sage scale-110 shadow-md' : 'border-sand hover:scale-105'
                        }`}
                        style={{ backgroundColor: c.hex }}
                        title={c.name}
                      >
                        {currentColor === c.name && (
                          <div className="w-2 h-2 rounded-full bg-white shadow-sm" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Size Selector */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-semibold text-sage uppercase tracking-wider">
                      Size: <span className="font-bold">{currentSize}</span>
                    </span>
                    <button 
                      onClick={() => setIsSizeGuideOpen(true)}
                      className="text-xs text-sage underline hover:opacity-80 flex items-center gap-1 font-medium"
                    >
                      <Ruler className="w-3.5 h-3.5" /> Size Guide
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((s) => (
                      <button
                        key={s}
                        onClick={() => setSelectedSize(s)}
                        className={`px-4 py-2 text-xs font-semibold rounded-xl border transition-all ${
                          currentSize === s 
                            ? 'bg-sage text-white border-sage shadow-sm' 
                            : 'bg-white/80 text-sage border-sage/20 hover:border-sage/50'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3 pt-4 border-t border-sage/10">
                {addedToast && (
                  <div className="p-3 bg-sage/10 text-sage rounded-xl text-xs font-semibold flex items-center justify-center gap-2 animate-in fade-in">
                    <Check className="w-4 h-4 text-sage" /> Added to Shopping Bag!
                  </div>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={handleAddToCart}
                    className="flex-1 py-3.5 bg-sand/60 hover:bg-sand text-sage rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors border border-sage/20"
                  >
                    <ShoppingBag className="w-4 h-4" /> Add to Bag
                  </button>

                  <button
                    onClick={() => setIsWhatsAppOpen(true)}
                    className="flex-1 py-3.5 bg-sage hover:bg-sage/90 text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 transition-colors shadow-lg shadow-sage/20"
                  >
                    <span>Order via WhatsApp</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        categoryName={product.category_name} 
      />

      <WhatsAppOrderModal 
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        product={product}
        selectedColor={currentColor}
        selectedSize={currentSize}
      />
    </>
  );
}
