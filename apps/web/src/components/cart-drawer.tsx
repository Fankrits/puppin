import { Drawer } from "./ui/drawer";
import { Button } from "./ui/button";
import { useCart } from "../lib/context/cart";
import { formatPrice } from "../lib/utils/price";
import { Trash2, ShoppingBag, Plus, Minus } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function CartDrawer({ countryCode }: { countryCode: string }) {
  const { cart, isDrawerOpen, closeDrawer, totalItems, updateItemQuantity, removeItem, isLoading } =
    useCart();

  const currencyCode = cart?.currency_code || "usd";

  return (
    <Drawer
      isOpen={isDrawerOpen}
      onOpenChange={(open) => !open && closeDrawer()}
      title="Shopping Cart"
      description={
        totalItems === 0
          ? "Your cart is currently empty"
          : `${totalItems} ${totalItems === 1 ? "item" : "items"}`
      }
    >
      {totalItems === 0 ? (
        <div className="flex h-full flex-col items-center justify-center text-center py-12">
          <div className="rounded-full bg-neutral-100 p-4 mb-4">
            <ShoppingBag className="h-8 w-8 text-neutral-400" />
          </div>
          <p className="text-base font-medium text-neutral-900">Your cart is empty</p>
          <p className="text-sm text-neutral-500 mt-1 max-w-xs mb-6">
            Looks like you haven't added anything to your cart yet. Explore our products to find
            something you love.
          </p>
          <Button variant="secondary" onClick={closeDrawer} className="w-full max-w-xs">
            Continue Shopping
          </Button>
        </div>
      ) : (
        <div className="flex h-full flex-col justify-between">
          <div className="divide-y divide-neutral-200 overflow-y-auto pr-1">
            {cart?.items?.map((item) => (
              <div key={item.id} className="py-4 flex gap-4">
                {item.thumbnail ? (
                  <img
                    src={item.thumbnail}
                    alt={item.title || "Product"}
                    className="h-20 w-20 flex-shrink-0 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                    loading="lazy"
                  />
                ) : (
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-neutral-100 flex items-center justify-center text-neutral-400 border border-neutral-200">
                    <ShoppingBag className="h-6 w-6" />
                  </div>
                )}

                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-neutral-900 line-clamp-1">
                        {item.title}
                      </h3>
                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="text-neutral-400 hover:text-red-500 p-1 cursor-pointer transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    {item.variant_title && (
                      <p className="text-xs text-neutral-500 mt-0.5">{item.variant_title}</p>
                    )}
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center rounded-lg border border-neutral-300">
                      <button
                        type="button"
                        onClick={() => {
                          if (item.quantity > 1) {
                            void updateItemQuantity(item.id, item.quantity - 1);
                          } else {
                            void removeItem(item.id);
                          }
                        }}
                        disabled={isLoading}
                        className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-50 cursor-pointer"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-2 text-xs font-semibold text-neutral-900 min-w-[20px] text-center">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          void updateItemQuantity(item.id, item.quantity + 1);
                        }}
                        disabled={isLoading}
                        className="p-1 text-neutral-500 hover:text-neutral-900 disabled:opacity-50 cursor-pointer"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-semibold text-neutral-900">
                        {formatPrice((item.unit_price || 0) * (item.quantity || 1), currencyCode)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-neutral-200 pt-4 mt-4 space-y-4">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-medium text-neutral-900">
                  {formatPrice(cart?.subtotal, currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Taxes & Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-neutral-100 pt-2 flex justify-between text-base font-semibold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(cart?.total || cart?.subtotal, currencyCode)}</span>
              </div>
            </div>

            <div className="space-y-2">
              <Link
                to="/$countryCode/checkout"
                params={{ countryCode }}
                onClick={closeDrawer}
                className="w-full block"
              >
                <Button className="w-full text-base py-3">Proceed to Checkout</Button>
              </Link>
              <Link
                to="/$countryCode/cart"
                params={{ countryCode }}
                onClick={closeDrawer}
                className="w-full block"
              >
                <Button variant="secondary" className="w-full text-sm">
                  View Full Cart
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </Drawer>
  );
}
