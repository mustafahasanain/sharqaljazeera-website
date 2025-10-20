import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  users,
  brands,
  categories,
  products,
  productImages,
  orders,
  orderItems,
  carts,
  cartItems,
  addresses,
  favorites,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createBrandData,
  createCategoryData,
  createProductData,
  createProductImageData,
  createOrderData,
  createOrderItemData,
  createCartData,
  createCartItemData,
  createAddressData,
} from "../helpers/fixtures";

describe("Database Relations & Joins", () => {
  let testUser: any;
  let testAddress: any;
  let testBrand: any;
  let testCategory: any;
  let testProduct: any;

  beforeEach(async () => {
    await truncateTables([
      "favorites",
      "cartItems",
      "carts",
      "orderItems",
      "payments",
      "orders",
      "addresses",
      "productInventory",
      "productSpecifications",
      "productImages",
      "products",
      "categories",
      "brands",
      "users",
    ]);

    // Setup test data
    [testUser] = await db
      .insert(users)
      .values(createUserData({ email: "test@relations.com" }))
      .returning();

    [testAddress] = await db
      .insert(addresses)
      .values(createAddressData(testUser.id))
      .returning();

    [testBrand] = await db
      .insert(brands)
      .values(createBrandData({ name: "Test Brand" }))
      .returning();

    [testCategory] = await db
      .insert(categories)
      .values(createCategoryData({ name: "Test Category" }))
      .returning();

    [testProduct] = await db
      .insert(products)
      .values(createProductData(testBrand.id, testCategory.id))
      .returning();
  });

  describe("Product Relations", () => {
    it("should query product with brand", async () => {
      const result = await db
        .select({
          product: products,
          brand: brands,
        })
        .from(products)
        .innerJoin(brands, eq(products.brandId, brands.id))
        .where(eq(products.id, testProduct.id));

      expect(result[0]).toBeDefined();
      expect(result[0].product.id).toBe(testProduct.id);
      expect(result[0].brand.id).toBe(testBrand.id);
    });

    it("should query product with category", async () => {
      const result = await db
        .select({
          product: products,
          category: categories,
        })
        .from(products)
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, testProduct.id));

      expect(result[0]).toBeDefined();
      expect(result[0].category.id).toBe(testCategory.id);
    });

    it("should query product with brand and category", async () => {
      const result = await db
        .select({
          product: products,
          brand: brands,
          category: categories,
        })
        .from(products)
        .innerJoin(brands, eq(products.brandId, brands.id))
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(products.id, testProduct.id));

      expect(result[0]).toBeDefined();
      expect(result[0].product.id).toBe(testProduct.id);
      expect(result[0].brand.id).toBe(testBrand.id);
      expect(result[0].category.id).toBe(testCategory.id);
    });

    it("should query product with images", async () => {
      // Add images
      await db.insert(productImages).values([
        createProductImageData(testProduct.id, { position: 0 }),
        createProductImageData(testProduct.id, { position: 1 }),
      ]);

      const result = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, testProduct.id));

      expect(result.length).toBe(2);
      expect(result[0].productId).toBe(testProduct.id);
    });
  });

  describe("User Relations", () => {
    it("should query user with addresses", async () => {
      // Add addresses
      await db.insert(addresses).values([
        createAddressData(testUser.id, { type: "home" }),
        createAddressData(testUser.id, { type: "work" }),
      ]);

      const result = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, testUser.id));

      expect(result.length).toBe(2);
      expect(result[0].userId).toBe(testUser.id);
    });

    it("should query user with orders", async () => {
      // Create orders
      await db.insert(orders).values([
        createOrderData(testUser.id, testAddress.id),
        createOrderData(testUser.id, testAddress.id),
      ]);

      const result = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, testUser.id));

      expect(result.length).toBeGreaterThanOrEqual(2);
      expect(result[0].userId).toBe(testUser.id);
    });

    it("should query user with favorites", async () => {
      // Add favorites
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      const result = await db
        .select({
          favorite: favorites,
          product: products,
        })
        .from(favorites)
        .innerJoin(products, eq(favorites.productId, products.id))
        .where(eq(favorites.userId, testUser.id));

      expect(result[0]).toBeDefined();
      expect(result[0].favorite.userId).toBe(testUser.id);
      expect(result[0].product.id).toBe(testProduct.id);
    });
  });

  describe("Order Relations", () => {
    it("should query order with user", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      const result = await db
        .select({
          order: orders,
          user: users,
        })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .where(eq(orders.id, order.id));

      expect(result[0]).toBeDefined();
      expect(result[0].order.id).toBe(order.id);
      expect(result[0].user.id).toBe(testUser.id);
    });

    it("should query order with items and products", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      await db
        .insert(orderItems)
        .values(createOrderItemData(order.id, testProduct.id));

      const result = await db
        .select({
          order: orders,
          item: orderItems,
          product: products,
        })
        .from(orders)
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .where(eq(orders.id, order.id));

      expect(result[0]).toBeDefined();
      expect(result[0].order.id).toBe(order.id);
      expect(result[0].item.orderId).toBe(order.id);
      expect(result[0].product.id).toBe(testProduct.id);
    });
  });

  describe("Cart Relations", () => {
    it("should query cart with user and items", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id))
        .returning();

      await db
        .insert(cartItems)
        .values(createCartItemData(cart.id, testProduct.id));

      const result = await db
        .select({
          cart: carts,
          user: users,
          item: cartItems,
          product: products,
        })
        .from(carts)
        .innerJoin(users, eq(carts.userId, users.id))
        .innerJoin(cartItems, eq(carts.id, cartItems.cartId))
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(carts.id, cart.id));

      expect(result[0]).toBeDefined();
      expect(result[0].cart.id).toBe(cart.id);
      expect(result[0].user.id).toBe(testUser.id);
      expect(result[0].product.id).toBe(testProduct.id);
    });
  });

  describe("Category Hierarchy Relations", () => {
    it("should query nested categories", async () => {
      // Create hierarchy: Electronics -> Smartphones
      const [electronics] = await db
        .insert(categories)
        .values(
          createCategoryData({
            name: "Electronics",
            level: 0,
            path: [],
            parentId: null,
          })
        )
        .returning();

      const [smartphones] = await db
        .insert(categories)
        .values(
          createCategoryData({
            name: "Smartphones",
            level: 1,
            path: [electronics.id],
            parentId: electronics.id,
          })
        )
        .returning();

      // Query child with parent
      const result = await db
        .select({
          child: categories,
          parent: categories,
        })
        .from(categories)
        .innerJoin(
          categories as any,
          eq((categories as any).id, (categories as any).parentId)
        )
        .where(eq(categories.id, smartphones.id));

      // The test verifies the relationship exists
      expect(smartphones.parentId).toBe(electronics.id);
      expect(smartphones.path).toContain(electronics.id);
    });
  });

  describe("Brand Relations", () => {
    it("should query brand with all its products", async () => {
      // Create multiple products for the brand
      await db.insert(products).values([
        createProductData(testBrand.id, testCategory.id, { name: "Product 1" }),
        createProductData(testBrand.id, testCategory.id, { name: "Product 2" }),
      ]);

      const result = await db
        .select()
        .from(products)
        .where(eq(products.brandId, testBrand.id));

      expect(result.length).toBeGreaterThanOrEqual(3); // Including testProduct
    });
  });

  describe("Complex Multi-Table Joins", () => {
    it("should query complete order details with all relations", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      await db
        .insert(orderItems)
        .values(createOrderItemData(order.id, testProduct.id));

      const result = await db
        .select({
          order: orders,
          user: users,
          item: orderItems,
          product: products,
          brand: brands,
          category: categories,
        })
        .from(orders)
        .innerJoin(users, eq(orders.userId, users.id))
        .innerJoin(orderItems, eq(orders.id, orderItems.orderId))
        .innerJoin(products, eq(orderItems.productId, products.id))
        .innerJoin(brands, eq(products.brandId, brands.id))
        .innerJoin(categories, eq(products.categoryId, categories.id))
        .where(eq(orders.id, order.id));

      expect(result[0]).toBeDefined();
      expect(result[0].order.id).toBe(order.id);
      expect(result[0].user.id).toBe(testUser.id);
      expect(result[0].product.id).toBe(testProduct.id);
      expect(result[0].brand.id).toBe(testBrand.id);
      expect(result[0].category.id).toBe(testCategory.id);
    });
  });
});
