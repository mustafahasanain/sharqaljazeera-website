import { relations } from "drizzle-orm";
import {
  pgTable,
  varchar,
  text,
  timestamp,
  pgEnum,
  uuid,
  integer,
  decimal,
  index,
  uniqueIndex,
  json,
} from "drizzle-orm/pg-core";
import { users, addresses } from "./users";
import { products, productVariants } from "./products";

// Enums - Order status enumeration
export const orderStatusEnum = pgEnum("order_status", [
  "pending",
  "payment_pending",
  "payment_failed",
  "paid",
  "processing",
  "ready_to_ship",
  "shipped",
  "out_for_delivery",
  "delivered",
  "completed",
  "cancelled",
  "refunded",
  "failed",
]);

// Payment status enumeration
export const paymentStatusEnum = pgEnum("payment_status", [
  "pending",
  "authorized",
  "paid",
  "partial",
  "refunded",
  "voided",
  "failed",
]);

// Fulfillment status enumeration
export const fulfillmentStatusEnum = pgEnum("fulfillment_status", [
  "unfulfilled",
  "partial",
  "fulfilled",
  "restocked",
]);

// Payment provider enumeration
export const paymentProviderEnum = pgEnum("payment_provider", [
  "cod",
  "qicard",
  "zaincash",
  "stripe",
  "paypal",
]);

// Transaction status enumeration
export const transactionStatusEnum = pgEnum("transaction_status", [
  "pending",
  "processing",
  "authorized",
  "completed",
  "failed",
  "cancelled",
  "refunded",
  "partially_refunded",
]);

// Transaction type enumeration
export const transactionTypeEnum = pgEnum("transaction_type", [
  "payment",
  "refund",
  "authorization",
  "capture",
]);

// Shipment status enumeration
export const shipmentStatusEnum = pgEnum("shipment_status", [
  "pending",
  "processing",
  "ready_to_ship",
  "picked_up",
  "in_transit",
  "out_for_delivery",
  "delivered",
  "failed",
  "returned",
]);

// 1. Orders Table
export const orders = pgTable(
  "orders",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderNumber: varchar("order_number", { length: 50 }).notNull().unique(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    status: orderStatusEnum("status").default("pending").notNull(),
    paymentStatus: paymentStatusEnum("payment_status")
      .default("pending")
      .notNull(),
    fulfillmentStatus: fulfillmentStatusEnum("fulfillment_status")
      .default("unfulfilled")
      .notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
    discount: decimal("discount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("IQD").notNull(),
    shippingAddressId: uuid("shipping_address_id")
      .notNull()
      .references(() => addresses.id, { onDelete: "restrict" }),
    billingAddressId: uuid("billing_address_id").references(
      () => addresses.id,
      {
        onDelete: "restrict",
      }
    ),
    shippingMethodId: varchar("shipping_method_id", { length: 100 }).notNull(),
    shippingMethodName: varchar("shipping_method_name", {
      length: 255,
    }).notNull(),
    shippingEstimatedDays: integer("shipping_estimated_days"),
    paymentMethodId: varchar("payment_method_id", { length: 100 }).notNull(),
    paymentMethodType: varchar("payment_method_type", {
      length: 100,
    }).notNull(),
    paymentMethodName: varchar("payment_method_name", {
      length: 255,
    }).notNull(),
    trackingNumber: varchar("tracking_number", { length: 255 }),
    trackingUrl: text("tracking_url"),
    customerNotes: text("customer_notes"),
    adminNotes: text("admin_notes"),
    cancelReason: text("cancel_reason"),
    refundAmount: decimal("refund_amount", { precision: 10, scale: 2 }),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    paidAt: timestamp("paid_at", { mode: "string" }),
    shippedAt: timestamp("shipped_at", { mode: "string" }),
    deliveredAt: timestamp("delivered_at", { mode: "string" }),
    completedAt: timestamp("completed_at", { mode: "string" }),
    cancelledAt: timestamp("cancelled_at", { mode: "string" }),
  },
  (table) => ({
    orderNumberIdx: uniqueIndex("orders_order_number_idx").on(
      table.orderNumber
    ),
    userIdIdx: index("orders_user_id_idx").on(table.userId),
    statusIdx: index("orders_status_idx").on(table.status),
    paymentStatusIdx: index("orders_payment_status_idx").on(
      table.paymentStatus
    ),
    fulfillmentStatusIdx: index("orders_fulfillment_status_idx").on(
      table.fulfillmentStatus
    ),
    createdAtIdx: index("orders_created_at_idx").on(table.createdAt),
    trackingNumberIdx: index("orders_tracking_number_idx").on(
      table.trackingNumber
    ),
  })
);

// 1a. Order relations
export const ordersRelations = relations(orders, ({ one, many }) => ({
  user: one(users, {
    fields: [orders.userId],
    references: [users.id],
  }),
  shippingAddress: one(addresses, {
    fields: [orders.shippingAddressId],
    references: [addresses.id],
    relationName: "shipping_address",
  }),
  billingAddress: one(addresses, {
    fields: [orders.billingAddressId],
    references: [addresses.id],
    relationName: "billing_address",
  }),
  items: many(orderItems),
  payments: many(payments),
  shipments: many(shipments),
  statusHistory: many(orderStatusHistory),
}));

// 1b. Inferred order type
export type Order = typeof orders.$inferSelect;

// 1c. Order insert type
export type NewOrder = typeof orders.$inferInsert;

// 2- Order Items Table
export const orderItems = pgTable(
  "order_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "restrict" }),
    variantId: uuid("variant_id").references(() => productVariants.id, {
      onDelete: "restrict",
    }),
    sku: varchar("sku", { length: 100 }).notNull(),
    name: varchar("name", { length: 255 }).notNull(),
    slug: varchar("slug", { length: 255 }).notNull(),
    image: text("image"),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    quantity: integer("quantity").notNull(),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }).notNull(),
    tax: decimal("tax", { precision: 10, scale: 2 }).default("0").notNull(),
    discount: decimal("discount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    total: decimal("total", { precision: 10, scale: 2 }).notNull(),
    variantOptions: json("variant_options").$type<Record<string, string>>(),
    refundedQuantity: integer("refunded_quantity").default(0).notNull(),
    refundedAmount: decimal("refunded_amount", { precision: 10, scale: 2 })
      .default("0")
      .notNull(),
    fulfillmentStatus: varchar("fulfillment_status", { length: 50 })
      .default("unfulfilled")
      .notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_items_order_id_idx").on(table.orderId),
    productIdIdx: index("order_items_product_id_idx").on(table.productId),
    variantIdIdx: index("order_items_variant_id_idx").on(table.variantId),
    skuIdx: index("order_items_sku_idx").on(table.sku),
  })
);

