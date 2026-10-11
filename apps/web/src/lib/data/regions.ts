import { sdk } from "../sdk";
import type { HttpTypes } from "@medusajs/types";

export async function listRegions(
  queryParams?: Record<string, unknown>,
): Promise<HttpTypes.StoreRegion[]> {
  try {
    const { regions } = await sdk.store.region.list(queryParams);
    return regions || [];
  } catch (error) {
    console.error("Failed to fetch regions from Medusa:", error);
    return [];
  }
}

export async function getRegion(id: string): Promise<HttpTypes.StoreRegion | null> {
  try {
    const { region } = await sdk.store.region.retrieve(id);
    return region || null;
  } catch (error) {
    console.error(`Failed to retrieve region ${id}:`, error);
    return null;
  }
}

/** The region serving a country code, falling back to the first region. */
export function findRegionForCountry(regions: HttpTypes.StoreRegion[], countryCode: string) {
  const code = countryCode.toLowerCase();
  return (
    regions.find((r) => r.countries?.some((c) => c.iso_2?.toLowerCase() === code)) ??
    regions[0] ??
    null
  );
}
