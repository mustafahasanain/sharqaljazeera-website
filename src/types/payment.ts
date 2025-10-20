// Payment Method Types
export type PaymentProvider =
  | "cod"
  | "qicard"
  | "zaincash"
  | "stripe"
  | "paypal";
export type PaymentMethodType =
  | "cash_on_delivery"
  | "credit_card"
  | "debit_card"
  | "wallet"
  | "bank_transfer";
export type PaymentMethodStatus = "active" | "inactive" | "maintenance";

export type PaymentMethod = {
  readonly id: string;
  readonly provider: PaymentProvider;
  readonly type: PaymentMethodType;
  readonly name: string;
  readonly displayName: string;
  readonly description?: string;
  readonly icon?: string;
  readonly status: PaymentMethodStatus;
  readonly isDefault: boolean;
  readonly minAmount?: number;
  readonly maxAmount?: number;
  readonly fee?: PaymentFee;
  readonly supportedCurrencies: readonly string[];
  readonly processingTime?: string;
  readonly instructions?: string;
  readonly displayOrder: number;
  readonly metadata?: Record<string, unknown>;
  readonly createdAt: string;
  readonly updatedAt: string;
};

export type PaymentFee = {
  readonly type: "fixed" | "percentage";
  readonly amount: number;
  readonly currency?: string;
  readonly description?: string;
};

// Payment Transactions
export type TransactionStatus =
  | "pending"
  | "processing"
  | "authorized"
  | "completed"
  | "failed"
  | "cancelled"
  | "refunded"
  | "partially_refunded";
export type TransactionType =
  | "payment"
  | "refund"
  | "authorization"
  | "capture";

export type PaymentTransaction = {
  readonly id: string;
  readonly orderId: string;
  readonly userId: string;
  readonly type: TransactionType;
  readonly status: TransactionStatus;
  readonly provider: PaymentProvider;
  readonly paymentMethodId: string;
  readonly amount: number;
  readonly currency: string;
  readonly fee?: number;
  readonly netAmount: number;
  readonly providerTransactionId?: string;
  readonly providerReferenceId?: string;
  readonly providerResponse?: Record<string, unknown>;
  readonly errorCode?: string;
  readonly errorMessage?: string;
  readonly metadata?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly authorizedAt?: string;
  readonly completedAt?: string;
  readonly failedAt?: string;
  readonly refundedAt?: string;
};

// Payment Requests & Responses
export type PaymentInitRequest = {
  readonly orderId: string;
  readonly paymentMethodId: string;
  readonly amount: number;
  readonly currency: string;
  readonly returnUrl: string;
  readonly cancelUrl: string;
  readonly metadata?: Record<string, unknown>;
};

export type PaymentInitResponse = {
  readonly transactionId: string;
  readonly status: TransactionStatus;
  readonly redirectUrl?: string;
  readonly paymentUrl?: string;
  readonly qrCode?: string;
  readonly reference?: string;
  readonly expiresAt?: string;
  readonly instructions?: string;
};

export type PaymentConfirmRequest = {
  readonly transactionId: string;
  readonly providerTransactionId?: string;
  readonly verificationToken?: string;
  readonly metadata?: Record<string, unknown>;
};

export type PaymentConfirmResponse = {
  readonly transactionId: string;
  readonly status: TransactionStatus;
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly completedAt?: string;
  readonly receipt?: PaymentReceipt;
};

// Provider-Specific Types
export type CodPaymentData = {
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly instructions?: string;
  readonly verificationRequired: boolean;
};

export type QiCardPaymentRequest = {
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly customerName: string;
  readonly customerEmail: string;
  readonly customerPhone: string;
  readonly returnUrl: string;
  readonly cancelUrl: string;
  readonly description?: string;
};

export type QiCardPaymentResponse = {
  readonly transactionId: string;
  readonly paymentUrl: string;
  readonly reference: string;
  readonly expiresAt: string;
};

export type ZainCashPaymentRequest = {
  readonly orderId: string;
  readonly amount: number;
  readonly currency: string;
  readonly customerMsisdn: string;
  readonly customerName: string;
  readonly returnUrl: string;
  readonly description?: string;
};

