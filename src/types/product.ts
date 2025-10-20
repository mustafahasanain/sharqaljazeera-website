import type { BrandBasicInfo } from "./brand";
import type { CategoryBasicInfo } from "./category";

// Product Status & Condition
export type ProductStatus =
  | "active"
  | "inactive"
  | "draft"
  | "out_of_stock"
  | "discontinued";
export type ProductCondition = "new" | "refurbished" | "used" | "open_box";

// Core Product Types
export type Product = {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly shortDescription?: string;
  readonly status: ProductStatus;
  readonly condition: ProductCondition;
  readonly brandId: string;
  readonly brand?: BrandBasicInfo;
  readonly categoryId: string;
  readonly category?: CategoryBasicInfo;
  readonly price: number;
  readonly compareAtPrice?: number;
  readonly cost?: number;
  readonly currency: string;
  readonly taxable: boolean;
  readonly taxRate?: number;
  readonly weight?: number;
  readonly dimensions?: ProductDimensions;
  readonly images: readonly ProductImage[];
  readonly featured: boolean;
  readonly isNew: boolean;
  readonly isBestseller: boolean;
  readonly tags: readonly string[];
  readonly specifications?: readonly ProductSpecification[];
  readonly hasVariants: boolean;
  readonly variants?: readonly ProductVariant[];
  readonly inventory: ProductInventory;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoKeywords?: readonly string[];
  readonly viewCount: number;
  readonly favoriteCount: number;
  readonly reviewCount: number;
  readonly averageRating: number;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly publishedAt?: string;
};

export type ProductDimensions = {
  readonly length: number;
  readonly width: number;
  readonly height: number;
};
export type ProductImage = {
  readonly id: string;
  readonly url: string;
  readonly alt: string;
  readonly position: number;
  readonly isMain: boolean;
  readonly thumbnail?: string;
  readonly variants?: {
    readonly small: string;
    readonly medium: string;
    readonly large: string;
  };
};
export type ProductSpecification = {
  readonly name: string;
  readonly value: string;
  readonly group?: string;
};

// Product Variants
export type VariantOptionType = {
  readonly name: string;
  readonly values: readonly string[];
};
export type ProductVariant = {
  readonly id: string;
  readonly productId: string;
  readonly sku: string;
  readonly name: string;
  readonly options: Record<string, string>;
  readonly price?: number;
  readonly compareAtPrice?: number;
  readonly image?: string;
  readonly position: number;
  readonly inventory: ProductInventory;
  readonly barcode?: string;
  readonly weight?: number;
  readonly available: boolean;
  readonly createdAt: string;
  readonly updatedAt: string;
};
export type VariantSelection = {
  readonly variantId: string;
  readonly options: Record<string, string>;
};

// Inventory
export type InventoryPolicy = "track" | "no_track" | "track_but_allow_oversell";
export type ProductInventory = {
  readonly quantity: number;
  readonly policy: InventoryPolicy;
  readonly lowStockThreshold?: number;
  readonly allowBackorder: boolean;
  readonly isLowStock: boolean;
  readonly isOutOfStock: boolean;
  readonly reserved?: number;
  readonly available: number;
  readonly restockDate?: string;
  readonly updatedAt: string;
};

// Display Types
export type ProductCard = {
  readonly id: string;
  readonly sku: string;
  readonly name: string;
  readonly slug: string;
  readonly price: number;
  readonly compareAtPrice?: number;
  readonly currency: string;
  readonly mainImage?: ProductImage;
  readonly brand?: BrandBasicInfo;
  readonly featured: boolean;
  readonly isNew: boolean;
  readonly isBestseller: boolean;
  readonly averageRating: number;
  readonly reviewCount: number;
  readonly inventory: Pick<
    ProductInventory,
    "isOutOfStock" | "isLowStock" | "available"
  >;
  readonly hasVariants: boolean;
  readonly tags: readonly string[];
};
export type ProductListItem = ProductCard & {
  readonly shortDescription?: string;
  readonly categoryId: string;
  readonly category?: CategoryBasicInfo;
};
export type ProductDetail = Product & {
  readonly relatedProducts?: readonly ProductCard[];
  readonly upsellProducts?: readonly ProductCard[];
  readonly recentlyViewed?: readonly ProductCard[];
};

