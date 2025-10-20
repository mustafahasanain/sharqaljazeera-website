// Brand status
export type BrandStatus = "active" | "inactive" | "draft";

// Core brand entity
export type Brand = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly logo?: string;
  readonly coverImage?: string;
  readonly status: BrandStatus;
  readonly featured: boolean;
  readonly websiteUrl?: string;
  readonly country?: string;
  readonly foundedYear?: number;
  readonly productCount: number;
  readonly displayOrder: number;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoKeywords?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Minimal brand info
export type BrandBasicInfo = Pick<Brand, "id" | "name" | "slug" | "logo">;

// Brand card data
export type BrandCard = Pick<
  Brand,
  "id" | "name" | "slug" | "logo" | "productCount" | "featured"
>;

// Create brand
export type BrandCreateData = Omit<
  Brand,
  "id" | "slug" | "productCount" | "createdAt" | "updatedAt"
> & {
  readonly slug?: string; // Auto-generated if missing
};

// Update brand
export type BrandUpdateData = Partial<Omit<BrandCreateData, "slug">> & {
  readonly slug?: string;
};

// Brand filters
export type BrandFilterParams = {
  readonly status?: BrandStatus | readonly BrandStatus[];
  readonly featured?: boolean;
  readonly country?: string;
  readonly search?: string;
  readonly hasProducts?: boolean;
};

// Sortable brand fields
export type BrandSortField =
  | "name"
  | "productCount"
  | "displayOrder"
  | "createdAt"
  | "updatedAt";

// Brand statistics
export type BrandStats = {
  readonly brandId: string;
  readonly totalProducts: number;
  readonly activeProducts: number;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly averageProductRating: number;
  readonly popularProducts: readonly string[];
  readonly lastUpdated: string;
};

// Brand with product summary
export type BrandWithProducts = Brand & {
  readonly products: {
    readonly total: number;
    readonly active: number;
    readonly categories: readonly string[];
  };
};

// SEO metadata
export type BrandSeoMeta = {
  readonly brandId: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly ogImage?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly canonicalUrl?: string;
};

// Marketing content
export type BrandMarketingContent = {
  readonly brandId: string;
  readonly tagline?: string;
  readonly story?: string;
  readonly highlights?: readonly string[];
  readonly bannerImages?: readonly string[];
  readonly videoUrl?: string;
  readonly socialLinks?: {
    readonly facebook?: string;
    readonly instagram?: string;
    readonly twitter?: string;
    readonly youtube?: string;
  };
};
