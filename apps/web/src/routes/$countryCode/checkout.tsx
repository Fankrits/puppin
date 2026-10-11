import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCart } from "../../lib/context/cart";
import { formatPrice } from "../../lib/utils/price";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { useState } from "react";
import { ShieldCheck, ArrowLeft, AlertCircle } from "lucide-react";
import type { HttpTypes } from "@medusajs/types";
import {
  updateCartAddresses,
  listCartShippingOptions,
  setCartShippingMethod,
  listPaymentProviders,
  initiatePaymentSession,
  completeCart,
} from "../../lib/data/checkout";

export const Route = createFileRoute("/$countryCode/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { countryCode } = Route.useParams();
  const navigate = useNavigate();
  const { cart, totalItems, setCartData, refreshCart } = useCart();
  const currencyCode = cart?.currency_code || "eur";

  const [step, setStep] = useState<"address" | "delivery" | "payment">("address");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Shipping & Payment backend state
  const [shippingOptions, setShippingOptions] = useState<HttpTypes.StoreCartShippingOption[]>([]);
  const [selectedShippingOptionId, setSelectedShippingOptionId] = useState<string | null>(null);
  const [paymentProviders, setPaymentProviders] = useState<HttpTypes.StorePaymentProvider[]>([]);
  const [selectedProviderId, setSelectedProviderId] = useState<string | null>(null);

  // Address form fields pre-filled from existing cart addresses
  const [formData, setFormData] = useState({
    email: cart?.email || "",
    firstName: cart?.shipping_address?.first_name || "",
    lastName: cart?.shipping_address?.last_name || "",
    address: cart?.shipping_address?.address_1 || "",
    city: cart?.shipping_address?.city || "",
    postalCode: cart?.shipping_address?.postal_code || "",
    country: (cart?.shipping_address?.country_code || countryCode).toUpperCase(),
    phone: cart?.shipping_address?.phone || "",
  });

  // Step 1: Submit Address to Medusa backend
  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.id) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedCart = await updateCartAddresses({
        cartId: cart.id,
        email: formData.email,
        shippingAddress: {
          first_name: formData.firstName,
          last_name: formData.lastName,
          address_1: formData.address,
          city: formData.city,
          postal_code: formData.postalCode,
          country_code: formData.country.toLowerCase(),
          phone: formData.phone || undefined,
        },
      });

      setCartData(updatedCart);

      // Fetch live shipping options from Medusa backend
      const options = await listCartShippingOptions(cart.id);
      setShippingOptions(options);

      // Pre-select existing or first option
      const existingSelected = updatedCart.shipping_methods?.[0]?.shipping_option_id;
      if (existingSelected) {
        setSelectedShippingOptionId(existingSelected);
      } else if (options.length > 0) {
        setSelectedShippingOptionId(options[0].id);
      }

      setStep("delivery");
    } catch (err: unknown) {
      console.error("Failed to save address:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to save address to cart");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 2: Select and save shipping method to Medusa backend
  const handleDeliverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cart?.id || !selectedShippingOptionId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const updatedCart = await setCartShippingMethod({
        cartId: cart.id,
        shippingOptionId: selectedShippingOptionId,
      });

      setCartData(updatedCart);

      // Fetch live payment providers from Medusa backend
      if (updatedCart.region_id) {
        const providers = await listPaymentProviders(updatedCart.region_id);
        setPaymentProviders(providers);
        if (providers.length > 0) {
          setSelectedProviderId(providers[0].id);
        }
      }

      setStep("payment");
    } catch (err: unknown) {
      console.error("Failed to select shipping method:", err);
      setErrorMessage(err instanceof Error ? err.message : "Failed to set shipping method");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Step 3: Initiate payment session & complete the order in Medusa
  const handleCompleteOrder = async () => {
    if (!cart?.id || !selectedProviderId) return;

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      // 1. Initialize payment session with selected provider
      await initiatePaymentSession({
        cart,
        providerId: selectedProviderId,
      });

      // 2. Complete cart and create real Medusa order
      const result = await completeCart(cart.id);

      if (result.order?.id) {
        await refreshCart();
        void navigate({
          to: "/$countryCode/order/$orderId/confirmed",
          params: {
            countryCode,
            orderId: result.order.id,
          },
        });
      } else if (result.error) {
        setErrorMessage(result.error);
      } else {
        setErrorMessage("Order creation failed. Please verify your details.");
      }
    } catch (err: unknown) {
      console.error("Failed to complete order:", err);
      setErrorMessage(err instanceof Error ? err.message : "Payment and order completion failed");
    } finally {
      setIsSubmitting(false);
    }
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

      {errorMessage && (
        <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3 text-sm text-red-700">
          <AlertCircle className="h-5 w-5 flex-shrink-0 text-red-500" />
          <span>{errorMessage}</span>
        </div>
      )}

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
                    placeholder="Copenhagen"
                    isRequired
                    value={formData.city}
                    onChange={(val) => setFormData((p) => ({ ...p, city: val }))}
                  />
                  <Input
                    label="Postal code"
                    placeholder="1000"
                    isRequired
                    value={formData.postalCode}
                    onChange={(val) => setFormData((p) => ({ ...p, postalCode: val }))}
                  />
                </div>
                <Button type="submit" size="lg" isLoading={isSubmitting} className="w-full mt-4">
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
                {shippingOptions.length === 0 ? (
                  <p className="text-sm text-neutral-500 py-2">
                    Loading shipping options from Medusa backend...
                  </p>
                ) : (
                  <div className="space-y-3">
                    {shippingOptions.map((opt) => (
                      <label
                        key={opt.id}
                        className={`flex items-center justify-between rounded-xl border p-4 cursor-pointer transition-all ${
                          selectedShippingOptionId === opt.id
                            ? "border-neutral-900 bg-neutral-50/80 shadow-xs"
                            : "border-neutral-200 hover:border-neutral-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="shipping-option"
                            value={opt.id}
                            checked={selectedShippingOptionId === opt.id}
                            onChange={() => setSelectedShippingOptionId(opt.id)}
                            className="h-4 w-4 text-neutral-900 focus:ring-neutral-900"
                          />
                          <div>
                            <span className="text-sm font-semibold text-neutral-900 block">
                              {opt.name}
                            </span>
                            {opt.type?.description && (
                              <span className="text-xs text-neutral-500">
                                {opt.type.description}
                              </span>
                            )}
                          </div>
                        </div>
                        <span className="text-sm font-bold text-neutral-900">
                          {formatPrice(
                            opt.calculated_price?.calculated_amount ?? opt.amount ?? 0,
                            currencyCode,
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                )}

                <Button
                  type="submit"
                  size="lg"
                  isLoading={isSubmitting}
                  isDisabled={!selectedShippingOptionId}
                  className="w-full mt-4"
                >
                  Continue to Payment
                </Button>
              </form>
            )}

            {step === "payment" && (
              <p className="text-xs text-neutral-600">
                {shippingOptions.find((o) => o.id === selectedShippingOptionId)?.name ||
                  "Selected shipping method"}
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
                <div className="space-y-3">
                  {paymentProviders.map((prov) => (
                    <label
                      key={prov.id}
                      className={`flex items-center gap-3 rounded-xl border p-4 cursor-pointer transition-all ${
                        selectedProviderId === prov.id
                          ? "border-neutral-900 bg-neutral-50/80 shadow-xs"
                          : "border-neutral-200 hover:border-neutral-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-provider"
                        value={prov.id}
                        checked={selectedProviderId === prov.id}
                        onChange={() => setSelectedProviderId(prov.id)}
                        className="h-4 w-4 text-neutral-900 focus:ring-neutral-900"
                      />
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="h-5 w-5 text-emerald-600" />
                        <div>
                          <span className="text-sm font-semibold text-neutral-900 block">
                            {prov.id === "pp_system_default"
                              ? "Standard Payment / Manual Provider"
                              : prov.id}
                          </span>
                          <span className="text-xs text-neutral-500">
                            Processed securely through Medusa payment engine
                          </span>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <Button
                  size="xl"
                  onClick={handleCompleteOrder}
                  isLoading={isSubmitting}
                  isDisabled={!selectedProviderId}
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
                <span className="font-semibold text-neutral-900">
                  {cart?.shipping_total
                    ? formatPrice(cart.shipping_total, currencyCode)
                    : "Calculated at next step"}
                </span>
              </div>
              {cart?.tax_total ? (
                <div className="flex justify-between text-neutral-600">
                  <span>Taxes</span>
                  <span className="font-semibold text-neutral-900">
                    {formatPrice(cart.tax_total, currencyCode)}
                  </span>
                </div>
              ) : null}
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
