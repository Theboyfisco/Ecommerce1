export interface DummyProductImage {
  image_url: string;
  color_tag?: string;
  display_order: number;
}

export interface DummyProduct {
  id: string;
  title: string;
  slug: string;
  base_price: number;
  category_slug: string;
  category_name: string;
  description: string;
  colors: { name: string; hex: string }[];
  sizes: string[];
  product_images: DummyProductImage[];
  rating: number;
  review_count: number;
  tag: 'New' | 'Bestseller' | 'Organic' | 'Limited' | 'Essential';
  material: string;
}

export const dummyCategories = [
  { id: 'c1', name: 'Clothing', slug: 'clothing', count: 45, desc: 'Tailored silhouettes and effortless organic linen pieces.' },
  { id: 'c2', name: 'Shoes', slug: 'shoes', count: 30, desc: 'Handcrafted leather loafers, mules, and sustainable sandals.' },
  { id: 'c3', name: 'Accessories', slug: 'accessories', count: 25, desc: 'Silk scarves, woven belts, and timeless minimalist jewelry.' },
  { id: 'c4', name: 'Outerwear', slug: 'outerwear', count: 25, desc: 'Draped wool coats, relaxed blazers, and textured layers.' },
  { id: 'c5', name: 'Bags', slug: 'bags', count: 25, desc: 'Structured totes, woven crossbody bags, and everyday carries.' },
];

const colorPalette = [
  { name: 'Sage', hex: '#5A5A40' },
  { name: 'Sand', hex: '#E6E2D3' },
  { name: 'Terracotta', hex: '#D4A373' },
  { name: 'Oatmeal', hex: '#D8D2C2' },
  { name: 'Olive', hex: '#4A5D4E' },
  { name: 'Charcoal', hex: '#33332A' },
  { name: 'Warm Cream', hex: '#F5F2EB' },
];

const clothingSizes = ['XS', 'S', 'M', 'L', 'XL'];
const shoeSizes = ['36', '37', '38', '39', '40', '41', '42'];
const accessorySizes = ['One Size'];

const tags: ('New' | 'Bestseller' | 'Organic' | 'Limited' | 'Essential')[] = [
  'New', 'Bestseller', 'Organic', 'Limited', 'Essential'
];

const adjectives = [
  "Linen", "Cotton", "Silk", "Woven", "Knit", "Denim", "Velvet", "Cashmere", 
  "Wool", "Hemp", "Organic", "Ribbed", "Pleated", "Embroidered", "Floral", 
  "Striped", "Solid", "Vintage", "Classic", "Modern", "Relaxed", "Tailored", 
  "Oversized", "Cropped", "Flowy", "Draped", "Textured", "Lightweight"
];

const categoryItemMap: Record<string, { nouns: string[]; sizes: string[]; material: string }> = {
  clothing: {
    nouns: ["Dress", "Blouse", "Shirt", "Trousers", "Pants", "Skirt", "Shorts", "Sweater", "Cardigan", "Jumpsuit", "Romper", "Tunic", "Kimono"],
    sizes: clothingSizes,
    material: "100% Organic French Linen & Soft Cotton",
  },
  shoes: {
    nouns: ["Sandals", "Boots", "Sneakers", "Loafers", "Mules", "Espadrilles", "Flats", "Slides"],
    sizes: shoeSizes,
    material: "Hand-finished Vegetable-Tanned Leather",
  },
  accessories: {
    nouns: ["Scarf", "Belt", "Hat", "Wrap", "Bandana", "Hairband", "Shawl"],
    sizes: accessorySizes,
    material: "Pure Mulberry Silk & Woven Straw",
  },
  outerwear: {
    nouns: ["Jacket", "Coat", "Blazer", "Vest", "Trench", "Parka", "Cape", "Duster"],
    sizes: clothingSizes,
    material: "Heavyweight Virgin Wool & Brushed Twill",
  },
  bags: {
    nouns: ["Tote", "Crossbody", "Clutch", "Satchel", "Carryall", "Pouch", "Bucket Bag"],
    sizes: accessorySizes,
    material: "Handwoven Artisanal Raffia & Canvas",
  },
};

export function generateDummyProducts(count: number = 150): DummyProduct[] {
  const catKeys = Object.keys(categoryItemMap);
  const products: DummyProduct[] = [];

  for (let i = 1; i <= count; i++) {
    const catSlug = catKeys[(i - 1) % catKeys.length];
    const categoryObj = dummyCategories.find(c => c.slug === catSlug)!;
    const catData = categoryItemMap[catSlug];
    
    const adj = adjectives[Math.floor((i * 7) % adjectives.length)];
    const noun = catData.nouns[Math.floor((i * 3) % catData.nouns.length)];
    const title = `${adj} ${noun}`;
    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`;
    const base_price = Math.round((25000 + ((i * 3850) % 195000)) / 500) * 500;

    // Pick 2-3 colors
    const startColorIdx = i % colorPalette.length;
    const selectedColors = [
      colorPalette[startColorIdx],
      colorPalette[(startColorIdx + 2) % colorPalette.length],
      colorPalette[(startColorIdx + 4) % colorPalette.length],
    ];

    // Seeded images
    const product_images: DummyProductImage[] = [
      {
        image_url: `https://picsum.photos/seed/${slug}-1/700/900`,
        color_tag: selectedColors[0].name,
        display_order: 0,
      },
      {
        image_url: `https://picsum.photos/seed/${slug}-2/700/900`,
        color_tag: selectedColors[1].name,
        display_order: 1,
      },
      {
        image_url: `https://picsum.photos/seed/${slug}-3/700/900`,
        color_tag: selectedColors[2].name,
        display_order: 2,
      },
    ];

    const rating = Number((4.3 + ((i % 7) * 0.1)).toFixed(1));
    const review_count = 12 + ((i * 13) % 88);
    const tag = tags[i % tags.length];

    products.push({
      id: i.toString(),
      title,
      slug,
      base_price,
      category_slug: catSlug,
      category_name: categoryObj.name,
      description: `The ${title} embodies effortless simplicity. Crafted from ${catData.material.toLowerCase()}, it offers a timeless relaxed silhouette designed for everyday elegance and longevity in your wardrobe.`,
      colors: selectedColors,
      sizes: catData.sizes,
      product_images,
      rating,
      review_count,
      tag,
      material: catData.material,
    });
  }

  return products;
}
