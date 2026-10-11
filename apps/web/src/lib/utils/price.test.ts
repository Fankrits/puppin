import { describe, expect, test } from "vite-plus/test";
import { formatPrice } from "./price";

describe("formatPrice utility", () => {
  test("formats standard positive price without dividing by 100", () => {
    // Medusa stores prices as display values ($49.99 = 49.99)
    const formatted = formatPrice(49.99, "USD", "en-US");
    expect(formatted).toBe("$49.99");
  });

  test("formats EUR currency with display value", () => {
    const formatted = formatPrice(10, "EUR", "en-US");
    expect(formatted).toBe("€10.00");
  });

  test("handles zero correctly", () => {
    const formatted = formatPrice(0, "USD", "en-US");
    expect(formatted).toBe("$0.00");
  });

  test("handles null and undefined gracefully", () => {
    expect(formatPrice(null)).toBe("-");
    expect(formatPrice(undefined)).toBe("-");
  });
});
