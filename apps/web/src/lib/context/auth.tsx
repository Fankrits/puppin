import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import type { HttpTypes } from "@medusajs/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getCurrentCustomer,
  loginCustomer as apiLoginCustomer,
  registerCustomer as apiRegisterCustomer,
  logoutCustomer as apiLogoutCustomer,
  type LoginPayload,
  type RegisterPayload,
} from "../data/auth";
import { sdk } from "../sdk";

interface AuthContextType {
  customer: HttpTypes.StoreCustomer | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (payload: LoginPayload) => Promise<HttpTypes.StoreCustomer>;
  register: (payload: RegisterPayload) => Promise<HttpTypes.StoreCustomer>;
  logout: () => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Query customer profile
  const { data: customer = null, isLoading } = useQuery({
    queryKey: ["customer"],
    queryFn: async () => {
      // Check if token exists in localStorage before requesting
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("medusa_auth_token");
        if (!token) return null;
      }
      return getCurrentCustomer();
    },
    enabled: isClient,
    staleTime: 1000 * 60 * 5,
    retry: false,
  });

  // Login mutation
  const loginMutation = useMutation({
    mutationFn: async (payload: LoginPayload) => {
      const cust = await apiLoginCustomer(payload);
      return cust;
    },
    onSuccess: async (cust) => {
      queryClient.setQueryData(["customer"], cust);
      // Transfer active guest cart to logged in customer if cart exists
      try {
        const cartId =
          typeof window !== "undefined" ? localStorage.getItem("medusa_cart_id") : null;
        if (cartId) {
          await sdk.store.cart.transferCart(cartId);
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      } catch (err) {
        console.warn("Cart transfer note:", err);
      }
      await queryClient.invalidateQueries({ queryKey: ["customer"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });

  // Register mutation
  const registerMutation = useMutation({
    mutationFn: async (payload: RegisterPayload) => {
      const cust = await apiRegisterCustomer(payload);
      return cust;
    },
    onSuccess: async (cust) => {
      queryClient.setQueryData(["customer"], cust);
      try {
        const cartId =
          typeof window !== "undefined" ? localStorage.getItem("medusa_cart_id") : null;
        if (cartId) {
          await sdk.store.cart.transferCart(cartId);
          await queryClient.invalidateQueries({ queryKey: ["cart"] });
        }
      } catch (err) {
        console.warn("Cart transfer note:", err);
      }
      await queryClient.invalidateQueries({ queryKey: ["customer"] });
      await queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      await apiLogoutCustomer();
      if (typeof window !== "undefined") {
        localStorage.removeItem("medusa_auth_token");
      }
    },
    onSuccess: () => {
      queryClient.setQueryData(["customer"], null);
      void queryClient.invalidateQueries({ queryKey: ["customer"] });
      void queryClient.invalidateQueries({ queryKey: ["customer-orders"] });
    },
  });

  const refreshCustomer = useCallback(async () => {
    await queryClient.invalidateQueries({ queryKey: ["customer"] });
  }, [queryClient]);

  const value = {
    customer,
    isAuthenticated: Boolean(customer),
    isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
    login: async (payload: LoginPayload) => {
      return await loginMutation.mutateAsync(payload);
    },
    register: async (payload: RegisterPayload) => {
      return await registerMutation.mutateAsync(payload);
    },
    logout: async () => {
      await logoutMutation.mutateAsync();
    },
    refreshCustomer,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
