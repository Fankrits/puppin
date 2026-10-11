import { Link } from "@tanstack/react-router";
import type { HttpTypes } from "@medusajs/types";
import { formatPrice } from "../lib/utils/price";
import { Badge } from "./ui/badge";

export function ProductCard({
  product,
  countryCode,
  currencyCode = "usd",
}: {
  product: HttpTypes.StoreProduct;
  countryCode: string;
  currencyCode?: string;
}) {
  // Extract cheapest or first variant price
  const variant = product.variants?.[0];
  const calculatedPrice = variant?.calculated_price?.calculated_amount;
  const originalPrice = variant?.calculated_price?.original_amount;
  const hasDiscount = originalPrice && calculatedPrice && originalPrice > calculatedPrice;

  return (
    <Link
      to="/$countryCode/products/$handle"
      params={{ countryCode, handle: product.handle }}
      className="group flex flex-col rounded-xl overflow-hidden bg-white border border-neutral-200/80 hover:border-neutral-300 hover:shadow-md transition-all duration-200"
    >
      {/* Product Image */}
      <div className="relative aspect-square w-full overflow-hidden bg-neutral-100">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title || "Product Image"}
            loading="lazy"
            className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300 ease-out"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-400 text-sm">
            No image available
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-2.5 left-2.5">
            <Badge variant="error" size="sm">
              Sale
            </Badge>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col p-4 justify-between">
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 group-hover:text-neutral-700 transition-colors line-clamp-1">
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="text-xs text-neutral-500 mt-0.5 line-clamp-1">{product.subtitle}</p>
          )}
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          {calculatedPrice !== undefined && calculatedPrice !== null ? (
            <>
              <span className="text-sm font-bold text-neutral-900">
                {formatPrice(calculatedPrice, currencyCode)}
              </span>
              {hasDiscount && (
                <span className="text-xs text-neutral-400 line-through">
                  {formatPrice(originalPrice, currencyCode)}
                </span>
              )}
            </>
          ) : (
            <span className="text-xs text-neutral-500">Contact for pricing</span>
          )}
        </div>
      </div>
    </Link>
  );
}
