import type {Metadata} from 'next';
import { Inter, Cormorant_Garamond } from 'next/font/google';
import './globals.css'; // Global styles
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['300', '400', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurelia Apparel & Maison',
  description: 'Luxury Organic Linen, Silk & Artisanal Leather Storefront',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body suppressHydrationWarning className="antialiased min-h-screen bg-[#F2F0E9] text-[#5A5A40]">
        <ToastProvider>
          {children}
        </ToastProvider>
      </body>
    </html>
  );
}
