import { useState } from "react";
import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import type { HttpTypes } from "@medusajs/types";
import { Check } from "lucide-react";
import { getProductByHandle, listProducts } from "../../../lib/data/products";
import { findRegionForCountry, listRegions } from "../../../lib/data/regions";
import { formatPrice } from "../../../lib/utils/price";
import {
  findVariant,
  isInStock,
  isValueAvailable,
  selectValue,
  type Selection,
} from "../../../lib/utils/variants";
import { useCart } from "../../../lib/context/cart";
import { cn } from "../../../lib/utils/cn";
import { Button } from "../../../components/ui/button";
import { OptionChip } from "../../../components/ui/chip";
import { ProductCard } from "../../../components/product-card";

export const Route = createFileRoute("/$countryCode/products/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions(),
    });
    const region = findRegionForCountry(regions, countryCode);

    const [product, related] = await Promise.all([
      queryClient.ensureQueryData({
        queryKey: ["product", handle, region?.id],
        queryFn: () => getProductByHandle(handle, region?.id),
      }),
      // Same key as the homepage grid, so the cache is shared
      queryClient.ensureQueryData({
        queryKey: ["products", countryCode, region?.id],
        queryFn: () =>
          listProducts({
            regionId: region?.id,
            queryParams: { fields: "*variants,*variants.calculated_price,*options" },
          }),
      }),
    ]);

    if (!product) {
      throw notFound();
    }

    return {
      countryCode,
      currencyCode: region?.currency_code || "usd",
      product,
      related: related.products.filter((p) => p.id !== product.id).slice(0, 4),
    };
  },
  component: ProductDetailPage,
  notFoundComponent: ProductNotFound,
});

function initialSelection(product: HttpTypes.StoreProduct): Selection {
  // Preselect only options with a single value; real choices are the shopper's to make
  const selection: Selection = {};
  for (const option of product.options ?? []) {
    if (option.values?.length === 1 && option.values[0].value) {
      selection[option.id] = option.values[0].value;
    }
  }
  return selection;
}

