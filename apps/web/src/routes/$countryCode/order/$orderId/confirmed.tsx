import { createFileRoute } from "@tanstack/react-router";
import { Button } from "../../../../components/ui/button";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { removeStoredCartId } from "../../../../lib/data/cart";

export const Route = createFileRoute("/$countryCode/order/$orderId/confirmed")({
  component: OrderConfirmedPage,
});

function OrderConfirmedPage() {
  const { countryCode, orderId } = Route.useParams();

  // Clear stored cart on confirmed order
  useEffect(() => {
    removeStoredCartId();
  }, []);

  return (
    <div className="mx-auto max-w-3xl px-4 py-24 sm:px-6 lg:px-8 text-center space-y-8">
      <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
        <CheckCircle2 className="h-10 w-10" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600">
          Payment Successful
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
          Thank you for your order!
        </h1>
        <p className="text-base text-neutral-600 max-w-md mx-auto">
          We have received your order and are processing it. An email confirmation has been sent to
          your address.
        </p>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs max-w-md mx-auto text-left space-y-4">
        <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-3">
          <span className="text-neutral-500">Order Number</span>
          <span className="font-mono font-bold text-neutral-900">{orderId}</span>
        </div>
        <div className="flex justify-between items-center text-sm border-b border-neutral-100 pb-3">
          <span className="text-neutral-500">Status</span>
          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
            Confirmed
          </span>
        </div>
        <div className="flex justify-between items-center text-sm">
          <span className="text-neutral-500">Estimated Delivery</span>
          <span className="font-medium text-neutral-900">3-5 Business Days</span>
        </div>
      </div>

      <div className="pt-4">
        <Link to="/$countryCode" params={{ countryCode }}>
          <Button size="lg" className="min-w-[200px]">
            Continue Shopping
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
