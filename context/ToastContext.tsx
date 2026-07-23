'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { Heart, ShoppingBag, X, CheckCircle2 } from 'lucide-react';

export interface Toast {
  id: string;
  title: string;
  message?: string;
  type?: 'success' | 'wishlist' | 'cart' | 'info';
  image?: string;
}

interface ToastContextType {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const showToast = useCallback(({ title, message, type = 'success', image }: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9);
    
    // Limit to max 4 toasts concurrently
    setToasts((prev) => [...prev.slice(-3), { id, title, message, type, image }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, removeToast }}>
      {children}
      {/* Toast Overlay Container */}
      <div 
        className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none px-4 sm:px-0"
        aria-live="polite"
        aria-atomic="true"
      >
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className="pointer-events-auto bg-white/95 backdrop-blur-md border border-sage/20 rounded-2xl p-4 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom-5 fade-in duration-300 transition-all"
          >
            <div className="flex items-center gap-3 min-w-0">
              {toast.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={toast.image} 
                  alt="" 
                  className="w-10 h-12 object-cover rounded-xl border border-sage/10 flex-shrink-0 bg-sand/20" 
                />
              ) : (
                <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                  toast.type === 'wishlist' ? 'bg-terracotta/15 text-terracotta' :
                  toast.type === 'cart' ? 'bg-sage/15 text-sage' :
                  'bg-emerald-100 text-emerald-800'
                }`}>
                  {toast.type === 'wishlist' && <Heart className="w-5 h-5 fill-current" />}
                  {toast.type === 'cart' && <ShoppingBag className="w-5 h-5" />}
                  {toast.type !== 'wishlist' && toast.type !== 'cart' && <CheckCircle2 className="w-5 h-5" />}
                </div>
              )}

              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-sage truncate">{toast.title}</p>
                {toast.message && <p className="text-[11px] text-sage/70 truncate mt-0.5">{toast.message}</p>}
              </div>
            </div>

            <button
              onClick={() => removeToast(toast.id)}
              className="text-sage/40 hover:text-sage p-1 rounded-lg transition-colors flex-shrink-0"
              aria-label="Dismiss notification"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
