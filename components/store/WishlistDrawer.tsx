'use client';

import React from 'react';
import { X, Heart, ShoppingBag, Trash2 } from 'lucide-react';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: DummyProduct[];
  onRemoveWishlist: (productId: string) => void;
  onMoveToCart: (product: DummyProduct) => void;
}

export function WishlistDrawer({
  isOpen,
  onClose,
  items,
  onRemoveWishlist,
  onMoveToCart,
}: WishlistDrawerProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-[#F9F8F3] border-l border-sage/20 p-6 flex flex-col justify-between shadow-2xl relative">
          
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-sage/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-terracotta/10 text-terracotta rounded-xl flex items-center justify-center">
                  <Heart className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h3 className="serif text-2xl italic text-sage">Saved Favorites</h3>
                  <p className="text-xs text-sage/70 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} saved</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-sand/40 hover:bg-sand text-sage transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-sand/40 text-sage/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Heart className="w-8 h-8" />
                </div>
                <p className="serif text-2xl italic text-sage mb-2">No Saved Items Yet</p>
                <p className="text-xs text-sage/70 max-w-xs mx-auto mb-6">Click the heart icon on any item while browsing to save it to your personal wishlist.</p>
                <button onClick={onClose} className="px-6 py-3 bg-sage text-white rounded-full text-xs font-semibold hover:bg-sage/90">
                  Browse Products
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-1 custom-scrollbar">
                {items.map((product) => (
                  <div key={product.id} className="bg-sand/30 border border-sage/10 rounded-2xl p-4 flex gap-4 items-center">
                    <div className="w-16 h-20 bg-sand/50 rounded-xl overflow-hidden relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={product.product_images[0]?.image_url} 
                        alt={product.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="serif text-lg text-sage truncate">{product.title}</h4>
                        <button 
                          onClick={() => onRemoveWishlist(product.id)}
                          className="text-sage/40 hover:text-red-600 transition-colors p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-sm font-semibold text-sage mt-1">{formatNaira(product.base_price)}</p>

                      <button
                        onClick={() => {
                          onMoveToCart(product);
                          onRemoveWishlist(product.id);
                        }}
                        className="mt-3 w-full py-2 bg-sage/10 hover:bg-sage text-sage hover:text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
                      >
                        <ShoppingBag className="w-3.5 h-3.5" /> Move to Bag
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