// Query & Filter
export type ProductFilterParams = {
  readonly status?: ProductStatus | readonly ProductStatus[];
  readonly condition?: ProductCondition | readonly ProductCondition[];
  readonly categoryId?: string | readonly string[];
  readonly brandId?: string | readonly string[];
  readonly priceMin?: number;
  readonly priceMax?: number;
  readonly inStock?: boolean;
  readonly featured?: boolean;
  readonly isNew?: boolean;
  readonly isBestseller?: boolean;
  readonly tags?: readonly string[];
  readonly rating?: number;
  readonly search?: string;
  readonly hasDiscount?: boolean;
};
export type ProductSortField =
  | "name"
  | "price"
  | "createdAt"
  | "updatedAt"
  | "publishedAt"
  | "averageRating"
  | "reviewCount"
  | "viewCount"
  | "popularity"
  | "discount";

// Creation & Update
export type ProductCreateData = Omit<
  Product,
  | "id"
  | "slug"
  | "brand"
  | "category"
  | "viewCount"
  | "favoriteCount"
  | "reviewCount"
  | "averageRating"
  | "createdAt"
  | "updatedAt"
  | "publishedAt"
> & { readonly slug?: string };
export type ProductUpdateData = Partial<Omit<ProductCreateData, "sku">>;
export type VariantCreateData = Omit<
  ProductVariant,
  "id" | "productId" | "createdAt" | "updatedAt"
>;
export type VariantUpdateData = Partial<Omit<VariantCreateData, "sku">>;

// Search
export type ProductSearchResult = ProductCard & {
  readonly highlights?: {
    readonly name?: string;
    readonly description?: string;
  };
  readonly score: number;
};
export type ProductSearchSuggestion = {
  readonly query: string;
  readonly products: readonly ProductCard[];
  readonly categories: readonly CategoryBasicInfo[];
  readonly brands: readonly BrandBasicInfo[];
};

// Statistics
export type ProductStats = {
  readonly productId: string;
  readonly viewCount: number;
  readonly favoriteCount: number;
  readonly cartAddCount: number;
  readonly orderCount: number;
  readonly revenue: number;
  readonly averageRating: number;
  readonly reviewCount: number;
  readonly conversionRate: number;
  readonly returnRate: number;
  readonly lastSoldAt?: string;
  readonly updatedAt: string;
};

// Reviews & Ratings
export type ProductReview = {
  readonly id: string;
  readonly productId: string;
  readonly userId: string;
  readonly userName: string;
  readonly userAvatar?: string;
  readonly rating: number;
  readonly title?: string;
  readonly comment: string;
  readonly images?: readonly string[];
  readonly verified: boolean;
  readonly helpful: number;
  readonly notHelpful: number;
  readonly status: "pending" | "approved" | "rejected";
  readonly createdAt: string;
  readonly updatedAt: string;
};
export type ProductRatingSummary = {
  readonly productId: string;
  readonly averageRating: number;
  readonly totalReviews: number;
  readonly distribution: {
    readonly 1: number;
    readonly 2: number;
    readonly 3: number;
    readonly 4: number;
    readonly 5: number;
  };
};

// Pricing
export type ProductPrice = {
  readonly productId: string;
  readonly variantId?: string;
  readonly basePrice: number;
  readonly salePrice?: number;
  readonly discount?: {
    readonly amount: number;
    readonly percentage: number;
    readonly label?: string;
  };
  readonly finalPrice: number;
  readonly currency: string;
  readonly taxIncluded: boolean;
  readonly tax?: { readonly rate: number; readonly amount: number };
};

// Availability
export type ProductAvailability = {
  readonly productId: string;
  readonly variantId?: string;
  readonly available: boolean;
  readonly quantity: number;
  readonly maxOrderQuantity?: number;
  readonly restockDate?: string;
  readonly message?: string;
};
