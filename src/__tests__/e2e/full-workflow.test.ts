import { describe, it, expect, beforeEach } from "vitest";
import { db, transaction } from "@/lib/db";
import {
  users,
  brands,
  categories,
  products,
  productImages,
  productInventory,
  carts,
  cartItems,
  orders,
  orderItems,
  addresses,
  favorites,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createBrandData,
  createCategoryData,
  createProductData,
  createProductImageData,
  createProductInventoryData,
  createCartData,
  createCartItemData,
  createOrderData,
  createOrderItemData,
  createAddressData,
} from "../helpers/fixtures";

describe("E2E Workflow Tests", () => {
  beforeEach(async () => {
    await truncateTables([
      "favorites",
      "orderItems",
      "payments",
      "orders",
      "cartItems",
      "carts",
      "addresses",
      "productInventory",
      "productSpecifications",
      "productImages",
      "products",
      "categories",
      "brands",
      "userPreferences",
      "userActivity",
      "users",
    ]);
  });

  describe("Complete E-commerce User Journey", () => {
    it("should complete full user registration to order workflow", async () => {
      await transaction(async (tx) => {
        // 1. Create brands and categories
        const [brand] = await tx
          .insert(brands)
          .values(
            createBrandData({
              name: "Apple",
              slug: "apple",
              featured: true,
            })
          )
          .returning();

        const [category] = await tx
          .insert(categories)
          .values(
            createCategoryData({
              name: "Smartphones",
              slug: "smartphones",
              level: 0,
            })
          )
          .returning();

        // 2. Create products with inventory
        const [product1] = await tx
          .insert(products)
          .values(
            createProductData(brand.id, category.id, {
              name: "iPhone 15",
              sku: "APPLE-IP15",
              price: "999.99",
            })
          )
          .returning();

        const [product2] = await tx
          .insert(products)
          .values(
            createProductData(brand.id, category.id, {
              name: "iPhone 15 Pro",
              sku: "APPLE-IP15-PRO",
              price: "1199.99",
            })
          )
          .returning();

        // Add product images
        await tx.insert(productImages).values([
          createProductImageData(product1.id, { isMain: true }),
          createProductImageData(product2.id, { isMain: true }),
        ]);

        // Add inventory
        await tx.insert(productInventory).values([
          createProductInventoryData(product1.id, { quantity: 100 }),
          createProductInventoryData(product2.id, { quantity: 50 }),
        ]);

        // 3. Register user
        const [user] = await tx
          .insert(users)
          .values(
            createUserData({
              email: "customer@example.com",
              firstName: "John",
              lastName: "Doe",
            })
          )
          .returning();

        // 4. Add user address
        const [address] = await tx
          .insert(addresses)
          .values(
            createAddressData(user.id, {
              type: "home",
              isDefault: true,
              city: "Baghdad",
              governorate: "Baghdad",
            })
          )
          .returning();

        // 5. User adds product to favorites
        await tx.insert(favorites).values({
          userId: user.id,
          productId: product2.id,
        });

        // 6. Create shopping cart
        const [cart] = await tx
          .insert(carts)
          .values(createCartData(user.id))
          .returning();

        // 7. Add items to cart
        await tx.insert(cartItems).values([
          createCartItemData(cart.id, product1.id, {
            quantity: 1,
          }),
          createCartItemData(cart.id, product2.id, {
            quantity: 1,
          }),
        ]);

        // 9. Create order from cart
        const [order] = await tx
          .insert(orders)
          .values(
            createOrderData(user.id, address.id, {
              orderNumber: `ORD-${Date.now()}`,
              status: "pending",
              paymentStatus: "pending",
              subtotal: "2199.98",
              total: "2199.98",
              billingAddressId: address.id,
            })
          )
          .returning();

        // 10. Create order items from cart items
        const cartItemsList = await tx
          .select()
          .from(cartItems)
          .where(eq(cartItems.cartId, cart.id));

        for (const cartItem of cartItemsList) {
          await tx.insert(orderItems).values(
            createOrderItemData(order.id, cartItem.productId, {
              quantity: cartItem.quantity,
            })
          );
        }

        // 11. Update inventory (reserve items)
        const inventory1 = await tx
          .select()
          .from(productInventory)
          .where(eq(productInventory.productId, product1.id));

        await tx
          .update(productInventory)
          .set({ reserved: 1 })
          .where(eq(productInventory.productId, product1.id));

        const inventory2 = await tx
          .select()
          .from(productInventory)
          .where(eq(productInventory.productId, product2.id));

        await tx
          .update(productInventory)
          .set({ reserved: 1 })
          .where(eq(productInventory.productId, product2.id));

        // 12. Cart is implicitly completed after order creation

        // Verify everything
        expect(user.id).toBeDefined();
        expect(product1.id).toBeDefined();
        expect(cart.id).toBeDefined();
        expect(order.id).toBeDefined();
        expect(order.total).toBe("2199.98");
      });

      // Verify data persisted
      const allUsers = await db.select().from(users);
      const allProducts = await db.select().from(products);
      const allOrders = await db.select().from(orders);
      const allOrderItems = await db.select().from(orderItems);

      expect(allUsers.length).toBeGreaterThan(0);
      expect(allProducts.length).toBeGreaterThanOrEqual(2);
      expect(allOrders.length).toBeGreaterThan(0);
      expect(allOrderItems.length).toBeGreaterThanOrEqual(2);
    });

    it("should handle order status updates workflow", async () => {
      // Setup initial data
      const [user] = await db
        .insert(users)
        .values(createUserData())
        .returning();

      const [address] = await db
        .insert(addresses)
        .values(createAddressData(user.id))
        .returning();

      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      const [product] = await db
        .insert(products)
        .values(createProductData(brand.id, category.id))
        .returning();

      const [order] = await db
        .insert(orders)
        .values(
          createOrderData(user.id, address.id, {
            status: "pending",
            paymentStatus: "pending",
          })
        )
        .returning();

      await db
        .insert(orderItems)
        .values(createOrderItemData(order.id, product.id));

      // Workflow: pending -> paid -> processing -> shipped -> delivered
      const statuses = [
        "paid",
        "processing",
        "shipped",
        "delivered",
      ] as const;

      for (const status of statuses) {
        await db
          .update(orders)
          .set({ status })
          .where(eq(orders.id, order.id));

        const [updated] = await db
          .select()
          .from(orders)
          .where(eq(orders.id, order.id));

        expect(updated.status).toBe(status);
      }
    });

    it("should handle inventory management workflow", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      const [product] = await db
        .insert(products)
        .values(createProductData(brand.id, category.id))
        .returning();

      // Initial inventory
      const [inventory] = await db
        .insert(productInventory)
        .values(
          createProductInventoryData(product.id, {
            quantity: 100,
            reserved: 0,
            policy: "track",
          })
        )
        .returning();

      expect(inventory.quantity).toBe(100);

      // Reserve 10 items (order placed)
      await db
        .update(productInventory)
        .set({ reserved: 10 })
        .where(eq(productInventory.id, inventory.id));

      const [afterReserve] = await db
        .select()
        .from(productInventory)
        .where(eq(productInventory.id, inventory.id));

      expect(afterReserve.reserved).toBe(10);
      expect(afterReserve.quantity - afterReserve.reserved).toBe(90);

      // Fulfill order (reduce quantity, clear reserved)
      await db
        .update(productInventory)
        .set({
          quantity: afterReserve.quantity - 10,
          reserved: 0,
        })
        .where(eq(productInventory.id, inventory.id));

      const [afterFulfill] = await db
        .select()
        .from(productInventory)
        .where(eq(productInventory.id, inventory.id));

      expect(afterFulfill.quantity).toBe(90);
      expect(afterFulfill.reserved).toBe(0);
    });

    it("should handle multi-user concurrent shopping workflow", async () => {
      // Create shared catalog
      const [brand] = await db
        .insert(brands)
        .values(createBrandData({ name: "Samsung" }))
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData({ name: "Smartphones" }))
        .returning();

      const [product] = await db
        .insert(products)
        .values(
          createProductData(brand.id, category.id, {
            name: "Galaxy S24",
            price: "899.99",
          })
        )
        .returning();

      // Create two users
      const [user1] = await db
        .insert(users)
        .values(createUserData({ email: "user1@test.com" }))
        .returning();

      const [user2] = await db
        .insert(users)
        .values(createUserData({ email: "user2@test.com" }))
        .returning();

      // Both users create carts and add the same product
      const [cart1] = await db
        .insert(carts)
        .values(createCartData(user1.id))
        .returning();

      const [cart2] = await db
        .insert(carts)
        .values(createCartData(user2.id))
        .returning();

      await db.insert(cartItems).values([
        createCartItemData(cart1.id, product.id, { quantity: 2 }),
        createCartItemData(cart2.id, product.id, { quantity: 1 }),
      ]);

      // Verify both carts have items
      const cart1Items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart1.id));

      const cart2Items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart2.id));

      expect(cart1Items.length).toBe(1);
      expect(cart2Items.length).toBe(1);
      expect(cart1Items[0].quantity).toBe(2);
      expect(cart2Items[0].quantity).toBe(1);
    });
  });

  describe("Admin Workflows", () => {
    it("should handle product catalog management", async () => {
      // Admin creates brand
      const [brand] = await db
        .insert(brands)
        .values(
          createBrandData({
            name: "Sony",
            slug: "sony",
            featured: true,
          })
        )
        .returning();

      // Admin creates category hierarchy
      const [rootCategory] = await db
        .insert(categories)
        .values(
          createCategoryData({
            name: "Electronics",
            slug: "electronics",
            level: 0,
            path: [],
          })
        )
        .returning();

      const [childCategory] = await db
        .insert(categories)
        .values(
          createCategoryData({
            name: "Headphones",
            slug: "headphones",
            level: 1,
            path: [rootCategory.id],
            parentId: rootCategory.id,
          })
        )
        .returning();

      // Admin creates product
      const [product] = await db
        .insert(products)
        .values(
          createProductData(brand.id, childCategory.id, {
            name: "Sony WH-1000XM5",
            sku: "SONY-WH1000XM5",
            price: "399.99",
            featured: true,
          })
        )
        .returning();

      // Admin adds images
      await db.insert(productImages).values([
        createProductImageData(product.id, { isMain: true, position: 0 }),
        createProductImageData(product.id, { isMain: false, position: 1 }),
      ]);

      // Admin sets inventory
      await db
        .insert(productInventory)
        .values(
          createProductInventoryData(product.id, {
            quantity: 200,
            lowStockThreshold: 20,
          })
        );

      // Verify all created
      expect(brand.featured).toBe(true);
      expect(childCategory.parentId).toBe(rootCategory.id);
      expect(product.featured).toBe(true);

      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      expect(images.length).toBe(2);
    });
  });
});
