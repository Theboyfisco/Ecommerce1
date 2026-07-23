'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { DummyProduct, dummyCategories } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';
import { StorefrontHeader } from './StorefrontHeader';
import { ProductCard } from './ProductCard';
import { QuickViewModal } from './QuickViewModal';
import { CartDrawer, CartItem } from './CartDrawer';
import { WishlistDrawer } from './WishlistDrawer';
import { useToast } from '@/context/ToastContext';
import { SlidersHorizontal, ArrowUpDown, RefreshCw, Sparkles, ShieldCheck, Truck, Headphones, Search, X } from 'lucide-react';

interface StorefrontCatalogProps {
  initialProducts: DummyProduct[];
}

export function StorefrontCatalog({ initialProducts }: StorefrontCatalogProps) {
  const { showToast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState<'featured' | 'price-low' | 'price-high' | 'rating' | 'name'>('featured');
  const [selectedTag, setSelectedTag] = useState<string>('all');
  const [priceMax, setPriceMax] = useState<number>(250000);
  
  // Drawers & Modals
  const [quickViewProduct, setQuickViewProduct] = useState<DummyProduct | null>(null);
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aurelia_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.error('Error loading cart from localStorage:', err);
      }
    }
    return [];
  });

  const [wishlistItems, setWishlistItems] = useState<DummyProduct[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aurelia_wishlist');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (err) {
        console.error('Error loading wishlist from localStorage:', err);
      }
    }
    return [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  
  // Pagination
  const [displayCount, setDisplayCount] = useState(24);

  // Quick search keywords list
  const quickSearchKeywords = ['Linen', 'Silk', 'Kaftan', 'Footwear', 'Bestseller', 'Organic', 'Leather', 'Sandals', 'Dress'];

  // Save Wishlist to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlistItems));
    } catch (err) {
      console.error('Error saving wishlist to localStorage:', err);
    }
  }, [wishlistItems]);

  // Save Cart to localStorage on updates
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_cart', JSON.stringify(cartItems));
    } catch (err) {
      console.error('Error saving cart to localStorage:', err);
    }
  }, [cartItems]);

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return initialProducts.filter((p) => {
      // Search - matches title, description, category_name, or material
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = 
        !q || 
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category_name.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.tag.toLowerCase().includes(q);

      // Category
      const matchesCategory = 
        selectedCategory === 'all' || p.category_slug === selectedCategory;

      // Tag
      const matchesTag = 
        selectedTag === 'all' || p.tag === selectedTag;

      // Price
      const matchesPrice = p.base_price <= priceMax;

      return matchesSearch && matchesCategory && matchesTag && matchesPrice;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.base_price - b.base_price;
      if (sortBy === 'price-high') return b.base_price - a.base_price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'name') return a.title.localeCompare(b.title);
      return 0; // featured
    });
  }, [initialProducts, searchQuery, selectedCategory, selectedTag, priceMax, sortBy]);

  // Wishlist handler with Toast feedback & localStorage
  const handleToggleWishlist = (product: DummyProduct) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === product.id);
      if (exists) {
        showToast({
          title: 'Removed from Saved Items',
          message: product.title,
          type: 'info',
          image: product.product_images[0]?.image_url,
        });
        return prev.filter((item) => item.id !== product.id);
      } else {
        showToast({
          title: 'Saved to Wishlist',
          message: `${product.title} saved to your favorites`,
          type: 'wishlist',
          image: product.product_images[0]?.image_url,
        });
        return [...prev, product];
      }
    });
  };

  // Cart handler with Toast feedback & localStorage
  const handleAddToCart = (product: DummyProduct, color?: string, size?: string) => {
    const itemColor = color || product.colors[0]?.name || 'Natural';
    const itemSize = size || product.sizes[0] || 'M';
    const cartId = `${product.id}-${itemColor}-${itemSize}`;

    setCartItems((prev) => {
      const existingIndex = prev.findIndex((item) => item.id === cartId);
      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      }
      return [...prev, { id: cartId, product, color: itemColor, size: itemSize, quantity: 1 }];
    });

    showToast({
      title: 'Added to Shopping Bag',
      message: `${product.title} (${itemColor}, Size ${itemSize})`,
      type: 'cart',
      image: product.product_images[0]?.image_url,
    });
  };

  const handleUpdateCartQuantity = (id: string, qty: number) => {
    setCartItems((prev) => prev.map((item) => (item.id === id ? { ...item, quantity: qty } : item)));
  };

  const handleRemoveCartItem = (id: string) => {
    const targetItem = cartItems.find((item) => item.id === id);
    setCartItems((prev) => prev.filter((item) => item.id !== id));
    if (targetItem) {
      showToast({
        title: 'Removed from Bag',
        message: targetItem.product.title,
        type: 'info',
        image: targetItem.product.product_images[0]?.image_url,
      });
    }
  };


  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedTag('all');
    setPriceMax(250000);
    setSortBy('featured');
  };

  const visibleProducts = filteredProducts.slice(0, displayCount);

  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col font-sans text-[#5A5A40]">
      
      <StorefrontHeader 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      {/* Prominent Search Banner Bar */}
      <section className="bg-sand/30 border-b border-sage/15 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 bg-sage/10 text-sage rounded-full text-xs font-bold tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Search 150+ Curated Natural Apparel & Maison Pieces</span>
          </div>

          <div className="relative max-w-2xl mx-auto">
            <Search className="w-5 h-5 absolute left-5 top-1/2 -translate-y-1/2 text-sage/50" />
            <input 
              type="text"
              placeholder="Search by name, fabric, style (e.g. 'French Linen', 'Kaftan', 'Silk Dress')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-13 pr-12 py-4 rounded-full bg-white border border-sage/20 text-sage placeholder:text-sage/40 text-sm sm:text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-sage/40 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-sand/60 hover:bg-sand text-sage transition-colors"
                title="Clear Search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Quick Search Chips */}
          <div className="flex items-center justify-center gap-2 flex-wrap text-xs pt-1">
            <span className="text-sage/60 font-semibold mr-1">Popular searches:</span>
            {quickSearchKeywords.map((keyword) => (
              <button
                key={keyword}
                onClick={() => setSearchQuery(keyword)}
                className={`px-3 py-1 rounded-full border transition-all ${
                  searchQuery.toLowerCase() === keyword.toLowerCase()
                    ? 'bg-sage text-white border-sage font-bold shadow-xs'
                    : 'bg-white/70 text-sage border-sage/20 hover:border-sage/50 hover:bg-white'
                }`}
              >
                {keyword}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Main Layout Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full flex flex-col md:flex-row gap-8">
        
        {/* Desktop Sidebar Filters */}
        <aside className="w-64 flex-shrink-0 hidden md:block">
          <div className="sticky top-28 bg-white/60 backdrop-blur border border-sage/15 rounded-3xl p-6 space-y-8 shadow-xs">
            
            {/* Categories */}
            <div>
              <h3 className="serif text-xl italic text-sage mb-4 flex items-center justify-between">
                <span>Categories</span>
                <span className="text-xs font-sans not-italic text-sage/50 font-semibold">{initialProducts.length} items</span>
              </h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => setSelectedCategory('all')}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                    selectedCategory === 'all' 
                      ? 'bg-sage text-white shadow-sm' 
                      : 'text-sage hover:bg-sand/40'
                  }`}
                >
                  <span>Shop All</span>
                  <span className={`text-xs ${selectedCategory === 'all' ? 'text-white/80' : 'text-sage/50'}`}>150</span>
                </button>
                {dummyCategories.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedCategory(c.slug)}
                    className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                      selectedCategory === c.slug 
                        ? 'bg-sage text-white shadow-sm' 
                        : 'text-sage hover:bg-sand/40'
                    }`}
                  >
                    <span>{c.name}</span>
                    <span className={`text-xs ${selectedCategory === c.slug ? 'text-white/80' : 'text-sage/50'}`}>30</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Collection Tags */}
            <div>
              <h3 className="serif text-xl italic text-sage mb-3">Filter by Vibe</h3>
              <div className="flex flex-wrap gap-2">
                {['all', 'New', 'Bestseller', 'Organic', 'Limited', 'Essential'].map((tag) => (
                  <button
                    key={tag}
                    onClick={() => setSelectedTag(tag)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      selectedTag === tag 
                        ? 'bg-sage text-white border-sage' 
                        : 'bg-white/80 text-sage border-sage/20 hover:border-sage/50'
                    }`}
                  >
                    {tag === 'all' ? 'All Vibes' : tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range Filter */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <h3 className="serif text-xl italic text-sage">Max Price</h3>
                <span className="text-xs font-bold text-sage">{formatNaira(priceMax)}</span>
              </div>
              <input 
                type="range" 
                min="20000" 
                max="250000" 
                step="5000"
                value={priceMax}
                onChange={(e) => setPriceMax(Number(e.target.value))}
                className="w-full accent-sage cursor-pointer"
              />
            </div>

            {/* Reset Filters */}
            <button
              onClick={resetFilters}
              className="w-full py-2.5 bg-sand/40 hover:bg-sand text-sage rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-colors border border-sage/10"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Reset Filters
            </button>

          </div>
        </aside>

        {/* Main Content Feed */}
        <main className="flex-1 flex flex-col min-w-0">
          
          {/* Top Control Bar */}
          <div className="bg-white/60 backdrop-blur border border-sage/15 rounded-3xl p-4 sm:p-6 mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="serif text-3xl sm:text-4xl italic text-sage">
                {selectedCategory === 'all' ? 'All Collection' : dummyCategories.find(c => c.slug === selectedCategory)?.name || 'Collection'}
              </h2>
              <p className="text-xs text-sage/70 font-medium mt-1 flex items-center gap-2">
                Showing <span className="font-bold text-sage">{visibleProducts.length}</span> of {filteredProducts.length} curated pieces
                {searchQuery && (
                  <span className="px-2.5 py-0.5 bg-amber-100 text-amber-800 rounded-full text-[11px] font-bold">
                    Matching &ldquo;{searchQuery}&rdquo;
                  </span>
                )}
              </p>
            </div>

            {/* Sorting Dropdown */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <ArrowUpDown className="w-4 h-4 text-sage/60" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2.5 rounded-2xl bg-sand/30 border border-sage/20 text-sage text-xs font-semibold focus:outline-none cursor-pointer w-full sm:w-auto"
              >
                <option value="featured">Sort by: Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="name">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>

          {/* Mobile Category Pill Scroller */}
          <div className="flex md:hidden gap-2 overflow-x-auto pb-4 mb-4 custom-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === 'all' ? 'bg-sage text-white' : 'bg-sand/40 text-sage'
              }`}
            >
              All (150)
            </button>
            {dummyCategories.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedCategory(c.slug)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  selectedCategory === c.slug ? 'bg-sage text-white' : 'bg-sand/40 text-sage'
                }`}
              >
                {c.name}
              </button>
            ))}
          </div>

          {/* Product Grid */}
          {filteredProducts.length === 0 ? (
            <div className="bg-white/40 border border-sage/10 rounded-3xl p-12 text-center my-8">
              <SlidersHorizontal className="w-12 h-12 text-sage/30 mx-auto mb-4" />
              <h3 className="serif text-3xl italic text-sage mb-2">No Matching Products</h3>
              <p className="text-sm text-sage/70 max-w-sm mx-auto mb-6">We could not find items matching your search criteria. Try adjusting filters or search terms.</p>
              <button
                onClick={resetFilters}
                className="px-6 py-3 bg-sage text-white rounded-full text-xs font-semibold hover:bg-sage/90 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                {visibleProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    isWishlisted={wishlistItems.some((w) => w.id === p.id)}
                    onToggleWishlist={handleToggleWishlist}
                    onQuickView={setQuickViewProduct}
                    onQuickAdd={(item) => handleAddToCart(item)}
                    searchQuery={searchQuery}
                  />
                ))}
              </div>

              {/* Load More Button */}
              {displayCount < filteredProducts.length && (
                <div className="text-center mt-12 mb-8">
                  <button
                    onClick={() => setDisplayCount((prev) => prev + 24)}
                    className="px-8 py-4 bg-sage text-white rounded-2xl font-semibold text-sm hover:bg-sage/90 transition-colors shadow-lg shadow-sage/20"
                  >
                    Load More Collection ({filteredProducts.length - displayCount} remaining)
                  </button>
                </div>
              )}
            </>
          )}

          {/* Value Props Bar */}
          <div className="mt-16 border-t border-sage/15 pt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-center gap-4 p-6 bg-white/40 rounded-3xl border border-sage/10">
              <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center flex-shrink-0">
                <Truck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="serif text-xl italic text-sage">Nationwide Delivery</h4>
                <p className="text-xs text-sage/70 mt-1">Door-to-door courier across Lagos, Abuja, Port Harcourt & all Nigerian states.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/40 rounded-3xl border border-sage/10">
              <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center flex-shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h4 className="serif text-xl italic text-sage">Authentic Craftsmanship</h4>
                <p className="text-xs text-sage/70 mt-1">100% natural organic linen, silk & handcrafted leather.</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-6 bg-white/40 rounded-3xl border border-sage/10">
              <div className="w-12 h-12 bg-sage/10 text-sage rounded-2xl flex items-center justify-center flex-shrink-0">
                <Headphones className="w-6 h-6" />
              </div>
              <div>
                <h4 className="serif text-xl italic text-sage">WhatsApp Concierge</h4>
                <p className="text-xs text-sage/70 mt-1">Instant sizing support, custom orders & direct transfer options.</p>
              </div>
            </div>
          </div>

        </main>
      </div>

      {/* Footer */}
      <footer className="bg-sage text-sand/90 py-12 px-4 sm:px-6 lg:px-8 border-t border-sage/20 mt-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-sand text-sage rounded-full flex items-center justify-center serif font-bold">A</div>
            <span className="serif text-2xl italic text-white">Aurelia Apparel & Maison</span>
          </div>
          <p className="text-xs text-sand/70">
            © {new Date().getFullYear()} Aurelia Store. Crafted with organic materials for natural living.
          </p>
        </div>
      </footer>

      {/* Modals & Drawers */}
      <QuickViewModal
        product={quickViewProduct}
        isOpen={!!quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveCartItem}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemoveWishlist={(id) => setWishlistItems((prev) => prev.filter((item) => item.id !== id))}
        onMoveToCart={(product) => handleAddToCart(product)}
      />

    </div>
  );
}

