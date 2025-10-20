import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  favorites,
  users,
  products,
  brands,
  categories,
} from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createProductData,
  createBrandData,
  createCategoryData,
} from "../helpers/fixtures";

describe("Favorites CRUD Operations", () => {
  let testUser: any;
  let testProduct: any;

  beforeEach(async () => {
    await truncateTables([
      "favorites",
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

  describe("Create Favorite", () => {
    it("should add product to favorites", async () => {
      const [favorite] = await db
        .insert(favorites)
        .values({
          userId: testUser.id,
          productId: testProduct.id,
        })
        .returning();

      expect(favorite).toBeDefined();
      expect(favorite.userId).toBe(testUser.id);
      expect(favorite.productId).toBe(testProduct.id);
    });

    it("should prevent duplicate favorites", async () => {
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      // Attempting to add same product again should fail
      await expect(
        db.insert(favorites).values({
          userId: testUser.id,
          productId: testProduct.id,
        })
      ).rejects.toThrow();
    });
  });

  describe("Read Favorites", () => {
    it("should read user favorites", async () => {
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, testUser.id));

      expect(userFavorites.length).toBeGreaterThanOrEqual(1);
    });

    it("should check if product is favorited by user", async () => {
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      const [favorite] = await db
        .select()
        .from(favorites)
        .where(
          and(
            eq(favorites.userId, testUser.id),
            eq(favorites.productId, testProduct.id)
          )
        );

      expect(favorite).toBeDefined();
    });
  });

  describe("Delete Favorite", () => {
    it("should remove product from favorites", async () => {
      const [favorite] = await db
        .insert(favorites)
        .values({
          userId: testUser.id,
          productId: testProduct.id,
        })
        .returning();

      await db.delete(favorites).where(eq(favorites.id, favorite.id));

      const [found] = await db
        .select()
        .from(favorites)
        .where(eq(favorites.id, favorite.id));

      expect(found).toBeUndefined();
    });

    it("should cascade delete favorites when user is deleted", async () => {
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      await db.delete(users).where(eq(users.id, testUser.id));

      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, testUser.id));

      expect(userFavorites.length).toBe(0);
    });

    it("should cascade delete favorites when product is deleted", async () => {
      await db.insert(favorites).values({
        userId: testUser.id,
        productId: testProduct.id,
      });

      await db.delete(products).where(eq(products.id, testProduct.id));

      const productFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.productId, testProduct.id));

      expect(productFavorites.length).toBe(0);
    });
  });

  describe("Multiple Favorites", () => {
    it("should allow user to favorite multiple products", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      const [product1] = await db
        .insert(products)
        .values(createProductData(brand.id, category.id))
        .returning();

      const [product2] = await db
        .insert(products)
        .values(createProductData(brand.id, category.id))
        .returning();

      await db.insert(favorites).values([
        { userId: testUser.id, productId: product1.id },
        { userId: testUser.id, productId: product2.id },
      ]);

      const userFavorites = await db
        .select()
        .from(favorites)
        .where(eq(favorites.userId, testUser.id));

      expect(userFavorites.length).toBeGreaterThanOrEqual(2);
    });
  });
});
