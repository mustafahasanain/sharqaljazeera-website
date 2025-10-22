export const API = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || "/api",
  VERSION: "v1",
  TIMEOUT: 30000,
} as const;

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    LOGOUT: "/auth/logout",
    REGISTER: "/auth/register",
    REFRESH: "/auth/refresh",
    VERIFY_EMAIL: "/auth/verify-email",
    FORGOT_PASSWORD: "/auth/forgot-password",
    RESET_PASSWORD: "/auth/reset-password",
  },

  USERS: {
    PROFILE: "/users/profile",
    UPDATE: "/users/update",
    DELETE: "/users/delete",
    ORDERS: "/users/orders",
    WISHLIST: "/users/wishlist",
    ADDRESSES: "/users/addresses",
  },

  PRODUCTS: {
    LIST: "/products",
    DETAIL: (id: string) => `/products/${id}`,
    SEARCH: "/products/search",
    CATEGORIES: "/products/categories",
    FEATURED: "/products/featured",
    NEW_ARRIVALS: "/products/new-arrivals",
    BEST_SELLERS: "/products/best-sellers",
    REVIEWS: (productId: string) => `/products/${productId}/reviews`,
  },

  CART: {
    GET: "/cart",
    ADD: "/cart/add",
    UPDATE: "/cart/update",
    REMOVE: "/cart/remove",
    CLEAR: "/cart/clear",
  },

  ORDERS: {
    CREATE: "/orders",
    LIST: "/orders",
    DETAIL: (id: string) => `/orders/${id}`,
    CANCEL: (id: string) => `/orders/${id}/cancel`,
    TRACK: (id: string) => `/orders/${id}/track`,
  },

  PAYMENT: {
    PROCESS: "/payment/process",
    VERIFY: "/payment/verify",
    METHODS: "/payment/methods",
  },

  CATEGORIES: {
    LIST: "/categories",
    DETAIL: (id: string) => `/categories/${id}`,
    PRODUCTS: (id: string) => `/categories/${id}/products`,
  },

  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    PRODUCTS: "/admin/products",
    ORDERS: "/admin/orders",
    USERS: "/admin/users",
    ANALYTICS: "/admin/analytics",
  },
} as const;

export const HTTP_STATUS = {
  // Success
  OK: 200,
  CREATED: 201,
  ACCEPTED: 202,
  NO_CONTENT: 204,

  // Redirection
  MOVED_PERMANENTLY: 301,
  FOUND: 302,
  NOT_MODIFIED: 304,

  // Client Errors
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  METHOD_NOT_ALLOWED: 405,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,

  // Server Errors
  INTERNAL_SERVER_ERROR: 500,
  BAD_GATEWAY: 502,
  SERVICE_UNAVAILABLE: 503,
  GATEWAY_TIMEOUT: 504,
} as const;

export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MIN_LIMIT: 10,
  MAX_LIMIT: 100,
  PRODUCT_GRID_LIMIT: 24,
  SEARCH_RESULTS_LIMIT: 50,
} as const;

export const PRODUCT = {
  MIN_PRICE: 0,
  MAX_PRICE: 1000000,
  MAX_QUANTITY: 999,
  MIN_QUANTITY: 1,
  MAX_IMAGES: 10,
  MAX_TITLE_LENGTH: 200,
  MAX_DESCRIPTION_LENGTH: 5000,
  REVIEW_MIN_RATING: 1,
  REVIEW_MAX_RATING: 5,
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB in bytes
  ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/jpg", "image/png", "image/webp"],
  ALLOWED_DOCUMENT_TYPES: ["application/pdf", "application/msword"],
  MAX_PRODUCT_IMAGES: 10,
  MAX_PROFILE_IMAGE_SIZE: 2 * 1024 * 1024, // 2MB
} as const;

export const CACHE_TTL = {
  SHORT: 60, // 1 minute
  MEDIUM: 300, // 5 minutes
  LONG: 3600, // 1 hour
  DAY: 86400, // 24 hours
  WEEK: 604800, // 7 days
} as const;

export const SESSION = {
  COOKIE_NAME: "session",
  MAX_AGE: 7 * 24 * 60 * 60, // 7 days in seconds
  REFRESH_THRESHOLD: 24 * 60 * 60, // Refresh if less than 1 day remaining
} as const;

export const ORDER = {
  MIN_AMOUNT: 10,
  MAX_ITEMS: 50,
  STATUSES: {
    PENDING: "pending",
    PROCESSING: "processing",
    SHIPPED: "shipped",
    DELIVERED: "delivered",
    CANCELLED: "cancelled",
    REFUNDED: "refunded",
  } as const,
  PAYMENT_METHODS: {
    CARD: "card",
    PAYPAL: "paypal",
    CASH_ON_DELIVERY: "cash_on_delivery",
  } as const,
} as const;

export const USER = {
  ROLES: {
    ADMIN: "admin",
    CUSTOMER: "customer",
    VENDOR: "vendor",
  } as const,
  PASSWORD_MIN_LENGTH: 8,
  USERNAME_MIN_LENGTH: 3,
  USERNAME_MAX_LENGTH: 30,
} as const;

export const SEARCH = {
  MIN_QUERY_LENGTH: 2,
  DEBOUNCE_DELAY: 300, // milliseconds
  MAX_SUGGESTIONS: 10,
  MAX_RECENT_SEARCHES: 5,
} as const;

export const APP = {
  NAME: "Sharq Al Jazeera",
  DESCRIPTION: "Modern E-commerce Platform",
  SUPPORT_EMAIL: "support@sharqaljazeera.com",
  CURRENCY: "IQD",
  CURRENCY_SYMBOL: "IQD",
  DEFAULT_LOCALE: "en-US",
  SUPPORTED_LOCALES: ["en-US", "ar-SA"] as const,
  // Note: All numbers are formatted using Western numerals (0-9) regardless of UI language
  NUMERIC_LOCALE: "en-US",
} as const;

export const REGEX = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^\+?[\d\s-()]+$/,
  POSTAL_CODE: /^[\d\s-]+$/,
  SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  URL: /^https?:\/\/.+/,
} as const;

export const DATETIME = {
  FORMAT: {
    SHORT_DATE: "MM/DD/YYYY",
    LONG_DATE: "MMMM DD, YYYY",
    TIME: "HH:mm",
    DATETIME: "MM/DD/YYYY HH:mm",
    ISO: "YYYY-MM-DDTHH:mm:ss.sssZ",
  } as const,
  TIMEZONE: "UTC",
} as const;

export const CURRENCY = {
  SUPPORTED: ["IQD", "USD"] as const,

  DEFAULT: "IQD",

  EXCHANGE_RATES: {
    IQD_TO_USD: 1320,
    USD_TO_IQD: 1 / 1320,
  } as const,

  SYMBOLS: {
    IQD: "د.ع.",
    USD: "$",
  } as const,

  CODES: {
    IQD: "IQD",
    USD: "USD",
  } as const,

  DECIMALS: {
    IQD: 0,
    USD: 2,
  } as const,

  STORAGE_KEY: "preferred_currency",
} as const;
