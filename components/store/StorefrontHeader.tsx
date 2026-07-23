'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Search, ShoppingBag, Heart, Menu, X, MessageCircle, Sparkles } from 'lucide-react';
import { dummyCategories } from '@/lib/dummyData';

interface StorefrontHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: string;
  onSelectCategory: (categorySlug: string) => void;
  cartCount: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

export function StorefrontHeader({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  cartCount,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}: StorefrontHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-[#F2F0E9]/90 backdrop-blur-md border-b border-sage/10 transition-all">
      {/* Top Banner */}
      <div className="bg-sage text-white text-xs py-2 px-4 text-center font-medium flex items-center justify-center gap-2">
        <Sparkles className="w-3.5 h-3.5 text-sand" />
        <span>Complimentary Nationwide Delivery across Nigeria on orders over ₦150,000 • Direct WhatsApp Concierge</span>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 flex-shrink-0">
            <div className="w-10 h-10 bg-sage rounded-full flex items-center justify-center text-white serif text-xl shadow-md">
              A
            </div>
            <div>
              <h1 className="serif text-2xl font-bold accent-sage italic tracking-tight">Aurelia</h1>
              <p className="text-[10px] uppercase tracking-widest text-sage/70 font-semibold -mt-1 hidden sm:block">Natural Apparel & Maison</p>
            </div>
          </Link>

          {/* Center Search Input */}
          <div className="flex-1 max-w-md relative hidden md:block">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sage/50" />
            <input 
              type="text"
              placeholder="Search 150+ natural linen, silk, footwear..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 rounded-full bg-sand/40 border border-sage/15 text-sage placeholder:text-sage/50 text-sm focus:outline-none focus:ring-2 focus:ring-sage/30 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => onSearchChange('')} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-sage/50 hover:text-sage"
              >
                Clear
              </button>
            )}
          </div>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Wishlist Button */}
            <button
              onClick={onOpenWishlist}
              className="p-2.5 rounded-full bg-sand/30 hover:bg-sand text-sage relative transition-colors"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-terracotta text-white rounded-full text-[10px] font-bold flex items-center justify-center shadow-sm">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Bag Button */}
            <button
              onClick={onOpenCart}
              className="px-4 py-2.5 rounded-full bg-sage text-white font-medium text-xs flex items-center gap-2 hover:bg-sage/90 transition-colors shadow-md shadow-sage/15"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="hidden sm:inline">Bag</span>
              {cartCount > 0 && (
                <span className="bg-white text-sage rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-full bg-sand/30 text-sage md:hidden"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Search Bar for Mobile Screen */}
        <div className="pb-3 md:hidden">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sage/50" />
            <input 
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-11 pr-4 py-2 rounded-full bg-sand/40 border border-sage/15 text-sage placeholder:text-sage/50 text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-sage/10 animate-in slide-in-from-top-2">
            <p className="text-xs uppercase tracking-wider text-sage/60 font-semibold mb-3 px-2">Categories</p>
            <div className="flex flex-col space-y-2">
              <button
                onClick={() => {
                  onSelectCategory('all');
                  setMobileMenuOpen(false);
                }}
                className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                  selectedCategory === 'all' ? 'bg-sage text-white' : 'text-sage hover:bg-sand/40'
                }`}
              >
                Shop All Collection (150 Items)
              </button>
              {dummyCategories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    onSelectCategory(c.slug);
                    setMobileMenuOpen(false);
                  }}
                  className={`text-left px-4 py-3 rounded-2xl text-sm font-semibold transition-colors ${
                    selectedCategory === c.slug ? 'bg-sage text-white' : 'text-sage hover:bg-sand/40'
                  }`}
                >
                  {c.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
