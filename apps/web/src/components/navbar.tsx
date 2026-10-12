import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import type { HttpTypes } from "@medusajs/types";
import {
  Button as AriaButton,
  Dialog,
  ListBox,
  ListBoxItem,
  Modal,
  ModalOverlay,
  Popover,
  Select,
  SelectValue,
} from "react-aria-components";
import { Check, ChevronDown, Menu, ShoppingBag, User, X } from "lucide-react";
import { useCart } from "../lib/context/cart";
import { useAuth } from "../lib/context/auth";
import { cn } from "../lib/utils/cn";

type Country = { id: string; name: string; code: string; currency: string };

export function Navbar({
  regions,
  currentCountryCode,
  categories = [],
}: {
  regions: HttpTypes.StoreRegion[];
  currentCountryCode: string;
  categories?: HttpTypes.StoreProductCategory[];
}) {
  const { cart, totalItems, openDrawer } = useCart();
  const { customer, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const scrolled = useScrolled(24);
  const hop = useHopOnIncrease(totalItems, !!cart);

  const countries: Country[] = regions.flatMap((r) =>
    (r.countries || []).map((c) => ({
      id: c.iso_2?.toLowerCase() || "",
      name: c.display_name || c.name || c.iso_2?.toUpperCase() || "",
      code: c.iso_2?.toLowerCase() || "",
      currency: r.currency_code?.toUpperCase() || "",
    })),
  );
  const links = categories.slice(0, 4);
  const accountLabel = isAuthenticated ? customer?.first_name || "Account" : "Sign in";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-paper transition-[border-color] duration-200",
        scrolled ? "border-line" : "border-transparent",
      )}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[88rem] items-center gap-6 px-4 transition-[height] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] sm:px-6 lg:px-10",
          scrolled ? "h-14" : "h-[4.5rem]",
        )}
      >
        {/* Brand: the wordmark tucks away on scroll, leaving Puppin's face */}
        <Link
          to="/$countryCode"
          params={{ countryCode: currentCountryCode }}
          className="group flex shrink-0 items-center gap-2.5"
          aria-label="Puppin home"
        >
          <img
            key={hop}
            src="/logo.svg"
            alt=""
            className={cn(
              "h-9 w-9 object-contain transition-transform duration-300 ease-out group-hover:-rotate-6",
              hop > 0 && "puppin-hop",
            )}
          />
          <span
            className={cn(
              "font-display-tight overflow-hidden text-[1.75rem] leading-none text-ink transition-[max-width,opacity] duration-300 ease-out",
              scrolled ? "max-w-0 opacity-0" : "max-w-40 opacity-100",
            )}
          >
            Puppin
          </span>
        </Link>

        <nav aria-label="Main" className="hidden items-center gap-5 md:flex lg:gap-7">
          <NavLink to="/$countryCode" countryCode={currentCountryCode} hash="products">
            Shop all
          </NavLink>
          {links.map((cat) => (
            <NavLink
              key={cat.id}
              to="/$countryCode/categories/$handle"
              countryCode={currentCountryCode}
              handle={cat.handle}
            >
              {cat.name}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          {countries.length > 1 && (
            <CountrySelect
              countries={countries}
              current={currentCountryCode}
              className="hidden md:flex"
            />
          )}

          <Link
            to={isAuthenticated ? "/$countryCode/account" : "/$countryCode/account/login"}
            params={{ countryCode: currentCountryCode }}
            className="hidden min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-[15px] font-medium whitespace-nowrap text-ink-soft transition-colors hover:text-ink md:flex"
            aria-label={accountLabel}
          >
            <User className="h-[18px] w-[18px]" />
            <span className="hidden lg:inline">{accountLabel}</span>
          </Link>

          <button
            type="button"
            onClick={openDrawer}
            className="relative flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full text-ink transition-colors hover:bg-mist"
            aria-label={`Cart, ${totalItems} ${totalItems === 1 ? "item" : "items"}`}
          >
            <ShoppingBag className="h-5 w-5" />
            {totalItems > 0 && (
              <span
                aria-hidden="true"
                className="tabular absolute top-1 right-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-puppin px-1 text-[11px] font-bold text-white"
              >
                {totalItems}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-ink transition-colors hover:bg-mist md:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
            Menu
          </button>
        </div>
      </div>

      <MobileMenu
        isOpen={menuOpen}
        onOpenChange={setMenuOpen}
        countryCode={currentCountryCode}
        countries={countries}
        categories={links}
        accountLabel={accountLabel}
        isAuthenticated={isAuthenticated}
      />
    </header>
  );
}

function NavLink({
  to,
  countryCode,
  handle,
  hash,
  children,
}: {
  to: "/$countryCode" | "/$countryCode/categories/$handle";
  countryCode: string;
  handle?: string;
  hash?: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      to={to}
      params={handle ? { countryCode, handle } : { countryCode }}
      hash={hash}
      activeOptions={{ exact: true, includeHash: false }}
      className="relative py-1 text-[15px] font-medium whitespace-nowrap text-ink-soft transition-colors hover:text-ink data-[status=active]:text-ink after:absolute after:inset-x-0 after:-bottom-0.5 after:h-0.5 after:origin-left after:scale-x-0 after:rounded-full after:bg-puppin after:transition-transform after:duration-300 hover:after:scale-x-100 data-[status=active]:after:scale-x-100"
    >
      {children}
    </Link>
  );
}

/** Country and currency picker on react-aria's Select: keyboard, typeahead and screen-reader support, styled popover. */
function CountrySelect({
  countries,
  current,
  className,
}: {
  countries: Country[];
  current: string;
  className?: string;
}) {
  const navigate = useNavigate();
  return (
    <Select
      aria-label="Country and currency"
      value={current}
      onChange={(key) => {
        if (key && key !== current) {
          void navigate({ to: "/$countryCode", params: { countryCode: String(key) } });
        }
      }}
      className={cn("relative", className)}
    >
      <AriaButton className="flex min-h-11 cursor-pointer items-center gap-1.5 rounded-full px-3 text-sm font-semibold whitespace-nowrap text-ink-soft outline-none transition-colors hover:bg-mist hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-puppin data-[pressed]:bg-mist">
        <SelectValue<Country>>
          {({ selectedItem }) => (
            <span>
              {current.toUpperCase()} · {selectedItem?.currency}
            </span>
          )}
        </SelectValue>
        <ChevronDown aria-hidden="true" className="h-4 w-4" />
      </AriaButton>
      <Popover
        placement="bottom end"
        offset={6}
        className="min-w-56 rounded-2xl border border-line bg-paper p-1.5 shadow-[0_12px_32px_-8px_rgb(18_18_18/0.18)] outline-none data-[entering]:animate-[sheet-in_200ms_cubic-bezier(0.16,1,0.3,1)]"
      >
        <ListBox items={countries} className="max-h-72 overflow-y-auto outline-none">
          {(c) => (
            <ListBoxItem
              id={c.code}
              textValue={c.name}
              className="flex cursor-pointer items-center justify-between gap-4 rounded-xl px-3 py-2.5 text-sm text-ink outline-none data-[focused]:bg-mist data-[selected]:font-semibold"
            >
              {({ isSelected }) => (
                <>
                  <span>{c.name}</span>
                  <span className="flex items-center gap-2 text-ink-soft">
                    <span className="tabular">{c.currency}</span>
                    {isSelected ? (
                      <Check aria-hidden="true" className="h-4 w-4 text-puppin" />
                    ) : (
                      <span className="w-4" />
                    )}
                  </span>
                </>
              )}
            </ListBoxItem>
          )}
        </ListBox>
      </Popover>
    </Select>
  );
}

function MobileMenu({
  isOpen,
  onOpenChange,
  countryCode,
  countries,
  categories,
  accountLabel,
  isAuthenticated,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  countryCode: string;
  countries: Country[];
  categories: HttpTypes.StoreProductCategory[];
  accountLabel: string;
  isAuthenticated: boolean;
}) {
  const close = () => onOpenChange(false);
  const bigLink =
    "font-display-tight block text-[clamp(3.5rem,17vw,6rem)] text-ink transition-colors active:text-puppin data-[status=active]:text-puppin";

  return (
    <ModalOverlay
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      isDismissable
      className="fixed inset-0 z-50 md:hidden"
    >
      <Modal className="sheet-in h-full w-full bg-paper outline-none">
        <Dialog
          aria-label="Menu"
          className="relative flex h-full flex-col overflow-hidden outline-none"
        >
          <div className="flex h-[4.5rem] shrink-0 items-center justify-between px-4 sm:px-6">
            <Link
              to="/$countryCode"
              params={{ countryCode }}
              onClick={close}
              className="flex items-center gap-2.5"
            >
              <img src="/logo.svg" alt="" className="h-9 w-9" />
              <span className="font-display-tight text-[1.75rem] leading-none">Puppin</span>
            </Link>
            <button
              type="button"
              onClick={close}
              className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-[15px] font-semibold text-ink hover:bg-mist"
            >
              <X className="h-5 w-5" />
              Close
            </button>
          </div>

          <nav aria-label="Main" className="flex-1 overflow-y-auto px-4 pt-6 pb-8 sm:px-6">
            <ul className="space-y-1">
              <li>
                <Link
                  to="/$countryCode"
                  params={{ countryCode }}
                  hash="products"
                  onClick={close}
                  className={bigLink}
                >
                  Shop all
                </Link>
              </li>
              {categories.map((cat) => (
                <li key={cat.id}>
                  <Link
                    to="/$countryCode/categories/$handle"
                    params={{ countryCode, handle: cat.handle }}
                    onClick={close}
                    className={bigLink}
                  >
                    {cat.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex shrink-0 items-end justify-between gap-3 border-t border-line px-4 pt-5 sm:px-6">
            <div className="flex flex-wrap items-center gap-3 pb-5">
              <Link
                to={isAuthenticated ? "/$countryCode/account" : "/$countryCode/account/login"}
                params={{ countryCode }}
                onClick={close}
                className="flex min-h-11 items-center gap-2 rounded-full border-2 border-line px-4 text-[15px] font-semibold text-ink hover:border-ink"
              >
                <User className="h-[18px] w-[18px]" />
                {accountLabel}
              </Link>
              {countries.length > 1 && (
                <CountrySelect countries={countries} current={countryCode} />
              )}
            </div>
            <img
              src="/images/puppin/peek.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none w-28 shrink-0 select-none"
            />
          </div>
        </Dialog>
      </Modal>
    </ModalOverlay>
  );
}

function useScrolled(threshold: number) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

/** Bumps a counter whenever `value` goes up after data has loaded, to replay the hop. */
function useHopOnIncrease(value: number, loaded: boolean) {
  const prev = useRef({ value, loaded });
  const [hop, setHop] = useState(0);
  useEffect(() => {
    // The first load (0 -> saved count) is not an add, so only count rises seen while loaded
    if (prev.current.loaded && value > prev.current.value) setHop((n) => n + 1);
    prev.current = { value, loaded };
  }, [value, loaded]);
  return hop;
}
