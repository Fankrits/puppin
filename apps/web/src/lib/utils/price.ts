/**
 * Formats a monetary price amount.
 *
 * CRITICAL RULE: Medusa prices are stored in their display value (e.g. 49.99 = $49.99),
 * NOT in cents (unlike Stripe). NEVER divide by 100!
 */
export function formatPrice(
  amount: number | null | undefined,
  currencyCode = "USD",
  locale = "en-US",
): string {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return "-";
  }

  try {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: currencyCode.toUpperCase(),
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`;
  }
}
