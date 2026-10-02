import type { Product } from '@/lib/types'

// The only size labels the API accepts, in display order
export const ALLOWED_SIZES = [
  'S', 'M', 'L', 'XL', 'XXL',
  'MT', 'LT', 'XLT', '2XT', '3XT',
  '1X', '2X', '3X', '4X',
] as const

export function hasSizes(product: Pick<Product, 'sizes'>): boolean {
  return (product.sizes?.length ?? 0) > 0
}

// Stock available for a size: its own quantity when stock is tracked per size,
// otherwise the product's shared quantity.
export function getSizeStock(
  product: Pick<Product, 'sizes' | 'quantity'>,
  size?: string | null,
): number {
  const entry = size ? product.sizes?.find((s) => s.label === size) : undefined
  return typeof entry?.quantity === 'number' ? entry.quantity : product.quantity
}
