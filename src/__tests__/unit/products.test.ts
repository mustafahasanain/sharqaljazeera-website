import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  products,
  productImages,
  productInventory,
  productSpecifications,
  brands,
  categories,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createProductData,
  createBrandData,
  createCategoryData,
  createProductImageData,
  createProductInventoryData,
} from "../helpers/fixtures";

describe("Products CRUD Operations", () => {
  let testBrand: any;
  let testCategory: any;

  beforeEach(async () => {
    await truncateTables([
      "productInventory",
      "variantInventory",
      "productVariants",
      "productSpecifications",
      "productImages",
      "products",
      "categories",
      "brands",
    ]);

    // Create test brand and category
    [testBrand] = await db
      .insert(brands)
      .values(createBrandData({ name: "Test Brand" }))
      .returning();

    [testCategory] = await db
      .insert(categories)
      .values(createCategoryData({ name: "Test Category" }))
      .returning();
  });

  describe("Create Product", () => {
    it("should create a new product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        name: "iPhone 15",
        sku: "APPLE-IP15",
        price: "999.99",
      });

      const [product] = await db.insert(products).values(productData).returning();

      expect(product).toBeDefined();
      expect(product.name).toBe("iPhone 15");
      expect(product.sku).toBe("APPLE-IP15");
      expect(product.price).toBe("999.99");
      expect(product.brandId).toBe(testBrand.id);
      expect(product.categoryId).toBe(testCategory.id);
    });

    it("should enforce unique SKU constraint", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        sku: "UNIQUE-SKU",
      });

      await db.insert(products).values(productData);

      await expect(
        db.insert(products).values(
          createProductData(testBrand.id, testCategory.id, { sku: "UNIQUE-SKU" })
        )
      ).rejects.toThrow();
    });

    it("should create product with variants flag", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        hasVariants: true,
      });

      const [product] = await db.insert(products).values(productData).returning();

      expect(product.hasVariants).toBe(true);
    });

    it("should create featured product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        featured: true,
        isNew: true,
        isBestseller: true,
      });

      const [product] = await db.insert(products).values(productData).returning();

      expect(product.featured).toBe(true);
      expect(product.isNew).toBe(true);
      expect(product.isBestseller).toBe(true);
    });
  });

  describe("Read Product", () => {
    it("should read a product by ID", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [created] = await db.insert(products).values(productData).returning();

      const [found] = await db
        .select()
        .from(products)
        .where(eq(products.id, created.id));

      expect(found).toBeDefined();
      expect(found.id).toBe(created.id);
    });

    it("should read a product by SKU", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        sku: "FIND-BY-SKU",
      });
      await db.insert(products).values(productData);

      const [found] = await db
        .select()
        .from(products)
        .where(eq(products.sku, "FIND-BY-SKU"));

      expect(found).toBeDefined();
      expect(found.sku).toBe("FIND-BY-SKU");
    });

    it("should read products by brand", async () => {
      await db.insert(products).values([
        createProductData(testBrand.id, testCategory.id),
        createProductData(testBrand.id, testCategory.id),
      ]);

      const brandProducts = await db
        .select()
        .from(products)
        .where(eq(products.brandId, testBrand.id));

      expect(brandProducts.length).toBeGreaterThanOrEqual(2);
    });

    it("should read featured products", async () => {
      await db.insert(products).values([
        createProductData(testBrand.id, testCategory.id, { featured: true }),
        createProductData(testBrand.id, testCategory.id, { featured: false }),
      ]);

      const featured = await db
        .select()
        .from(products)
        .where(eq(products.featured, true));

      expect(featured.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Update Product", () => {
    it("should update product information", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        name: "Old Name",
      });
      const [product] = await db.insert(products).values(productData).returning();

      const [updated] = await db
        .update(products)
        .set({ name: "New Name" })
        .where(eq(products.id, product.id))
        .returning();

      expect(updated.name).toBe("New Name");
    });

    it("should update product price", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        price: "99.99",
      });
      const [product] = await db.insert(products).values(productData).returning();

      const [updated] = await db
        .update(products)
        .set({ price: "149.99" })
        .where(eq(products.id, product.id))
        .returning();

      expect(updated.price).toBe("149.99");
    });

    it("should update product status", async () => {
      const productData = createProductData(testBrand.id, testCategory.id, {
        status: "active",
      });
      const [product] = await db.insert(products).values(productData).returning();

      const [updated] = await db
        .update(products)
        .set({ status: "out_of_stock" })
        .where(eq(products.id, product.id))
        .returning();

      expect(updated.status).toBe("out_of_stock");
    });
  });

  describe("Delete Product", () => {
    it("should delete a product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      await db.delete(products).where(eq(products.id, product.id));

      const [found] = await db
        .select()
        .from(products)
        .where(eq(products.id, product.id));

      expect(found).toBeUndefined();
    });

    it("should cascade delete product images", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      // Add images
      await db.insert(productImages).values([
        createProductImageData(product.id),
        createProductImageData(product.id),
      ]);

      // Delete product
      await db.delete(products).where(eq(products.id, product.id));

      // Check images are deleted
      const images = await db
        .select()
        .from(productImages)
        .where(eq(productImages.productId, product.id));

      expect(images.length).toBe(0);
    });
  });

  describe("Product Images", () => {
    it("should add images to product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      const imageData = createProductImageData(product.id, {
        url: "https://example.com/product.jpg",
        isMain: true,
      });

      const [image] = await db
        .insert(productImages)
        .values(imageData)
        .returning();

      expect(image.productId).toBe(product.id);
      expect(image.isMain).toBe(true);
    });

    it("should set main image", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      await db.insert(productImages).values([
        createProductImageData(product.id, { isMain: true, position: 0 }),
        createProductImageData(product.id, { isMain: false, position: 1 }),
      ]);

      const mainImages = await db
        .select()
        .from(productImages)
        .where(eq(productImages.isMain, true));

      expect(mainImages.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Product Inventory", () => {
    it("should create inventory for product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      const inventoryData = createProductInventoryData(product.id, {
        quantity: 100,
        policy: "track",
      });

      const [inventory] = await db
        .insert(productInventory)
        .values(inventoryData)
        .returning();

      expect(inventory.productId).toBe(product.id);
      expect(inventory.quantity).toBe(100);
      expect(inventory.policy).toBe("track");
    });

    it("should update inventory quantity", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      const inventoryData = createProductInventoryData(product.id, {
        quantity: 100,
      });
      const [inventory] = await db
        .insert(productInventory)
        .values(inventoryData)
        .returning();

      const [updated] = await db
        .update(productInventory)
        .set({ quantity: 50 })
        .where(eq(productInventory.id, inventory.id))
        .returning();

      expect(updated.quantity).toBe(50);
    });

    it("should track reserved inventory", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      const inventoryData = createProductInventoryData(product.id, {
        quantity: 100,
        reserved: 10,
      });

      const [inventory] = await db
        .insert(productInventory)
        .values(inventoryData)
        .returning();

      expect(inventory.reserved).toBe(10);
      expect(inventory.quantity - inventory.reserved).toBe(90);
    });
  });

  describe("Product Specifications", () => {
    it("should add specifications to product", async () => {
      const productData = createProductData(testBrand.id, testCategory.id);
      const [product] = await db.insert(products).values(productData).returning();

      const [spec] = await db
        .insert(productSpecifications)
        .values({
          productId: product.id,
          name: "Screen Size",
          value: "6.1 inches",
          group: "Display",
          displayOrder: 1,
        })
        .returning();

      expect(spec.productId).toBe(product.id);
      expect(spec.name).toBe("Screen Size");
      expect(spec.value).toBe("6.1 inches");
    });
  });
});
