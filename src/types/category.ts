// Category status
export type CategoryStatus = "active" | "inactive" | "draft";

// Core category entity
export type Category = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly description?: string;
  readonly parentId: string | null; // null for root categories
  readonly level: number; // 0=root, 1=child, etc.
  readonly path: readonly string[];
  readonly icon?: string;
  readonly image?: string;
  readonly coverImage?: string;
  readonly status: CategoryStatus;
  readonly featured: boolean;
  readonly displayOrder: number;
  readonly productCount: number;
  readonly showInMenu: boolean;
  readonly seoTitle?: string;
  readonly seoDescription?: string;
  readonly seoKeywords?: readonly string[];
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Minimal category info
export type CategoryBasicInfo = Pick<
  Category,
  "id" | "name" | "slug" | "level"
>;

// Category with children
export type CategoryWithChildren = Category & {
  readonly children: readonly CategoryWithChildren[];
  readonly hasChildren: boolean;
};

// Flattened category node
export type CategoryTreeNode = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly level: number;
  readonly parentId: string | null;
  readonly indent: number;
  readonly hasChildren: boolean;
};

// Category card
export type CategoryCard = Pick<
  Category,
  "id" | "name" | "slug" | "image" | "icon" | "productCount" | "featured"
>;

// Create category
export type CategoryCreateData = Omit<
  Category,
  "id" | "slug" | "level" | "path" | "productCount" | "createdAt" | "updatedAt"
> & {
  readonly slug?: string; // Auto-generated if missing
};

// Update category
export type CategoryUpdateData = Partial<
  Omit<CategoryCreateData, "parentId">
> & {
  readonly parentId?: string | null;
  readonly slug?: string;
};

// Breadcrumb item
export type CategoryBreadcrumb = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly level: number;
};

// Category path
export type CategoryPath = readonly CategoryBreadcrumb[];

// With ancestors
export type CategoryWithAncestors = Category & {
  readonly ancestors: readonly CategoryBasicInfo[];
};

// With descendants
export type CategoryWithDescendants = Category & {
  readonly descendantCount: number;
  readonly directChildrenCount: number;
};

// Category filters
export type CategoryFilterParams = {
  readonly status?: CategoryStatus | readonly CategoryStatus[];
  readonly featured?: boolean;
  readonly parentId?: string | null;
  readonly level?: number;
  readonly showInMenu?: boolean;
  readonly search?: string;
  readonly hasProducts?: boolean;
};

// Sortable category fields
export type CategorySortField =
  | "name"
  | "displayOrder"
  | "productCount"
  | "level"
  | "createdAt"
  | "updatedAt";

// Category tree options
export type CategoryTreeOptions = {
  readonly maxDepth?: number;
  readonly includeInactive?: boolean;
  readonly includeEmpty?: boolean;
  readonly expandAll?: boolean;
};

// Category stats
export type CategoryStats = {
  readonly categoryId: string;
  readonly totalProducts: number;
  readonly activeProducts: number;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly viewCount: number;
  readonly popularProducts: readonly string[];
  readonly topBrands: readonly string[];
  readonly lastUpdated: string;
};

// Category with products
export type CategoryWithProducts = Category & {
  readonly products: {
    readonly total: number;
    readonly active: number;
    readonly priceRange: {
      readonly min: number;
      readonly max: number;
      readonly currency: string;
    };
  };
};

// Category menu item
export type CategoryMenuItem = {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly icon?: string;
  readonly level: number;
  readonly children?: readonly CategoryMenuItem[];
  readonly isMegaMenu?: boolean;
  readonly productCount: number;
};

// Mega menu category
export type MegaMenuCategory = CategoryMenuItem & {
  readonly featured: boolean;
  readonly image?: string;
  readonly columns: readonly CategoryMenuItem[][];
  readonly promotionalBanner?: {
    readonly image: string;
    readonly link: string;
    readonly title: string;
  };
};

// SEO metadata
export type CategorySeoMeta = {
  readonly categoryId: string;
  readonly title: string;
  readonly description: string;
  readonly keywords: readonly string[];
  readonly ogImage?: string;
  readonly ogTitle?: string;
  readonly ogDescription?: string;
  readonly canonicalUrl?: string;
  readonly structuredData?: Record<string, unknown>;
};

// Marketing content
export type CategoryMarketingContent = {
  readonly categoryId: string;
  readonly headline?: string;
  readonly subheadline?: string;
  readonly bannerImage?: string;
  readonly bannerLink?: string;
  readonly featuredBrands?: readonly string[];
  readonly highlights?: readonly string[];
};
