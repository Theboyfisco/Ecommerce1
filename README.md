# Aurelia Apparel & Maison — Nigerian E-Commerce Storefront

**Aurelia** is a luxury, organic e-commerce storefront designed for the Nigerian market, featuring **150+ natural linen, silk, and artisanal leather products**, real-time search and filtering, Naira (₦) pricing, and direct **WhatsApp Concierge Checkout** optimized for nationwide delivery.

---

## 🌟 Key Features

### 🔍 Real-Time Search & Instant Filtering
- **Interactive Search Bar**: Search across 150+ items by product title, description, category, or fabric (e.g. *French Organic Linen*, *Silk*, *Kaftan*, *Leather*).
- **Match Highlighting**: Search terms are dynamically highlighted in product titles on product cards.
- **Quick-Search Chips**: One-tap filter chips for popular keywords (*Linen*, *Silk*, *Kaftan*, *Footwear*, *Bestseller*, *Organic*, *Leather*).
- **Multi-faceted Filtering**: Filter by category, vibe tags (*New*, *Bestseller*, *Organic*, *Limited*, *Essential*), and price range slider (₦20,000 – ₦250,000).
- **Sorting Options**: Sort by Featured, Price (Low to High / High to Low), Highest Rating, or Alphabetical order.

### 🛍️ Nigerian Naira (₦) & WhatsApp Commerce Engine
- **Naira Currency Formatting**: All product pricing, bag subtotals, and quick-add calculations are formatted in Nigerian Naira (`₦`).
- **Direct WhatsApp Order Modal**: Pre-fills item reference code, selected color, size, quantity, customer details, and delivery region across Nigerian states (Lagos Island, Lagos Mainland, Abuja FCT, Port Harcourt, Enugu, Kano, etc.) into an instant WhatsApp message payload.
- **Multi-Item Bag Checkout**: Allows customers to assemble a bag with multiple items and send a consolidated order summary directly to the WhatsApp Concierge.

### 🎨 Visual Craftsmanship & Interactive UI
- **Product Cards**: Feature hover image zoom, quick view modal overlay, color swatches with overflow counter, rating badges, and one-tap quick-add to shopping bag with feedback.
- **Product Detail Page (`/products/[slug]`)**:
  - Image gallery with thumbnail selection and **full-screen lightbox zoom modal**.
  - Real-time stock status indicator (*In Stock • Ready for Doorstep Courier*).
  - Interactive color swatch selector and size picker linked with a modal Size Guide.
  - Expandable accordions for Material & Artisanal Care, Nationwide Delivery Timelines, and 7-Day Exchange Policy.
  - Verified customer reviews from buyers in Lagos, Abuja, and Port Harcourt.
  - "You May Also Love" curated product pairings.
- **Drawer Overlays**:
  - **Saved Favorites (Wishlist Drawer)**: Add/remove items with one-click "Move to Bag".
  - **Shopping Bag Drawer**: Adjust item quantities, view estimated delivery timelines, and launch single or multi-item WhatsApp checkout.

---

## 🏗️ Architecture & Tech Stack

- **Framework**: Next.js 15 (App Router with TypeScript)
- **Styling**: Tailwind CSS v4 with an organic, warm neutral aesthetic (`#F2F0E9` canvas, `#5A5A40` sage green accents, `#D4A373` terracotta highlights)
- **Icons**: Lucide React
- **Animations & Interactivity**: Client-side React hooks for modal states, search filtering, and responsive drawers
- **Data Layer**: Hybrid approach using Supabase client integration with fallback to a rich 150-product generator (`lib/dummyData.ts`)

---

## 📁 Directory Overview

```
├── app/
│   ├── layout.tsx                # Root layout with Playfair Display & Plus Jakarta Sans typography
│   ├── page.tsx                  # Home page displaying catalog with initial SSR product fetching
│   └── (store)/
│       ├── products/[slug]/      # Dynamic product detail page
│       └── categories/[slug]/    # Dynamic category view page
├── components/
│   └── store/
│       ├── StorefrontCatalog.tsx # Primary catalog feed with search bar, filters & grid
│       ├── StorefrontHeader.tsx  # Sticky header with logo, search, bag & wishlist triggers
│       ├── ProductCard.tsx       # Individual product card with hover zoom & search highlight
│       ├── ProductDetailClient.tsx # Interactive product detail page with gallery & lightbox
│       ├── CartDrawer.tsx        # Shopping bag slide-over drawer
│       ├── WishlistDrawer.tsx    # Saved items slide-over drawer
│       ├── QuickViewModal.tsx    # Fast preview modal for catalog items
│       ├── WhatsAppOrderModal.tsx# Nigerian delivery region selector & WhatsApp generator
│       └── SizeGuideModal.tsx    # Sizing conversion chart modal
├── lib/
│   ├── currency.ts               # Naira (₦) formatting utility (`formatNaira`)
│   ├── dummyData.ts              # 150-product generator & category metadata
│   └── supabase/                 # Supabase server & client initializers
└── public/                       # Static public assets
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Installation

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env.local` file at the root:
   ```env
   NEXT_PUBLIC_WHATSAPP_NUMBER=2348000000000
   ```

3. **Run Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build & Production**:
   ```bash
   npm run build
   npm start
   ```

---

## 🇳🇬 Nigerian Regional Delivery Options
The application includes presets for doorstep courier dispatch across Nigeria:
- **Lagos Island** (Victoria Island, Lekki, Ikoyi)
- **Lagos Mainland** (Ikeja, Yaba, Surulere)
- **Abuja FCT** (Central Area, Wuse, Maitama)
- **Port Harcourt** (GRA, Aba Road)
- **Ibadan & Oyo State**
- **Kano & Northern States**
- **Enugu, Asaba & Eastern States**
- **Nationwide Doorstep Courier**

---

## 📄 License

Crafted for Aurelia Apparel & Maison. All rights reserved.
