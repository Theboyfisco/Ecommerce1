'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';
import { Star, Heart, ShoppingBag, Ruler, Check, ShieldCheck, Truck, ArrowLeft, MessageCircle, ChevronDown, ChevronUp, ZoomIn, X, ThumbsUp, Sparkles, RefreshCw } from 'lucide-react';
import { SizeGuideModal } from './SizeGuideModal';
import { WhatsAppOrderModal } from './WhatsAppOrderModal';
import { StorefrontHeader } from './StorefrontHeader';
import { ProductCard } from './ProductCard';
import { CartDrawer, CartItem } from './CartDrawer';
import { WishlistDrawer } from './WishlistDrawer';
import { useToast } from '@/context/ToastContext';

interface ProductDetailClientProps {
  product: DummyProduct;
  relatedProducts: DummyProduct[];
}

export function ProductDetailClient({ product, relatedProducts }: ProductDetailClientProps) {
  const { showToast } = useToast();
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0]?.name || 'Natural');
  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [quantity, setQuantity] = useState<number>(1);
  const [activeImgIdx, setActiveImgIdx] = useState<number>(0);
  const [isZoomOpen, setIsZoomOpen] = useState<boolean>(false);
  
  // Modals & Drawers
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isWhatsAppOpen, setIsWhatsAppOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  // Persistence State
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('aurelia_cart');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error(e);
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
      } catch (e) {
        console.error(e);
      }
    }
    return [];
  });

  // Accordion state
  const [openAccordion, setOpenAccordion] = useState<'materials' | 'shipping' | 'returns' | null>('materials');

  // Sync Wishlist to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_wishlist', JSON.stringify(wishlistItems));
    } catch (e) {
      console.error(e);
    }
  }, [wishlistItems]);

  // Sync Cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('aurelia_cart', JSON.stringify(cartItems));
    } catch (e) {
      console.error(e);
    }
  }, [cartItems]);

  const isWishlisted = wishlistItems.some((item) => item.id === product.id);

  const handleToggleWishlist = (targetProduct: DummyProduct = product) => {
    setWishlistItems((prev) => {
      const exists = prev.some((item) => item.id === targetProduct.id);
      if (exists) {
        showToast({
          title: 'Removed from Wishlist',
          message: targetProduct.title,
          type: 'info',
          image: targetProduct.product_images[0]?.image_url,
        });
        return prev.filter((item) => item.id !== targetProduct.id);
      } else {
        showToast({
          title: 'Saved to Wishlist',
          message: `${targetProduct.title} saved to your favorites`,
          type: 'wishlist',
          image: targetProduct.product_images[0]?.image_url,
        });
        return [...prev, targetProduct];
      }
    });
  };

  const handleAddToCart = (targetProduct: DummyProduct = product, color?: string, size?: string, qty: number = quantity) => {
    const itemColor = color || selectedColor || targetProduct.colors[0]?.name || 'Natural';
    const itemSize = size || selectedSize || targetProduct.sizes[0] || 'M';
    const cartId = `${targetProduct.id}-${itemColor}-${itemSize}`;

    setCartItems((prev) => {
      const existingIdx = prev.findIndex((i) => i.id === cartId);
      if (existingIdx > -1) {
        const updated = [...prev];
        updated[existingIdx].quantity += qty;
        return updated;
      }
      return [...prev, { id: cartId, product: targetProduct, color: itemColor, size: itemSize, quantity: qty }];
    });

    showToast({
      title: 'Added to Shopping Bag',
      message: `${qty}x ${targetProduct.title} (${itemColor}, Size ${itemSize})`,
      type: 'cart',
      image: targetProduct.product_images[0]?.image_url,
    });
  };


  const handleColorChange = (colorName: string) => {
    setSelectedColor(colorName);
    // Find image tagged with this color if available
    const imgIndex = product.product_images.findIndex((img) => img.color_tag?.toLowerCase() === colorName.toLowerCase());
    if (imgIndex > -1) {
      setActiveImgIdx(imgIndex);
    }
  };

  const sampleReviews = [
    { id: 1, author: "Chioma A.", location: "Lekki Phase 1, Lagos", rating: 5, date: "2 days ago", comment: "The linen quality is divine! Breathable, beautifully cut, and delivered right to my doorstep in Lagos within 24 hours. Will definitely order more." },
    { id: 2, author: "Amina B.", location: "Maitama, Abuja", rating: 5, date: "1 week ago", comment: "Ordered via WhatsApp and the response was instant. Sizing guide was 100% accurate. Premium luxury craftsmanship." },
    { id: 3, author: "Femi O.", location: "GRA, Port Harcourt", rating: 5, date: "2 weeks ago", comment: "Exceptional fabric and fit. It feels so luxurious and light in our Nigerian climate." }
  ];

  return (
    <div className="min-h-screen bg-[#F2F0E9] flex flex-col font-sans text-[#5A5A40]">
      
      {/* Header */}
      <StorefrontHeader 
        searchQuery=""
        onSearchChange={() => {}}
        selectedCategory={product.category_slug}
        onSelectCategory={() => {}}
        cartCount={cartItems.reduce((a, b) => a + b.quantity, 0)}
        wishlistCount={wishlistItems.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full">
        
        {/* Breadcrumb Navigation */}
        <nav className="flex items-center gap-2 text-xs font-semibold text-sage/70 mb-8">
          <Link href="/" className="hover:text-sage flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Storefront Catalog
          </Link>
          <span>/</span>
          <Link href="/" className="hover:text-sage capitalize">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-sage font-bold truncate max-w-[200px]">{product.title}</span>
        </nav>

        {/* Product Details Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          
          {/* Gallery Section */}
          <div className="space-y-4">
            <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-sand/20 border border-sage/15 shadow-xl group">
              {/* Main Active Image */}
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img 
                src={product.product_images[activeImgIdx]?.image_url || product.product_images[0]?.image_url} 
                alt={product.title} 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />

              <span className="absolute top-6 left-6 px-4 py-1.5 bg-white/90 backdrop-blur text-sage text-xs font-bold rounded-full shadow-sm flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-terracotta" />
                {product.tag}
              </span>

              {/* Image Zoom Trigger Button */}
              <button
                onClick={() => setIsZoomOpen(true)}
                className="absolute bottom-6 right-6 p-3 bg-white/90 backdrop-blur text-sage rounded-full shadow-lg hover:bg-white transition-all hover:scale-110"
                title="Zoom image"
              >
                <ZoomIn className="w-5 h-5" />
              </button>

              <button
                onClick={() => handleToggleWishlist(product)}
                className={`absolute top-6 right-6 p-3 rounded-full backdrop-blur transition-all ${
                  isWishlisted ? 'bg-terracotta text-white shadow-md' : 'bg-white/80 text-sage hover:bg-white'
                }`}
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Gallery Thumbnails */}
            <div className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar">
              {product.product_images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImgIdx(idx)}
                  className={`w-20 h-24 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 relative ${
                    activeImgIdx === idx ? 'border-sage scale-95 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={img.image_url} alt="" className="w-full h-full object-cover" />
                  {img.color_tag && (
                    <span className="absolute bottom-1 left-1 right-1 bg-black/60 text-white text-[9px] font-bold px-1 rounded text-center truncate">
                      {img.color_tag}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Product Form & Specs Section */}
          <div className="bg-white/60 backdrop-blur border border-sage/15 rounded-3xl p-6 sm:p-10 space-y-8 shadow-xs">
            
            <div>
              {/* Stock Pulse & Category */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
                  </span>
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    In Stock • Ready for Doorstep Courier
                  </span>
                </div>

                <div className="flex items-center gap-1 text-amber-700 text-xs font-bold">
                  <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                  <span>{product.rating} ({product.review_count} Reviews)</span>
                </div>
              </div>

              <h1 className="serif text-4xl sm:text-5xl italic text-sage mb-3">{product.title}</h1>
              
              <div className="flex items-baseline gap-3">
                <p className="text-3xl font-bold text-sage">{formatNaira(product.base_price)}</p>
                <span className="text-xs text-sage/70 font-semibold">Taxes included • Free delivery on orders over ₦150,000</span>
              </div>
            </div>

            <p className="text-sage/80 leading-relaxed text-sm sm:text-base border-t border-b border-sage/10 py-4">
              {product.description}
            </p>

            {/* Color Swatch Selector */}
            <div>
              <span className="block text-xs font-semibold text-sage uppercase tracking-wider mb-3">
                Selected Color: <span className="font-bold text-sage">{selectedColor}</span>
              </span>
              <div className="flex gap-3">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => handleColorChange(c.name)}
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${
                      selectedColor === c.name ? 'border-sage scale-110 shadow-md ring-2 ring-sage/20' : 'border-sand hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  >
                    {selectedColor === c.name && (
                      <div className="w-2.5 h-2.5 rounded-full bg-white shadow-sm" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selector */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs font-semibold text-sage uppercase tracking-wider">
                  Select Size: <span className="font-bold text-sage">{selectedSize}</span>
                </span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-xs text-sage underline hover:opacity-80 flex items-center gap-1 font-medium"
                >
                  <Ruler className="w-4 h-4" /> Size Guide
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`px-5 py-3 text-xs font-bold rounded-2xl border transition-all ${
                      selectedSize === s
                        ? 'bg-sage text-white border-sage shadow-md'
                        : 'bg-white/80 text-sage border-sage/20 hover:border-sage/50'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector */}
            <div>
              <span className="block text-xs font-semibold text-sage uppercase tracking-wider mb-2">Quantity</span>
              <div className="flex items-center gap-4 bg-sand/30 border border-sage/20 rounded-2xl w-fit p-1.5">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-8 h-8 rounded-xl bg-white/80 text-sage font-bold flex items-center justify-center hover:bg-white"
                >-</button>
                <span className="font-bold text-sage text-sm w-6 text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-8 h-8 rounded-xl bg-white/80 text-sage font-bold flex items-center justify-center hover:bg-white"
                >+</button>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-sage/10">
              <button
                onClick={() => setIsWhatsAppOpen(true)}
                className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-semibold text-base flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Order Direct via WhatsApp</span>
              </button>

              <button
                onClick={() => handleAddToCart(product, selectedColor, selectedSize, quantity)}
                className="w-full py-4 bg-sage text-white rounded-2xl font-semibold text-sm flex items-center justify-center gap-2 hover:bg-sage/90 transition-colors shadow-lg shadow-sage/15"
              >
                <ShoppingBag className="w-4 h-4" /> Add to Shopping Bag
              </button>
            </div>

            {/* Accordions */}
            <div className="pt-6 border-t border-sage/10 space-y-3 text-sm text-sage">
              
              <div className="border-b border-sage/10 pb-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'materials' ? null : 'materials')}
                  className="w-full flex justify-between items-center py-2 font-semibold text-left"
                >
                  <span>Material & Artisanal Care</span>
                  {openAccordion === 'materials' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'materials' && (
                  <p className="text-xs text-sage/70 pt-2 leading-relaxed">
                    Crafted from {product.material}. Hand wash or gentle machine wash in cold water using neutral liquid soap. Hang dry in shade. Iron lightly on reverse side while slightly damp.
                  </p>
                )}
              </div>

              <div className="border-b border-sage/10 pb-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? null : 'shipping')}
                  className="w-full flex justify-between items-center py-2 font-semibold text-left"
                >
                  <span>Nationwide Delivery Timelines (Nigeria)</span>
                  {openAccordion === 'shipping' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'shipping' && (
                  <p className="text-xs text-sage/70 pt-2 leading-relaxed">
                    Same-day / 24-hour express courier delivery within Lagos (Island & Mainland). 1-2 business days to Abuja & Port Harcourt. Express 2-4 business days doorstep delivery across all 36 Nigerian states.
                  </p>
                )}
              </div>

              <div className="border-b border-sage/10 pb-3">
                <button
                  onClick={() => setOpenAccordion(openAccordion === 'returns' ? null : 'returns')}
                  className="w-full flex justify-between items-center py-2 font-semibold text-left"
                >
                  <span>7-Day Sizing Exchange & Guarantee</span>
                  {openAccordion === 'returns' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                </button>
                {openAccordion === 'returns' && (
                  <p className="text-xs text-sage/70 pt-2 leading-relaxed">
                    If the size is not a perfect fit, notify our WhatsApp Concierge within 7 days for a hassle-free exchange. Items must be unworn with original tags attached.
                  </p>
                )}
              </div>

            </div>

          </div>
        </div>

        {/* Customer Reviews Section */}
        <div className="mt-16 bg-white/50 backdrop-blur border border-sage/15 rounded-3xl p-8 sm:p-12">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8 border-b border-sage/10 pb-6">
            <div>
              <span className="text-xs font-semibold uppercase tracking-widest text-sage/60">Verified Feedback</span>
              <h2 className="serif text-3xl sm:text-4xl italic text-sage mt-1">Customer Reviews</h2>
            </div>
            
            <div className="flex items-center gap-4 bg-sand/40 p-4 rounded-2xl border border-sage/10">
              <div className="text-center">
                <span className="text-3xl font-bold text-sage">{product.rating}</span>
                <span className="text-xs text-sage/60 block">out of 5</span>
              </div>
              <div className="space-y-1">
                <div className="flex text-amber-500">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-xs font-semibold text-sage/80">{product.review_count} Verified Nigerian Buyers</p>
              </div>
            </div>
          </div>

          {/* Sample Review Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sampleReviews.map((rev) => (
              <div key={rev.id} className="bg-white/80 p-6 rounded-2xl border border-sage/10 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex text-amber-500">
                      {[...Array(rev.rating)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[10px] text-sage/50">{rev.date}</span>
                  </div>
                  <p className="text-xs text-sage/80 leading-relaxed italic mb-4">&ldquo;{rev.comment}&rdquo;</p>
                </div>

                <div className="pt-3 border-t border-sage/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-sage block">{rev.author}</span>
                    <span className="text-[10px] text-sage/60">{rev.location}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <Check className="w-3 h-3" /> Verified
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* You May Also Like Section */}
        {relatedProducts.length > 0 && (
          <div className="mt-20">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="text-xs font-semibold uppercase tracking-widest text-sage/60">Curated Pairing</span>
                <h2 className="serif text-4xl italic text-sage mt-1">You May Also Love</h2>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map((rel) => (
                <ProductCard
                  key={rel.id}
                  product={rel}
                  isWishlisted={false}
                  onToggleWishlist={() => {}}
                  onQuickView={() => {}}
                  onQuickAdd={() => {}}
                />
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Sticky Mobile CTA Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur border-t border-sage/15 z-20 flex items-center justify-between gap-4 shadow-xl">
        <div>
          <p className="text-xs text-sage/70">Total Price</p>
          <p className="serif text-2xl font-bold text-sage">{formatNaira(product.base_price * quantity)}</p>
        </div>
        <button
          onClick={() => setIsWhatsAppOpen(true)}
          className="px-6 py-3.5 bg-[#25D366] text-white rounded-2xl font-semibold text-sm flex items-center gap-2 shadow-lg shadow-[#25D366]/20"
        >
          <MessageCircle className="w-4 h-4 fill-current" />
          <span>Order via WhatsApp</span>
        </button>
      </div>

      {/* Zoom Modal Lightbox */}
      {isZoomOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in">
          <button 
            onClick={() => setIsZoomOpen(false)}
            className="absolute top-6 right-6 p-3 bg-white/20 text-white hover:bg-white/40 rounded-full transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative max-w-4xl max-h-[85vh] w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img 
              src={product.product_images[activeImgIdx]?.image_url || product.product_images[0]?.image_url} 
              alt={product.title} 
              className="w-full h-full object-contain rounded-2xl"
            />
          </div>
        </div>
      )}

      <SizeGuideModal 
        isOpen={isSizeGuideOpen} 
        onClose={() => setIsSizeGuideOpen(false)} 
        categoryName={product.category_name} 
      />

      <WhatsAppOrderModal 
        isOpen={isWhatsAppOpen}
        onClose={() => setIsWhatsAppOpen(false)}
        product={product}
        selectedColor={selectedColor}
        selectedSize={selectedSize}
        quantity={quantity}
      />

      <CartDrawer 
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={(id, qty) => setCartItems((prev) => prev.map((i) => i.id === id ? { ...i, quantity: qty } : i))}
        onRemoveItem={(id) => setCartItems((prev) => prev.filter((i) => i.id !== id))}
      />

      <WishlistDrawer 
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        items={wishlistItems}
        onRemoveWishlist={(id) => {
          const p = wishlistItems.find((w) => w.id === id);
          if (p) handleToggleWishlist(p);
        }}
        onMoveToCart={(p) => {
          handleAddToCart(p);
          handleToggleWishlist(p);
        }}
      />

    </div>
  );
}

