export const AUTH_MESSAGES = {
  SUCCESS: {
    LOGIN: "Successfully logged in. Welcome back!",
    LOGOUT: "You have been logged out successfully.",
    REGISTER: "Account created successfully! Please verify your email.",
    EMAIL_VERIFIED: "Email verified successfully. You can now log in.",
    PASSWORD_RESET_SENT: "Password reset link sent to your email.",
    PASSWORD_RESET_SUCCESS:
      "Password reset successfully. Please log in with your new password.",
    PASSWORD_CHANGED: "Password changed successfully.",
  } as const,

  ERROR: {
    INVALID_CREDENTIALS: "Invalid email or password. Please try again.",
    EMAIL_ALREADY_EXISTS: "An account with this email already exists.",
    USER_NOT_FOUND: "No account found with this email address.",
    INVALID_TOKEN: "Invalid or expired token. Please request a new one.",
    EMAIL_NOT_VERIFIED: "Please verify your email before logging in.",
    WEAK_PASSWORD:
      "Password must be at least 8 characters long and include uppercase, lowercase, and numbers.",
    UNAUTHORIZED: "You are not authorized to access this resource.",
    SESSION_EXPIRED: "Your session has expired. Please log in again.",
    ACCOUNT_LOCKED: "Your account has been locked. Please contact support.",
    TOO_MANY_ATTEMPTS: "Too many login attempts. Please try again later.",
  } as const,
} as const;

export const PRODUCT_MESSAGES = {
  SUCCESS: {
    CREATED: "Product created successfully.",
    UPDATED: "Product updated successfully.",
    DELETED: "Product deleted successfully.",
    REVIEW_ADDED: "Your review has been submitted successfully.",
    REVIEW_UPDATED: "Your review has been updated.",
    REVIEW_DELETED: "Review deleted successfully.",
  } as const,

  ERROR: {
    NOT_FOUND: "Product not found.",
    OUT_OF_STOCK: "This product is currently out of stock.",
    INSUFFICIENT_STOCK: "Insufficient stock available.",
    INVALID_QUANTITY: "Please enter a valid quantity.",
    LOAD_FAILED: "Failed to load products. Please try again.",
    ALREADY_REVIEWED: "You have already reviewed this product.",
    REVIEW_PERMISSION_DENIED:
      "You must purchase this product before leaving a review.",
  } as const,

  INFO: {
    LOW_STOCK: (quantity: number) =>
      `Only ${quantity} items left in stock!` as const,
    BACK_IN_STOCK: "This product is back in stock!",
  } as const,
} as const;

export const CART_MESSAGES = {
  SUCCESS: {
    ADDED: (productName: string) => `${productName} added to cart.` as const,
    UPDATED: "Cart updated successfully.",
    REMOVED: (productName: string) =>
      `${productName} removed from cart.` as const,
    CLEARED: "Cart cleared successfully.",
    QUANTITY_UPDATED: "Quantity updated successfully.",
  } as const,

  ERROR: {
    ADD_FAILED: "Failed to add item to cart. Please try again.",
    UPDATE_FAILED: "Failed to update cart. Please try again.",
    REMOVE_FAILED: "Failed to remove item from cart. Please try again.",
    LOAD_FAILED: "Failed to load cart. Please try again.",
    EMPTY_CART: "Your cart is empty.",
    MAX_QUANTITY_REACHED: (max: number) =>
      `Maximum quantity of ${max} reached for this item.` as const,
    ITEM_NOT_IN_CART: "Item not found in cart.",
  } as const,

  INFO: {
    ITEM_ALREADY_IN_CART: "This item is already in your cart.",
  } as const,
} as const;

