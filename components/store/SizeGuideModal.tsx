'use client';

import React, { useState } from 'react';
import { X, Ruler } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryName?: string;
}

export function SizeGuideModal({ isOpen, onClose, categoryName = 'Clothing' }: SizeGuideModalProps) {
  const [activeTab, setActiveTab] = useState<'clothing' | 'shoes'>('clothing');

  if (!isOpen) return null;

  const isShoe = categoryName.toLowerCase().includes('shoe') || categoryName.toLowerCase().includes('footwear');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="bg-[#F9F8F3] border border-sage/20 rounded-3xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scrollbar"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 rounded-full bg-sand/40 hover:bg-sand/80 text-sage transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-sage/10 text-sage rounded-2xl flex items-center justify-center">
            <Ruler className="w-5 h-5" />
          </div>
          <div>
            <h3 className="serif text-2xl italic text-sage">Aurelia Size Guide</h3>
            <p className="text-xs text-sage/70 font-medium">Standard International Conversions & Body Measurements</p>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex gap-2 p-1 bg-sand/30 rounded-2xl mb-6">
          <button
            onClick={() => setActiveTab('clothing')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'clothing' ? 'bg-sage text-white shadow' : 'text-sage/70 hover:text-sage'
            }`}
          >
            Apparel & Tops
          </button>
          <button
            onClick={() => setActiveTab('shoes')}
            className={`flex-1 py-2 text-sm font-semibold rounded-xl transition-all ${
              activeTab === 'shoes' ? 'bg-sage text-white shadow' : 'text-sage/70 hover:text-sage'
            }`}
          >
            Footwear
          </button>
        </div>

        {activeTab === 'clothing' ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-sage">
              <thead>
                <tr className="border-b border-sage/20 bg-sand/20">
                  <th className="py-3 px-4 font-semibold">Size</th>
                  <th className="py-3 px-4 font-semibold">Bust (cm)</th>
                  <th className="py-3 px-4 font-semibold">Waist (cm)</th>
                  <th className="py-3 px-4 font-semibold">Hips (cm)</th>
                  <th className="py-3 px-4 font-semibold">US / UK</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                <tr>
                  <td className="py-3 px-4 font-bold">XS</td>
                  <td className="py-3 px-4">80 - 84</td>
                  <td className="py-3 px-4">62 - 66</td>
                  <td className="py-3 px-4">88 - 92</td>
                  <td className="py-3 px-4">0-2 / 6</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">S</td>
                  <td className="py-3 px-4">85 - 89</td>
                  <td className="py-3 px-4">67 - 71</td>
                  <td className="py-3 px-4">93 - 97</td>
                  <td className="py-3 px-4">4-6 / 8-10</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">M</td>
                  <td className="py-3 px-4">90 - 94</td>
                  <td className="py-3 px-4">72 - 76</td>
                  <td className="py-3 px-4">98 - 102</td>
                  <td className="py-3 px-4">8-10 / 12</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">L</td>
                  <td className="py-3 px-4">95 - 100</td>
                  <td className="py-3 px-4">77 - 82</td>
                  <td className="py-3 px-4">103 - 108</td>
                  <td className="py-3 px-4">12 / 14</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-bold">XL</td>
                  <td className="py-3 px-4">101 - 107</td>
                  <td className="py-3 px-4">83 - 89</td>
                  <td className="py-3 px-4">109 - 115</td>
                  <td className="py-3 px-4">14-16 / 16</td>
                </tr>
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm text-sage">
              <thead>
                <tr className="border-b border-sage/20 bg-sand/20">
                  <th className="py-3 px-4 font-semibold">EU Size</th>
                  <th className="py-3 px-4 font-semibold">UK Size</th>
                  <th className="py-3 px-4 font-semibold">US Size</th>
                  <th className="py-3 px-4 font-semibold">Foot Length (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sage/10">
                <tr><td className="py-3 px-4 font-bold">36</td><td className="py-3 px-4">3</td><td className="py-3 px-4">5.5</td><td className="py-3 px-4">23.0</td></tr>
                <tr><td className="py-3 px-4 font-bold">37</td><td className="py-3 px-4">4</td><td className="py-3 px-4">6.5</td><td className="py-3 px-4">23.5</td></tr>
                <tr><td className="py-3 px-4 font-bold">38</td><td className="py-3 px-4">5</td><td className="py-3 px-4">7.5</td><td className="py-3 px-4">24.0</td></tr>
                <tr><td className="py-3 px-4 font-bold">39</td><td className="py-3 px-4">6</td><td className="py-3 px-4">8.5</td><td className="py-3 px-4">25.0</td></tr>
                <tr><td className="py-3 px-4 font-bold">40</td><td className="py-3 px-4">7</td><td className="py-3 px-4">9.5</td><td className="py-3 px-4">25.5</td></tr>
                <tr><td className="py-3 px-4 font-bold">41</td><td className="py-3 px-4">8</td><td className="py-3 px-4">10.5</td><td className="py-3 px-4">26.5</td></tr>
                <tr><td className="py-3 px-4 font-bold">42</td><td className="py-3 px-4">9</td><td className="py-3 px-4">11.5</td><td className="py-3 px-4">27.0</td></tr>
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 p-4 bg-sand/30 rounded-2xl flex items-start gap-3 text-xs text-sage/80">
          <span className="font-bold accent-sage">Tip:</span>
          <p>For oversized silhouettes or relaxed linen trousers, we recommend sticking to your true standard size. If between sizes for footwear, option for the larger size.</p>
        </div>
      </div>
    </div>
  );
}
