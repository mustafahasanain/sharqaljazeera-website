/**
 * Database Schema - Central Export
 *
 * This file re-exports all database schemas, relations, validation schemas, and types
 * for easy importing throughout the application.
 */

// Better Auth schemas (for authentication)
export * from './auth/user';
export * from './auth/account';
export * from './auth/session';
export * from './auth/verification';
export * from './auth/guest';
export * from './auth/passwordReset';

// eCommerce Users
export * from './users';
export * from './guests';
export * from './addresses';

// Categories
export * from './categories';

// Filters
export * from './filters/brands';
export * from './filters/colors';
export * from './filters/sizes';
export * from './filters/models';
export * from './filters/lengths';
export * from './filters/product-types';

// Products
export * from './products';
export * from './variants';

// Collections
export * from './collections';

// Shopping
export * from './carts';
export * from './orders';
export * from './payments';
export * from './coupons';
export * from './wishlists';

/**
 * All database relations for Drizzle ORM
 * Import this object when initializing the database connection
 */
// Auth relations
import { userRelations } from './auth/user';
import { accountRelations } from './auth/account';
import { sessionRelations } from './auth/session';
import { passwordResetRelations } from './auth/passwordReset';

// eCommerce relations
import { usersRelations } from './users';
import { guestsRelations } from './guests';
import { addressesRelations } from './addresses';
import { categoriesRelations } from './categories';
import { brandsRelations } from './filters/brands';
import { colorsRelations } from './filters/colors';
import { sizesRelations } from './filters/sizes';
import { modelsRelations } from './filters/models';
import { lengthsRelations } from './filters/lengths';
import { productTypesRelations } from './filters/product-types';
import { productsRelations } from './products';
import { productVariantsRelations, productImagesRelations, productSpecificationsRelations } from './variants';
import { collectionsRelations, productCollectionsRelations } from './collections';
import { cartsRelations, cartItemsRelations } from './carts';
import { ordersRelations, orderItemsRelations } from './orders';
import { paymentsRelations } from './payments';
import { couponsRelations } from './coupons';
import { wishlistsRelations } from './wishlists';

// Import auth tables
import { user } from './auth/user';
import { account } from './auth/account';
import { session } from './auth/session';
import { verification } from './auth/verification';
import { guest } from './auth/guest';
import { passwordReset } from './auth/passwordReset';

// Import eCommerce tables
import { users } from './users';
import { guests } from './guests';
import { addresses } from './addresses';
import { categories } from './categories';
import { brands } from './filters/brands';
import { colors } from './filters/colors';
import { sizes } from './filters/sizes';
import { models } from './filters/models';
import { lengths } from './filters/lengths';
import { productTypes } from './filters/product-types';
import { products } from './products';
import { productVariants, productImages, productSpecifications } from './variants';
import { collections, productCollections } from './collections';
import { carts, cartItems } from './carts';
import { orders, orderItems } from './orders';
import { payments } from './payments';
import { coupons } from './coupons';
import { wishlists } from './wishlists';

export const schema = {
  // Auth Tables
  user,
  account,
  session,
  verification,
  guest,
  passwordReset,

  // eCommerce Tables
  users,
  guests,
  addresses,
  categories,
  brands,
  colors,
  sizes,
  models,
  lengths,
  productTypes,
  products,
  productVariants,
  productImages,
  productSpecifications,
  collections,
  productCollections,
  carts,
  cartItems,
  orders,
  orderItems,
  payments,
  coupons,
  wishlists,

  // Auth Relations
  userRelations,
  accountRelations,
  sessionRelations,
  passwordResetRelations,

  // eCommerce Relations
  usersRelations,
  guestsRelations,
  addressesRelations,
  categoriesRelations,
  brandsRelations,
  colorsRelations,
  sizesRelations,
  modelsRelations,
  lengthsRelations,
  productTypesRelations,
  productsRelations,
  productVariantsRelations,
  productImagesRelations,
  productSpecificationsRelations,
  collectionsRelations,
  productCollectionsRelations,
  cartsRelations,
  cartItemsRelations,
  ordersRelations,
  orderItemsRelations,
  paymentsRelations,
  couponsRelations,
  wishlistsRelations,
};
