import { describe, expect, it } from "bun:test";
import { toOptionValues } from "../../search/helpers/option-values";
import { toProductPricing } from "../../search/helpers/pricing";

describe("Medusa Search Helpers: Option Values", () => {
  it("formats option values into tag strings correctly", () => {
    const options = [
      {
        title: "Size",
        values: [{ value: "S" }, { value: "M" }, { value: "L" }],
      },
      {
        title: "Color",
        values: [{ value: "Black" }, { value: "White" }],
      },
    ];

    const result = toOptionValues(options);
    expect(result).toEqual(["Size:S", "Size:M", "Size:L", "Color:Black", "Color:White"]);
  });

  it("handles null, undefined or empty options gracefully", () => {
    expect(toOptionValues(null)).toEqual([]);
    expect(toOptionValues(undefined)).toEqual([]);
    expect(toOptionValues([])).toEqual([]);
    expect(toOptionValues([{ title: "", values: [{ value: "Test" }] }])).toEqual([]);
  });

  it("deduplicates identical option values", () => {
    const options = [
      {
        title: "Size",
        values: [{ value: "M" }, { value: "M" }],
      },
    ];
    const result = toOptionValues(options);
    expect(result).toEqual(["Size:M"]);
  });
});

describe("Medusa Search Helpers: Pricing Calculation", () => {
  it("calculates min, max, and original price for eur and usd", () => {
    const pricingRows = {
      eur: [
        { calculated_price: { calculated_amount: 25, original_amount: 30 } },
        { calculated_price: { calculated_amount: 50, original_amount: 50 } },
      ],
      usd: [
        { calculated_price: { calculated_amount: 20, original_amount: 20 } },
        { calculated_price: { calculated_amount: 40, original_amount: 45 } },
      ],
    };

    const pricing = toProductPricing(pricingRows);

    expect(pricing.min_price_eur).toBe(25);
    expect(pricing.max_price_eur).toBe(50);
    expect(pricing.original_price_eur).toBe(30);
    expect(pricing.on_sale_eur).toBe(true);

    expect(pricing.min_price_usd).toBe(20);
    expect(pricing.max_price_usd).toBe(40);
    expect(pricing.original_price_usd).toBe(20);
    expect(pricing.on_sale_usd).toBe(false);
  });

  it("handles empty or missing currency rows gracefully", () => {
    const result = toProductPricing({});
    expect(result).toEqual({});
  });
});
