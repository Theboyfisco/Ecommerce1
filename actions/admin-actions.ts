'use server';

import { revalidateTag } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateSku } from '@/lib/sku';
import { ActionResponse } from '@/types';

export async function upsertCategory(
  categoryId: string | null,
  fields: { name: string; slug: string }
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = categoryId
    ? await supabase.from('categories').update(fields).eq('id', categoryId)
    : await supabase.from('categories').insert(fields);

  if (error) return { success: false, error: error.message };

  revalidateTag('categories');
  return { success: true };
}

export async function upsertSizeGuide(
  guideId: string | null,
  fields: { title: string; content: Record<string, unknown> }
): Promise<ActionResponse> {
  const supabase = await createClient();
  const { error } = guideId
    ? await supabase.from('size_guides').update(fields).eq('id', guideId)
    : await supabase.from('size_guides').insert(fields);

  if (error) return { success: false, error: error.message };

  revalidateTag('size-guides');
  return { success: true };
}

export async function upsertProduct(
  productId: string | null,
  fields: {
    category_id: string;
    size_guide_id?: string;
    title: string;
    slug: string;
    description: string;
    base_price: number;
    is_active: boolean;
  }
): Promise<ActionResponse<{ id: string }>> {
  const supabase = await createClient();

  const { data, error } = productId
    ? await supabase.from('products').update(fields).eq('id', productId).select('id').single()
    : await supabase.from('products').insert(fields).select('id').single();

  if (error) return { success: false, error: error.message };

  revalidateTag('products');
  revalidateTag('categories');
  if (productId) revalidateTag(`product-${productId}`);

  return { success: true, data: { id: data.id } };
}

export async function upsertVariant(
  variantId: string | null,
  productId: string,
  productSlug: string,
  fields: { size: string; color: string; stock_quantity: number; additional_price: number }
): Promise<ActionResponse> {
  const supabase = await createClient();

  const payload = variantId
    ? fields
    : { ...fields, product_id: productId, sku: generateSku(productSlug, fields.size, fields.color) };

  const { error } = variantId
    ? await supabase.from('product_variants').update(payload).eq('id', variantId)
    : await supabase.from('product_variants').insert(payload);

  if (error) return { success: false, error: error.message };

  revalidateTag('products');
  revalidateTag(`product-${productId}`);
  return { success: true };
}

export async function updateOrderStatus(
  orderId: string,
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed'
): Promise<ActionResponse> {
  const supabase = await createClient();

  const { error } = await supabase
    .from('orders')
    .update({ status })
    .eq('id', orderId);

  if (error) return { success: false, error: error.message };

  revalidateTag('orders');
  revalidateTag('products'); // Handles restoration invalidation if cancelled
  return { success: true };
}
