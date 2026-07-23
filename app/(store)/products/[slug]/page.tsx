import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { mapSupabaseProductToCatalogProduct } from '@/lib/catalog';
import { generateDummyProducts, DummyProduct } from '@/lib/dummyData';
import { getSiteUrl, isDemoCatalogEnabled } from '@/lib/site';
import { ProductDetailClient } from '@/components/store/ProductDetailClient';

export async function generateStaticParams() {
  return generateDummyProducts(150).map((p) => ({ slug: p.slug }));
}

async function getProductBySlug(slug: string): Promise<DummyProduct | undefined> {
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
    return generateDummyProducts(150).find((p) => p.slug === slug);
  }

  return undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: 'Product Not Found | Aurelia Apparel & Maison',
    };
  }

  const imageUrl = product.product_images[0]?.image_url;
  const productUrl = `${getSiteUrl()}/products/${product.slug}`;

  return {
    title: `${product.title} | Aurelia Apparel & Maison`,
    description: product.description,
    alternates: {
      canonical: productUrl,
    },
    openGraph: {
      title: product.title,
      description: product.description,
      url: productUrl,
      type: 'website',
      images: imageUrl ? [{ url: imageUrl, alt: product.title }] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  const allProducts = isDemoCatalogEnabled() ? generateDummyProducts(150) : [product];
  const related = allProducts
    .filter((p) => p.category_slug === product.category_slug && p.id !== product.id)
    .slice(0, 4);

  return <ProductDetailClient product={product} relatedProducts={related} />;
}
