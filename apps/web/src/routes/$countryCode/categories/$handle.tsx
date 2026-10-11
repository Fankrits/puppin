import { createFileRoute } from "@tanstack/react-router";
import { listProducts, listCategories } from "../../../lib/data/products";
import { ProductCard } from "../../../components/product-card";
import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";

export const Route = createFileRoute("/$countryCode/categories/$handle")({
  loader: async ({ params, context }) => {
    const { countryCode, handle } = params;
    const { queryClient } = context;

    const categories = await queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: () => listCategories(),
    });

    const currentCat = categories.find((c) => c.handle === handle);

    const productsData = await queryClient.ensureQueryData({
      queryKey: ["products", "category", handle, countryCode],
      queryFn: () =>
        listProducts({
          countryCode,
          queryParams: currentCat?.id ? { category_id: [currentCat.id] } : undefined,
        }),
    });

    return {
      countryCode,
      handle,
      category: currentCat,
      products: productsData.products,
    };
  },
  component: CategoryPage,
});

function CategoryPage() {
  const { countryCode, category, handle, products } = Route.useLoaderData();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      <div>
        <Link
          to="/$countryCode"
          params={{ countryCode }}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors mb-3"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all products
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">
          {category?.name || handle.toUpperCase()}
        </h1>
        <p className="text-sm text-neutral-500 mt-1">Explore items in this category.</p>
      </div>

      {products.length === 0 ? (
        <div className="rounded-xl border border-dashed border-neutral-300 p-12 text-center bg-white">
          <p className="text-sm font-medium text-neutral-900">No products found in this category</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} countryCode={countryCode} />
          ))}
        </div>
      )}
    </div>
  );
}
