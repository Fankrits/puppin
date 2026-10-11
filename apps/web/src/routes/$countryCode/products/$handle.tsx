import { createFileRoute, notFound } from "@tanstack/react-router";
import { getProductByHandle } from "../../../lib/data/products";
import { formatPrice } from "../../../lib/utils/price";
import { useCart } from "../../../lib/context/cart";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { useState, useMemo } from "react";
import { ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/$countryCode/products/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    const product = await queryClient.ensureQueryData({
      queryKey: ["product", handle, countryCode],
      queryFn: () => getProductByHandle(handle),
    });

    if (!product) {
      throw notFound();
    }

    return {
      countryCode,
      product,
    };
  },
  component: ProductDetailPage,
});

function ProductDetailPage() {
  const { product } = Route.useLoaderData();
  const { addItem, isLoading: isCartLoading } = useCart();

  // Track selected options e.g. { "Color": "Black", "Size": "M" }
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    product.options?.forEach((opt) => {
      if (opt.title && opt.values?.[0]?.value) {
        initial[opt.title] = opt.values[0].value;
      }
    });
    return initial;
  });

  // Selected image index
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Find variant matching selected options
  const matchedVariant = useMemo(() => {
    if (!product.variants || product.variants.length === 0) return null;
    if (!product.options || product.options.length === 0) return product.variants[0];

    return (
      product.variants.find((v) => {
        // In Medusa v2, variant option values can be in v.options or v.title
        return Object.entries(selectedOptions).every(([optTitle, optVal]) => {
          const match = v.options?.some((o) => o.value === optVal || o.option?.title === optTitle);
          return match || v.title?.includes(optVal);
        });
      }) || product.variants[0]
    );
  }, [product.variants, product.options, selectedOptions]);

  const calculatedPrice = matchedVariant?.calculated_price?.calculated_amount;
  const originalPrice = matchedVariant?.calculated_price?.original_amount;
  const hasDiscount = originalPrice && calculatedPrice && originalPrice > calculatedPrice;
  const images =
    product.images && product.images.length > 0
      ? product.images
      : product.thumbnail
        ? [{ url: product.thumbnail }]
        : [];

  const handleAddToCart = async () => {
    if (!matchedVariant?.id) return;
    await addItem(matchedVariant.id, 1);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
        {/* Images Gallery */}
        <div className="space-y-4">
          <div className="aspect-square w-full overflow-hidden rounded-2xl bg-neutral-100 border border-neutral-200">
            {images[activeImageIndex]?.url ? (
              <img
                src={images[activeImageIndex].url}
                alt={product.title}
                className="h-full w-full object-cover object-center"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-neutral-400">
                No image available
              </div>
            )}
          </div>

          {images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-2">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg border-2 transition-all cursor-pointer ${
                    activeImageIndex === idx
                      ? "border-neutral-900 ring-2 ring-neutral-900/10"
                      : "border-neutral-200 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={img.url}
                    alt={`${product.title} thumbnail ${idx + 1}`}
                    className="h-full w-full object-cover object-center"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Details & Purchase Form */}
        <div className="flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            <div>
              {product.collection && (
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
                  {product.collection.title}
                </span>
              )}
              <h1 className="text-3xl font-bold tracking-tight text-neutral-900 sm:text-4xl mt-1">
                {product.title}
              </h1>
              {product.subtitle && (
                <p className="text-base text-neutral-600 mt-2">{product.subtitle}</p>
              )}
            </div>

            {/* Price section - CRITICAL: never divide by 100 */}
            <div className="flex items-baseline gap-3">
              {calculatedPrice !== undefined && calculatedPrice !== null ? (
                <>
                  <span className="text-2xl font-bold text-neutral-900">
                    {formatPrice(calculatedPrice)}
                  </span>
                  {hasDiscount && (
                    <>
                      <span className="text-base text-neutral-400 line-through">
                        {formatPrice(originalPrice)}
                      </span>
                      <Badge variant="error" size="sm">
                        Save {formatPrice(originalPrice - calculatedPrice)}
                      </Badge>
                    </>
                  )}
                </>
              ) : (
                <span className="text-sm text-neutral-500">Price unavailable</span>
              )}
            </div>

            {/* Product Options (Variants: Color, Size, etc.) */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-5 border-t border-b border-neutral-200 py-6">
                {product.options.map((option) => (
                  <div key={option.id} className="space-y-2.5">
                    <label className="text-xs font-semibold uppercase tracking-wider text-neutral-700">
                      {option.title}:{" "}
                      <span className="font-normal text-neutral-900">
                        {selectedOptions[option.title || ""]}
                      </span>
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {option.values?.map((val) => {
                        const isSelected = selectedOptions[option.title || ""] === val.value;
                        return (
                          <button
                            key={val.id}
                            type="button"
                            onClick={() => {
                              if (option.title) {
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.title!]: val.value || "",
                                }));
                              }
                            }}
                            className={`min-h-[44px] min-w-[44px] rounded-lg border px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
                              isSelected
                                ? "border-neutral-900 bg-neutral-900 text-white shadow-xs"
                                : "border-neutral-200 bg-white text-neutral-800 hover:border-neutral-300 hover:bg-neutral-50"
                            }`}
                          >
                            {val.value}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Description */}
            {product.description && (
              <div className="prose prose-sm text-neutral-600 leading-relaxed">
                <p>{product.description}</p>
              </div>
            )}
          </div>

          {/* Add to Cart CTA */}
          <div className="space-y-4 pt-6 border-t border-neutral-200">
            <Button
              size="xl"
              onClick={handleAddToCart}
              isLoading={isCartLoading}
              isDisabled={!matchedVariant}
              className="w-full text-base font-semibold"
            >
              <ShoppingBag className="h-5 w-5 mr-2" />
              Add to Cart
            </Button>

            {/* Trust Badges */}
            <div className="grid grid-cols-3 gap-2 pt-4 text-center text-xs text-neutral-500">
              <div className="flex flex-col items-center gap-1">
                <Truck className="h-4 w-4 text-neutral-400" />
                <span>Fast Worldwide Delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <RefreshCw className="h-4 w-4 text-neutral-400" />
                <span>30-Day Easy Returns</span>
              </div>
              <div className="flex flex-col items-center gap-1">
                <ShieldCheck className="h-4 w-4 text-neutral-400" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
