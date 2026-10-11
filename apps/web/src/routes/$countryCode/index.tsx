import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { HttpTypes } from "@medusajs/types";
import { Check } from "lucide-react";
import { listProducts } from "../../lib/data/products";
import { findRegionForCountry, listRegions } from "../../lib/data/regions";
import { useCart } from "../../lib/context/cart";
import { formatPrice } from "../../lib/utils/price";
import { ProductCard } from "../../components/product-card";
import { Button } from "../../components/ui/button";
import { cn } from "../../lib/utils/cn";
import { OptionChip } from "../../components/ui/chip";

export const Route = createFileRoute("/$countryCode/")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions(),
    });
    const region = findRegionForCountry(regions, countryCode);

    const productsData = await queryClient.ensureQueryData({
      queryKey: ["products", countryCode, region?.id],
      queryFn: () =>
        listProducts({
          regionId: region?.id,
          queryParams: { fields: "*variants,*variants.calculated_price,*options" },
        }),
    });

    return {
      countryCode,
      currencyCode: region?.currency_code || "usd",
      products: productsData.products,
    };
  },
  component: HomePage,
});

function HomePage() {
  const { countryCode, currencyCode, products } = Route.useLoaderData();
  const featured = products.find((p) => p.variants?.length) ?? null;

  return (
    <div className="pb-8">
      <Hero featured={featured} currencyCode={currencyCode} />

      {/* New in */}
      <section id="products" className="mx-auto max-w-[88rem] px-4 sm:px-6 lg:px-10 pt-24">
        <div className="relative flex flex-wrap items-end justify-between gap-x-8 gap-y-4 border-b-2 border-ink pb-4">
          <h2 className="font-display-tight text-[clamp(3.5rem,11vw,10rem)]">New in</h2>
          <img
            src="/images/puppin/peek.webp"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute right-[18%] bottom-[2px] hidden w-44 select-none md:block lg:w-52"
          />
        </div>

        {products.length === 0 ? (
          <RestockingState />
        ) : (
          <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                countryCode={countryCode}
                currencyCode={currencyCode}
              />
            ))}
          </div>
        )}
      </section>

      <OwnLabel />
    </div>
  );
}

function Hero({
  featured,
  currencyCode,
}: {
  featured: HttpTypes.StoreProduct | null;
  currencyCode: string;
}) {
  const [hop, setHop] = useState(0);

  return (
    <section className="mx-auto max-w-[88rem] px-4 pt-4 sm:px-6 lg:px-10 lg:pt-6">
      <div className="relative grid overflow-hidden rounded-[28px] bg-sprout lg:grid-cols-12">
        <h1 className="font-display-tight relative z-10 px-6 pt-10 text-[clamp(3.6rem,10.5vw,9.5rem)] text-ink sm:px-10 sm:pt-12 lg:col-span-12 lg:px-14 lg:pt-14">
          Cute brand.
          <br />
          <span className="text-puppin">Serious</span> clothes.
        </h1>

        <div className="relative z-10 flex flex-col px-6 pt-5 pb-8 sm:px-10 lg:col-span-7 lg:px-14 lg:pb-12">
          <p lang="th" className="text-xl font-semibold text-sprout-deep sm:text-2xl">
            น่ารักที่ตัวละคร จริงจังที่ตะเข็บ
          </p>
          <p className="mt-3 max-w-[34rem] text-lg leading-relaxed text-ink-soft">
            Our own label, designed by us and sold straight to you. One very fuzzy inspector signs
            off on the lot.
          </p>

          {featured && (
            <QuickAdd
              product={featured}
              currencyCode={currencyCode}
              onAdded={() => setHop((n) => n + 1)}
            />
          )}
        </div>

        <img
          src="/images/puppin/hero.webp"
          alt=""
          aria-hidden="true"
          className="pointer-events-none absolute top-[6.5rem] right-5 z-20 w-[5.5rem] select-none sm:top-[7rem] sm:right-8 sm:w-32 lg:hidden"
        />
        <div className="relative hidden items-end justify-center pb-12 lg:col-span-5 lg:-mt-24 lg:flex">
          <img
            key={hop}
            src="/images/puppin/hero.webp"
            alt="Puppin, a red fuzzy creature with a rainbow sprout, hugging a stack of folded t-shirts"
            className={cn(
              "relative h-[32rem] w-auto select-none drop-shadow-[0_24px_24px_rgb(36_88_60/0.22)]",
              hop > 0 && "puppin-hop",
            )}
            fetchPriority="high"
          />
        </div>
      </div>
    </section>
  );
}