export type ZainCashPaymentResponse = {
  readonly transactionId: string;
  readonly paymentUrl: string;
  readonly reference: string;
  readonly qrCode?: string;
  readonly expiresAt: string;
};

export type ZainCashCallbackData = {
  readonly token: string;
  readonly transactionId: string;
  readonly orderId: string;
  readonly status: "success" | "failed" | "pending";
  readonly operationId?: string;
  readonly message?: string;
};

// Payment Verification
export type PaymentVerifyRequest = {
  readonly transactionId: string;
  readonly provider: PaymentProvider;
  readonly providerTransactionId?: string;
  readonly verificationToken?: string;
};

export type PaymentVerifyResponse = {
  readonly verified: boolean;
  readonly status: TransactionStatus;
  readonly amount: number;
  readonly currency: string;
  readonly transactionDate: string;
  readonly details?: Record<string, unknown>;
};

// Payment Receipts
export type PaymentReceipt = {
  readonly transactionId: string;
  readonly orderId: string;
  readonly orderNumber: string;
  readonly amount: number;
  readonly currency: string;
  readonly paymentMethod: string;
  readonly status: TransactionStatus;
  readonly paidAt: string;
  readonly reference?: string;
  readonly customer: {
    readonly name: string;
    readonly email: string;
  };
  readonly items?: readonly {
    readonly name: string;
    readonly quantity: number;
    readonly price: number;
  }[];
};

// Refunds
export type RefundRequest = {
  readonly transactionId: string;
  readonly orderId: string;
  readonly amount: number;
  readonly reason: string;
  readonly refundMethod?: "original" | "store_credit";
  readonly metadata?: Record<string, unknown>;
};

export type RefundResponse = {
  readonly refundId: string;
  readonly transactionId: string;
  readonly status: "pending" | "processing" | "completed" | "failed";
  readonly amount: number;
  readonly currency: string;
  readonly providerRefundId?: string;
  readonly estimatedCompletionDate?: string;
  readonly createdAt: string;
};

// Gateway Config
export type PaymentGatewayConfig = {
  readonly provider: PaymentProvider;
  readonly enabled: boolean;
  readonly testMode: boolean;
  readonly credentials: {
    readonly publicKey?: string;
    readonly merchantId?: string;
    readonly apiEndpoint?: string;
  };
  readonly webhookUrl?: string;
  readonly supportedCurrencies: readonly string[];
  readonly supportedCountries: readonly string[];
  readonly settings?: Record<string, unknown>;
};

// Payment Statistics
export type PaymentStats = {
  readonly period: { readonly from: string; readonly to: string };
  readonly totalTransactions: number;
  readonly successfulTransactions: number;
  readonly failedTransactions: number;
  readonly totalAmount: number;
  readonly totalFees: number;
  readonly currency: string;
  readonly byProvider: Record<
    PaymentProvider,
    {
      readonly count: number;
      readonly amount: number;
      readonly successRate: number;
    }
  >;
  readonly byStatus: Record<TransactionStatus, number>;
  readonly averageTransactionValue: number;
  readonly successRate: number;
};

// Validation & Eligibility
export type PaymentValidation = {
  readonly valid: boolean;
  readonly errors?: readonly {
    readonly field: string;
    readonly message: string;
    readonly code: string;
  }[];
  readonly warnings?: readonly string[];
};

export type PaymentEligibility = {
  readonly eligible: boolean;
  readonly paymentMethods: readonly PaymentMethod[];
  readonly restrictions?: readonly {
    readonly methodId: string;
    readonly reason: string;
  }[];
  readonly recommendedMethod?: string;
};

export type SavedPaymentMethod = {
  readonly id: string;
  readonly userId: string;
  readonly provider: PaymentProvider;
  readonly type: PaymentMethodType;
  readonly isDefault: boolean;
  readonly token: string;
  readonly last4?: string;
  readonly brand?: string;
  readonly expiryMonth?: number;
  readonly expiryYear?: number;
  readonly holderName?: string;
  readonly billingAddress?: {
    readonly country: string;
    readonly city?: string;
    readonly postalCode?: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
};
