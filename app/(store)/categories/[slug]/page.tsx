import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProductToCatalogProduct } from '@/lib/catalog';
import { generateDummyProducts, dummyCategories, DummyProduct } from '@/lib/dummyData';
import { isDemoCatalogEnabled } from '@/lib/site';
import { StorefrontCatalog } from '@/components/store/StorefrontCatalog';

export async function generateStaticParams() {
  return dummyCategories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let products: DummyProduct[] = [];

  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data: prods } = await supabase
        .from('products')
        .select(`
          id, category_id, size_guide_id, title, slug, base_price, description, is_active, created_at, updated_at,
          categories!inner(id, name, slug, created_at),
          product_images(id, product_id, image_url, color_tag, display_order),
          product_variants(id, product_id, sku, size, color, stock_quantity, additional_price)
        `)
        .eq('is_active', true)
        .eq('categories.slug', slug)
        .limit(150);

      if (prods && prods.length > 0) {
        products = prods.map((product, index) => mapSupabaseProductToCatalogProduct(product, index));
      }
    }
  } catch {
    // Fall through to demo data when enabled.
  }

  if (products.length === 0 && isDemoCatalogEnabled()) {
    products = generateDummyProducts(150).filter((product) => product.category_slug === slug);
  }

  return <StorefrontCatalog initialProducts={products} />;
}
