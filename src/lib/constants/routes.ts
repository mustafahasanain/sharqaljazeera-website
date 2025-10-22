export const PUBLIC_ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  CONTACT: "/contact",
  TERMS: "/terms",
  PRIVACY: "/privacy",
  FAQ: "/faq",
} as const;

export const AUTH_ROUTES = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  RESET_PASSWORD: "/auth/reset-password",
  VERIFY_EMAIL: "/auth/verify-email",
  LOGOUT: "/auth/logout",
} as const;

export const PRODUCT_ROUTES = {
  LIST: "/products",
  DETAIL: (slug: string) => `/products/${slug}` as const,
  CATEGORY: (categorySlug: string) =>
    `/products/category/${categorySlug}` as const,
  SEARCH: "/products/search",
  NEW_ARRIVALS: "/products/new-arrivals",
  FEATURED: "/products/featured",
  BEST_SELLERS: "/products/best-sellers",
  ON_SALE: "/products/on-sale",
} as const;

export const CATEGORY_ROUTES = {
  LIST: "/categories",
  DETAIL: (slug: string) => `/categories/${slug}` as const,
} as const;

export const CART_ROUTES = {
  VIEW: "/cart",
  CHECKOUT: "/checkout",
  CHECKOUT_SUCCESS: "/checkout/success",
  CHECKOUT_CANCEL: "/checkout/cancel",
} as const;

// User Account Routes
export const ACCOUNT_ROUTES = {
  DASHBOARD: "/account",
  PROFILE: "/account/profile",
  ORDERS: "/account/orders",
  ORDER_DETAIL: (orderId: string) => `/account/orders/${orderId}` as const,
  WISHLIST: "/account/wishlist",
  ADDRESSES: "/account/addresses",
  SETTINGS: "/account/settings",
  SECURITY: "/account/security",
  NOTIFICATIONS: "/account/notifications",
} as const;

export const ADMIN_ROUTES = {
  DASHBOARD: "/admin",

  // Product Management
  PRODUCTS: "/admin/products",
  PRODUCTS_CREATE: "/admin/products/create",
  PRODUCTS_EDIT: (productId: string) =>
    `/admin/products/${productId}/edit` as const,

  // Order Management
  ORDERS: "/admin/orders",
  ORDER_DETAIL: (orderId: string) => `/admin/orders/${orderId}` as const,

  // Category Management
  CATEGORIES: "/admin/categories",
  CATEGORIES_CREATE: "/admin/categories/create",
  CATEGORIES_EDIT: (categoryId: string) =>
    `/admin/categories/${categoryId}/edit` as const,

  // User Management
  USERS: "/admin/users",
  USER_DETAIL: (userId: string) => `/admin/users/${userId}` as const,

  ANALYTICS: "/admin/analytics",
  REPORTS: "/admin/reports",

  SETTINGS: "/admin/settings",
} as const;

export const ERROR_ROUTES = {
  NOT_FOUND: "/404",
  SERVER_ERROR: "/500",
  UNAUTHORIZED: "/401",
  FORBIDDEN: "/403",
} as const;

// All Routes Combined
export const ROUTES = {
  PUBLIC: PUBLIC_ROUTES,
  AUTH: AUTH_ROUTES,
  PRODUCTS: PRODUCT_ROUTES,
  CATEGORIES: CATEGORY_ROUTES,
  CART: CART_ROUTES,
  ACCOUNT: ACCOUNT_ROUTES,
  ADMIN: ADMIN_ROUTES,
  ERROR: ERROR_ROUTES,
} as const;

export const PROTECTED_ROUTES = ["/account", "/admin", "/checkout"] as const;

export const ADMIN_ONLY_ROUTES = ["/admin"] as const;

export const ROUTE_METADATA = {
  [PUBLIC_ROUTES.HOME]: {
    title: "Home",
    description: "Welcome to Sharq Al Jazeera E-commerce Platform",
  },
  [PUBLIC_ROUTES.ABOUT]: {
    title: "About Us",
    description: "Learn more about our company",
  },
  [PUBLIC_ROUTES.CONTACT]: {
    title: "Contact Us",
    description: "Get in touch with our team",
  },
  [PRODUCT_ROUTES.LIST]: {
    title: "All Products",
    description: "Browse our complete product catalog",
  },
  [CART_ROUTES.VIEW]: {
    title: "Shopping Cart",
    description: "Review your cart items",
  },
  [CART_ROUTES.CHECKOUT]: {
    title: "Checkout",
    description: "Complete your purchase",
  },
  [ACCOUNT_ROUTES.DASHBOARD]: {
    title: "My Account",
    description: "Manage your account settings",
  },
  [ACCOUNT_ROUTES.ORDERS]: {
    title: "My Orders",
    description: "View your order history",
  },
  [ACCOUNT_ROUTES.WISHLIST]: {
    title: "My Wishlist",
    description: "Your saved items",
  },
  [ADMIN_ROUTES.DASHBOARD]: {
    title: "Admin Dashboard",
    description: "Manage your e-commerce platform",
  },
} as const;

// Type helper to extract all possible route paths
export type RoutePath =
  | (typeof PUBLIC_ROUTES)[keyof typeof PUBLIC_ROUTES]
  | (typeof AUTH_ROUTES)[keyof typeof AUTH_ROUTES]
  | (typeof CART_ROUTES)[keyof typeof CART_ROUTES]
  | (typeof ACCOUNT_ROUTES)[keyof typeof ACCOUNT_ROUTES]
  | (typeof ADMIN_ROUTES)[keyof typeof ADMIN_ROUTES]
  | (typeof ERROR_ROUTES)[keyof typeof ERROR_ROUTES]
  | string; // For dynamic routes

export type RouteMetadataKey = keyof typeof ROUTE_METADATA;
