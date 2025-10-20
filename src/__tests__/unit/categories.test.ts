import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import { createCategoryData } from "../helpers/fixtures";

describe("Categories CRUD Operations", () => {
  beforeEach(async () => {
    await truncateTables(["categories"]);
  });

  describe("Create Category", () => {
    it("should create a root category", async () => {
      const categoryData = createCategoryData({
        name: "Electronics",
        slug: "electronics",
        level: 0,
        path: [],
        parentId: null,
      });

      const [category] = await db.insert(categories).values(categoryData).returning();

      expect(category).toBeDefined();
      expect(category.name).toBe("Electronics");
      expect(category.level).toBe(0);
      expect(category.parentId).toBeNull();
      expect(category.path).toEqual([]);
    });

    it("should create a child category", async () => {
      // Create parent
      const parentData = createCategoryData({
        name: "Electronics",
        slug: "electronics",
        level: 0,
        path: [],
      });
      const [parent] = await db.insert(categories).values(parentData).returning();

      // Create child
      const childData = createCategoryData({
        name: "Smartphones",
        slug: "smartphones",
        level: 1,
        path: [parent.id],
        parentId: parent.id,
      });
      const [child] = await db.insert(categories).values(childData).returning();

      expect(child.parentId).toBe(parent.id);
      expect(child.level).toBe(1);
      expect(child.path).toContain(parent.id);
    });

    it("should enforce unique slug constraint", async () => {
      const categoryData = createCategoryData({ slug: "duplicate-category" });

      await db.insert(categories).values(categoryData);

      await expect(
        db.insert(categories).values(createCategoryData({ slug: "duplicate-category" }))
      ).rejects.toThrow();
    });
  });

  describe("Read Category", () => {
    it("should read a category by ID", async () => {
      const categoryData = createCategoryData({ name: "Test Category" });
      const [created] = await db.insert(categories).values(categoryData).returning();

      const [found] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, created.id));

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it("should read all root categories", async () => {
      await db.insert(categories).values([
        createCategoryData({ name: "Root 1", level: 0, parentId: null }),
        createCategoryData({ name: "Root 2", level: 0, parentId: null }),
      ]);

      const rootCategories = await db
        .select()
        .from(categories)
        .where(eq(categories.level, 0));

      expect(rootCategories.length).toBeGreaterThanOrEqual(2);
    });

    it("should read featured categories", async () => {
      await db.insert(categories).values([
        createCategoryData({ name: "Featured", featured: true }),
        createCategoryData({ name: "Regular", featured: false }),
      ]);

      const featured = await db
        .select()
        .from(categories)
        .where(eq(categories.featured, true));

      expect(featured.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Update Category", () => {
    it("should update category information", async () => {
      const categoryData = createCategoryData({ name: "Old Name" });
      const [category] = await db.insert(categories).values(categoryData).returning();

      const [updated] = await db
        .update(categories)
        .set({ name: "New Name" })
        .where(eq(categories.id, category.id))
        .returning();

      expect(updated.name).toBe("New Name");
    });

    it("should update category status", async () => {
      const categoryData = createCategoryData({ status: "active" });
      const [category] = await db.insert(categories).values(categoryData).returning();

      const [updated] = await db
        .update(categories)
        .set({ status: "inactive" })
        .where(eq(categories.id, category.id))
        .returning();

      expect(updated.status).toBe("inactive");
    });
  });

  describe("Delete Category", () => {
    it("should delete a category", async () => {
      const categoryData = createCategoryData({ name: "Delete Me" });
      const [category] = await db.insert(categories).values(categoryData).returning();

      await db.delete(categories).where(eq(categories.id, category.id));

      const [found] = await db
        .select()
        .from(categories)
        .where(eq(categories.id, category.id));

      expect(found).toBeUndefined();
    });
  });

  describe("Category Hierarchy", () => {
    it("should create multi-level category hierarchy", async () => {
      // Level 0
      const [root] = await db
        .insert(categories)
        .values(createCategoryData({
          name: "Electronics",
          level: 0,
          path: [],
        }))
        .returning();

      // Level 1
      const [level1] = await db
        .insert(categories)
        .values(createCategoryData({
          name: "Computers",
          level: 1,
          path: [root.id],
          parentId: root.id,
        }))
        .returning();

      // Level 2
      const [level2] = await db
        .insert(categories)
        .values(createCategoryData({
          name: "Laptops",
          level: 2,
          path: [root.id, level1.id],
          parentId: level1.id,
        }))
        .returning();

      expect(level2.path.length).toBe(2);
      expect(level2.path).toContain(root.id);
      expect(level2.path).toContain(level1.id);
    });
  });
});
