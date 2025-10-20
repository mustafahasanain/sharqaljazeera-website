// Import All Schemas
import * as usersSchema from "./users";
import * as brandsSchema from "./brands";
import * as categoriesSchema from "./categories";
import * as productsSchema from "./products";
import * as cartsSchema from "./carts";
import * as favoritesSchema from "./favorites";
import * as ordersSchema from "./orders";

// Export All Schemas
export * from "./users";
export * from "./brands";
export * from "./categories";
export * from "./products";
export * from "./carts";
export * from "./favorites";
export * from "./orders";

// Schemas Collection (exported as a single object for passing Drizzle ORM init)
export const schema = {
  // Users
  users: usersSchema.users,
  accounts: usersSchema.accounts,
  sessions: usersSchema.sessions,
  verificationTokens: usersSchema.verificationTokens,
  addresses: usersSchema.addresses,
  userPreferences: usersSchema.userPreferences,
  userActivity: usersSchema.userActivity,
  // Relations
  usersRelations: usersSchema.usersRelations,
  accountsRelations: usersSchema.accountsRelations,
  sessionsRelations: usersSchema.sessionsRelations,
  verificationTokensRelations: usersSchema.verificationTokensRelations,
  addressesRelations: usersSchema.addressesRelations,
  userPreferencesRelations: usersSchema.userPreferencesRelations,
  userActivityRelations: usersSchema.userActivityRelations,

  // Brands
  brands: brandsSchema.brands,
  brandsRelations: brandsSchema.brandsRelations,

  // Categories
  categories: categoriesSchema.categories,
  categoriesRelations: categoriesSchema.categoriesRelations,

  // Products
  products: productsSchema.products,
  productImages: productsSchema.productImages,
  productSpecifications: productsSchema.productSpecifications,
  productVariants: productsSchema.productVariants,
  productInventory: productsSchema.productInventory,
  variantInventory: productsSchema.variantInventory,
  productsRelations: productsSchema.productsRelations,
  productImagesRelations: productsSchema.productImagesRelations,
  productSpecificationsRelations: productsSchema.productSpecificationsRelations,
  productVariantsRelations: productsSchema.productVariantsRelations,
  productInventoryRelations: productsSchema.productInventoryRelations,
  variantInventoryRelations: productsSchema.variantInventoryRelations,

  // Carts
  carts: cartsSchema.carts,
  cartItems: cartsSchema.cartItems,
  cartsRelations: cartsSchema.cartsRelations,
  cartItemsRelations: cartsSchema.cartItemsRelations,

  // Favorites
  favorites: favoritesSchema.favorites,
  favoritesRelations: favoritesSchema.favoritesRelations,

  // Orders
  orders: ordersSchema.orders,
  orderItems: ordersSchema.orderItems,
  payments: ordersSchema.payments,
  shipments: ordersSchema.shipments,
  shipmentTrackingEvents: ordersSchema.shipmentTrackingEvents,
  orderStatusHistory: ordersSchema.orderStatusHistory,
  ordersRelations: ordersSchema.ordersRelations,
  orderItemsRelations: ordersSchema.orderItemsRelations,
  paymentsRelations: ordersSchema.paymentsRelations,
  shipmentsRelations: ordersSchema.shipmentsRelations,
  shipmentTrackingEventsRelations: ordersSchema.shipmentTrackingEventsRelations,
  orderStatusHistoryRelations: ordersSchema.orderStatusHistoryRelations,
};
