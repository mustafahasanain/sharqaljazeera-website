import { describe, it, expect, beforeEach } from "vitest";
import { db, transaction } from "@/lib/db";
import {
  users,
  brands,
  products,
  categories,
  addresses,
  orders,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createBrandData,
  createCategoryData,
  createProductData,
  createAddressData,
  createOrderData,
} from "../helpers/fixtures";

describe("Database Constraints & Validation", () => {
  beforeEach(async () => {
    await truncateTables([
      "products",
      "categories",
      "brands",
      "addresses",
      "users",
    ]);
  });

  describe("Unique Constraints", () => {
    it("should enforce unique email for users", async () => {
      const userData = createUserData({ email: "unique@test.com" });

      await db.insert(users).values(userData);

      await expect(
        db.insert(users).values(createUserData({ email: "unique@test.com" }))
      ).rejects.toThrow();
    });

    it("should enforce unique SKU for products", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      await db
        .insert(products)
        .values(createProductData(brand.id, category.id, { sku: "UNIQUE-SKU-1" }));

      await expect(
        db
          .insert(products)
          .values(createProductData(brand.id, category.id, { sku: "UNIQUE-SKU-1" }))
      ).rejects.toThrow();
    });

    it("should enforce unique slug for brands", async () => {
      await db.insert(brands).values(createBrandData({ slug: "unique-brand" }));

      await expect(
        db.insert(brands).values(createBrandData({ slug: "unique-brand" }))
      ).rejects.toThrow();
    });

    it("should enforce unique slug for categories", async () => {
      await db
        .insert(categories)
        .values(createCategoryData({ slug: "unique-category" }));

      await expect(
        db.insert(categories).values(createCategoryData({ slug: "unique-category" }))
      ).rejects.toThrow();
    });
  });

  describe("Required Fields", () => {
    it("should require email for users", async () => {
      await expect(
        db.insert(users).values({
          firstName: "Test",
          lastName: "User",
          passwordHash: "hash",
        } as any)
      ).rejects.toThrow();
    });

    it("should require name for products", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      await expect(
        db.insert(products).values({
          sku: "TEST",
          brandId: brand.id,
          categoryId: category.id,
          price: "99.99",
        } as any)
      ).rejects.toThrow();
    });
  });

  describe("Foreign Key Constraints", () => {
    it("should enforce valid brandId for products", async () => {
      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      await expect(
        db.insert(products).values(
          createProductData(
            "00000000-0000-0000-0000-000000000000",
            category.id
          )
        )
      ).rejects.toThrow();
    });

    it("should enforce valid categoryId for products", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      await expect(
        db.insert(products).values(
          createProductData(
            brand.id,
            "00000000-0000-0000-0000-000000000000"
          )
        )
      ).rejects.toThrow();
    });

    it("should enforce valid userId for addresses", async () => {
      await expect(
        db.insert(addresses).values(
          createAddressData("00000000-0000-0000-0000-000000000000")
        )
      ).rejects.toThrow();
    });
  });

  describe("Cascade Delete", () => {
    it("should cascade delete user addresses when user is deleted", async () => {
      const [user] = await db
        .insert(users)
        .values(createUserData())
        .returning();

      await db.insert(addresses).values(createAddressData(user.id));

      await db.delete(users).where(eq(users.id, user.id));

      const userAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, user.id));

      expect(userAddresses.length).toBe(0);
    });

    it("should cascade delete products when brand is deleted (with restrict)", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      await db
        .insert(products)
        .values(createProductData(brand.id, category.id));

      // This should fail because of foreign key restrict constraint
      await expect(
        db.delete(brands).where(eq(brands.id, brand.id))
      ).rejects.toThrow();
    });
  });

  describe("Enum Validation", () => {
    it("should only accept valid user roles", async () => {
      const validRoles = ["customer", "admin", "vendor", "support"];

      for (const role of validRoles) {
        const userData = createUserData({ role: role as any });
        const [user] = await db.insert(users).values(userData).returning();
        expect(user.role).toBe(role);
        await db.delete(users).where(eq(users.id, user.id));
      }
    });

    it("should only accept valid user statuses", async () => {
      const validStatuses = [
        "active",
        "inactive",
        "suspended",
        "pending_verification",
      ];

      for (const status of validStatuses) {
        const userData = createUserData({ status: status as any });
        const [user] = await db.insert(users).values(userData).returning();
        expect(user.status).toBe(status);
        await db.delete(users).where(eq(users.id, user.id));
      }
    });

    it("should only accept valid product statuses", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      const validStatuses = [
        "active",
        "inactive",
        "draft",
        "out_of_stock",
        "discontinued",
      ];

      for (const status of validStatuses) {
        const productData = createProductData(brand.id, category.id, {
          status: status as any,
        });
        const [product] = await db
          .insert(products)
          .values(productData)
          .returning();
        expect(product.status).toBe(status);
        await db.delete(products).where(eq(products.id, product.id));
      }
    });
  });

  describe("Default Values", () => {
    it("should set default role to customer for users", async () => {
      const userData = createUserData();
      delete (userData as any).role;

      const [user] = await db.insert(users).values(userData).returning();

      expect(user.role).toBe("customer");
    });

    it("should set default status to active for users", async () => {
      const userData = createUserData();
      delete (userData as any).status;

      const [user] = await db.insert(users).values(userData).returning();

      expect(user.status).toBe("active");
    });

    it("should set default values for product counters", async () => {
      const [brand] = await db
        .insert(brands)
        .values(createBrandData())
        .returning();

      const [category] = await db
        .insert(categories)
        .values(createCategoryData())
        .returning();

      const productData = createProductData(brand.id, category.id);
      delete (productData as any).viewCount;
      delete (productData as any).favoriteCount;
      delete (productData as any).reviewCount;

      const [product] = await db
        .insert(products)
        .values(productData)
        .returning();

      expect(product.viewCount).toBe(0);
      expect(product.favoriteCount).toBe(0);
      expect(product.reviewCount).toBe(0);
    });
  });

  describe("Transaction Tests", () => {
    it("should rollback transaction on error", async () => {
      const initialCount = await db.select().from(users);

      try {
        await transaction(async (tx) => {
          // Insert first user with specific email
          await tx.insert(users).values(createUserData({ email: "test1@rollback.com" }));
          // Insert second user with different email
          await tx.insert(users).values(createUserData({ email: "test2@rollback.com" }));

          // This should cause an error (duplicate email from first insert)
          await tx
            .insert(users)
            .values(createUserData({ email: "test1@rollback.com" }));
        });
      } catch (error) {
        // Expected to fail
      }

      const finalCount = await db.select().from(users);

      // Should be same as before (rollback)
      expect(finalCount.length).toBe(initialCount.length);
    });

    it("should commit successful transaction", async () => {
      const initialCount = (await db.select().from(users)).length;

      await transaction(async (tx) => {
        await tx.insert(users).values(createUserData());
        await tx.insert(users).values(createUserData());
      });

      const finalCount = (await db.select().from(users)).length;

      expect(finalCount).toBe(initialCount + 2);
    });

    it("should handle nested operations in transaction", async () => {
      await transaction(async (tx) => {
        const [user] = await tx
          .insert(users)
          .values(createUserData())
          .returning();

        await tx.insert(addresses).values(createAddressData(user.id));

        const [brand] = await tx
          .insert(brands)
          .values(createBrandData())
          .returning();

        const [category] = await tx
          .insert(categories)
          .values(createCategoryData())
          .returning();

        await tx
          .insert(products)
          .values(createProductData(brand.id, category.id));
      });

      // Verify all data was committed
      const usersCount = (await db.select().from(users)).length;
      const addressesCount = (await db.select().from(addresses)).length;
      const brandsCount = (await db.select().from(brands)).length;
      const productsCount = (await db.select().from(products)).length;

      expect(usersCount).toBeGreaterThan(0);
      expect(addressesCount).toBeGreaterThan(0);
      expect(brandsCount).toBeGreaterThan(0);
      expect(productsCount).toBeGreaterThan(0);
    });
  });
});
