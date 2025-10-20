import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import { brands } from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import { createBrandData } from "../helpers/fixtures";

describe("Brands CRUD Operations", () => {
  beforeEach(async () => {
    await truncateTables(["brands"]);
  });

  describe("Create Brand", () => {
    it("should create a new brand", async () => {
      const brandData = createBrandData({
        name: "Apple",
        slug: "apple",
        description: "Innovative technology products",
      });

      const [brand] = await db.insert(brands).values(brandData).returning();

      expect(brand).toBeDefined();
      expect(brand.name).toBe("Apple");
      expect(brand.slug).toBe("apple");
      expect(brand.status).toBe("active");
    });

    it("should enforce unique slug constraint", async () => {
      const brandData = createBrandData({ slug: "duplicate-slug" });

      await db.insert(brands).values(brandData);

      await expect(
        db.insert(brands).values(createBrandData({ slug: "duplicate-slug" }))
      ).rejects.toThrow();
    });

    it("should create featured brand", async () => {
      const brandData = createBrandData({
        name: "Samsung",
        featured: true,
      });

      const [brand] = await db.insert(brands).values(brandData).returning();

      expect(brand.featured).toBe(true);
    });

    it("should set default values", async () => {
      const brandData = createBrandData({ name: "Test Brand" });
      const [brand] = await db.insert(brands).values(brandData).returning();

      expect(brand.status).toBe("active");
      expect(brand.featured).toBe(false);
      expect(brand.productCount).toBe(0);
    });
  });

  describe("Read Brand", () => {
    it("should read a brand by ID", async () => {
      const brandData = createBrandData({ name: "Sony" });
      const [createdBrand] = await db.insert(brands).values(brandData).returning();

      const [foundBrand] = await db
        .select()
        .from(brands)
        .where(eq(brands.id, createdBrand.id));

      expect(foundBrand).toBeDefined();
      expect(foundBrand.id).toBe(createdBrand.id);
      expect(foundBrand.name).toBe("Sony");
    });

    it("should read a brand by slug", async () => {
      const brandData = createBrandData({
        name: "Dell",
        slug: "dell",
      });
      await db.insert(brands).values(brandData);

      const [foundBrand] = await db
        .select()
        .from(brands)
        .where(eq(brands.slug, "dell"));

      expect(foundBrand).toBeDefined();
      expect(foundBrand.slug).toBe("dell");
    });

    it("should read all brands", async () => {
      await db.insert(brands).values([
        createBrandData({ name: "Brand 1" }),
        createBrandData({ name: "Brand 2" }),
        createBrandData({ name: "Brand 3" }),
      ]);

      const allBrands = await db.select().from(brands);
      expect(allBrands.length).toBeGreaterThanOrEqual(3);
    });

    it("should read only featured brands", async () => {
      await db.insert(brands).values([
        createBrandData({ name: "Featured 1", featured: true }),
        createBrandData({ name: "Regular 1", featured: false }),
        createBrandData({ name: "Featured 2", featured: true }),
      ]);

      const featuredBrands = await db
        .select()
        .from(brands)
        .where(eq(brands.featured, true));

      expect(featuredBrands.length).toBeGreaterThanOrEqual(2);
      featuredBrands.forEach((brand) => {
        expect(brand.featured).toBe(true);
      });
    });
  });

  describe("Update Brand", () => {
    it("should update brand information", async () => {
      const brandData = createBrandData({ name: "Old Name" });
      const [brand] = await db.insert(brands).values(brandData).returning();

      const [updatedBrand] = await db
        .update(brands)
        .set({ name: "New Name" })
        .where(eq(brands.id, brand.id))
        .returning();

      expect(updatedBrand.name).toBe("New Name");
    });

    it("should update brand status", async () => {
      const brandData = createBrandData({ status: "active" });
      const [brand] = await db.insert(brands).values(brandData).returning();

      const [updatedBrand] = await db
        .update(brands)
        .set({ status: "inactive" })
        .where(eq(brands.id, brand.id))
        .returning();

      expect(updatedBrand.status).toBe("inactive");
    });

    it("should update brand featured status", async () => {
      const brandData = createBrandData({ featured: false });
      const [brand] = await db.insert(brands).values(brandData).returning();

      const [updatedBrand] = await db
        .update(brands)
        .set({ featured: true })
        .where(eq(brands.id, brand.id))
        .returning();

      expect(updatedBrand.featured).toBe(true);
    });

    it("should update product count", async () => {
      const brandData = createBrandData({ productCount: 0 });
      const [brand] = await db.insert(brands).values(brandData).returning();

      const [updatedBrand] = await db
        .update(brands)
        .set({ productCount: 10 })
        .where(eq(brands.id, brand.id))
        .returning();

      expect(updatedBrand.productCount).toBe(10);
    });
  });

  describe("Delete Brand", () => {
    it("should delete a brand", async () => {
      const brandData = createBrandData({ name: "Delete Me" });
      const [brand] = await db.insert(brands).values(brandData).returning();

      await db.delete(brands).where(eq(brands.id, brand.id));

      const [foundBrand] = await db
        .select()
        .from(brands)
        .where(eq(brands.id, brand.id));

      expect(foundBrand).toBeUndefined();
    });
  });

  describe("Brand Metadata", () => {
    it("should store brand country and founded year", async () => {
      const brandData = createBrandData({
        name: "Apple",
        country: "USA",
        foundedYear: 1976,
      });

      const [brand] = await db.insert(brands).values(brandData).returning();

      expect(brand.country).toBe("USA");
      expect(brand.foundedYear).toBe(1976);
    });

    it("should handle optional fields", async () => {
      const brandData = createBrandData({
        name: "NewBrand",
        country: null,
        foundedYear: null,
        website: null,
        logo: null,
      });

      const [brand] = await db.insert(brands).values(brandData).returning();

      expect(brand.country).toBeNull();
      expect(brand.foundedYear).toBeNull();
    });
  });
});
