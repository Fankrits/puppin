import { Link } from "@tanstack/react-router";
import { useCart } from "../lib/context/cart";
import { useAuth } from "../lib/context/auth";
import type { HttpTypes } from "@medusajs/types";
import { ShoppingBag, Globe, User } from "lucide-react";

export function Navbar({
  regions,
  currentCountryCode,
  categories = [],
}: {
  regions: HttpTypes.StoreRegion[];
  currentCountryCode: string;
  categories?: HttpTypes.StoreProductCategory[];
}) {
  const { totalItems, openDrawer } = useCart();
  const { customer, isAuthenticated } = useAuth();

  // Collect countries from all regions
  const allCountries = regions.flatMap((r) =>
    (r.countries || []).map((c) => ({
      name: c.display_name || c.name || c.iso_2?.toUpperCase(),
      code: c.iso_2?.toLowerCase() || "",
      currency: r.currency_code?.toUpperCase(),
    })),
  );

  return (
    <header className="sticky top-0 z-40 w-full border-b border-neutral-200 bg-white/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/$countryCode"
            params={{ countryCode: currentCountryCode }}
            className="flex items-center gap-2 group"
          >
            <img src="/logo.svg" alt="Puppin Logo" className="h-8 w-8 object-contain" />
            <span className="text-xl font-bold tracking-tight text-neutral-900 group-hover:text-neutral-700 transition-colors">
              Puppin
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              to="/$countryCode"
              params={{ countryCode: currentCountryCode }}
              className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
            >
              Shop All
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to="/$countryCode/categories/$handle"
                params={{ countryCode: currentCountryCode, handle: cat.handle }}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors"
              >
                {cat.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Right Action Icons (Country Selector, User Account, Cart Badge) */}
        <div className="flex items-center gap-3 sm:gap-4">
          {/* Region / Country Selector */}
          {allCountries.length > 0 && (
            <div className="relative group">
              <div className="flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 px-2.5 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors cursor-pointer">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{currentCountryCode}</span>
              </div>
              <div className="absolute right-0 mt-1 hidden group-hover:block z-50 w-44 rounded-lg border border-neutral-200 bg-white shadow-lg py-1">
                <div className="px-3 py-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Select Country
                </div>
                {allCountries.map((country) => (
                  <Link
                    key={country.code}
                    to="/$countryCode"
                    params={{ countryCode: country.code }}
                    className={`block px-3 py-1.5 text-xs hover:bg-neutral-50 transition-colors ${
                      country.code === currentCountryCode
                        ? "font-semibold text-neutral-900 bg-neutral-50"
                        : "text-neutral-600"
                    }`}
                  >
                    {country.name} ({country.currency})
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Customer Account / Sign In */}
          <Link
            to={isAuthenticated ? "/$countryCode/account" : "/$countryCode/account/login"}
            params={{ countryCode: currentCountryCode }}
            className="flex items-center gap-1.5 p-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label={isAuthenticated ? "Customer Account" : "Sign In"}
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline text-xs font-medium">
              {isAuthenticated ? customer?.first_name || "Account" : "Sign in"}
            </span>
          </Link>

          {/* Cart Trigger with aria-live="polite" */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center p-2 rounded-lg text-neutral-700 hover:text-neutral-900 hover:bg-neutral-100 transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span
              aria-live="polite"
              className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-neutral-900 text-[11px] font-bold text-white shadow-xs"
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
