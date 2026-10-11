import { sdk } from "../sdk";
import type { HttpTypes } from "@medusajs/types";

const CART_KEY = "medusa_cart_id";

export function getStoredCartId(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(CART_KEY);
}

export function setStoredCartId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(CART_KEY, id);
}

export function removeStoredCartId(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CART_KEY);
}

export async function getOrSetCart(regionId: string): Promise<HttpTypes.StoreCart | null> {
  let cartId = getStoredCartId();

  if (cartId) {
    try {
      const { cart } = await sdk.store.cart.retrieve(cartId, {
        fields: "*items,*items.variant,*shipping_methods,*payment_collection",
      });
      if (cart) {
        // If cart has different region, update it
        if (cart.region_id !== regionId) {
          const { cart: updatedCart } = await sdk.store.cart.update(cart.id, {
            region_id: regionId,
          });
          return updatedCart;
        }
        return cart;
      }
    } catch {
      // Cart might have expired or been deleted
      removeStoredCartId();
      cartId = null;
    }
  }

  try {
    const { cart } = await sdk.store.cart.create({
      region_id: regionId,
    });
    if (cart) {
      setStoredCartId(cart.id);
      return cart;
    }
  } catch (error) {
    console.error("Failed to create cart:", error);
  }

  return null;
}

export async function addToCart({
  cartId,
  variantId,
  quantity = 1,
}: {
  cartId: string;
  variantId: string;
  quantity?: number;
}): Promise<HttpTypes.StoreCart | null> {
  try {
    const { cart } = await sdk.store.cart.createLineItem(cartId, {
      variant_id: variantId,
      quantity,
    });
    return cart;
  } catch (error) {
    console.error("Failed to add line item to cart:", error);
    throw error;
  }
}

export async function updateLineItem({
  cartId,
  lineItemId,
  quantity,
}: {
  cartId: string;
  lineItemId: string;
  quantity: number;
}): Promise<HttpTypes.StoreCart | null> {
  try {
    const { cart } = await sdk.store.cart.updateLineItem(cartId, lineItemId, {
      quantity,
    });
    return cart;
  } catch (error) {
    console.error("Failed to update line item:", error);
    throw error;
  }
}

export async function removeLineItem({
  cartId,
  lineItemId,
}: {
  cartId: string;
  lineItemId: string;
}): Promise<HttpTypes.StoreCart | null> {
  try {
    const { parent: cart } = await sdk.store.cart.deleteLineItem(cartId, lineItemId);
    return cart || null;
  } catch (error) {
    console.error("Failed to delete line item:", error);
    throw error;
  }
}
