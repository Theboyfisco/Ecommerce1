import { generateDummyProducts, DummyProduct } from '@/lib/dummyData';
import { createClient } from '@/lib/supabase/server';
import { ProductDetailClient } from '@/components/store/ProductDetailClient';

export async function generateStaticParams() {
  const products = generateDummyProducts(150);
  return products.map((p) => ({ slug: p.slug }));
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const allProducts = generateDummyProducts(150);
  let product: DummyProduct | undefined = allProducts.find((p) => p.slug === slug);

  // Try DB lookup safely
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data } = await supabase
        .from('products')
        .select('*, product_images(image_url, color_tag, display_order)')
        .eq('slug', slug)
        .single();

      if (data) {
        product = {
          id: data.id,
          title: data.title,
          slug: data.slug,
          base_price: Number(data.base_price) || 95,
          category_slug: 'clothing',
          category_name: 'Clothing',
          description: data.description || 'Crafted with attention to detail in organic fabrics.',
          colors: [{ name: 'Sage', hex: '#5A5A40' }, { name: 'Sand', hex: '#E6E2D3' }, { name: 'Terracotta', hex: '#D4A373' }],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          product_images: data.product_images?.length > 0 ? data.product_images : [{ image_url: `https://picsum.photos/seed/${slug}/700/900`, display_order: 0 }],
          rating: 4.9,
          review_count: 38,
          tag: 'Bestseller',
          material: 'French Organic Linen & Soft Cotton',
        };
      }
    }
  } catch (e) {
    // Fallback to static dummy product if DB is unreachable or during static rendering
  }

  if (!product) {
    product = allProducts[0];
  }

  const related = allProducts
    .filter((p) => p.category_slug === product?.category_slug && p.id !== product?.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={related} />;
}

