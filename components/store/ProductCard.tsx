'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart, Eye, Star, ShoppingBag, Check, Sparkles } from 'lucide-react';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';

interface ProductCardProps {
  product: DummyProduct;
  isWishlisted: boolean;
  onToggleWishlist: (product: DummyProduct) => void;
  onQuickView: (product: DummyProduct) => void;
  onQuickAdd: (product: DummyProduct) => void;
  searchQuery?: string;
}

export function ProductCard({
  product,
  isWishlisted,
  onToggleWishlist,
  onQuickView,
  onQuickAdd,
  searchQuery,
}: ProductCardProps) {
  const [isAdded, setIsAdded] = useState(false);
  const imageUrl = product.product_images?.[0]?.image_url || `https://picsum.photos/seed/${product.slug}/600/800`;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickAdd(product);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  // Highlight matching text if search query exists
  const highlightText = (text: string) => {
    if (!searchQuery || !searchQuery.trim()) return text;
    const parts = text.split(new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase() ? (
        <mark key={i} className="bg-amber-200 text-sage px-0.5 rounded font-bold">
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div className="organic-card p-5 flex flex-col justify-between group overflow-hidden relative min-h-[430px] border border-sage/15 hover:border-sage/40 transition-all duration-300 hover:shadow-2xl bg-white/70 backdrop-blur rounded-3xl">
      
      {/* Top Bar: Tag Badge & Wishlist Button */}
      <div className="relative z-10 flex justify-between items-center mb-3">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="px-3 py-1 bg-terracotta/15 text-terracotta rounded-full text-xs font-semibold tracking-wider flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            {product.tag}
          </span>
        </div>

        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onToggleWishlist(product);
          }}
          className={`p-2.5 rounded-full backdrop-blur transition-all duration-200 ${
            isWishlisted 
              ? 'bg-terracotta text-white shadow-md scale-105' 
              : 'bg-white/90 text-sage hover:bg-white hover:text-terracotta hover:scale-110 shadow-xs'
          }`}
          aria-label="Wishlist"
          title={isWishlisted ? "Remove from saved" : "Save to wishlist"}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* Center Image Container with Zoom Effect */}
      <div className="relative aspect-[4/5] w-full rounded-2xl overflow-hidden mb-4 bg-sand/20 border border-sage/10">
        <Image 
          src={imageUrl} 
          alt={product.title} 
          fill 
          className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          referrerPolicy="no-referrer"
        />

        {/* Quick View Hover Overlay Button */}
        <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onQuickView(product);
            }}
            className="px-5 py-3 bg-white/95 text-sage rounded-xl text-xs font-bold flex items-center gap-2 hover:bg-sage hover:text-white transition-all transform translate-y-2 group-hover:translate-y-0 duration-300 shadow-xl"
          >
            <Eye className="w-4 h-4" /> Quick View
          </button>
        </div>
      </div>

      {/* Product Information */}
      <div className="relative z-10 flex flex-col justify-between flex-1">
        <div>
          {/* Rating & Review Count */}
          <div className="flex items-center justify-between text-xs font-medium mb-1.5">
            <div className="flex items-center gap-1 text-amber-700">
              <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
              <span className="font-bold">{product.rating}</span>
              <span className="text-sage/60">({product.review_count})</span>
            </div>
            <span className="text-[11px] text-sage/70 font-semibold truncate max-w-[110px]" title={product.material}>
              {product.material.split(' ')[0]} {product.material.split(' ')[1] || ''}
            </span>
          </div>

          {/* Product Title */}
          <Link href={`/products/${product.slug}`}>
            <h3 className="serif text-xl text-sage group-hover:text-sage/80 transition-colors line-clamp-1 font-semibold leading-tight">
              {highlightText(product.title)}
            </h3>
          </Link>

          {/* Price */}
          <p className="text-lg font-bold text-sage mt-1.5 tracking-tight">{formatNaira(product.base_price)}</p>
        </div>

        {/* Color Swatches & Quick Add Button */}
        <div className="mt-4 pt-3 border-t border-sage/10 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                className="w-4 h-4 rounded-full border border-sand/80 shadow-xs inline-block transition-transform hover:scale-125 cursor-pointer"
                style={{ backgroundColor: c.hex }}
                title={c.name}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-[10px] text-sage/60 font-bold ml-1">+{product.colors.length - 3}</span>
            )}
          </div>

          <button
            onClick={handleQuickAdd}
            className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all duration-300 ${
              isAdded 
                ? 'bg-[#25D366] text-white shadow-sm' 
                : 'bg-sage/10 text-sage hover:bg-sage hover:text-white'
            }`}
            title="Add to Shopping Bag"
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Add</span>
              </>
            )}
          </button>
        </div>
      </div>

    </div>
  );
}

