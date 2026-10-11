import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useAuth } from "../../../lib/context/auth";
import { listCustomerOrders } from "../../../lib/data/auth";
import { useQuery } from "@tanstack/react-query";
import { Button } from "../../../components/ui/button";
import { formatPrice } from "../../../lib/utils/price";
import { User, ShoppingBag, Package, LogOut, Calendar, ExternalLink } from "lucide-react";

export const Route = createFileRoute("/$countryCode/account/")({
  component: AccountDashboardPage,
});

function AccountDashboardPage() {
  const { countryCode } = Route.useParams();
  const navigate = useNavigate();
  const { customer, isAuthenticated, isLoading: isAuthLoading, logout } = useAuth();

  // Fetch customer orders
  const { data: orders = [], isLoading: isOrdersLoading } = useQuery({
    queryKey: ["customer-orders"],
    queryFn: () => listCustomerOrders(),
    enabled: isAuthenticated,
  });

  const handleLogout = async () => {
    await logout();
    void navigate({
      to: "/$countryCode",
      params: { countryCode },
    });
  };

  if (isAuthLoading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-20 text-center text-sm text-neutral-500">
        Loading your account...
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center space-y-4">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-neutral-100 text-neutral-600">
          <User className="h-7 w-7" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900">Sign in to view your account</h2>
        <p className="text-sm text-neutral-500">
          Track and view your recent purchases and shipping updates.
        </p>
        <div className="flex justify-center gap-3 pt-2">
          <Link to="/$countryCode/account/login" params={{ countryCode }}>
            <Button>Sign In</Button>
          </Link>
          <Link to="/$countryCode/account/register" params={{ countryCode }}>
            <Button variant="outline">Create Account</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8 space-y-8">
      {/* Header Profile Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-neutral-200 pb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-neutral-900 sm:text-3xl">
            My Account
          </h1>
          <p className="text-sm text-neutral-500 mt-1">
            Welcome back,{" "}
            <span className="font-semibold text-neutral-800">
              {customer?.first_name || customer?.email}
            </span>
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
          className="self-start sm:self-auto text-neutral-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4 mr-1.5" />
          Sign Out
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Profile Details */}
        <div className="space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-4">
            <h2 className="text-sm font-bold uppercase tracking-wider text-neutral-400">
              Profile Details
            </h2>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-xs text-neutral-500 block">Name</span>
                <span className="font-medium text-neutral-900">
                  {customer?.first_name
                    ? `${customer.first_name} ${customer.last_name || ""}`
                    : "Not provided"}
                </span>
              </div>
              <div>
                <span className="text-xs text-neutral-500 block">Email</span>
                <span className="font-medium text-neutral-900">{customer?.email}</span>
              </div>
              {customer?.phone && (
                <div>
                  <span className="text-xs text-neutral-500 block">Phone</span>
                  <span className="font-medium text-neutral-900">{customer.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-3">
            <h3 className="text-sm font-semibold text-neutral-900">Need help?</h3>
            <p className="text-xs text-neutral-500 leading-relaxed">
              If you have any questions regarding your past orders or shipping, our customer support
              team is available 24/7.
            </p>
          </div>
        </div>

        {/* Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <h2 className="text-lg font-bold text-neutral-900 flex items-center gap-2">
                <Package className="h-5 w-5 text-neutral-700" />
                Order History
              </h2>
              <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2.5 py-0.5 rounded-full">
                {orders.length} {orders.length === 1 ? "order" : "orders"}
              </span>
            </div>

            {isOrdersLoading ? (
              <div className="py-8 text-center text-sm text-neutral-500">
                Loading order history...
              </div>
            ) : orders.length === 0 ? (
              <div className="py-12 text-center space-y-3">
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
                  <ShoppingBag className="h-6 w-6" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900">No orders placed yet</h3>
                <p className="text-xs text-neutral-500 max-w-xs mx-auto">
                  When you purchase items while signed in, they will appear right here with full
                  shipping tracking.
                </p>
                <Link to="/$countryCode" params={{ countryCode }}>
                  <Button size="sm" className="mt-2">
                    Browse Catalog
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-neutral-100 space-y-4">
                {orders.map((ord) => {
                  const currency = ord.currency_code || "eur";
                  const createdDate = ord.created_at
                    ? new Date(ord.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })
                    : "";

                  return (
                    <div key={ord.id} className="pt-4 first:pt-0 space-y-3">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="space-y-0.5">
                          <span className="font-mono text-xs font-bold text-neutral-900">
                            #{ord.id.slice(-8).toUpperCase()}
                          </span>
                          {createdDate && (
                            <span className="text-xs text-neutral-500 flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {createdDate}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700">
                            {ord.status ? ord.status.toUpperCase() : "CONFIRMED"}
                          </span>
                          <Link
                            to="/$countryCode/order/$orderId/confirmed"
                            params={{ countryCode, orderId: ord.id }}
                            className="text-xs font-semibold text-neutral-900 hover:underline flex items-center gap-1"
                          >
                            Details
                            <ExternalLink className="h-3 w-3" />
                          </Link>
                        </div>
                      </div>

                      {/* Items in this order */}
                      {ord.items && ord.items.length > 0 && (
                        <div className="bg-neutral-50/70 rounded-xl p-3 divide-y divide-neutral-200/60">
                          {ord.items.map((item) => (
                            <div
                              key={item.id}
                              className="py-1.5 first:pt-0 last:pb-0 flex items-center justify-between text-xs"
                            >
                              <div className="flex items-center gap-2 min-w-0">
                                {item.thumbnail ? (
                                  <img
                                    src={item.thumbnail}
                                    alt={item.title || "Product"}
                                    className="h-8 w-8 rounded object-cover border border-neutral-200"
                                  />
                                ) : (
                                  <div className="h-8 w-8 rounded bg-neutral-200 flex items-center justify-center text-neutral-400">
                                    <ShoppingBag className="h-3 w-3" />
                                  </div>
                                )}
                                <span className="font-medium text-neutral-900 truncate max-w-[200px]">
                                  {item.title}
                                </span>
                                <span className="text-neutral-500 text-[11px]">
                                  x{item.quantity}
                                </span>
                              </div>
                              <span className="font-semibold text-neutral-900">
                                {formatPrice(
                                  (item.unit_price || 0) * (item.quantity || 1),
                                  currency,
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      <div className="flex justify-between items-center text-sm font-bold text-neutral-900 pt-1">
                        <span className="text-xs text-neutral-500 font-normal">Total paid:</span>
                        <span>{formatPrice(ord.total, currency)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
