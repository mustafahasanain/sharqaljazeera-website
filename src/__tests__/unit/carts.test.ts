import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  carts,
  cartItems,
  users,
  products,
  brands,
  categories,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createCartData,
  createCartItemData,
  createProductData,
  createBrandData,
  createCategoryData,
} from "../helpers/fixtures";

describe("Carts CRUD Operations", () => {
  let testUser: any;
  let testProduct: any;

  beforeEach(async () => {
    await truncateTables([
      "cartItems",
      "carts",
      "products",
      "categories",
      "brands",
      "users",
    ]);

    // Setup test data
    [testUser] = await db
      .insert(users)
      .values(createUserData())
      .returning();

    const [brand] = await db
      .insert(brands)
      .values(createBrandData())
      .returning();

    const [category] = await db
      .insert(categories)
      .values(createCategoryData())
      .returning();

    [testProduct] = await db
      .insert(products)
      .values(createProductData(brand.id, category.id))
      .returning();
  });

  describe("Create Cart", () => {
    it("should create a cart for user", async () => {
      const cartData = createCartData(testUser.id);
      const [cart] = await db.insert(carts).values(cartData).returning();

      expect(cart).toBeDefined();
      expect(cart.userId).toBe(testUser.id);
    });

    it("should create guest cart", async () => {
      const cartData = createCartData(null);
      const [cart] = await db.insert(carts).values(cartData).returning();

      expect(cart.userId).toBeNull();
    });
  });

  describe("Cart Items", () => {
    it("should add item to cart", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id))
        .returning();

      const itemData = createCartItemData(cart.id, testProduct.id, {
        quantity: 2,
      });

      const [item] = await db.insert(cartItems).values(itemData).returning();

      expect(item.cartId).toBe(cart.id);
      expect(item.productId).toBe(testProduct.id);
      expect(item.quantity).toBe(2);
    });

    it("should update cart item quantity", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id))
        .returning();

      const [item] = await db
        .insert(cartItems)
        .values(createCartItemData(cart.id, testProduct.id, { quantity: 1 }))
        .returning();

      const [updated] = await db
        .update(cartItems)
        .set({ quantity: 5 })
        .where(eq(cartItems.id, item.id))
        .returning();

      expect(updated.quantity).toBe(5);
    });

    it("should remove item from cart", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id))
        .returning();

      const [item] = await db
        .insert(cartItems)
        .values(createCartItemData(cart.id, testProduct.id))
        .returning();

      await db.delete(cartItems).where(eq(cartItems.id, item.id));

      const [found] = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.id, item.id));

      expect(found).toBeUndefined();
    });

    it("should cascade delete cart items when cart is deleted", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id))
        .returning();

      await db
        .insert(cartItems)
        .values(createCartItemData(cart.id, testProduct.id));

      await db.delete(carts).where(eq(carts.id, cart.id));

      const items = await db
        .select()
        .from(cartItems)
        .where(eq(cartItems.cartId, cart.id));

      expect(items.length).toBe(0);
    });
  });

  describe("Cart Metadata", () => {
    it("should store cart metadata", async () => {
      const [cart] = await db
        .insert(carts)
        .values(createCartData(testUser.id, { metadata: { notes: "Test cart" } }))
        .returning();

      expect(cart.metadata).toBeDefined();
    });
  });
});
