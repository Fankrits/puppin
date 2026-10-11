import { createFileRoute, redirect, Outlet } from "@tanstack/react-router";
import { listRegions } from "../lib/data/regions";
import { listCategories } from "../lib/data/products";
import { CartProvider } from "../lib/context/cart";
import { Navbar } from "../components/navbar";
import { Footer } from "../components/footer";
import { CartDrawer } from "../components/cart-drawer";

export const Route = createFileRoute("/$countryCode")({
  loader: async ({ params, context }) => {
    const { countryCode } = params;
    const { queryClient } = context;

    const regions = await queryClient.ensureQueryData({
      queryKey: ["regions"],
      queryFn: () => listRegions(),
    });

    const categories = await queryClient.ensureQueryData({
      queryKey: ["categories"],
      queryFn: () => listCategories(),
    });

    // Validate country code or fallback to first region
    const matchedRegion = regions.find((r) =>
      r.countries?.some((c) => c.iso_2?.toLowerCase() === countryCode.toLowerCase()),
    );

    if (!matchedRegion && regions.length > 0) {
      const defaultCountry = regions[0].countries?.[0]?.iso_2?.toLowerCase() || "us";
      if (countryCode !== defaultCountry) {
        throw redirect({
          to: "/$countryCode",
          params: { countryCode: defaultCountry },
        });
      }
    }

    return {
      countryCode,
      region: matchedRegion || regions[0] || null,
      regions,
      categories,
    };
  },
  component: CountryLayout,
});

function CountryLayout() {
  const { countryCode, region, regions, categories } = Route.useLoaderData();

  return (
    <CartProvider regionId={region?.id}>
      <div className="flex min-h-screen flex-col">
        <Navbar regions={regions} currentCountryCode={countryCode} categories={categories} />
        <main className="flex-1">
          <Outlet />
        </main>
        <Footer countryCode={countryCode} />
        <CartDrawer countryCode={countryCode} />
      </div>
    </CartProvider>
  );
}
