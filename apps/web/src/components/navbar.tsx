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
    <header className="sticky top-0 z-40 w-full border-b border-line bg-paper">
      <div className="mx-auto flex max-w-[88rem] items-center justify-between px-4 sm:px-6 lg:px-10 h-16">
        {/* Brand / Logo */}
        <div className="flex items-center gap-8">
          <Link
            to="/$countryCode"
            params={{ countryCode: currentCountryCode }}
            className="flex items-center gap-2.5 group"
          >
            <img
              src="/logo.svg"
              alt=""
              className="h-9 w-9 object-contain transition-transform duration-300 ease-out group-hover:-rotate-6"
            />
            <span className="font-display-tight text-[1.75rem] leading-none text-ink">Puppin</span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/$countryCode"
              params={{ countryCode: currentCountryCode }}
              className="text-[15px] font-medium text-ink-soft hover:text-ink transition-colors"
            >
              Shop All
            </Link>
            {categories.slice(0, 4).map((cat) => (
              <Link
                key={cat.id}
                to="/$countryCode/categories/$handle"
                params={{ countryCode: currentCountryCode, handle: cat.handle }}
                className="text-[15px] font-medium text-ink-soft hover:text-ink transition-colors"
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
              <div className="flex items-center gap-1.5 text-xs font-semibold text-ink-soft hover:text-ink px-3 py-2 rounded-full hover:bg-mist transition-colors cursor-pointer">
                <Globe className="h-4 w-4" />
                <span className="uppercase">{currentCountryCode}</span>
              </div>
              <div className="absolute right-0 mt-1 hidden group-hover:block z-50 w-44 rounded-2xl border border-line bg-paper shadow-[0_12px_32px_-8px_rgb(18_18_18/0.18)] py-2">
                <div className="px-3 py-1.5 text-xs font-semibold text-ink-soft">
                  Select Country
                </div>
                {allCountries.map((country) => (
                  <Link
                    key={country.code}
                    to="/$countryCode"
                    params={{ countryCode: country.code }}
                    className={`block px-3 py-1.5 text-xs hover:bg-mist transition-colors ${
                      country.code === currentCountryCode
                        ? "font-semibold text-ink bg-mist"
                        : "text-ink-soft"
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
            className="flex items-center gap-1.5 p-2 rounded-full text-ink hover:bg-mist transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label={isAuthenticated ? "Customer Account" : "Sign In"}
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline text-sm font-medium">
              {isAuthenticated ? customer?.first_name || "Account" : "Sign in"}
            </span>
          </Link>

          {/* Cart Trigger with aria-live="polite" */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative flex items-center justify-center p-2 rounded-full text-ink hover:bg-mist transition-colors cursor-pointer min-h-[44px] min-w-[44px]"
            aria-label={`Shopping Cart with ${totalItems} items`}
          >
            <ShoppingBag className="h-5 w-5" />
            <span
              aria-live="polite"
              className="tabular absolute -top-0.5 -right-0.5 flex h-5 min-w-5 px-1 items-center justify-center rounded-full bg-puppin text-[11px] font-bold text-white"
            >
              {totalItems}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