function ProductDetailPage() {
  const { countryCode, currencyCode, product, related } = Route.useLoaderData();
  const { addItem } = useCart();

  const [selection, setSelection] = useState<Selection>(() => initialSelection(product));
  const [activeImage, setActiveImage] = useState(0);
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error" | "needs-option">(
    "idle",
  );
  const [hop, setHop] = useState(0);

  const variant = findVariant(product, selection);
  const inStock = isInStock(variant);
  const missing = (product.options ?? []).filter((o) => !selection[o.id]);

  // Before a full selection, show the cheapest price as a "from" price
  const prices = (product.variants ?? [])
    .map((v) => v.calculated_price?.calculated_amount)
    .filter((n): n is number => typeof n === "number");
  const price =
    variant?.calculated_price?.calculated_amount ?? (prices.length ? Math.min(...prices) : null);
  const original = variant?.calculated_price?.original_amount;
  const hasDiscount = variant && original != null && price != null && original > price;
  const isFromPrice = !variant && new Set(prices).size > 1;

  const images = product.images?.length
    ? product.images
    : product.thumbnail
      ? [{ id: "thumb", url: product.thumbnail }]
      : [];

  async function handleAdd() {
    if (!variant) {
      setStatus("needs-option");
      document.querySelector<HTMLInputElement>(`input[name="opt-${missing[0]?.id}"]`)?.focus();
      return;
    }
    setStatus("adding");
    try {
      await addItem(variant.id, 1);
      setStatus("added");
      setHop((n) => n + 1);
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="pb-8">
      <div className="mx-auto max-w-[88rem] px-4 pt-2 sm:px-6 lg:px-10 lg:pt-4">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
          {/* Gallery */}
          <div className="lg:col-span-7 lg:flex lg:items-end lg:gap-4">
            <div className="relative mt-14 lg:mt-24 lg:flex-1">
              <img
                key={hop}
                src="/images/puppin/peek.webp"
                alt=""
                aria-hidden="true"
                className={cn(
                  "pointer-events-none absolute right-6 bottom-full z-10 w-20 select-none lg:right-10 lg:w-32",
                  hop > 0 && "puppin-hop",
                )}
              />
              <div className="relative aspect-[5/4] w-full overflow-hidden rounded-2xl bg-mist lg:aspect-square">
                {images[activeImage]?.url ? (
                  <img
                    src={images[activeImage].url}
                    alt={product.title}
                    className="h-full w-full object-cover object-center"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
                    <img src="/logo.svg" alt="" className="h-16 w-16 opacity-25" />
                    <span>Photo coming soon</span>
                  </div>
                )}
              </div>
            </div>

            {images.length > 1 && (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1 lg:order-first lg:mt-0 lg:flex-col lg:overflow-visible lg:pb-0">
                {images.map((img, idx) => (
                  <button
                    key={img.id ?? idx}
                    type="button"
                    onClick={() => setActiveImage(idx)}
                    aria-label={`Show image ${idx + 1} of ${images.length}`}
                    aria-current={activeImage === idx}
                    className={cn(
                      "h-16 w-14 shrink-0 cursor-pointer overflow-hidden rounded-xl border-2 bg-mist transition-colors lg:h-24 lg:w-20",
                      activeImage === idx ? "border-ink" : "border-line hover:border-ink",
                    )}
                  >
                    <img src={img.url} alt="" className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="lg:col-span-5">
            <div className="lg:sticky lg:top-24 lg:pt-24">
              <h1 className="font-display-tight text-[clamp(3rem,7vw,5.75rem)] text-ink">
                {product.title}
              </h1>
              {product.subtitle && <p className="mt-3 text-lg text-ink-soft">{product.subtitle}</p>}

              <div className="mt-5 flex items-baseline gap-3">
                {price != null ? (
                  <>
                    <span className="tabular text-3xl font-semibold text-ink">
                      {isFromPrice && (
                        <span className="mr-1.5 text-lg font-medium text-ink-soft">From</span>
                      )}
                      {formatPrice(price, currencyCode)}
                    </span>
                    {hasDiscount && (
                      <>
                        <span className="tabular text-lg text-ink-soft line-through">
                          {formatPrice(original, currencyCode)}
                        </span>
                        <span className="text-sm font-semibold text-ink">
                          Save {formatPrice(original - price, currencyCode)}
                        </span>
                      </>
                    )}
                  </>
                ) : (
                  <span className="text-ink-soft">Price on request</span>
                )}
              </div>

              {(product.options?.length ?? 0) > 0 && (
                <div className="mt-8 space-y-6 border-t border-line pt-6">
                  {product.options?.map((option) => (
                    <fieldset key={option.id}>
                      <legend className="text-sm font-semibold text-ink">
                        {option.title}
                        {selection[option.id] && (
                          <span className="ml-2 font-normal text-ink-soft">
                            {selection[option.id]}
                          </span>
                        )}
                      </legend>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {option.values?.map((val) => {
                          const value = val.value ?? "";
                          const available = isValueAvailable(product, selection, option.id, value);
                          return (
                            <OptionChip
                              key={val.id}
                              name={`opt-${option.id}`}
                              value={value}
                              checked={selection[option.id] === value}
                              unavailable={!available}
                              onSelect={() => {
                                setSelection((prev) =>
                                  selectValue(product, prev, option.id, value),
                                );
                                setStatus("idle");
                              }}
                            >
                              {value}
                            </OptionChip>
                          );
                        })}
                      </div>
                    </fieldset>
                  ))}
                </div>
              )}

              <Button
                size="xl"
                className="mt-8 w-full"
                onPress={handleAdd}
                isLoading={status === "adding"}
                isDisabled={!!variant && !inStock}
              >
                {status === "added" ? (
                  <>
                    <Check className="h-5 w-5" /> In your bag
                  </>
                ) : variant && !inStock ? (
                  "Sold out"
                ) : (
                  "Add to cart"
                )}
              </Button>
              <p aria-live="polite" className="mt-2 text-sm text-puppin-deep empty:mt-0">
                {status === "needs-option" &&
                  `Pick a ${missing.map((o) => o.title?.toLowerCase()).join(" and ")} first.`}
                {status === "error" && "That didn't go through. Try again in a moment."}
              </p>

              {product.description && (
                <div className="mt-8 border-t border-line pt-6">
                  <h2 className="text-sm font-semibold text-ink">About this piece</h2>
                  <p className="mt-2 max-w-[65ch] text-base leading-relaxed text-ink-soft">
                    {product.description}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mx-auto mt-28 max-w-[88rem] px-4 sm:px-6 lg:px-10">
          <h2 className="font-display-tight border-b-2 border-ink pb-4 text-[clamp(3rem,8vw,7rem)]">
            More from <span className="text-puppin">Puppin</span>
          </h2>
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                countryCode={countryCode}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ProductNotFound() {
  const { countryCode } = Route.useParams();
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-24 text-center">
      <img src="/images/puppin/nap.webp" alt="" className="w-72" />
      <h1 className="font-display-tight mt-6 text-6xl">
        Not <span className="text-puppin">here</span>
      </h1>
      <p className="mt-3 text-lg text-ink-soft">
        Puppin looked everywhere, then fell asleep. This piece may have sold out or moved.
      </p>
      <Link
        to="/$countryCode"
        params={{ countryCode }}
        className="mt-8 inline-flex min-h-[50px] items-center rounded-full bg-puppin px-6 font-semibold text-white transition-colors hover:bg-puppin-deep"
      >
        Back to the shop
      </Link>
    </div>
  );
}
