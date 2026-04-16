"use client"
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus } from "lucide-react";
import { ShoppingCart01Icon } from "hugeicons-react";
import { toast } from "sonner";
import type { Product } from "@/lib/types";
import { ProductStatus } from "@/lib/types";
import { useAddToCart, useUpdateCartItem, useRemoveCartItem, useCart } from "@/lib/queries/cart";
import { Spinner } from "@/components/ui/spinner";

interface ProductCardProps {
  product: Product;
}

function getStockLabel(product: Product): string | undefined {
  if (product.status === ProductStatus.OUT_OF_STOCK) return "Out of stock";
  if (product.quantity <= 5) return `Only ${product.quantity} left`;
  return `${product.quantity} Available`;
}

function isValidImageSrc(src: string | undefined): src is string {
  if (!src) return false;
  try {
    // Accept absolute URLs and root-relative paths
    if (src.startsWith("/") || src.startsWith("http://") || src.startsWith("https://")) return true;
    new URL(src);
    return true;
  } catch {
    return false;
  }
}

export default function ProductCard({ product }: ProductCardProps) {
  const router = useRouter();
  const { mutate: addToCart, isPending: isAdding } = useAddToCart();
  const { mutate: updateItem, isPending: isUpdating } = useUpdateCartItem();
  const { mutate: removeItem, isPending: isRemoving } = useRemoveCartItem();
  const { data: cart } = useCart();

  const rawImage = product.images?.[0];
  const image = isValidImageSrc(rawImage) ? rawImage : undefined;
  const stock = getStockLabel(product);
  const outOfStock = product.status === ProductStatus.OUT_OF_STOCK;

  const cartItem = cart?.items?.find((i) => i.product._id === product._id);
  const inCart = !!cartItem;
  const isPending = isAdding || isUpdating || isRemoving;

  const handleAddToCart = () => {
    addToCart(
      { productId: product._id, quantity: 1 },
      { onError: () => toast.error("Failed to add to cart") }
    );
  };

  const handleIncrement = () => {
    updateItem(
      { productId: product._id, quantity: cartItem!.quantity + 1 },
      { onError: () => toast.error("Failed to update cart") }
    );
  };

  const handleDecrement = () => {
    if (cartItem!.quantity === 1) {
      removeItem(product._id, { onError: () => toast.error("Failed to update cart") });
    } else {
      updateItem(
        { productId: product._id, quantity: cartItem!.quantity - 1 },
        { onError: () => toast.error("Failed to update cart") }
      );
    }
  };

  const handleBuyNow = () => {
    if (inCart) {
      router.push("/cart");
      return;
    }
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () => router.push("/cart"),
        onError: () => toast.error("Failed to add to cart"),
      }
    );
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Image Container */}
      <Link href={`/store/${product._id}`} className="block">
      <div className="relative w-full aspect-236/244 overflow-hidden group bg-primary/5">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-primary/20 text-xs font-satoshi">
            No image
          </div>
        )}
      </div>
      </Link>

      <div className="flex flex-col gap-3">
        {/* Name and Add to Cart */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex flex-col">
            <h4 className="font-baloo font-medium text-primary text-sm leading-tight opacity-70">
              {product.name}
            </h4>
            <span className="font-baloo font-bold text-primary text-[17px]">
              £{product.price.toFixed(2)}
            </span>
          </div>

          {inCart ? (
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleDecrement}
                disabled={isPending}
                className="size-5.5 flex items-center justify-center rounded-sm bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isRemoving || (isUpdating && cartItem!.quantity === 1) ? (
                  <Spinner className="size-3" />
                ) : (
                  <Minus size={11} />
                )}
              </button>
              <span className="font-baloo font-bold text-primary text-sm w-5 text-center">
                {cartItem!.quantity}
              </span>
              <button
                onClick={handleIncrement}
                disabled={isPending}
                className="size-5.5 flex items-center justify-center rounded-sm bg-primary text-white hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                {isUpdating && cartItem!.quantity > 1 ? (
                  <Spinner className="size-3" />
                ) : (
                  <Plus size={11} />
                )}
              </button>
            </div>
          ) : (
            <button
              onClick={handleAddToCart}
              disabled={isAdding || outOfStock}
              className="px-2 h-5.5 bg-primary text-white rounded-sm flex items-center gap-2 hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAdding ? <Spinner className="size-3" /> : <ShoppingCart01Icon size={13} />}
              <span className="font-baloo text-sm font-medium whitespace-nowrap">
                Add to cart
              </span>
            </button>
          )}
        </div>

        {/* Stock Info */}
        {stock && (
          <p className="font-baloo font-medium text-[12px] text-[#A20505]">
            {stock}
          </p>
        )}

        {/* Buy Now Button */}
        <button
          onClick={handleBuyNow}
          disabled={isPending || outOfStock}
          className="w-full h-10.5 bg-primary text-[#FFEBEB] font-baloo font-medium text-base rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Buy Now
        </button>
      </div>
    </div>
  );
}
