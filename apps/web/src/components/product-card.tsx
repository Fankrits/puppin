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
      className="group flex flex-col gap-3 rounded-2xl"
    >
      {/* Product Image */}
      <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-mist">
        {product.thumbnail ? (
          <img
            src={product.thumbnail}
            alt={product.title || "Product image"}
            loading="lazy"
            className="h-full w-full object-cover object-center transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04]"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
            <img src="/logo.svg" alt="" className="h-14 w-14 opacity-25" />
            <span className="text-sm">Photo coming soon</span>
          </div>
        )}

        {hasDiscount && (
          <div className="absolute top-3 left-3">
            <Badge variant="error" size="sm">
              Sale
            </Badge>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="flex flex-col gap-0.5 px-1 sm:flex-row sm:items-start sm:justify-between sm:gap-3">
        <div className="min-w-0">
          <h3 className="text-base font-semibold text-ink line-clamp-2 decoration-2 group-hover:underline">
            {product.title}
          </h3>
          {product.subtitle && (
            <p className="text-sm text-ink-soft mt-0.5 line-clamp-1">{product.subtitle}</p>
          )}
        </div>

        <div className="flex shrink-0 flex-col sm:items-end">
          {calculatedPrice !== undefined && calculatedPrice !== null ? (
            <>
              <span className="tabular text-base font-semibold text-ink">
                {formatPrice(calculatedPrice, currencyCode)}
              </span>
              {hasDiscount && (
                <span className="tabular text-sm text-ink-soft line-through">
                  {formatPrice(originalPrice, currencyCode)}
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-ink-soft">Price on request</span>
          )}
        </div>
      </div>
    </Link>
  );
}
