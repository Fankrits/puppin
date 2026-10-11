import { Link } from "@tanstack/react-router";

export function Footer({ countryCode }: { countryCode: string }) {
  const linkClass = "text-ink-soft hover:text-ink transition-colors";

  return (
    <footer className="mt-24 border-t border-line bg-paper text-[15px]">
      <div className="mx-auto max-w-[88rem] px-4 pt-14 sm:px-6 lg:px-10">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-12">
          <div className="col-span-2 md:col-span-5">
            <p className="max-w-sm text-lg leading-relaxed text-ink">
              Puppin is an own-label clothing brand. Designed by us, sold direct, inspected by a
              small red creature.
            </p>
            <p lang="th" className="mt-2 text-ink-soft">
              เสื้อผ้าแบรนด์ Puppin ออกแบบเอง ขายตรงถึงมือคุณ
            </p>
          </div>

          <nav aria-label="Shop" className="md:col-span-2 md:col-start-8">
            <h2 className="text-sm font-semibold text-ink">Shop</h2>
            <ul className="mt-3 space-y-2">
              <li>
                <Link to="/$countryCode" params={{ countryCode }} className={linkClass}>
                  All products
                </Link>
              </li>
              <li>
                <Link to="/$countryCode/cart" params={{ countryCode }} className={linkClass}>
                  Cart
                </Link>
              </li>
              <li>
                <Link to="/$countryCode/account" params={{ countryCode }} className={linkClass}>
                  Account
                </Link>
              </li>
            </ul>
          </nav>

          <div className="md:col-span-3">
            <h2 className="text-sm font-semibold text-ink">Help</h2>
            {/* ponytail: these pages don't exist yet; plain text until they do */}
            <ul className="mt-3 space-y-2 text-ink-soft">
              <li>Shipping & returns</li>
              <li>Terms of service</li>
              <li>Privacy policy</li>
            </ul>
          </div>
        </div>

        <div className="relative mt-28 sm:mt-40">
          <img
            src="/images/puppin/nap.webp"
            alt=""
            aria-hidden="true"
            loading="lazy"
            className="pointer-events-none absolute left-[3%] bottom-full w-[min(34vw,14rem)] select-none"
          />
          <p
            aria-hidden="true"
            className="font-display-tight text-center text-[36vw] leading-[0.8] text-puppin xl:text-[min(36vw,33rem)]"
          >
            Puppin
          </p>
        </div>

        <div className="flex flex-col gap-2 border-t border-line py-6 text-sm text-ink-soft sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} Puppin</p>
          <p lang="th">ขอบคุณที่แวะมา</p>
        </div>
      </div>
    </footer>
  );
}
