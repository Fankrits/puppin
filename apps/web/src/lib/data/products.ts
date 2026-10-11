import { sdk } from "../sdk";
import type { HttpTypes } from "@medusajs/types";

export interface ListProductsParams {
  pageParam?: number;
  queryParams?: HttpTypes.StoreProductListParams;
  countryCode?: string;
  regionId?: string;
}

export async function listProducts({ queryParams, regionId }: ListProductsParams = {}): Promise<{
  products: HttpTypes.StoreProduct[];
  count: number;
}> {
  try {
    const params: HttpTypes.StoreProductListParams = {
      ...queryParams,
      ...(regionId ? { region_id: regionId } : {}),
    };

    const { products, count } = await sdk.store.product.list(params);
    return {
      products: products || [],
      count: count || 0,
    };
  } catch (error) {
    console.error("Failed to list products from Medusa:", error);
    return { products: [], count: 0 };
  }
}

export async function getProductByHandle(
  handle: string,
  regionId?: string,
): Promise<HttpTypes.StoreProduct | null> {
  try {
    const params: HttpTypes.StoreProductListParams = {
      handle,
      limit: 1,
      fields: "*variants,*variants.calculated_price,*options,*options.values,*images,*categories",
      ...(regionId ? { region_id: regionId } : {}),
    };

    const { products } = await sdk.store.product.list(params);
    return products?.[0] || null;
  } catch (error) {
    console.error(`Failed to get product by handle ${handle}:`, error);
    return null;
  }
}

export async function listCategories(): Promise<HttpTypes.StoreProductCategory[]> {
  try {
    const { product_categories } = await sdk.store.category.list({
      fields: "id,name,handle,parent_category_id",
    });
    return product_categories || [];
  } catch (error) {
    console.error("Failed to fetch product categories:", error);
    return [];
  }
}
