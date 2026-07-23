import { SupabaseClient } from '@supabase/supabase-js';

export async function getCategoryProducts(supabase: SupabaseClient, categorySlug: string) {
  const { data, error } = await supabase
    .from('products')
    .select(`
      id, title, slug, base_price, is_active,
      product_images(image_url, display_order),
      categories!inner(slug),
      product_variants!inner(stock_quantity)
    `)
    .eq('categories.slug', categorySlug)
    .eq('is_active', true)
    .gt('product_variants.stock_quantity', 0);

  if (error) throw error;

  // Deduplicate products returned by inner join against multiple matching variants
  const seen = new Set<string>();
  return (data || []).filter((product) => (seen.has(product.id) ? false : seen.add(product.id)));
}
