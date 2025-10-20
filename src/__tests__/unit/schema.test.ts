import { describe, it, expect } from "vitest";
import {
  tableExists,
  getTableColumns,
  getTableIndexes,
  indexExists,
} from "../helpers/db-helper";

describe("Database Schema Tests", () => {
  describe("Users Schema", () => {
    it("should have users table", async () => {
      const exists = await tableExists("users");
      expect(exists).toBe(true);
    });

    it("should have correct columns in users table", async () => {
      const columns = await getTableColumns("users");
      expect(columns).toContain("id");
      expect(columns).toContain("email");
      expect(columns).toContain("password_hash");
      expect(columns).toContain("first_name");
      expect(columns).toContain("last_name");
      expect(columns).toContain("role");
      expect(columns).toContain("status");
    });

    it("should have users email index", async () => {
      const exists = await indexExists("users_email_idx");
      expect(exists).toBe(true);
    });

    it("should have accounts table", async () => {
      const exists = await tableExists("accounts");
      expect(exists).toBe(true);
    });

    it("should have sessions table", async () => {
      const exists = await tableExists("sessions");
      expect(exists).toBe(true);
    });

    it("should have addresses table", async () => {
      const exists = await tableExists("addresses");
      expect(exists).toBe(true);
    });

    it("should have user_preferences table", async () => {
      const exists = await tableExists("user_preferences");
      expect(exists).toBe(true);
    });

    it("should have verification_tokens table", async () => {
      const exists = await tableExists("verification_tokens");
      expect(exists).toBe(true);
    });
  });

  describe("Brands Schema", () => {
    it("should have brands table", async () => {
      const exists = await tableExists("brands");
      expect(exists).toBe(true);
    });

    it("should have correct columns in brands table", async () => {
      const columns = await getTableColumns("brands");
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("slug");
      expect(columns).toContain("status");
      expect(columns).toContain("featured");
    });
  });

  describe("Categories Schema", () => {
    it("should have categories table", async () => {
      const exists = await tableExists("categories");
      expect(exists).toBe(true);
    });

    it("should have correct columns in categories table", async () => {
      const columns = await getTableColumns("categories");
      expect(columns).toContain("id");
      expect(columns).toContain("name");
      expect(columns).toContain("slug");
      expect(columns).toContain("parent_id");
      expect(columns).toContain("level");
      expect(columns).toContain("path");
    });
  });

  describe("Products Schema", () => {
    it("should have products table", async () => {
      const exists = await tableExists("products");
      expect(exists).toBe(true);
    });

    it("should have correct columns in products table", async () => {
      const columns = await getTableColumns("products");
      expect(columns).toContain("id");
      expect(columns).toContain("sku");
      expect(columns).toContain("name");
      expect(columns).toContain("slug");
      expect(columns).toContain("brand_id");
      expect(columns).toContain("category_id");
      expect(columns).toContain("price");
    });

    it("should have product images table", async () => {
      const exists = await tableExists("product_images");
      expect(exists).toBe(true);
    });

    it("should have product specifications table", async () => {
      const exists = await tableExists("product_specifications");
      expect(exists).toBe(true);
    });

    it("should have product variants table", async () => {
      const exists = await tableExists("product_variants");
      expect(exists).toBe(true);
    });

    it("should have product inventory table", async () => {
      const exists = await tableExists("product_inventory");
      expect(exists).toBe(true);
    });

    it("should have variant inventory table", async () => {
      const exists = await tableExists("variant_inventory");
      expect(exists).toBe(true);
    });
  });

  describe("Carts Schema", () => {
    it("should have carts table", async () => {
      const exists = await tableExists("carts");
      expect(exists).toBe(true);
    });

    it("should have cart_items table", async () => {
      const exists = await tableExists("cart_items");
      expect(exists).toBe(true);
    });

    it("should have correct columns in carts table", async () => {
      const columns = await getTableColumns("carts");
      expect(columns).toContain("id");
      expect(columns).toContain("user_id");
      expect(columns).toContain("session_id");
      expect(columns).toContain("created_at");
    });
  });

  describe("Orders Schema", () => {
    it("should have orders table", async () => {
      const exists = await tableExists("orders");
      expect(exists).toBe(true);
    });

    it("should have order_items table", async () => {
      const exists = await tableExists("order_items");
      expect(exists).toBe(true);
    });

    it("should have payments table", async () => {
      const exists = await tableExists("payments");
      expect(exists).toBe(true);
    });

    it("should have shipments table", async () => {
      const exists = await tableExists("shipments");
      expect(exists).toBe(true);
    });

    it("should have correct columns in orders table", async () => {
      const columns = await getTableColumns("orders");
      expect(columns).toContain("id");
      expect(columns).toContain("user_id");
      expect(columns).toContain("order_number");
      expect(columns).toContain("status");
      expect(columns).toContain("payment_status");
      expect(columns).toContain("total");
    });
  });

  describe("Favorites Schema", () => {
    it("should have favorites table", async () => {
      const exists = await tableExists("favorites");
      expect(exists).toBe(true);
    });

    it("should have correct columns in favorites table", async () => {
      const columns = await getTableColumns("favorites");
      expect(columns).toContain("id");
      expect(columns).toContain("user_id");
      expect(columns).toContain("product_id");
    });
  });

  describe("Indexes", () => {
    it("should have key indexes for performance", async () => {
      // Users indexes
      expect(await indexExists("users_email_idx")).toBe(true);
      expect(await indexExists("users_role_idx")).toBe(true);

      // Products indexes
      expect(await indexExists("products_sku_idx")).toBe(true);
      expect(await indexExists("products_slug_idx")).toBe(true);
      expect(await indexExists("products_brand_id_idx")).toBe(true);
      expect(await indexExists("products_category_id_idx")).toBe(true);
    });
  });
});
