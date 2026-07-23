import { ImageResponse } from 'next/og';
import { createClient } from '@/lib/supabase/server';

// export const runtime = 'edge';
export const alt = 'Product Details';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from('products')
    .select(`
      title, base_price,
      product_images(image_url),
      product_variants(additional_price, stock_quantity)
    `)
    .eq('slug', slug)
    .single();

  if (!product) {
    return new ImageResponse(
      (
        <div style={{ display: 'flex', width: '100%', height: '100%', background: '#fff', alignItems: 'center', justifyContent: 'center' }}>
          <h1 style={{ fontSize: 48, fontWeight: 'bold' }}>Product Not Found</h1>
        </div>
      ),
      { ...size }
    );
  }

  const inStockVariants = product.product_variants?.filter((v: any) => v.stock_quantity > 0) || [];
  const minAdditional = inStockVariants.length > 0
    ? Math.min(...inStockVariants.map((v: any) => v.additional_price))
    : 0;

  const displayPrice = (Number(product.base_price) + minAdditional).toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });

  const mainImage = product.product_images?.[0]?.image_url;

  return new ImageResponse(
    (
      <div style={{ display: 'flex', width: '100%', height: '100%', background: '#ffffff', color: '#000000', fontFamily: 'sans-serif' }}>
        <div style={{ display: 'flex', width: '50%', height: '100%', padding: '40px' }}>
          {mainImage && (
            <img src={mainImage} alt={product.title} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '12px' }} />
          )}
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '50%', padding: '40px' }}>
          <span style={{ fontSize: 24, textTransform: 'uppercase', letterSpacing: '2px', color: '#666' }}>Fashion Store</span>
          <h1 style={{ fontSize: 52, fontWeight: 'bold', margin: '16px 0' }}>{product.title}</h1>
          <p style={{ fontSize: 36, fontWeight: '600', color: '#000' }}>{displayPrice}</p>
        </div>
      </div>
    ),
    { ...size }
  );
}