// 2a. Order items relations
export const orderItemsRelations = relations(orderItems, ({ one }) => ({
  order: one(orders, {
    fields: [orderItems.orderId],
    references: [orders.id],
  }),
  product: one(products, {
    fields: [orderItems.productId],
    references: [products.id],
  }),
  variant: one(productVariants, {
    fields: [orderItems.variantId],
    references: [productVariants.id],
  }),
}));

// 2b. Inferred order item type
export type OrderItem = typeof orderItems.$inferSelect;

// 2c. Order item insert type
export type NewOrderItem = typeof orderItems.$inferInsert;

// 3. Payments Transactions Table
export const payments = pgTable(
  "payments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    type: transactionTypeEnum("type").default("payment").notNull(),
    status: transactionStatusEnum("status").default("pending").notNull(),
    provider: paymentProviderEnum("provider").notNull(),
    paymentMethodId: varchar("payment_method_id", { length: 100 }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("IQD").notNull(),
    fee: decimal("fee", { precision: 10, scale: 2 }).default("0"),
    netAmount: decimal("net_amount", { precision: 10, scale: 2 }).notNull(),
    providerTransactionId: varchar("provider_transaction_id", { length: 255 }),
    providerReferenceId: varchar("provider_reference_id", { length: 255 }),
    providerResponse:
      json("provider_response").$type<Record<string, unknown>>(),
    errorCode: varchar("error_code", { length: 100 }),
    errorMessage: text("error_message"),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    ipAddress: varchar("ip_address", { length: 45 }),
    userAgent: text("user_agent"),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    authorizedAt: timestamp("authorized_at", { mode: "string" }),
    completedAt: timestamp("completed_at", { mode: "string" }),
    failedAt: timestamp("failed_at", { mode: "string" }),
    refundedAt: timestamp("refunded_at", { mode: "string" }),
  },
  (table) => ({
    orderIdIdx: index("payments_order_id_idx").on(table.orderId),
    userIdIdx: index("payments_user_id_idx").on(table.userId),
    statusIdx: index("payments_status_idx").on(table.status),
    providerIdx: index("payments_provider_idx").on(table.provider),
    providerTransactionIdIdx: index("payments_provider_transaction_id_idx").on(
      table.providerTransactionId
    ),
    createdAtIdx: index("payments_created_at_idx").on(table.createdAt),
  })
);

// 3a. Payment relations
export const paymentsRelations = relations(payments, ({ one }) => ({
  order: one(orders, {
    fields: [payments.orderId],
    references: [orders.id],
  }),
  user: one(users, {
    fields: [payments.userId],
    references: [users.id],
  }),
}));

// 3b. Inferred payment type
export type Payment = typeof payments.$inferSelect;

// 3c. Payment insert type
export type NewPayment = typeof payments.$inferInsert;

