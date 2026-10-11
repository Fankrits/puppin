import { sdk } from "../sdk";
import type { HttpTypes } from "@medusajs/types";
import { getStoredCartId, removeStoredCartId } from "./cart";

export interface AddressPayload {
  first_name: string;
  last_name: string;
  address_1: string;
  address_2?: string;
  company?: string;
  postal_code: string;
  city: string;
  country_code: string;
  province?: string;
  phone?: string;
}

/**
 * Updates cart addresses and email on the Medusa backend.
 */
export async function updateCartAddresses({
  cartId,
  email,
  shippingAddress,
  billingAddress,
}: {
  cartId: string;
  email: string;
  shippingAddress: AddressPayload;
  billingAddress?: AddressPayload;
}): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.update(cartId, {
    email,
    shipping_address: shippingAddress,
    billing_address: billingAddress || shippingAddress,
  });
  return cart;
}

/**
 * Retrieves available shipping options for a cart.
 */
export async function listCartShippingOptions(
  cartId: string,
): Promise<HttpTypes.StoreCartShippingOption[]> {
  try {
    const { shipping_options } = await sdk.store.fulfillment.listCartOptions({
      cart_id: cartId,
    });
    return shipping_options || [];
  } catch (error) {
    console.error("Failed to list shipping options:", error);
    return [];
  }
}

/**
 * Selects and sets a shipping method on the cart.
 */
export async function setCartShippingMethod({
  cartId,
  shippingOptionId,
  data,
}: {
  cartId: string;
  shippingOptionId: string;
  data?: Record<string, unknown>;
}): Promise<HttpTypes.StoreCart> {
  const { cart } = await sdk.store.cart.addShippingMethod(cartId, {
    option_id: shippingOptionId,
    data,
  });
  return cart;
}

/**
 * Lists available payment providers for a given region.
 */
export async function listPaymentProviders(
  regionId: string,
): Promise<HttpTypes.StorePaymentProvider[]> {
  try {
    const { payment_providers } = await sdk.store.payment.listPaymentProviders({
      region_id: regionId,
    });
    return payment_providers || [];
  } catch (error) {
    console.error("Failed to list payment providers:", error);
    return [];
  }
}

/**
 * Initiates a payment session on the cart.
 */
export async function initiatePaymentSession({
  cart,
  providerId,
  data,
}: {
  cart: HttpTypes.StoreCart;
  providerId: string;
  data?: Record<string, unknown>;
}): Promise<HttpTypes.StorePaymentCollection> {
  const { payment_collection } = await sdk.store.payment.initiatePaymentSession(cart, {
    provider_id: providerId,
    data,
  });
  return payment_collection;
}

/**
 * Completes the cart in Medusa, placing a real order.
 */
export async function completeCart(
  cartId?: string,
): Promise<{ order?: HttpTypes.StoreOrder; cart?: HttpTypes.StoreCart; error?: string }> {
  const activeCartId = cartId || getStoredCartId();
  if (!activeCartId) {
    throw new Error("No cart available to complete");
  }

  try {
    const response = await sdk.store.cart.complete(activeCartId, {});

    if (response.type === "order") {
      removeStoredCartId();
      return { order: response.order };
    } else if (response.type === "cart") {
      return { cart: response.cart, error: response.error?.message };
    }

    return { error: "Unknown completion status" };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error("Error completing cart:", msg);
    throw err;
  }
}

/**
 * Retrieves a placed order by ID for the confirmation page.
 */
export async function getOrder(orderId: string): Promise<HttpTypes.StoreOrder | null> {
  try {
    const { order } = await sdk.store.order.retrieve(orderId, {
      fields: "*items,*items.variant,*shipping_address,*shipping_methods,*summary",
    });
    return order || null;
  } catch (error) {
    console.error(`Failed to retrieve order ${orderId}:`, error);
    return null;
  }
}
