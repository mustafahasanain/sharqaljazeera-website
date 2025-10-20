// User roles
export type UserRole = "customer" | "admin" | "vendor" | "support";

// User status
export type UserStatus =
  | "active"
  | "inactive"
  | "suspended"
  | "pending_verification";

// User entity
export type User = {
  readonly id: string;
  readonly email: string;
  readonly phone?: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly role: UserRole;
  readonly status: UserStatus;
  readonly emailVerified: boolean;
  readonly phoneVerified: boolean;
  readonly avatar?: string;
  readonly dateOfBirth?: string;
  readonly gender?: "male" | "female" | "other" | "prefer_not_to_say";
  readonly createdAt: string;
  readonly updatedAt: string;
  readonly lastLoginAt?: string;
};

// Public profile
export type UserProfile = Pick<
  User,
  "id" | "firstName" | "lastName" | "avatar" | "createdAt"
>;

// Registration data
export type UserRegistrationData = {
  readonly email: string;
  readonly password: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly phone?: string;
  readonly acceptTerms: boolean;
};

// Login credentials
export type UserLoginCredentials = {
  readonly email: string;
  readonly password: string;
  readonly rememberMe?: boolean;
};

// Profile update data
export type UserProfileUpdateData = {
  readonly firstName?: string;
  readonly lastName?: string;
  readonly phone?: string;
  readonly dateOfBirth?: string;
  readonly gender?: User["gender"];
  readonly avatar?: string;
};

// Password change
export type PasswordChangeData = {
  readonly currentPassword: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
};

// Password reset request
export type PasswordResetRequestData = {
  readonly email: string;
};

// Password reset confirm
export type PasswordResetConfirmData = {
  readonly token: string;
  readonly newPassword: string;
  readonly confirmPassword: string;
};

// Address type
export type AddressType = "home" | "work" | "other";

// Address entity
export type Address = {
  readonly id: string;
  readonly userId: string;
  readonly type: AddressType;
  readonly isDefault: boolean;
  readonly recipientName: string;
  readonly recipientPhone: string;
  readonly addressLine1: string;
  readonly addressLine2?: string;
  readonly city: string;
  readonly governorate: string;
  readonly district?: string;
  readonly nearestLandmark?: string;
  readonly postalCode?: string;
  readonly country: string;
  readonly latitude?: number;
  readonly longitude?: number;
  readonly deliveryNotes?: string;
  readonly createdAt: string;
  readonly updatedAt: string;
};

// Create address
export type AddressCreateData = Omit<
  Address,
  "id" | "userId" | "createdAt" | "updatedAt"
>;

// Update address
export type AddressUpdateData = Partial<AddressCreateData>;

// User session
export type UserSession = {
  readonly user: User;
  readonly accessToken: string;
  readonly refreshToken?: string;
  readonly expiresAt: string;
  readonly issuedAt: string;
};

// Session payload
export type SessionTokenPayload = {
  readonly userId: string;
  readonly email: string;
  readonly role: UserRole;
  readonly iat: number;
  readonly exp: number;
};

// Refresh token
export type RefreshTokenData = {
  readonly refreshToken: string;
};

// Auth response
export type AuthResponse = {
  readonly user: User;
  readonly session: UserSession;
};

// Email verification
export type EmailVerificationData = {
  readonly token: string;
};

// Phone verification
export type PhoneVerificationData = {
  readonly phone: string;
  readonly code: string;
};

// OAuth providers
export type OAuthProvider = "google" | "facebook" | "apple";

// OAuth data
export type OAuthAuthenticationData = {
  readonly provider: OAuthProvider;
  readonly code: string;
  readonly redirectUri: string;
};

// Notification preferences
export type NotificationPreferences = {
  readonly email: {
    readonly orderUpdates: boolean;
    readonly promotions: boolean;
    readonly newsletter: boolean;
    readonly accountActivity: boolean;
  };
  readonly sms: {
    readonly orderUpdates: boolean;
    readonly promotions: boolean;
  };
  readonly push: {
    readonly orderUpdates: boolean;
    readonly promotions: boolean;
    readonly newArrivals: boolean;
  };
};

// User preferences
export type UserPreferences = {
  readonly userId: string;
  readonly language: "en" | "ar";
  readonly currency: "IQD" | "USD";
  readonly notifications: NotificationPreferences;
  readonly theme?: "light" | "dark" | "auto";
  readonly updatedAt: string;
};

// User activity types
export type UserActivityType =
  | "login"
  | "logout"
  | "password_change"
  | "profile_update"
  | "address_added"
  | "address_updated"
  | "order_placed"
  | "email_verified"
  | "phone_verified";

// User activity log
export type UserActivity = {
  readonly id: string;
  readonly userId: string;
  readonly type: UserActivityType;
  readonly description: string;
  readonly metadata?: Record<string, unknown>;
  readonly ipAddress?: string;
  readonly userAgent?: string;
  readonly createdAt: string;
};

// User stats
export type UserStats = {
  readonly userId: string;
  readonly totalOrders: number;
  readonly totalSpent: number;
  readonly averageOrderValue: number;
  readonly wishlistItems: number;
  readonly reviewsCount: number;
  readonly savedAddresses: number;
  readonly loyaltyPoints?: number;
  readonly memberSince: string;
};
