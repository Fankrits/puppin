import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "../../lib/context/cart";
import { formatPrice } from "../../lib/utils/price";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { ShieldCheck, ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countryCode/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { countryCode } = Route.useParams();
  const navigate = useNavigate();
  const { cart, totalItems } = useCart();
  const currencyCode = cart?.currency_code || "usd";

  const [step, setStep] = useState<"address" | "delivery" | "payment">("address");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    country: countryCode.toUpperCase(),
  });

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("delivery");
  };

  const handleDeliverySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("payment");
  };

  const handleCompleteOrder = async () => {
    setIsSubmitting(true);
    // In demo / starter flow, proceed to confirmation
    setTimeout(() => {
      setIsSubmitting(false);
      void navigate({
        to: "/$countryCode/order/$orderId/confirmed",
        params: {
          countryCode,
          orderId: cart?.id ? `ord_${cart.id.slice(-6)}` : "ord_demo123",
        },
      });
    }, 1200);
  };

  if (totalItems === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <h2 className="text-2xl font-bold text-neutral-900">Your cart is empty</h2>
        <p className="mt-2 text-sm text-neutral-500">Add some items before checking out.</p>
        <Link to="/$countryCode" params={{ countryCode }} className="mt-6 inline-block">
          <Button>Return to Shop</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="mb-8">
        <Link
          to="/$countryCode/cart"
          params={{ countryCode }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to cart
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900 mt-2">Checkout</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Checkout Steps Form */}
        <div className="lg:col-span-7 space-y-8">
          {/* Step 1: Address */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                  1
                </span>
                Shipping Address
              </h2>
              {step !== "address" && (
                <button
                  type="button"
                  onClick={() => setStep("address")}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {step === "address" ? (
              <form onSubmit={handleAddressSubmit} className="space-y-4">
                <Input
                  label="Email address"
                  placeholder="you@example.com"
                  type="email"
                  isRequired
                  value={formData.email}
                  onChange={(val) => setFormData((p) => ({ ...p, email: val }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="First name"
                    placeholder="John"
                    isRequired
                    value={formData.firstName}
                    onChange={(val) => setFormData((p) => ({ ...p, firstName: val }))}
                  />
                  <Input
                    label="Last name"
                    placeholder="Doe"
                    isRequired
                    value={formData.lastName}
                    onChange={(val) => setFormData((p) => ({ ...p, lastName: val }))}
                  />
                </div>
                <Input
                  label="Address"
                  placeholder="123 Main St"
                  isRequired
                  value={formData.address}
                  onChange={(val) => setFormData((p) => ({ ...p, address: val }))}
                />
                <div className="grid grid-cols-2 gap-4">
                  <Input
                    label="City"
                    placeholder="San Francisco"
                    isRequired
                    value={formData.city}
                    onChange={(val) => setFormData((p) => ({ ...p, city: val }))}
                  />
                  <Input
                    label="Postal code"
                    placeholder="94101"
                    isRequired
                    value={formData.postalCode}
                    onChange={(val) => setFormData((p) => ({ ...p, postalCode: val }))}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full mt-4">
                  Continue to Delivery
                </Button>
              </form>
            ) : (
              <div className="text-xs text-neutral-600 space-y-1">
                <p className="font-semibold text-neutral-900">
                  {formData.firstName} {formData.lastName} ({formData.email})
                </p>
                <p>{formData.address}</p>
                <p>
                  {formData.city}, {formData.postalCode}, {formData.country}
                </p>
              </div>
            )}
          </div>

          {/* Step 2: Delivery */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                  2
                </span>
                Delivery Method
              </h2>
              {step === "payment" && (
                <button
                  type="button"
                  onClick={() => setStep("delivery")}
                  className="text-xs font-medium text-neutral-600 hover:text-neutral-900 underline cursor-pointer"
                >
                  Edit
                </button>
              )}
            </div>

            {step === "delivery" && (
              <form onSubmit={handleDeliverySubmit} className="space-y-4">
                <div className="rounded-xl border border-neutral-300 p-4 flex items-center justify-between bg-neutral-50/50">
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      id="standard-shipping"
                      defaultChecked
                      className="h-4 w-4 text-neutral-900 focus:ring-neutral-900"
                    />
                    <label
                      htmlFor="standard-shipping"
                      className="text-sm font-medium text-neutral-900"
                    >
                      Standard Delivery (3-5 business days)
                    </label>
                  </div>
                  <span className="text-sm font-semibold text-neutral-900">Free</span>
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === "payment" && (
              <p className="text-xs text-neutral-600">
                Standard Delivery (3-5 business days) — Free
              </p>
            )}
          </div>

          {/* Step 3: Payment */}
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2 border-b border-neutral-100 pb-4">
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-neutral-900 text-xs font-semibold text-white">
                3
              </span>
              Payment & Place Order
            </h2>

            {step === "payment" && (
              <div className="space-y-6">
                <div className="rounded-xl border border-neutral-200 p-4 bg-neutral-50 space-y-2">
                  <div className="flex items-center gap-2 text-sm font-semibold text-neutral-900">
                    <ShieldCheck className="h-5 w-5 text-emerald-600" />
                    Medusa Mock Payment Provider (Test Mode)
                  </div>
                  <p className="text-xs text-neutral-500">
                    Your payment details are simulated securely in this environment.
                  </p>
                </div>

                <Button
                  size="xl"
                  onClick={handleCompleteOrder}
                  isLoading={isSubmitting}
                  className="w-full text-base font-semibold"
                >
                  Complete Order ({formatPrice(cart?.total || cart?.subtotal, currencyCode)})
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Order Items Preview */}
        <div className="lg:col-span-5">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6 sticky top-24">
            <h3 className="text-lg font-bold text-neutral-900">Order Summary ({totalItems})</h3>

            <div className="divide-y divide-neutral-100 max-h-80 overflow-y-auto">
              {cart?.items?.map((item) => (
                <div key={item.id} className="py-3 flex items-center gap-3">
                  {item.thumbnail && (
                    <img
                      src={item.thumbnail}
                      alt={item.title || "Product"}
                      className="h-14 w-14 rounded-lg object-cover bg-neutral-100 border border-neutral-200"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-semibold text-neutral-900 truncate">
                      {item.title}
                    </h4>
                    <p className="text-[11px] text-neutral-500">Qty: {item.quantity}</p>
                  </div>
                  <span className="text-xs font-bold text-neutral-900">
                    {formatPrice((item.unit_price || 0) * (item.quantity || 1), currencyCode)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-neutral-200 pt-4 space-y-2 text-sm">
              <div className="flex justify-between text-neutral-600">
                <span>Subtotal</span>
                <span className="font-semibold text-neutral-900">
                  {formatPrice(cart?.subtotal, currencyCode)}
                </span>
              </div>
              <div className="flex justify-between text-neutral-600">
                <span>Shipping</span>
                <span className="font-semibold text-emerald-600">Free</span>
              </div>
              <div className="border-t border-neutral-100 pt-2 flex justify-between text-base font-bold text-neutral-900">
                <span>Total</span>
                <span>{formatPrice(cart?.total || cart?.subtotal, currencyCode)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
