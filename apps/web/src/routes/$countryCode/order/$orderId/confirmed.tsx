import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../../components/ui/button";
import { CheckCircle2, ArrowRight, ShoppingBag } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { removeStoredCartId } from "../../../../lib/data/cart";
import { getOrder } from "../../../../lib/data/checkout";
import { formatPrice } from "../../../../lib/utils/price";

export const Route = createFileRoute("/$countryCode/order/$orderId/confirmed")({
  loader: async ({ params, context }) => {
    const { orderId } = params;
    const { queryClient } = context;

    const order = await queryClient.ensureQueryData({
      queryKey: ["order", orderId],
      queryFn: () => getOrder(orderId),
    });

    return {
      order,
    };
  },
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const { countryCode, orderId } = Route.useParams();
  const { order } = Route.useLoaderData();

  // Clear stored cart on confirmed order
  useEffect(() => {
    removeStoredCartId();
  }, []);

  const currencyCode = order?.currency_code || "eur";

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8 space-y-8">
      <div className="text-center space-y-3">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <CheckCircle2 className="h-10 w-10" />
        </div>
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600 block">
          Order Confirmed
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="text-base text-neutral-600 max-w-md mx-auto">
          We have received your order and are processing it. An email confirmation has been sent to{" "}
          <span className="font-semibold text-neutral-900">{order?.email || "your address"}</span>.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs max-w-lg mx-auto text-left space-y-5">
        <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-3">
          <span className="text-neutral-500">Order ID</span>
          <span className="font-mono font-bold text-neutral-900 text-xs sm:text-sm">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-3">
          <span className="text-neutral-500">Status</span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            {order?.status ? order.status.toUpperCase() : "CONFIRMED"}
          </span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-3">
          <span className="text-neutral-500">Shipping To</span>
          <span className="font-medium text-neutral-900 text-right">
            {order?.shipping_address
              ? `${order.shipping_address.first_name || ""} ${order.shipping_address.last_name || ""}, ${order.shipping_address.city || ""}`
              : "Standard Delivery"}
          </span>
        </div>

        {/* Order Items */}
        {order?.items && order.items.length > 0 && (
          <div className="border-b border-neutral-100 pb-3 space-y-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
              Items Ordered
            </span>
            <div className="divide-y divide-neutral-100">
              {order.items.map((item) => (
                <div key={item.id} className="py-2 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    {item.thumbnail ? (
                      <img
                        src={item.thumbnail}
                        alt={item.title || "Product"}
                        className="h-10 w-10 rounded-md object-cover border border-neutral-200"
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-md bg-neutral-100 flex items-center justify-center text-neutral-400">
                        <ShoppingBag className="h-4 w-4" />
                      </div>
                    )}
                    <div>
                      <span className="font-medium text-neutral-900 block truncate max-w-[200px]">
                        {item.title}
                      </span>
                      <span className="text-neutral-500">Qty: {item.quantity}</span>
                    </div>
                  </div>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice((item.unit_price || 0) * (item.quantity || 1), currencyCode)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="flex justify-between items-center text-base font-bold text-neutral-900 pt-1">
          <span>Total Paid</span>
          <span>{formatPrice(order?.total, currencyCode)}</span>
        </div>
      </div>

      <div className="text-center pt-2">
        <Link to="/$countryCode" params={{ countryCode }}>
          <Button size="lg" className="min-w-[220px]">
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
