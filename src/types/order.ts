import type { Address } from "./user";
import type { ProductCard } from "./product";

export type OrderStatus =
  | "pending"
  | "payment_pending"
  | "payment_failed"
  | "paid"
  | "processing"
  | "ready_to_ship"
  | "shipped"
  | "out_for_delivery"
  | "delivered"
  | "completed"
  | "cancelled"
  | "refunded"
  | "failed";

export type FulfillmentStatus =
  | "unfulfilled"
  | "partial"
  | "fulfilled"
  | "restocked";

export type PaymentStatus =
  | "pending"
  | "authorized"
  | "paid"
  | "partial"
  | "refunded"
  | "voided"
  | "failed";

export type Order = {
  readonly id: string;
  readonly orderNumber: string;
  readonly userId: string;
  readonly status: OrderStatus;
  readonly paymentStatus: PaymentStatus;
  readonly fulfillmentStatus: FulfillmentStatus;
  readonly items: readonly OrderItem[];
  readonly subtotal: number;
  readonly shippingCost: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly currency: string;
  readonly shippingAddress: Address;
  readonly billingAddress?: Address;
  readonly shippingMethod: {
    readonly id: string;
    readonly name: string;
    readonly estimatedDays: number;
  };
  readonly paymentMethod: {
    readonly id: string;
    readonly type: string;
    readonly name: string;
  };
  readonly trackingNumber?: string;
  readonly trackingUrl?: string;
  readonly customerNotes?: string;
  readonly adminNotes?: string;
  readonly cancelReason?: string;
  readonly refundAmount?: number;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly paidAt?: string;
  readonly shippedAt?: string;
  readonly deliveredAt?: string;
  readonly completedAt?: string;
  readonly cancelledAt?: string;
};

export type OrderItem = {
  readonly id: string;
  readonly orderId: string;
  readonly productId: string;
  readonly variantId?: string;
  readonly sku: string;
  readonly name: string;
  readonly slug: string;
  readonly image?: string;
  readonly price: number;
  readonly quantity: number;
  readonly subtotal: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly variantOptions?: Record<string, string>;
  readonly refundedQuantity: number;
  readonly refundedAmount: number;
  readonly fulfillmentStatus: "unfulfilled" | "fulfilled" | "returned";
  readonly metadata?: Record<string, unknown>;
};

export type OrderSummary = {
  readonly id: string;
  readonly orderNumber: string;
  readonly status: OrderStatus;
  readonly paymentStatus: PaymentStatus;
  readonly total: number;
  readonly currency: string;
  readonly itemCount: number;
  readonly thumbnails: readonly string[];
  readonly createdAt: string;
  readonly deliveredAt?: string;
};

// Full order details
export type OrderDetail = Order & {
  readonly timeline: readonly OrderTimeline[];
  readonly statusHistory: readonly OrderStatusHistory[];
  readonly canCancel: boolean;
  readonly canReturn: boolean;
  readonly canReview: boolean;
};

// Timeline event
export type OrderTimeline = {
  readonly id: string;
  readonly orderId: string;
  readonly type: "status_change" | "payment" | "shipment" | "note" | "refund";
  readonly title: string;
  readonly description?: string;
  readonly status?: OrderStatus;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: string;
  readonly createdBy?: string;
};

// Status history
export type OrderStatusHistory = {
  readonly id: string;
  readonly orderId: string;
  readonly fromStatus: OrderStatus | null;
  readonly toStatus: OrderStatus;
  readonly reason?: string;
  readonly changedBy?: string;
  readonly createdAt: string;
};

// Order creation
export type OrderCreateData = {
  readonly userId: string;
  readonly items: readonly OrderItemInput[];
  readonly shippingAddressId: string;
  readonly billingAddressId?: string;
  readonly shippingMethodId: string;
  readonly paymentMethodId: string;
  readonly customerNotes?: string;
  readonly couponCode?: string;
  readonly metadata?: Record<string, unknown>;
};

// Order item input
export type OrderItemInput = {
  readonly productId: string;
  readonly variantId?: string;
  readonly quantity: number;
};

// Order update
export type OrderUpdateData = {
  readonly status?: OrderStatus;
  readonly trackingNumber?: string;
  readonly trackingUrl?: string;
  readonly adminNotes?: string;
  readonly shippedAt?: string;
  readonly deliveredAt?: string;
};

