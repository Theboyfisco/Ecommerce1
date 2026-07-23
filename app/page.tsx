import { createClient } from '@/lib/supabase/server';
import { generateDummyProducts, dummyCategories, DummyProduct } from '@/lib/dummyData';
import { StorefrontCatalog } from '@/components/store/StorefrontCatalog';

export default async function HomePage() {
  let products: DummyProduct[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data: prods } = await supabase
        .from('products')
        .select(`
          id, title, slug, base_price, description,
          product_images(image_url, color_tag, display_order)
        `)
        .eq('is_active', true)
        .limit(150);

      if (prods && prods.length > 0) {
        products = prods.map((p: any, idx: number) => ({
          id: p.id || idx.toString(),
          title: p.title,
          slug: p.slug,
          base_price: Number(p.base_price) || 85,
          category_slug: 'clothing',
          category_name: 'Clothing',
          description: p.description || 'A beautifully crafted piece perfect for any occasion.',
          colors: [{ name: 'Sage', hex: '#5A5A40' }, { name: 'Sand', hex: '#E6E2D3' }],
          sizes: ['XS', 'S', 'M', 'L', 'XL'],
          product_images: p.product_images?.length > 0 ? p.product_images : [{ image_url: `https://picsum.photos/seed/${p.slug}/700/900`, display_order: 0 }],
          rating: 4.8,
          review_count: 24,
          tag: 'New' as const,
          material: '100% French Organic Linen',
        }));
      }
    }
  } catch (error) {
    // Fallback to static products
  }


  // Fallback to rich 150 dummy products
  if (products.length === 0) {
    products = generateDummyProducts(150);
  }

  return <StorefrontCatalog initialProducts={products} />;
}
