'use client';

import React, { useState } from 'react';
import { X, Trash2, ShoppingBag, ArrowRight, MessageCircle } from 'lucide-react';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';

export interface CartItem {
  id: string;
  product: DummyProduct;
  color: string;
  size: string;
  quantity: number;
}

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  onUpdateQuantity: (id: string, qty: number) => void;
  onRemoveItem: (id: string) => void;
}

export function CartDrawer({
  isOpen,
  onClose,
  items,
  onUpdateQuantity,
  onRemoveItem,
}: CartDrawerProps) {
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  if (!isOpen) return null;

  const subtotal = items.reduce((acc, item) => acc + item.product.base_price * item.quantity, 0);

  const handleCheckout = () => {
    if (items.length === 0) return;
    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
    
    let text = `*NEW MULTI-ITEM AURELIA BAG ORDER* 🛍️\n-----------------------------------\n`;
    items.forEach((item, idx) => {
      text += `${idx + 1}. *${item.product.title}*\n   Color: ${item.color} | Size: ${item.size} | Qty: ${item.quantity}\n   Price: ${formatNaira(item.product.base_price * item.quantity)}\n`;
    });
    text += `-----------------------------------\n*Subtotal:* ${formatNaira(subtotal)}\n`;
    if (customerName) text += `*Name:* ${customerName}\n`;
    if (customerPhone) text += `*Phone:* ${customerPhone}\n`;
    text += `-----------------------------------\nPlease confirm availability & delivery timeline across Nigeria!`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
        <div className="w-screen max-w-md bg-[#F9F8F3] border-l border-sage/20 p-6 flex flex-col justify-between shadow-2xl relative">
          
          {/* Header */}
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-sage/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 bg-sage/10 rounded-xl flex items-center justify-center text-sage">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="serif text-2xl italic text-sage">Shopping Bag</h3>
                  <p className="text-xs text-sage/70 font-medium">{items.length} {items.length === 1 ? 'item' : 'items'} selected</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 rounded-full bg-sand/40 hover:bg-sand text-sage transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items List */}
            {items.length === 0 ? (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-sand/40 text-sage/40 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <p className="serif text-2xl italic text-sage mb-2">Your Bag is Empty</p>
                <p className="text-xs text-sage/70 max-w-xs mx-auto mb-6">Explore our latest organic linen and handcrafted pieces to curate your wardrobe.</p>
                <button onClick={onClose} className="px-6 py-3 bg-sage text-white rounded-full text-xs font-semibold hover:bg-sage/90">
                  Explore Collection
                </button>
              </div>
            ) : (
              <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-1 custom-scrollbar">
                {items.map((item) => (
                  <div key={item.id} className="bg-sand/30 border border-sage/10 rounded-2xl p-4 flex gap-4 items-center relative group">
                    <div className="w-16 h-20 bg-sand/50 rounded-xl overflow-hidden relative flex-shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img 
                        src={item.product.product_images[0]?.image_url} 
                        alt={item.product.title} 
                        className="w-full h-full object-cover" 
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start">
                        <h4 className="serif text-lg text-sage truncate">{item.product.title}</h4>
                        <button 
                          onClick={() => onRemoveItem(item.id)} 
                          className="text-sage/40 hover:text-red-600 transition-colors p-1"
                          title="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-sage/70 mt-0.5">Color: {item.color} | Size: {item.size}</p>
                      
                      <div className="flex justify-between items-center mt-3">
                        <div className="flex items-center gap-2 bg-white/80 border border-sage/20 rounded-lg px-2 py-1">
                          <button 
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="text-sage text-xs font-bold w-4 h-4 flex items-center justify-center hover:bg-sand/50 rounded"
                          >-</button>
                          <span className="text-xs font-semibold text-sage w-4 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="text-sage text-xs font-bold w-4 h-4 flex items-center justify-center hover:bg-sand/50 rounded"
                          >+</button>
                        </div>
                        <span className="text-sm font-semibold text-sage">{formatNaira(item.product.base_price * item.quantity)}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer Checkout */}
          {items.length > 0 && (
            <div className="pt-4 border-t border-sage/10 space-y-4">
              <div className="space-y-2">
                <input 
                  type="text" 
                  placeholder="Your Name (Optional)" 
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/80 border border-sage/20 text-sage focus:outline-none"
                />
                <input 
                  type="tel" 
                  placeholder="WhatsApp Number (Optional)" 
                  value={customerPhone}
                  onChange={(e) => setCustomerPhone(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl bg-white/80 border border-sage/20 text-sage focus:outline-none"
                />
              </div>

              <div className="space-y-2 text-sm text-sage">
                <div className="flex justify-between">
                  <span className="opacity-70">Subtotal</span>
                  <span className="font-semibold">{formatNaira(subtotal)}</span>
                </div>
                <div className="flex justify-between text-xs text-sage/70">
                  <span>Estimated Delivery</span>
                  <span>Calculated via Concierge</span>
                </div>
              </div>

              <button
                onClick={handleCheckout}
                className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-semibold flex items-center justify-center gap-2 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-5 h-5 fill-current" />
                <span>Checkout Bag via WhatsApp</span>
              </button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