function QuickAdd({
  product,
  currencyCode,
  onAdded,
}: {
  product: HttpTypes.StoreProduct;
  currencyCode: string;
  onAdded: () => void;
}) {
  const { addItem } = useCart();
  const variants = (product.variants ?? []).slice(0, 6);
  const [variantId, setVariantId] = useState(variants.length === 1 ? variants[0].id : "");
  const [status, setStatus] = useState<"idle" | "adding" | "added" | "error" | "needs-option">(
    "idle",
  );

  const selected = variants.find((v) => v.id === variantId) ?? variants[0];
  const price = selected?.calculated_price?.calculated_amount;

  async function handleAdd() {
    if (!variantId) {
      setStatus("needs-option");
      document.querySelector<HTMLInputElement>('input[name="hero-variant"]')?.focus();
      return;
    }
    setStatus("adding");
    try {
      await addItem(variantId, 1);
      setStatus("added");
      onAdded();
    } catch {
      setStatus("error");
    }
  }

  return (
    <div className="mt-6 w-full max-w-[30rem] rounded-2xl bg-paper p-5 shadow-[0_18px_40px_-18px_rgb(47_107_74/0.45)] sm:p-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="min-w-0 truncate text-xl font-semibold text-ink">{product.title}</h2>
        {price != null && (
          <span className="tabular shrink-0 text-xl font-semibold text-ink">
            {formatPrice(price, currencyCode)}
          </span>
        )}
      </div>

      {variants.length > 1 && (
        <fieldset className="mt-4">
          <legend className="sr-only">Choose an option</legend>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <OptionChip
                key={v.id}
                name="hero-variant"
                value={v.id}
                checked={v.id === variantId}
                onSelect={() => {
                  setVariantId(v.id);
                  setStatus("idle");
                }}
              >
                {v.title}
              </OptionChip>
            ))}
          </div>
        </fieldset>
      )}

      <Button size="lg" className="mt-5 w-full" onPress={handleAdd} isLoading={status === "adding"}>
        {status === "added" ? (
          <>
            <Check className="h-5 w-5" /> In your bag
          </>
        ) : (
          "Add to cart"
        )}
      </Button>
      <p aria-live="polite" className="mt-2 text-sm text-puppin-deep empty:mt-0">
        {status === "error" && "That didn't go through. Try again in a moment."}
        {status === "needs-option" && "Pick an option first."}
      </p>
    </div>
  );
}

function RestockingState() {
  return (
    <div className="mt-10 flex flex-col items-center rounded-[28px] border border-line bg-paper px-6 pt-6 pb-12 text-center">
      <img src="/images/puppin/nap.webp" alt="" className="w-full max-w-md" />
      <h3 className="font-display-tight mt-2 text-5xl">Restocking</h3>
      <p className="mt-3 max-w-sm text-ink-soft">
        Puppin is napping on the next batch. New pieces land here soon.
      </p>
    </div>
  );
}

function OwnLabel() {
  return (
    <section className="mx-auto mt-28 max-w-[88rem] px-4 sm:px-6 lg:px-10">
      <div className="grid items-center gap-10 lg:grid-cols-12">
        <img
          src="/images/puppin/tape.webp"
          alt="Puppin measuring with a yellow tailor's tape"
          loading="lazy"
          className="mx-auto w-full max-w-xs lg:col-span-5 lg:max-w-sm"
        />
        <div className="lg:col-span-7">
          <h2 className="font-display-tight text-[clamp(3.25rem,7.5vw,7rem)]">
            Made by us.
            <br />
            <span className="text-puppin">Checked</span> by him.
          </h2>
          <dl className="mt-10 divide-y divide-line border-y border-line">
            {[
              [
                "Our own label",
                "Every Puppin piece is designed by us. Nothing is picked off someone else's rack.",
              ],
              [
                "Straight to you",
                "No marketplace in the middle. You buy from the people who designed it.",
              ],
              [
                "The squish test",
                "Puppin hugs every batch before it ships. It is mostly for morale.",
              ],
            ].map(([term, detail]) => (
              <div key={term} className="grid gap-1 py-5 sm:grid-cols-[14rem_1fr] sm:gap-8">
                <dt className="text-lg font-semibold text-ink">{term}</dt>
                <dd className="text-lg text-ink-soft">{detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
