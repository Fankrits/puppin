import { Link } from "@tanstack/react-router";

export function Footer({ countryCode }: { countryCode: string }) {
  return (
    <footer className="border-t border-neutral-200 bg-white py-12 text-sm text-neutral-600 mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <img src="/logo.svg" alt="Puppin Logo" className="h-7 w-7 object-contain" />
              <span className="text-lg font-bold tracking-tight text-neutral-900">Puppin</span>
            </div>
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed">
              Curated premium lifestyle, apparel, and goods powered by Medusa v2 and TanStack Start.
            </p>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Shop
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link
                  to="/$countryCode"
                  params={{ countryCode }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  All Products
                </Link>
              </li>
              <li>
                <Link
                  to="/$countryCode/cart"
                  params={{ countryCode }}
                  className="hover:text-neutral-900 transition-colors"
                >
                  Shopping Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              Support
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">
                  Shipping & Returns
                </span>
              </li>
              <li>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">
                  Terms of Service
                </span>
              </li>
              <li>
                <span className="hover:text-neutral-900 transition-colors cursor-pointer">
                  Privacy Policy
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider mb-3">
              About
            </h4>
            <p className="text-xs text-neutral-500 leading-relaxed">
              Experience the blazing performance of server-side rendered commerce.
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-neutral-100 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-neutral-400">
          <p>© {new Date().getFullYear()} Puppin Store. All rights reserved.</p>
          <div className="flex gap-4 mt-2 md:mt-0">
            <span>Powered by Medusa 2.21 & TanStack Start</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
