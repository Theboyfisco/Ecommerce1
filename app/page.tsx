import { createClient } from '@/lib/supabase/server';
import { generateDummyProducts, DummyProduct } from '@/lib/dummyData';
import { StorefrontCatalog } from '@/components/store/StorefrontCatalog';

export default async function HomePage() {
  let products: DummyProduct[] = [];
  const hasSupabaseConfig = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  try {
    if (hasSupabaseConfig) {
      const supabase = await createClient();
      const { data: prods } = await supabase
        .from('products')
        .select(`
          id, category_id, size_guide_id, title, slug, base_price, description, is_active, created_at, updated_at,
          categories(id, name, slug, created_at),
          product_images(id, product_id, image_url, color_tag, display_order),
          product_variants(id, product_id, sku, size, color, stock_quantity, additional_price)
        `)
        .eq('is_active', true)
        .limit(150);

      if (prods && prods.length > 0) {
        products = prods.map((product, index) => mapSupabaseProductToCatalogProduct(product, index));
      }
    }
  } catch {
    // Fall through to the explicit demo catalog fallback when database access is unavailable.
  }

  if (products.length === 0 && isDemoCatalogEnabled()) {
    products = generateDummyProducts(150);
  }

  return <StorefrontCatalog initialProducts={products} />;
}