// Order cancellation
export type OrderCancelData = {
  readonly orderId: string;
  readonly reason: string;
  readonly requestedBy: "customer" | "admin";
};

// Order filters
export type OrderFilterParams = {
  readonly userId?: string;
  readonly status?: OrderStatus | readonly OrderStatus[];
  readonly paymentStatus?: PaymentStatus | readonly PaymentStatus[];
  readonly fulfillmentStatus?: FulfillmentStatus | readonly FulfillmentStatus[];
  readonly dateFrom?: string;
  readonly dateTo?: string;
  readonly minTotal?: number;
  readonly maxTotal?: number;
  readonly search?: string;
};

// Sort fields
export type OrderSortField =
  | "orderNumber"
  | "createdAt"
  | "updatedAt"
  | "total"
  | "status"
  | "deliveredAt";

// Order statistics
export type OrderStats = {
  readonly userId?: string;
  readonly totalOrders: number;
  readonly totalRevenue: number;
  readonly averageOrderValue: number;
  readonly byStatus: Record<OrderStatus, number>;
  readonly byMonth: readonly {
    readonly month: string;
    readonly count: number;
    readonly revenue: number;
  }[];
  readonly topProducts: readonly {
    readonly productId: string;
    readonly name: string;
    readonly orderCount: number;
    readonly revenue: number;
  }[];
  readonly updatedAt: string;
};

// Totals breakdown
export type OrderTotals = {
  readonly subtotal: number;
  readonly shipping: number;
  readonly tax: number;
  readonly discount: number;
  readonly total: number;
  readonly currency: string;
  readonly breakdown?: {
    readonly items: readonly {
      readonly name: string;
      readonly quantity: number;
      readonly price: number;
      readonly total: number;
    }[];
    readonly discounts?: readonly {
      readonly code: string;
      readonly amount: number;
      readonly type: "percentage" | "fixed";
    }[];
    readonly taxes?: readonly {
      readonly name: string;
      readonly rate: number;
      readonly amount: number;
    }[];
  };
};

// Calculation input
export type OrderCalculationInput = {
  readonly items: readonly OrderItemInput[];
  readonly shippingMethodId: string;
  readonly shippingAddressId: string;
  readonly couponCode?: string;
};

// Tracking info
export type OrderTracking = {
  readonly orderId: string;
  readonly orderNumber: string;
  readonly status: OrderStatus;
  readonly trackingNumber?: string;
  readonly trackingUrl?: string;
  readonly carrier?: string;
  readonly estimatedDelivery?: string;
  readonly events: readonly TrackingEvent[];
  readonly currentLocation?: string;
  readonly updatedAt: string;
};

// Tracking event
export type TrackingEvent = {
  readonly id: string;
  readonly status: string;
  readonly description: string;
  readonly location?: string;
  readonly timestamp: string;
};

// Return status
export type ReturnStatus =
  | "requested"
  | "approved"
  | "rejected"
  | "received"
  | "completed"
  | "cancelled";

// Return request
export type ReturnRequest = {
  readonly id: string;
  readonly orderId: string;
  readonly userId: string;
  readonly items: readonly {
    readonly orderItemId: string;
    readonly quantity: number;
    readonly reason: string;
  }[];
  readonly status: ReturnStatus;
  readonly reason: string;
  readonly comments?: string;
  readonly images?: readonly string[];
  readonly refundAmount: number;
  readonly refundMethod: "original" | "store_credit" | "exchange";
  readonly trackingNumber?: string;
  readonly adminNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly approvedAt?: string;
  readonly completedAt?: string;
};

// Refund
export type Refund = {
  readonly id: string;
  readonly orderId: string;
  readonly returnRequestId?: string;
  readonly amount: number;
  readonly currency: string;
  readonly reason: string;
  readonly status: "pending" | "processing" | "completed" | "failed";
  readonly method: string;
  readonly transactionId?: string;
  readonly processedBy?: string;
  readonly createdAt: string;
  readonly processedAt?: string;
};

// Order receipt
export type OrderReceipt = {
  readonly order: Order;
  readonly customer: {
    readonly name: string;
    readonly email: string;
    readonly phone?: string;
  };
  readonly company?: {
    readonly name: string;
    readonly address: string;
    readonly taxId?: string;
    readonly phone: string;
    readonly email: string;
    readonly website?: string;
    readonly logo?: string;
  };
  readonly generatedAt: string;
};
