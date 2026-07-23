'use client';

import React, { useState } from 'react';
import { X, MessageCircle, Phone, CheckCircle, ShieldCheck, Truck } from 'lucide-react';
import { DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';

interface WhatsAppOrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: DummyProduct;
  selectedColor?: string;
  selectedSize?: string;
  quantity?: number;
}

export function WhatsAppOrderModal({
  isOpen,
  onClose,
  product,
  selectedColor,
  selectedSize,
  quantity = 1,
}: WhatsAppOrderModalProps) {
  const [customerName, setCustomerName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('Lagos Island (Victoria Island, Lekki, Ikoyi)');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [refCode] = useState(() => `ORD-${Math.floor(1000 + Math.random() * 9000)}`);

  if (!isOpen) return null;
  const color = selectedColor || product.colors[0]?.name || 'Natural';
  const size = selectedSize || product.sizes[0] || 'Standard';
  const totalPrice = Number((product.base_price * quantity).toFixed(2));

  const handleWhatsAppCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !phone) return;

    const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '2348000000000';
    const textPayload = 
      `*NEW AURELIA NIGERIA ORDER* 🛍️\n` +
      `-----------------------------------\n` +
      `*Ref:* ${refCode}\n` +
      `*Item:* ${product.title}\n` +
      `*Color:* ${color}\n` +
      `*Size:* ${size}\n` +
      `*Quantity:* ${quantity}\n` +
      `*Total Price:* ${formatNaira(totalPrice)}\n` +
      `-----------------------------------\n` +
      `*Customer:* ${customerName}\n` +
      `*Phone:* ${phone}\n` +
      `*Delivery Region:* ${region}\n` +
      (notes ? `*Notes:* ${notes}\n` : '') +
      `-----------------------------------\n` +
      `Hello Aurelia team, please confirm item availability and send account transfer details for nationwide delivery!`;

    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(textPayload)}`;
    window.open(waUrl, '_blank');
    setSubmitted(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#F9F8F3] border border-sage/20 rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative max-h-[92vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-sand/40 hover:bg-sand/80 text-sage transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {!submitted ? (
          <>
            <div className="mb-6">
              <span className="px-3 py-1 bg-sage/10 text-sage rounded-full text-xs font-semibold uppercase tracking-wider">
                Instant Order via WhatsApp
              </span>
              <h3 className="serif text-3xl italic text-sage mt-2">Complete Your Request</h3>
              <p className="text-xs text-sage/70">Connect directly with our boutique assistant for instant order dispatch.</p>
            </div>

            {/* Product Summary Box */}
            <div className="bg-sand/30 border border-sage/10 rounded-2xl p-4 mb-6 flex gap-4 items-center">
              <div className="w-16 h-20 bg-sand/50 rounded-xl overflow-hidden relative flex-shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={product.product_images[0]?.image_url} 
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="serif text-lg text-sage truncate">{product.title}</h4>
                <div className="flex flex-wrap gap-2 text-xs text-sage/70 mt-1">
                  <span className="bg-white/60 px-2 py-0.5 rounded-md">Color: {color}</span>
                  <span className="bg-white/60 px-2 py-0.5 rounded-md">Size: {size}</span>
                  <span className="bg-white/60 px-2 py-0.5 rounded-md">Qty: {quantity}</span>
                </div>
                <p className="text-sm font-semibold text-sage mt-2">{formatNaira(totalPrice)}</p>
              </div>
            </div>

            {/* Order Form */}
            <form onSubmit={handleWhatsAppCheckout} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-sage uppercase tracking-wider mb-1">Full Name *</label>
                <input 
                  type="text" 
                  required
                  placeholder="e.g. Chioma Adebayo"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-sage/20 text-sage placeholder:text-sage/40 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage uppercase tracking-wider mb-1">Phone Number (WhatsApp) *</label>
                <input 
                  type="tel" 
                  required
                  placeholder="0803 000 0000 / +234..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-sage/20 text-sage placeholder:text-sage/40 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage uppercase tracking-wider mb-1">Delivery Region (Nigeria)</label>
                <select 
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-sage/20 text-sage text-sm focus:outline-none focus:ring-2 focus:ring-sage/40"
                >
                  <option value="Lagos Island (Victoria Island, Lekki, Ikoyi)">Lagos Island (VI, Lekki, Ikoyi)</option>
                  <option value="Lagos Mainland (Ikeja, Yaba, Surulere)">Lagos Mainland (Ikeja, Yaba, Surulere)</option>
                  <option value="Abuja FCT (Central, Wuse, Gwarinpa, Maitama)">Abuja FCT (Central, Wuse, Maitama)</option>
                  <option value="Port Harcourt (GRA, Aba Road)">Port Harcourt (GRA, Aba Road)</option>
                  <option value="Ibadan & Oyo State">Ibadan & Oyo State</option>
                  <option value="Kano & Northern States">Kano & Northern States</option>
                  <option value="Enugu, Asaba & Eastern States">Enugu, Asaba & Eastern States</option>
                  <option value="Other Nigerian State (Doorstep Courier)">Other Nigerian State (Doorstep Courier)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-sage uppercase tracking-wider mb-1">Special Instructions (Optional)</label>
                <textarea 
                  rows={2}
                  placeholder="e.g. Gift wrapping requested, deliver before 3 PM"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/80 border border-sage/20 text-sage placeholder:text-sage/40 text-sm focus:outline-none focus:ring-2 focus:ring-sage/40 resize-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-4 bg-[#25D366] text-white rounded-2xl font-medium flex items-center justify-center gap-3 hover:bg-[#20bd5a] transition-colors shadow-lg shadow-[#25D366]/20"
                >
                  <MessageCircle className="w-5 h-5 fill-current" />
                  <span className="text-base font-semibold">Send Order via WhatsApp</span>
                </button>
              </div>
            </form>

            <div className="mt-4 pt-4 border-t border-sage/10 flex items-center justify-between text-xs text-sage/70">
              <span className="flex items-center gap-1"><ShieldCheck className="w-4 h-4 text-sage" /> Direct Concierge</span>
              <span className="flex items-center gap-1"><Truck className="w-4 h-4 text-sage" /> Same-Day Dispatch</span>
            </div>
          </>
        ) : (
          <div className="text-center py-8 space-y-4">
            <div className="w-16 h-16 bg-sage/10 text-sage rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="w-10 h-10" />
            </div>
            <h3 className="serif text-3xl italic text-sage">WhatsApp Chat Opened</h3>
            <p className="text-sm text-sage/80 max-w-sm mx-auto">
              Your order details have been formatted and passed to WhatsApp. Please hit send in the chat to complete your request!
            </p>
            <div className="p-4 bg-sand/30 rounded-2xl text-xs text-sage/70 font-mono">
              Reference: {refCode}
            </div>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-sage text-white rounded-full text-sm font-medium hover:bg-sage/90 transition-colors"
            >
              Back to Store
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