export const ORDER_MESSAGES = {
  SUCCESS: {
    CREATED: (orderId: string) =>
      `Order #${orderId} placed successfully!` as const,
    CANCELLED: "Order cancelled successfully.",
    UPDATED: "Order updated successfully.",
    REFUNDED: "Refund processed successfully.",
  } as const,

  ERROR: {
    CREATE_FAILED: "Failed to create order. Please try again.",
    NOT_FOUND: "Order not found.",
    CANCEL_FAILED: "Failed to cancel order. Please contact support.",
    ALREADY_SHIPPED: "Cannot cancel order that has already been shipped.",
    PAYMENT_FAILED: "Payment processing failed. Please try again.",
    MINIMUM_AMOUNT_NOT_MET: (minAmount: number) =>
      `Minimum order amount of $${minAmount} not met.` as const,
    LOAD_FAILED: "Failed to load orders. Please try again.",
  } as const,

  INFO: {
    PROCESSING: "Your order is being processed.",
    SHIPPED: (trackingNumber: string) =>
      `Your order has been shipped. Tracking: ${trackingNumber}` as const,
    DELIVERED: "Your order has been delivered.",
    OUT_FOR_DELIVERY: "Your order is out for delivery.",
  } as const,
} as const;

export const PAYMENT_MESSAGES = {
  SUCCESS: {
    PROCESSED: "Payment processed successfully.",
    METHOD_ADDED: "Payment method added successfully.",
    METHOD_REMOVED: "Payment method removed successfully.",
    REFUND_INITIATED: "Refund initiated successfully.",
  } as const,

  ERROR: {
    PROCESSING_FAILED: "Payment processing failed. Please try again.",
    INVALID_CARD: "Invalid card details. Please check and try again.",
    DECLINED: "Payment declined. Please use a different payment method.",
    INSUFFICIENT_FUNDS:
      "Insufficient funds. Please use a different payment method.",
    METHOD_NOT_SUPPORTED: "This payment method is not supported.",
    EXPIRED_CARD: "Card has expired. Please use a different card.",
  } as const,
} as const;

export const ACCOUNT_MESSAGES = {
  SUCCESS: {
    PROFILE_UPDATED: "Profile updated successfully.",
    ADDRESS_ADDED: "Address added successfully.",
    ADDRESS_UPDATED: "Address updated successfully.",
    ADDRESS_DELETED: "Address deleted successfully.",
    PREFERENCES_UPDATED: "Preferences updated successfully.",
    ACCOUNT_DELETED: "Account deleted successfully.",
  } as const,

  ERROR: {
    UPDATE_FAILED: "Failed to update profile. Please try again.",
    INVALID_EMAIL: "Please enter a valid email address.",
    INVALID_PHONE: "Please enter a valid phone number.",
    ADDRESS_LIMIT_REACHED: "Maximum number of addresses reached.",
    DEFAULT_ADDRESS_REQUIRED: "At least one default address is required.",
  } as const,
} as const;

export const WISHLIST_MESSAGES = {
  SUCCESS: {
    ADDED: (productName: string) =>
      `${productName} added to wishlist.` as const,
    REMOVED: (productName: string) =>
      `${productName} removed from wishlist.` as const,
    MOVED_TO_CART: "Item moved to cart successfully.",
  } as const,

  ERROR: {
    ADD_FAILED: "Failed to add item to wishlist. Please try again.",
    REMOVE_FAILED: "Failed to remove item from wishlist. Please try again.",
    ALREADY_IN_WISHLIST: "This item is already in your wishlist.",
    LOAD_FAILED: "Failed to load wishlist. Please try again.",
  } as const,

  INFO: {
    EMPTY_WISHLIST: "Your wishlist is empty.",
  } as const,
} as const;

