import { describe, expect, test } from "vite-plus/test";
import type { HttpTypes } from "@medusajs/types";
import { findVariant, isInStock, isValueAvailable, selectValue } from "./variants";

// Shape mirrors the Medusa store API: 6 of 8 Color x Size combinations exist
const v = (
  id: string,
  color: string,
  size: string,
  extra: Partial<HttpTypes.StoreProductVariant> = {},
) =>
  ({
    id,
    manage_inventory: true,
    allow_backorder: false,
    inventory_quantity: 5,
    options: [
      { option_id: "color", value: color },
      { option_id: "size", value: size },
    ],
    ...extra,
  }) as unknown as HttpTypes.StoreProductVariant;

const product = {
  options: [{ id: "color" }, { id: "size" }],
  variants: [
    v("sw", "White", "S"),
    v("mw", "White", "M"),
    v("lb", "Black", "L"),
    v("mb", "Black", "M", { inventory_quantity: 0 }),
    v("sb", "Black", "S"),
    v("xb", "Black", "XL"),
  ],
} as unknown as HttpTypes.StoreProduct;

describe("findVariant", () => {
  test("matches on option id and value, not just option name", () => {
    expect(findVariant(product, { color: "Black", size: "L" })?.id).toBe("lb");
  });

  test("returns null until every option is chosen", () => {
    expect(findVariant(product, { color: "Black" })).toBeNull();
  });

  test("returns null for a combination that does not exist", () => {
    expect(findVariant(product, { color: "White", size: "XL" })).toBeNull();
  });
});

describe("isValueAvailable", () => {
  test("rules out sizes the chosen colour does not come in", () => {
    expect(isValueAvailable(product, { color: "White" }, "size", "XL")).toBe(false);
    expect(isValueAvailable(product, { color: "White" }, "size", "M")).toBe(true);
  });
});

describe("isInStock", () => {
  test("respects inventory, backorder and unmanaged stock", () => {
    expect(isInStock(findVariant(product, { color: "Black", size: "M" }))).toBe(false);
    expect(isInStock(v("x", "a", "b", { inventory_quantity: 0, allow_backorder: true }))).toBe(
      true,
    );
    expect(isInStock(v("x", "a", "b", { inventory_quantity: 0, manage_inventory: false }))).toBe(
      true,
    );
    expect(isInStock(null)).toBe(false);
  });
});

describe("selectValue", () => {
  test("keeps compatible choices", () => {
    expect(selectValue(product, { color: "Black" }, "size", "XL")).toEqual({
      color: "Black",
      size: "XL",
    });
  });

  test("drops a conflicting choice instead of trapping the shopper", () => {
    expect(selectValue(product, { size: "XL" }, "color", "White")).toEqual({ color: "White" });
  });
});
