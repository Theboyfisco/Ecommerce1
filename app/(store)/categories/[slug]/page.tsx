import { generateDummyProducts, dummyCategories } from '@/lib/dummyData';
import { StorefrontCatalog } from '@/components/store/StorefrontCatalog';

export async function generateStaticParams() {
  return dummyCategories.map((c) => ({ slug: c.slug }));
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  
  const allProducts = generateDummyProducts(150);
  
  return <StorefrontCatalog initialProducts={allProducts} />;
}