export const VALIDATION_MESSAGES = {
  REQUIRED: (fieldName: string) => `${fieldName} is required.` as const,
  INVALID_EMAIL: "Please enter a valid email address.",
  INVALID_PHONE: "Please enter a valid phone number.",
  INVALID_URL: "Please enter a valid URL.",
  MIN_LENGTH: (fieldName: string, minLength: number) =>
    `${fieldName} must be at least ${minLength} characters long.` as const,
  MAX_LENGTH: (fieldName: string, maxLength: number) =>
    `${fieldName} must not exceed ${maxLength} characters.` as const,
  MIN_VALUE: (fieldName: string, minValue: number) =>
    `${fieldName} must be at least ${minValue}.` as const,
  MAX_VALUE: (fieldName: string, maxValue: number) =>
    `${fieldName} must not exceed ${maxValue}.` as const,
  PATTERN_MISMATCH: (fieldName: string) =>
    `${fieldName} format is invalid.` as const,
  PASSWORDS_DO_NOT_MATCH: "Passwords do not match.",
  INVALID_FILE_TYPE: (allowedTypes: readonly string[]) =>
    `Invalid file type. Allowed types: ${allowedTypes.join(", ")}` as const,
  FILE_TOO_LARGE: (maxSize: number) =>
    `File size must not exceed ${maxSize}MB.` as const,
} as const;

export const SYSTEM_MESSAGES = {
  SUCCESS: {
    OPERATION_COMPLETED: "Operation completed successfully.",
    SAVED: "Changes saved successfully.",
    COPIED: "Copied to clipboard.",
  } as const,

  ERROR: {
    GENERIC: "Something went wrong. Please try again.",
    NETWORK_ERROR: "Network error. Please check your connection and try again.",
    SERVER_ERROR: "Server error. Please try again later.",
    NOT_FOUND: "The requested resource was not found.",
    FORBIDDEN: "You do not have permission to access this resource.",
    TIMEOUT: "Request timed out. Please try again.",
    RATE_LIMIT_EXCEEDED: "Too many requests. Please try again later.",
    MAINTENANCE:
      "The system is currently under maintenance. Please try again later.",
  } as const,

  INFO: {
    LOADING: "Loading...",
    PROCESSING: "Processing...",
    SAVING: "Saving...",
    NO_RESULTS: "No results found.",
    NO_DATA: "No data available.",
  } as const,

  WARNING: {
    UNSAVED_CHANGES:
      "You have unsaved changes. Are you sure you want to leave?",
    CONFIRM_DELETE:
      "Are you sure you want to delete this item? This action cannot be undone.",
    CONFIRM_CANCEL:
      "Are you sure you want to cancel? All changes will be lost.",
  } as const,
} as const;

export const ADMIN_MESSAGES = {
  SUCCESS: {
    USER_UPDATED: "User updated successfully.",
    USER_DELETED: "User deleted successfully.",
    CATEGORY_CREATED: "Category created successfully.",
    CATEGORY_UPDATED: "Category updated successfully.",
    CATEGORY_DELETED: "Category deleted successfully.",
    SETTINGS_UPDATED: "Settings updated successfully.",
  } as const,

  ERROR: {
    PERMISSION_DENIED: "Admin permission required.",
    CANNOT_DELETE_SELF: "You cannot delete your own account.",
    CATEGORY_HAS_PRODUCTS: "Cannot delete category with existing products.",
    INVALID_ACTION: "Invalid admin action.",
  } as const,
} as const;

export const SEARCH_MESSAGES = {
  INFO: {
    NO_RESULTS: (query: string) => `No results found for "${query}".` as const,
    RESULTS_COUNT: (count: number, query: string) =>
      `Found ${count} result${count !== 1 ? "s" : ""} for "${query}".` as const,
    MIN_QUERY_LENGTH: (minLength: number) =>
      `Please enter at least ${minLength} characters to search.` as const,
  } as const,

  ERROR: {
    SEARCH_FAILED: "Search failed. Please try again.",
  } as const,
} as const;

// All Messages Combined
export const MESSAGES = {
  AUTH: AUTH_MESSAGES,
  PRODUCT: PRODUCT_MESSAGES,
  CART: CART_MESSAGES,
  ORDER: ORDER_MESSAGES,
  PAYMENT: PAYMENT_MESSAGES,
  ACCOUNT: ACCOUNT_MESSAGES,
  WISHLIST: WISHLIST_MESSAGES,
  VALIDATION: VALIDATION_MESSAGES,
  SYSTEM: SYSTEM_MESSAGES,
  ADMIN: ADMIN_MESSAGES,
  SEARCH: SEARCH_MESSAGES,
} as const;
