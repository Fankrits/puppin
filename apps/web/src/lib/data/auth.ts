import { sdk } from "../sdk";
import type { HttpTypes } from "@medusajs/types";

export interface RegisterPayload {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

/**
 * Registers a new customer account using Medusa v2 Auth API.
 * 1. Calls sdk.auth.register("customer", "emailpass", { email, password })
 * 2. Creates the customer profile record via sdk.store.customer.create(...) with bearer token
 * 3. Logs in to store JWT in storage
 */
export async function registerCustomer(payload: RegisterPayload): Promise<HttpTypes.StoreCustomer> {
  const token = await sdk.auth.register("customer", "emailpass", {
    email: payload.email,
    password: payload.password,
  });

  if (typeof token !== "string") {
    throw new Error("Registration flow requires additional verification steps");
  }

  const { customer } = await sdk.store.customer.create(
    {
      email: payload.email,
      first_name: payload.firstName,
      last_name: payload.lastName,
      phone: payload.phone,
    },
    {},
    {
      Authorization: `Bearer ${token}`,
    },
  );

  // Authenticate customer in SDK session
  await sdk.auth.login("customer", "emailpass", {
    email: payload.email,
    password: payload.password,
  });

  return customer;
}

/**
 * Logs in a customer using email & password.
 */
export async function loginCustomer(payload: LoginPayload): Promise<HttpTypes.StoreCustomer> {
  const token = await sdk.auth.login("customer", "emailpass", {
    email: payload.email,
    password: payload.password,
  });

  if (typeof token !== "string") {
    throw new Error("Additional authentication steps required");
  }

  const { customer } = await sdk.store.customer.retrieve();
  return customer;
}

/**
 * Logs out the currently authenticated customer.
 */
export async function logoutCustomer(): Promise<void> {
  try {
    await sdk.auth.logout();
  } catch (error) {
    console.warn("Logout error:", error);
  }
}

/**
 * Fetches the currently authenticated customer profile.
 */
export async function getCurrentCustomer(): Promise<HttpTypes.StoreCustomer | null> {
  try {
    const { customer } = await sdk.store.customer.retrieve();
    return customer || null;
  } catch {
    return null;
  }
}

/**
 * Updates the current customer profile.
 */
export async function updateCustomerProfile(
  payload: Partial<HttpTypes.StoreUpdateCustomer>,
): Promise<HttpTypes.StoreCustomer> {
  const { customer } = await sdk.store.customer.update(payload);
  return customer;
}

/**
 * Lists the customer's placed orders.
 */
export async function listCustomerOrders(): Promise<HttpTypes.StoreOrder[]> {
  try {
    const { orders } = await sdk.store.order.list({
      fields: "*items,*shipping_address,*shipping_methods,*summary",
    });
    return orders || [];
  } catch (error) {
    console.error("Failed to list customer orders:", error);
    return [];
  }
}
