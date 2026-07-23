import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProductToCatalogProduct } from '@/lib/catalog';
import { generateDummyProducts, DummyProduct } from '@/lib/dummyData';
import { formatNaira } from '@/lib/currency';
import { isDemoCatalogEnabled } from '@/lib/site';

export const alt = 'Product Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

async function getProduct(slug: string): Promise<DummyProduct | undefined> {
  try {
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      const supabase = await createClient();
      const { data } = await supabase
        .from('products')
        .select(`
          id, category_id, size_guide_id, title, slug, base_price, description, is_active, created_at, updated_at,
          categories(id, name, slug, created_at),
          product_images(id, product_id, image_url, color_tag, display_order),
          product_variants(id, product_id, sku, size, color, stock_quantity, additional_price)
        `)
        .eq('is_active', true)
        .eq('slug', slug)
        .single();

      if (data) {
        return mapSupabaseProductToCatalogProduct(data);
      }
    }
  } catch {
    // Fall through to demo data when enabled.
  }

  if (isDemoCatalogEnabled()) {
    return generateDummyProducts(150).find((product) => product.slug === slug);
  }

  return undefined;
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#F2F0E9', color: '#5A5A40', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>Product Not Found</h1>
        </div>
      ),
      { ...size }
    );
  }

  const mainImage = product.product_images[0]?.image_url;

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#F2F0E9', color: '#5A5A40', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', width: '50%', height: '100%', padding: '40px' }}>
          {mainImage && (
            <img src={mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', padding: '40px' }}>
          <span style={{ fontSize: 24, textTransform: 'uppercase', letterSpacing: '2px', color: '#D4A373' }}>{product.category_name}</span>
          <h1 style={{ fontSize: 52, fontWeight: 'bold', margin: '16px 0' }}>{product.title}</h1>
          <p style={{ fontSize: 32, lineHeight: 1.3, color: '#5A5A40' }}>{product.material}</p>
          <p style={{ fontSize: 38, fontWeight: '600', color: '#33332A' }}>{formatNaira(product.base_price)}</p>
        </div>
      </div>
    ),
    { ...size }
  );
}
