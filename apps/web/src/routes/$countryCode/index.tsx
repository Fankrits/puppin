import { createFileRoute } from "@tanstack/react-router";
import { listProducts } from "../../lib/data/products";
import { ProductCard } from "../../components/product-card";
import { Button } from "../../components/ui/button";
import { ArrowRight, Sparkles, ShieldCheck, Truck } from "lucide-react";

export const Route = createFileRoute("/$countryCode/")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    // Access parent loader data or fetch products
    const productsData = await queryClient.ensureQueryData({
      queryKey: ["products", countryCode],
      queryFn: () => listProducts({ countryCode }),
    });

    return {
      countryCode,
      products: productsData.products,
      count: productsData.count,
    };
  },
  component: HomePage,
});

function HomePage() {
  const { countryCode, products } = Route.useLoaderData();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl bg-neutral-900 px-6 py-20 sm:px-12 sm:py-28 text-white shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="h-3.5 w-3.5 text-amber-300" />
              <span>Modern Commerce Experience</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Elevate your daily essentials.
            </h1>
            <p className="text-base text-neutral-300 sm:text-lg">
              Designed with precision, crafted with care. Explore our new collection built with
              TanStack Start & Medusa.
            </p>
            <div className="pt-2 flex flex-wrap gap-4">
              <a href="#products">
                <Button size="lg" className="bg-white text-neutral-900 hover:bg-neutral-100">
                  Shop Collection
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </Button>
              </a>
            </div>
          </div>

          {/* Background Decorative Gradient */}
          <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-neutral-800/60 blur-3xl" />
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 rounded-xl border border-neutral-200/80 bg-white p-6 shadow-xs">
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-neutral-100 p-3 text-neutral-900">
              <Truck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Fast Shipping</h4>
              <p className="text-xs text-neutral-500">Tracked deliveries worldwide</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-neutral-100 p-3 text-neutral-900">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Secure Checkout</h4>
              <p className="text-xs text-neutral-500">Powered by Medusa payment engine</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-neutral-100 p-3 text-neutral-900">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-neutral-900">Premium Quality</h4>
              <p className="text-xs text-neutral-500">Curated materials & craftsmanship</p>
            </div>
          </div>
        </div>
      </section>

      {/* Product Catalog Grid */}
      <section id="products" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-neutral-900">
              Featured Products
            </h2>
            <p className="text-sm text-neutral-500 mt-1">
              Explore our current arrivals and catalog.
            </p>
          </div>
        </div>

        {products.length === 0 ? (
          <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center bg-white">
            <p className="text-sm font-medium text-neutral-900">
              No products found in Medusa store
            </p>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              Please seed or create products in the Medusa Admin at http://localhost:9000/app.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} countryCode={countryCode} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