// 4. Shipments Table
export const shipments = pgTable(
  "shipments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    trackingNumber: varchar("tracking_number", { length: 255 })
      .notNull()
      .unique(),
    carrier: varchar("carrier", { length: 255 }),
    shippingMethodId: varchar("shipping_method_id", { length: 100 }).notNull(),
    status: shipmentStatusEnum("status").default("pending").notNull(),
    originAddress: json("origin_address")
      .$type<Record<string, string>>()
      .notNull(),
    destinationAddress: json("destination_address")
      .$type<Record<string, string>>()
      .notNull(),
    weight: integer("weight"), // in grams
    dimensions: json("dimensions").$type<{
      length: number;
      width: number;
      height: number;
    }>(),
    packageCount: integer("package_count").default(1).notNull(),
    estimatedDeliveryDate: timestamp("estimated_delivery_date", {
      mode: "string",
    }),
    actualDeliveryDate: timestamp("actual_delivery_date", { mode: "string" }),
    cost: decimal("cost", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).default("IQD").notNull(),
    notes: text("notes"),
    trackingUrl: text("tracking_url"),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    updatedAt: timestamp("updated_at", { mode: "string" })
      .defaultNow()
      .notNull(),
    shippedAt: timestamp("shipped_at", { mode: "string" }),
    deliveredAt: timestamp("delivered_at", { mode: "string" }),
  },
  (table) => ({
    orderIdIdx: index("shipments_order_id_idx").on(table.orderId),
    trackingNumberIdx: uniqueIndex("shipments_tracking_number_idx").on(
      table.trackingNumber
    ),
    statusIdx: index("shipments_status_idx").on(table.status),
    estimatedDeliveryDateIdx: index("shipments_estimated_delivery_date_idx").on(
      table.estimatedDeliveryDate
    ),
  })
);

// 4a. Shipment relations
export const shipmentsRelations = relations(shipments, ({ one, many }) => ({
  order: one(orders, {
    fields: [shipments.orderId],
    references: [orders.id],
  }),
  trackingEvents: many(shipmentTrackingEvents),
}));

// 4b. Inferred shipment type
export type Shipment = typeof shipments.$inferSelect;

// 4c. Shipment insert type
export type NewShipment = typeof shipments.$inferInsert;

// 5. Shipment Tracking Events Table
export const shipmentTrackingEvents = pgTable(
  "shipment_tracking_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shipmentId: uuid("shipment_id")
      .notNull()
      .references(() => shipments.id, { onDelete: "cascade" }),
    status: shipmentStatusEnum("status").notNull(),
    location: varchar("location", { length: 255 }),
    description: text("description").notNull(),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    timestamp: timestamp("timestamp", { mode: "string" }).notNull(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    shipmentIdIdx: index("shipment_tracking_events_shipment_id_idx").on(
      table.shipmentId
    ),
    timestampIdx: index("shipment_tracking_events_timestamp_idx").on(
      table.timestamp
    ),
  })
);

// 5a. Shipment tracking events relations
export const shipmentTrackingEventsRelations = relations(
  shipmentTrackingEvents,
  ({ one }) => ({
    shipment: one(shipments, {
      fields: [shipmentTrackingEvents.shipmentId],
      references: [shipments.id],
    }),
  })
);

// 5b. Inferred shipment tracking event type
export type ShipmentTrackingEvent = typeof shipmentTrackingEvents.$inferSelect;

// 5c. Shipment tracking event insert type
export type NewShipmentTrackingEvent =
  typeof shipmentTrackingEvents.$inferInsert;

// 6. Order Status History Table
export const orderStatusHistory = pgTable(
  "order_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: uuid("order_id")
      .notNull()
      .references(() => orders.id, { onDelete: "cascade" }),
    fromStatus: orderStatusEnum("from_status"),
    toStatus: orderStatusEnum("to_status").notNull(),
    reason: text("reason"),
    changedBy: uuid("changed_by").references(() => users.id, {
      onDelete: "set null",
    }),
    metadata: json("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { mode: "string" })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    orderIdIdx: index("order_status_history_order_id_idx").on(table.orderId),
    toStatusIdx: index("order_status_history_to_status_idx").on(table.toStatus),
    createdAtIdx: index("order_status_history_created_at_idx").on(
      table.createdAt
    ),
  })
);

// 6a. Order status history relations
export const orderStatusHistoryRelations = relations(
  orderStatusHistory,
  ({ one }) => ({
    order: one(orders, {
      fields: [orderStatusHistory.orderId],
      references: [orders.id],
    }),
    changedByUser: one(users, {
      fields: [orderStatusHistory.changedBy],
      references: [users.id],
    }),
  })
);

// 6b. Inferred order status history type
export type OrderStatusHistory = typeof orderStatusHistory.$inferSelect;

// 6c. Order status history insert type
export type NewOrderStatusHistory = typeof orderStatusHistory.$inferInsert;
