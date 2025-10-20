import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import {
  orders,
  orderItems,
  payments,
  users,
  products,
  brands,
  categories,
  addresses,
} from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createOrderData,
  createOrderItemData,
  createProductData,
  createBrandData,
  createCategoryData,
  createAddressData,
} from "../helpers/fixtures";

describe("Orders CRUD Operations", () => {
  let testUser: any;
  let testProduct: any;
  let testAddress: any;

  beforeEach(async () => {
    await truncateTables([
      "shipmentTrackingEvents",
      "shipments",
      "orderStatusHistory",
      "orderItems",
      "payments",
      "orders",
      "addresses",
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

    [testAddress] = await db
      .insert(addresses)
      .values(createAddressData(testUser.id))
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

  describe("Create Order", () => {
    it("should create a new order", async () => {
      const orderData = createOrderData(testUser.id, testAddress.id, {
        orderNumber: "ORD-12345",
        total: "99.99",
      });

      const [order] = await db.insert(orders).values(orderData).returning();

      expect(order).toBeDefined();
      expect(order.userId).toBe(testUser.id);
      expect(order.orderNumber).toBe("ORD-12345");
      expect(order.status).toBe("pending");
    });

    it("should enforce unique order number", async () => {
      const orderData = createOrderData(testUser.id, testAddress.id, {
        orderNumber: "UNIQUE-ORD",
      });

      await db.insert(orders).values(orderData);

      await expect(
        db.insert(orders).values(
          createOrderData(testUser.id, testAddress.id, { orderNumber: "UNIQUE-ORD" })
        )
      ).rejects.toThrow();
    });
  });

  describe("Order Items", () => {
    it("should add items to order", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      const itemData = createOrderItemData(order.id, testProduct.id, {
        quantity: 2,
        price: "99.99",
        subtotal: "199.98",
      });

      const [item] = await db.insert(orderItems).values(itemData).returning();

      expect(item.orderId).toBe(order.id);
      expect(item.productId).toBe(testProduct.id);
      expect(item.quantity).toBe(2);
      expect(item.subtotal).toBe("199.98");
    });

    it("should cascade delete order items when order is deleted", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      await db
        .insert(orderItems)
        .values(createOrderItemData(order.id, testProduct.id));

      await db.delete(orders).where(eq(orders.id, order.id));

      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      expect(items.length).toBe(0);
    });
  });

  describe("Read Orders", () => {
    it("should read order by ID", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      const [found] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, order.id));

      expect(found).toBeDefined();
      expect(found.id).toBe(order.id);
    });

    it("should read orders by user", async () => {
      await db.insert(orders).values([
        createOrderData(testUser.id, testAddress.id),
        createOrderData(testUser.id, testAddress.id),
      ]);

      const userOrders = await db
        .select()
        .from(orders)
        .where(eq(orders.userId, testUser.id));

      expect(userOrders.length).toBeGreaterThanOrEqual(2);
    });

    it("should read orders by status", async () => {
      await db.insert(orders).values([
        createOrderData(testUser.id, testAddress.id, { status: "completed" }),
        createOrderData(testUser.id, testAddress.id, { status: "pending" }),
      ]);

      const completed = await db
        .select()
        .from(orders)
        .where(eq(orders.status, "completed"));

      expect(completed.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("Update Order", () => {
    it("should update order status", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id, { status: "pending" }))
        .returning();

      const [updated] = await db
        .update(orders)
        .set({ status: "processing" })
        .where(eq(orders.id, order.id))
        .returning();

      expect(updated.status).toBe("processing");
    });

    it("should update payment status", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id, { paymentStatus: "pending" }))
        .returning();

      const [updated] = await db
        .update(orders)
        .set({ paymentStatus: "paid" })
        .where(eq(orders.id, order.id))
        .returning();

      expect(updated.paymentStatus).toBe("paid");
    });
  });

  describe("Order Payments", () => {
    it("should create payment for order", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      const [payment] = await db
        .insert(payments)
        .values({
          orderId: order.id,
          userId: testUser.id,
          provider: "stripe",
          paymentMethodId: "pm_test_123",
          amount: "99.99",
          netAmount: "99.99",
          currency: "USD",
          status: "completed",
        })
        .returning();

      expect(payment.orderId).toBe(order.id);
      expect(payment.status).toBe("completed");
    });
  });

  describe("Delete Order", () => {
    it("should delete an order", async () => {
      const [order] = await db
        .insert(orders)
        .values(createOrderData(testUser.id, testAddress.id))
        .returning();

      await db.delete(orders).where(eq(orders.id, order.id));

      const [found] = await db
        .select()
        .from(orders)
        .where(eq(orders.id, order.id));

      expect(found).toBeUndefined();
    });
  });
});
