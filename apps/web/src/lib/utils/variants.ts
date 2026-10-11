import type { HttpTypes } from "@medusajs/types";

/** Selected option values, keyed by option id */
export type Selection = Record<string, string>;

type Variant = HttpTypes.StoreProductVariant;

function variantValue(variant: Variant, optionId: string) {
  return variant.options?.find((o) => o.option_id === optionId)?.value;
}

function matches(variant: Variant, selection: Selection) {
  return Object.entries(selection).every(
    ([optionId, value]) => variantValue(variant, optionId) === value,
  );
}

/** The variant whose options equal the selection exactly; null until every option is chosen. */
export function findVariant(product: HttpTypes.StoreProduct, selection: Selection) {
  const optionIds = (product.options ?? []).map((o) => o.id);
  if (optionIds.some((id) => !selection[id])) {
    return optionIds.length === 0 ? (product.variants?.[0] ?? null) : null;
  }
  return product.variants?.find((v) => matches(v, selection)) ?? null;
}

/** Whether choosing `value` for `optionId` still leads to at least one real variant. */
export function isValueAvailable(
  product: HttpTypes.StoreProduct,
  selection: Selection,
  optionId: string,
  value: string,
) {
  const next = { ...selection, [optionId]: value };
  return (product.variants ?? []).some((v) => matches(v, next));
}

export function isInStock(variant: Variant | null | undefined) {
  if (!variant) return false;
  if (!variant.manage_inventory || variant.allow_backorder) return true;
  return (variant.inventory_quantity ?? 0) > 0;
}

/** Apply a choice; if it rules out every variant, keep the choice and drop the conflicting ones. */
export function selectValue(
  product: HttpTypes.StoreProduct,
  selection: Selection,
  optionId: string,
  value: string,
): Selection {
  const next = { ...selection, [optionId]: value };
  if ((product.variants ?? []).some((v) => matches(v, next))) return next;
  return { [optionId]: value };
}
