import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import type { HttpTypes } from "@medusajs/types";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getOrSetCart,
  addToCart as apiAddToCart,
  updateLineItem as apiUpdateLineItem,
  removeLineItem as apiRemoveLineItem,
  getStoredCartId,
} from "../data/cart";

interface CartContextType {
  cart: HttpTypes.StoreCart | null;
  cartId: string | null;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  totalItems: number;
  addItem: (variantId: string, quantity?: number) => Promise<void>;
  updateItemQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({
  regionId,
  children,
}: {
  regionId?: string;
  children: React.ReactNode;
}) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const queryClient = useQueryClient();
  const [storedCartId, setStoredCartId] = useState<string | null>(null);

  useEffect(() => {
    setStoredCartId(getStoredCartId());
  }, []);

  // Query to fetch/sync cart with Medusa backend
  const { data: cart = null, isLoading } = useQuery({
    queryKey: ["cart", regionId],
    queryFn: async () => {
      if (!regionId) return null;
      const c = await getOrSetCart(regionId);
      if (c?.id) setStoredCartId(c.id);
      return c;
    },
    enabled: Boolean(regionId),
    staleTime: 1000 * 60 * 2,
  });

  // Add line item mutation
  const addMutation = useMutation({
    mutationFn: async ({ variantId, quantity }: { variantId: string; quantity?: number }) => {
      let activeCart = cart;
      if (!activeCart && regionId) {
        activeCart = await getOrSetCart(regionId);
      }
      if (!activeCart) throw new Error("No cart available");

      return apiAddToCart({
        cartId: activeCart.id,
        variantId,
        quantity: quantity ?? 1,
      });
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", regionId], updatedCart);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
      setIsDrawerOpen(true);
    },
  });

  // Update line item mutation
  const updateMutation = useMutation({
    mutationFn: async ({ lineItemId, quantity }: { lineItemId: string; quantity: number }) => {
      if (!cart) throw new Error("No cart available");
      return apiUpdateLineItem({
        cartId: cart.id,
        lineItemId,
        quantity,
      });
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", regionId], updatedCart);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  // Remove line item mutation
  const removeMutation = useMutation({
    mutationFn: async ({ lineItemId }: { lineItemId: string }) => {
      if (!cart) throw new Error("No cart available");
      return apiRemoveLineItem({
        cartId: cart.id,
        lineItemId,
      });
    },
    onSuccess: (updatedCart) => {
      queryClient.setQueryData(["cart", regionId], updatedCart);
      void queryClient.invalidateQueries({ queryKey: ["cart"] });
    },
  });

  const totalItems = useMemo(() => {
    if (!cart?.items) return 0;
    return cart.items.reduce((acc, item) => acc + (item.quantity || 0), 0);
  }, [cart?.items]);

  const value = {
    cart,
    cartId: cart?.id || storedCartId,
    isLoading: isLoading || addMutation.isPending,
    isDrawerOpen,
    openDrawer: () => setIsDrawerOpen(true),
    closeDrawer: () => setIsDrawerOpen(false),
    totalItems,
    addItem: async (variantId: string, quantity = 1) => {
      await addMutation.mutateAsync({ variantId, quantity });
    },
    updateItemQuantity: async (lineItemId: string, quantity: number) => {
      await updateMutation.mutateAsync({ lineItemId, quantity });
    },
    removeItem: async (lineItemId: string) => {
      await removeMutation.mutateAsync({ lineItemId });
    },
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
