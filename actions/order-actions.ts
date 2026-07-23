'use server';

import { createClient } from '@/lib/supabase/server';
import { ActionResponse } from '@/types';

interface CreateOrderPayload {
  productId: string;
  variantId: string;
  customerName: string;
  customerPhone: string;
  deliveryRegion: string;
  quantity: number;
}

interface OrderResult {
  orderId: string;
  refCode: string;
  whatsappUrl: string;
  fallbackUrl: string;
}

export async function processWhatsAppOrder(
  payload: CreateOrderPayload
): Promise<ActionResponse<OrderResult>> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc('create_whatsapp_order', {
    p_product_id: payload.productId,
    p_variant_id: payload.variantId,
    p_customer_name: payload.customerName,
    p_customer_phone: payload.customerPhone,
    p_delivery_region: payload.deliveryRegion,
    p_quantity: payload.quantity,
  });

  if (error || !data || !data.success) {
    return {
      success: false,
      error: data?.message || error?.message || 'Failed to place order due to insufficient stock.',
    };
  }

  const storePhone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || '';
  const message = `Hello, I placed an order!\n\nOrder Ref: ${data.ref_code}\nName: ${payload.customerName}\nTotal: $${data.total_price}\n\nPlease confirm availability!`;
  
  const encodedMsg = encodeURIComponent(message);
  const whatsappUrl = `https://wa.me/${storePhone}?text=${encodedMsg}`;
  const fallbackUrl = `https://api.whatsapp.com/send?phone=${storePhone}&text=${encodedMsg}`;

  return {
    success: true,
    data: {
      orderId: data.order_id,
      refCode: data.ref_code,
      whatsappUrl,
      fallbackUrl,
    },
  };
}
