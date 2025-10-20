// Shipping Method Types
export type ShippingMethodStatus = "active" | "inactive" | "seasonal";
export type ShippingMethodType =
  | "standard"
  | "express"
  | "next_day"
  | "pickup"
  | "same_day";

export type ShippingMethod = {
  readonly id: string;
  readonly name: string;
  readonly type: ShippingMethodType;
  readonly description?: string;
  readonly status: ShippingMethodStatus;
  readonly carrier?: string;
  readonly icon?: string;
  readonly estimatedDaysMin: number;
  readonly estimatedDaysMax: number;
  readonly baseCost: number;
  readonly currency: string;
  readonly freeShippingThreshold?: number;
  readonly maxWeight?: number;
  readonly maxDimensions?: {
    readonly length: number;
    readonly width: number;
    readonly height: number;
  };
  readonly supportedGovernorates: readonly string[];
  readonly excludedGovernorates?: readonly string[];
  readonly availableDays?: readonly number[];
  readonly cutoffTime?: string;
  readonly displayOrder: number;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type ShippingMethodSummary = Pick<
  ShippingMethod,
  | "id"
  | "name"
  | "type"
  | "description"
  | "estimatedDaysMin"
  | "estimatedDaysMax"
> & {
  readonly cost: number;
  readonly currency: string;
  readonly freeShipping: boolean;
};

// Iraqi Governorates
export type IraqiGovernorate =
  | "baghdad"
  | "basra"
  | "nineveh"
  | "erbil"
  | "sulaymaniyah"
  | "dohuk"
  | "kirkuk"
  | "najaf"
  | "karbala"
  | "babil"
  | "diyala"
  | "anbar"
  | "wasit"
  | "saladin"
  | "dhi_qar"
  | "qadisiyyah"
  | "maysan"
  | "muthanna";

export type Governorate = {
  readonly id: string;
  readonly code: IraqiGovernorate;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly region: "central" | "southern" | "northern" | "kurdistan";
  readonly capital?: string;
  readonly districts?: readonly District[];
  readonly shippingZone: ShippingZone;
  readonly enabled: boolean;
  readonly displayOrder: number;
  readonly metadata?: Record<string, unknown>;
};

export type District = {
  readonly id: string;
  readonly governorateId: string;
  readonly nameEn: string;
  readonly nameAr: string;
  readonly enabled: boolean;
};

// Shipping Zones & Rates
export type ShippingZone = "zone_1" | "zone_2" | "zone_3" | "zone_4";

export type ShippingZoneConfig = {
  readonly zone: ShippingZone;
  readonly name: string;
  readonly description?: string;
  readonly governorates: readonly IraqiGovernorate[];
  readonly baseRate: number;
  readonly perKgRate?: number;
  readonly estimatedDaysMin: number;
  readonly estimatedDaysMax: number;
};

export type ShippingRate = {
  readonly id: string;
  readonly shippingMethodId: string;
  readonly governorateId?: string;
  readonly zone?: ShippingZone;
  readonly minWeight?: number;
  readonly maxWeight?: number;
  readonly minOrderValue?: number;
  readonly maxOrderValue?: number;
  readonly cost: number;
  readonly currency: string;
  readonly additionalCostPerKg?: number;
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Shipping Calculations
export type ShippingCalculationRequest = {
  readonly governorateId: string;
  readonly districtId?: string;
  readonly items: readonly {
    readonly productId: string;
    readonly variantId?: string;
    readonly quantity: number;
    readonly weight?: number;
  }[];
  readonly orderValue: number;
  readonly currency: string;
};

export type ShippingCalculationResponse = {
  readonly availableMethods: readonly ShippingMethodSummary[];
  readonly totalWeight: number;
  readonly governorate: Pick<
    Governorate,
    "id" | "nameEn" | "nameAr" | "shippingZone"
  >;
  readonly estimatedDeliveryDate?: {
    readonly min: string;
    readonly max: string;
  };
};

export type ShippingCostBreakdown = {
  readonly baseCost: number;
  readonly weightCost: number;
  readonly zoneSurcharge: number;
  readonly districtSurcharge: number;
  readonly discount: number;
  readonly total: number;
  readonly currency: string;
  readonly freeShippingApplied: boolean;
};

// Shipments & Tracking
export type ShipmentStatus =
  | "pending"
  | "processing"
  | "ready_to_ship"
  | "picked_up"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "failed"
  | "returned";

export type Shipment = {
  readonly id: string;
  readonly orderId: string;
  readonly trackingNumber: string;
  readonly carrier?: string;
  readonly shippingMethodId: string;
  readonly status: ShipmentStatus;
  readonly origin: ShippingAddress;
  readonly destination: ShippingAddress;
  readonly weight?: number;
  readonly dimensions?: {
    readonly length: number;
    readonly width: number;
    readonly height: number;
  };
  readonly packageCount: number;
  readonly estimatedDeliveryDate?: string;
  readonly actualDeliveryDate?: string;
  readonly cost: number;
  readonly currency: string;
  readonly notes?: string;
  readonly trackingUrl?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly shippedAt?: string;
  readonly deliveredAt?: string;
};

export type ShippingAddress = {
  readonly recipientName: string;
  readonly recipientPhone: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly governorate: string;
  readonly district?: string;
  readonly country: string;
  readonly postalCode?: string;
};

export type ShipmentTrackingEvent = {
  readonly id: string;
  readonly shipmentId: string;
  readonly status: ShipmentStatus;
  readonly location?: string;
  readonly description: string;
  readonly timestamp: string;
  readonly metadata?: Record<string, unknown>;
};

export type ShipmentTracking = {
  readonly shipment: Shipment;
  readonly events: readonly ShipmentTrackingEvent[];
  readonly currentLocation?: string;
  readonly estimatedDelivery?: string;
  readonly lastUpdated: string;
};

// Delivery Slots
export type DeliverySlot = {
  readonly id: string;
  readonly date: string;
  readonly startTime: string;
  readonly endTime: string;
  readonly available: boolean;
  readonly capacity: number;
  readonly booked: number;
  readonly governorateId: string;
  readonly shippingMethodId: string;
};

export type DeliverySlotSelection = {
  readonly slotId: string;
  readonly date: string;
  readonly timeRange: string;
};

// Shipping Stats & Config
export type ShippingStats = {
  readonly period: { readonly from: string; readonly to: string };
  readonly totalShipments: number;
  readonly byStatus: Record<ShipmentStatus, number>;
  readonly byGovernorate: Record<
    string,
    {
      readonly count: number;
      readonly cost: number;
      readonly averageDeliveryDays: number;
    }
  >;
  readonly byMethod: Record<
    string,
    { readonly count: number; readonly cost: number }
  >;
  readonly averageDeliveryDays: number;
  readonly onTimeDeliveryRate: number;
  readonly failureRate: number;
  readonly totalCost: number;
  readonly currency: string;
};

export type ShippingConfig = {
  readonly freeShippingEnabled: boolean;
  readonly freeShippingThreshold?: number;
  readonly currency: string;
  readonly maxWeight?: number;
  readonly maxDimensions?: {
    readonly length: number;
    readonly width: number;
    readonly height: number;
  };
  readonly allowInternationalShipping: boolean;
  readonly defaultShippingMethodId?: string;
  readonly enableDeliverySlots: boolean;
  readonly enableTrackingNotifications: boolean;
  readonly updatedAt: string;
};

// Coverage & Availability
export type ShippingCoverageCheck = {
  readonly governorateId: string;
  readonly districtId?: string;
  readonly covered: boolean;
  readonly availableMethods: readonly ShippingMethodSummary[];
  readonly restrictions?: readonly string[];
  readonly estimatedDeliveryDays?: {
    readonly min: number;
    readonly max: number;
  };
};

export type ServiceAvailability = {
  readonly governorateId: string;
  readonly available: boolean;
  readonly reason?: string;
  readonly alternativeGovernorates?: readonly string[];
  readonly expectedAvailabilityDate?: string;
};
