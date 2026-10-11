import { createFileRoute } from "@tanstack/react-router";
import { useCart } from "../../lib/context/cart";
import { formatPrice } from "../../lib/utils/price";
import { Button } from "../../components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";

export const Route = createFileRoute("/$countryCode/cart")({
  component: CartPage,
});

function CartPage() {
  const { countryCode } = Route.useParams();
  const { cart, totalItems, updateItemQuantity, removeItem, isLoading } = useCart();
  const currencyCode = cart?.currency_code || "usd";

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 mb-4">
          <ShoppingBag className="h-8 w-8 text-neutral-400" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Your cart is empty</h1>
        <p className="mt-2 text-sm text-neutral-500 max-w-sm mx-auto">
          Explore our collection and discover quality goods for your everyday life.
        </p>
        <div className="mt-6">
          <Link to="/$countryCode" params={{ countryCode }}>
            <Button size="lg">Explore Products</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mb-8">
        Shopping Cart ({totalItems})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Cart items list */}
        <div className="lg:col-span-8 divide-y divide-neutral-200 border-t border-b border-neutral-200">
          {cart?.items?.map((item) => (
            <div key={item.id} className="py-6 flex gap-6">
              {item.thumbnail ? (
                <img
                  src={item.thumbnail}
                  alt={item.title || "Product"}
                  className="h-28 w-28 flex-shrink-0 rounded-xl object-cover bg-neutral-100 border border-neutral-200"
                />
              ) : (
                <div className="h-28 w-28 flex-shrink-0 rounded-xl bg-neutral-100 flex items-center justify-center text-neutral-400">
                  <ShoppingBag className="h-8 w-8" />
                </div>
              )}

              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-base font-semibold text-neutral-900">{item.title}</h3>
                      {item.variant_title && (
                        <p className="text-xs text-neutral-500 mt-1">{item.variant_title}</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-neutral-400 hover:text-red-500 p-2 cursor-pointer transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4">
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
                      className="p-2 text-neutral-500 hover:text-neutral-900 disabled:opacity-50 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 text-sm font-semibold text-neutral-900 min-w-[24px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        void updateItemQuantity(item.id, item.quantity + 1);
                      }}
                      disabled={isLoading}
                      className="p-2 text-neutral-500 hover:text-neutral-900 disabled:opacity-50 cursor-pointer min-h-[36px] min-w-[36px] flex items-center justify-center"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>

                  <span className="text-base font-bold text-neutral-900">
                    {formatPrice((item.unit_price || 0) * (item.quantity || 1), currencyCode)}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-4">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900">Order Summary</h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(cart?.subtotal, currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Shipping</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Estimated Tax</span>
                <span>Calculated at checkout</span>
              </div>
              <div className="border-t border-neutral-200 pt-3 flex justify-between text-base font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(cart?.total || cart?.subtotal, currencyCode)}</span>
              </div>
            </div>

            <Link to="/$countryCode/checkout" params={{ countryCode }} className="block">
              <Button size="xl" className="w-full">
                Proceed to Checkout
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
