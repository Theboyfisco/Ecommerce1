import { dummyCategories, DummyProduct } from '@/lib/dummyData';
import { Category, Product } from '@/types';

const fallbackColors = [
  { name: 'Sage', hex: '#5A5A40' },
  { name: 'Sand', hex: '#E6E2D3' },
  { name: 'Terracotta', hex: '#D4A373' },
];

const fallbackSizes = ['XS', 'S', 'M', 'L', 'XL'];

const tagOptions: DummyProduct['tag'][] = ['New', 'Bestseller', 'Organic', 'Limited', 'Essential'];

type SupabaseProduct = Omit<Product, 'categories'> & {
  categories?: Category | Category[];
  material?: string | null;
  rating?: number | null;
  review_count?: number | null;
  tag?: DummyProduct['tag'] | null;
};

function categoryNameFromSlug(slug: string): string {
  return dummyCategories.find((category) => category.slug === slug)?.name || 'Clothing';
}

function getCategory(product: SupabaseProduct): Category | undefined {
  return Array.isArray(product.categories) ? product.categories[0] : product.categories;
}

function getCategorySlug(product: SupabaseProduct): string {
  return getCategory(product)?.slug || 'clothing';
}

function getColors(product: SupabaseProduct): DummyProduct['colors'] {
  const imageColorTags = product.product_images
    ?.map((image) => image.color_tag)
    .filter((color): color is string => Boolean(color));

  const variantColors = product.product_variants
    ?.map((variant) => variant.color)
    .filter(Boolean);

  const uniqueColorNames = Array.from(new Set([...(imageColorTags || []), ...(variantColors || [])]));

  if (uniqueColorNames.length === 0) {
    return fallbackColors;
  }

  return uniqueColorNames.map((name, index) => ({
    name,
    hex: fallbackColors[index % fallbackColors.length].hex,
  }));
}

function getSizes(product: SupabaseProduct): string[] {
  const sizes = product.product_variants?.map((variant) => variant.size).filter(Boolean) || [];
  const uniqueSizes = Array.from(new Set(sizes));

  return uniqueSizes.length > 0 ? uniqueSizes : fallbackSizes;
}

function getTag(product: SupabaseProduct): DummyProduct['tag'] {
  return product.tag && tagOptions.includes(product.tag) ? product.tag : 'New';
}

export function mapSupabaseProductToCatalogProduct(product: SupabaseProduct, index = 0): DummyProduct {
  const categorySlug = getCategorySlug(product);
  const images = product.product_images?.length
    ? [...product.product_images]
        .sort((a, b) => a.display_order - b.display_order)
        .map((image) => ({
          image_url: image.image_url,
          color_tag: image.color_tag || undefined,
          display_order: image.display_order,
        }))
    : [{ image_url: `https://picsum.photos/seed/${product.slug}/700/900`, display_order: 0 }];

  return {
    id: product.id || String(index),
    title: product.title,
    slug: product.slug,
    base_price: Number(product.base_price) || 0,
    category_slug: categorySlug,
    category_name: getCategory(product)?.name || categoryNameFromSlug(categorySlug),
    description: product.description || 'A beautifully crafted piece designed for everyday elegance.',
    colors: getColors(product),
    sizes: getSizes(product),
    product_images: images,
    rating: Number(product.rating) || 4.8,
    review_count: Number(product.review_count) || 24,
    tag: getTag(product),
    material: product.material || 'Organic natural fibers and artisanal finishing',
  };
}
