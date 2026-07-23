export interface Category {
  id: string;
  name: string;
  slug: string;
  created_at: string;
}

export interface SizeGuide {
  id: string;
  title: string;
  content: {
    headers: string[];
    rows: string[][];
  };
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  color_tag: string | null;
  display_order: number;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  sku: string;
  size: string;
  color: string;
  stock_quantity: number;
  additional_price: number;
}

export interface Product {
  id: string;
  category_id: string | null;
  size_guide_id: string | null;
  title: string;
  slug: string;
  description: string | null;
  base_price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  product_images?: ProductImage[];
  product_variants?: ProductVariant[];
  categories?: Category;
  size_guides?: SizeGuide;
}

export interface Order {
  id: string;
  ref_code: string;
  product_id: string | null;
  variant_id: string | null;
  product_title: string;
  customer_name: string;
  customer_phone: string;
  delivery_region: string;
  size: string;
  color: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
}

export type ActionResponse<T = undefined> = {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
};
