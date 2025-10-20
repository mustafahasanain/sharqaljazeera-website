import type {
  NewUser,
  NewBrand,
  NewCategory,
  NewProduct,
  NewProductImage,
  NewProductInventory,
  NewAddress,
  NewUserPreferences,
  NewCart,
  NewCartItem,
  NewOrder,
  NewOrderItem,
} from "@/db/schema";

/**
 * Factory functions for creating test data
 */

export const createUserData = (overrides?: Partial<NewUser>): NewUser => ({
  email: `test-${Date.now()}@example.com`,
  emailVerified: false,
  phoneVerified: false,
  passwordHash: "$2a$10$testHashForDevOnly123456789",
  firstName: "Test",
  lastName: "User",
  role: "customer",
  status: "active",
  ...overrides,
});

export const createBrandData = (overrides?: Partial<NewBrand>): NewBrand => ({
  name: `Test Brand ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  slug: `test-brand-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  description: "A test brand for testing purposes",
  status: "active",
  featured: false,
  productCount: 0,
  displayOrder: 0,
  ...overrides,
});

export const createCategoryData = (
  overrides?: Partial<NewCategory>
): NewCategory => ({
  name: `Test Category ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  slug: `test-category-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  description: "A test category",
  level: 0,
  path: [],
  status: "active",
  featured: false,
  productCount: 0,
  displayOrder: 0,
  showInMenu: true,
  ...overrides,
});

export const createProductData = (
  brandId: string,
  categoryId: string,
  overrides?: Partial<NewProduct>
): NewProduct => ({
  sku: `TEST-SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: `Test Product ${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  slug: `test-product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  description: "A test product description",
  shortDescription: "Test product",
  status: "active",
  condition: "new",
  brandId,
  categoryId,
  price: "99.99",
  currency: "USD",
  taxable: true,
  featured: false,
  isNew: false,
  isBestseller: false,
  hasVariants: false,
  viewCount: 0,
  favoriteCount: 0,
  reviewCount: 0,
  averageRating: "0",
  ...overrides,
});

export const createProductImageData = (
  productId: string,
  overrides?: Partial<NewProductImage>
): NewProductImage => ({
  productId,
  url: "https://example.com/image.jpg",
  alt: "Test product image",
  position: 0,
  isMain: false,
  ...overrides,
});

export const createProductInventoryData = (
  productId: string,
  overrides?: Partial<NewProductInventory>
): NewProductInventory => ({
  productId,
  quantity: 100,
  policy: "track",
  lowStockThreshold: 10,
  allowBackorder: false,
  reserved: 0,
  ...overrides,
});

export const createAddressData = (
  userId: string,
  overrides?: Partial<NewAddress>
): NewAddress => ({
  userId,
  type: "home",
  isDefault: false,
  recipientName: "Test Recipient",
  recipientPhone: "+1234567890",
  addressLine1: "123 Test Street",
  city: "Test City",
  governorate: "Test Governorate",
  country: "Iraq",
  ...overrides,
});

export const createUserPreferencesData = (
  userId: string,
  overrides?: Partial<NewUserPreferences>
): NewUserPreferences => ({
  userId,
  language: "en",
  currency: "USD",
  theme: "light",
  notifications: {
    email: {
      orderUpdates: true,
      promotions: true,
      newsletter: true,
      accountActivity: true,
    },
    sms: {
      orderUpdates: true,
      promotions: false,
    },
    push: {
      orderUpdates: true,
      promotions: false,
      newArrivals: true,
    },
  },
  ...overrides,
});

export const createCartData = (
  userId: string | null,
  overrides?: Partial<NewCart>
): NewCart => ({
  userId,
  sessionId: userId ? null : `session-${Date.now()}`,
  ...overrides,
});

export const createCartItemData = (
  cartId: string,
  productId: string,
  overrides?: Partial<NewCartItem>
): NewCartItem => ({
  cartId,
  productId,
  quantity: 1,
  ...overrides,
});

export const createOrderData = (
  userId: string,
  shippingAddressId: string,
  overrides?: Partial<NewOrder>
): NewOrder => ({
  userId,
  orderNumber: `ORD-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  status: "pending",
  paymentStatus: "pending",
  fulfillmentStatus: "unfulfilled",
  subtotal: "100",
  shippingCost: "0",
  tax: "0",
  total: "100",
  currency: "IQD",
  shippingAddressId,
  shippingMethodId: "standard",
  shippingMethodName: "Standard Shipping",
  paymentMethodId: "cod",
  paymentMethodType: "cash_on_delivery",
  paymentMethodName: "Cash on Delivery",
  ...overrides,
});

export const createOrderItemData = (
  orderId: string,
  productId: string,
  overrides?: Partial<NewOrderItem>
): NewOrderItem => ({
  orderId,
  productId,
  sku: `ORDER-ITEM-SKU-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
  name: `Order Item ${Date.now()}`,
  slug: `order-item-${Date.now()}`,
  quantity: 1,
  price: "99.99",
  subtotal: "99.99",
  total: "99.99",
  ...overrides,
});

/**
 * Helper to generate multiple items
 */
export const generateMultiple = <T>(
  factory: () => T,
  count: number
): T[] => {
  return Array.from({ length: count }, () => factory());
};
