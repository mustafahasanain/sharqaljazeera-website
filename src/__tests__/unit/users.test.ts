import { describe, it, expect, beforeEach } from "vitest";
import { db } from "@/lib/db";
import { users, addresses, userPreferences, sessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { truncateTables } from "../helpers/db-helper";
import {
  createUserData,
  createAddressData,
  createUserPreferencesData,
} from "../helpers/fixtures";

describe("Users CRUD Operations", () => {
  beforeEach(async () => {
    // Clean up before each test
    await truncateTables([
      "userActivity",
      "userPreferences",
      "addresses",
      "sessions",
      "accounts",
      "users",
    ]);
  });

  describe("Create User", () => {
    it("should create a new user", async () => {
      const userData = createUserData({
        email: "newuser@test.com",
        firstName: "John",
        lastName: "Doe",
      });

      const [user] = await db.insert(users).values(userData).returning();

      expect(user).toBeDefined();
      expect(user.email).toBe("newuser@test.com");
      expect(user.firstName).toBe("John");
      expect(user.lastName).toBe("Doe");
      expect(user.role).toBe("customer");
      expect(user.status).toBe("active");
    });

    it("should enforce unique email constraint", async () => {
      const userData = createUserData({ email: "duplicate@test.com" });

      // First insert should succeed
      await db.insert(users).values(userData);

      // Second insert with same email should fail
      await expect(
        db.insert(users).values(createUserData({ email: "duplicate@test.com" }))
      ).rejects.toThrow();
    });

    it("should create user with different roles", async () => {
      const adminData = createUserData({ role: "admin" });
      const [admin] = await db.insert(users).values(adminData).returning();
      expect(admin.role).toBe("admin");

      const vendorData = createUserData({ role: "vendor" });
      const [vendor] = await db.insert(users).values(vendorData).returning();
      expect(vendor.role).toBe("vendor");
    });
  });

  describe("Read User", () => {
    it("should read a user by ID", async () => {
      const userData = createUserData({ email: "read@test.com" });
      const [createdUser] = await db.insert(users).values(userData).returning();

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, createdUser.id));

      expect(foundUser).toBeDefined();
      expect(foundUser.id).toBe(createdUser.id);
      expect(foundUser.email).toBe("read@test.com");
    });

    it("should read a user by email", async () => {
      const userData = createUserData({ email: "emailsearch@test.com" });
      await db.insert(users).values(userData);

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.email, "emailsearch@test.com"));

      expect(foundUser).toBeDefined();
      expect(foundUser.email).toBe("emailsearch@test.com");
    });

    it("should read all users", async () => {
      await db.insert(users).values([
        createUserData({ email: "user1@test.com" }),
        createUserData({ email: "user2@test.com" }),
        createUserData({ email: "user3@test.com" }),
      ]);

      const allUsers = await db.select().from(users);
      expect(allUsers.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe("Update User", () => {
    it("should update user information", async () => {
      const userData = createUserData({ firstName: "OldName" });
      const [user] = await db.insert(users).values(userData).returning();

      const [updatedUser] = await db
        .update(users)
        .set({ firstName: "NewName" })
        .where(eq(users.id, user.id))
        .returning();

      expect(updatedUser.firstName).toBe("NewName");
    });

    it("should update user status", async () => {
      const userData = createUserData({ status: "active" });
      const [user] = await db.insert(users).values(userData).returning();

      const [updatedUser] = await db
        .update(users)
        .set({ status: "suspended" })
        .where(eq(users.id, user.id))
        .returning();

      expect(updatedUser.status).toBe("suspended");
    });
  });

  describe("Delete User", () => {
    it("should delete a user", async () => {
      const userData = createUserData({ email: "delete@test.com" });
      const [user] = await db.insert(users).values(userData).returning();

      await db.delete(users).where(eq(users.id, user.id));

      const [foundUser] = await db
        .select()
        .from(users)
        .where(eq(users.id, user.id));

      expect(foundUser).toBeUndefined();
    });

    it("should cascade delete related data", async () => {
      // Create user
      const userData = createUserData();
      const [user] = await db.insert(users).values(userData).returning();

      // Create related address
      const addressData = createAddressData(user.id);
      await db.insert(addresses).values(addressData);

      // Create related preferences
      const preferencesData = createUserPreferencesData(user.id);
      await db.insert(userPreferences).values(preferencesData);

      // Delete user
      await db.delete(users).where(eq(users.id, user.id));

      // Check that related data is also deleted (cascade)
      const relatedAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.userId, user.id));

      const relatedPreferences = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences.userId, user.id));

      expect(relatedAddresses.length).toBe(0);
      expect(relatedPreferences.length).toBe(0);
    });
  });

  describe("User Addresses", () => {
    it("should create address for user", async () => {
      const userData = createUserData();
      const [user] = await db.insert(users).values(userData).returning();

      const addressData = createAddressData(user.id, {
        city: "Baghdad",
        governorate: "Baghdad",
      });

      const [address] = await db
        .insert(addresses)
        .values(addressData)
        .returning();

      expect(address).toBeDefined();
      expect(address.userId).toBe(user.id);
      expect(address.city).toBe("Baghdad");
    });

    it("should set default address", async () => {
      const userData = createUserData();
      const [user] = await db.insert(users).values(userData).returning();

      const address1 = createAddressData(user.id, { isDefault: true });
      const address2 = createAddressData(user.id, { isDefault: false });

      await db.insert(addresses).values([address1, address2]);

      const defaultAddresses = await db
        .select()
        .from(addresses)
        .where(eq(addresses.isDefault, true));

      expect(defaultAddresses.length).toBeGreaterThan(0);
    });
  });

  describe("User Preferences", () => {
    it("should create user preferences", async () => {
      const userData = createUserData();
      const [user] = await db.insert(users).values(userData).returning();

      const preferencesData = createUserPreferencesData(user.id, {
        language: "ar",
        currency: "IQD",
      });

      const [preferences] = await db
        .insert(userPreferences)
        .values(preferencesData)
        .returning();

      expect(preferences).toBeDefined();
      expect(preferences.userId).toBe(user.id);
      expect(preferences.language).toBe("ar");
      expect(preferences.currency).toBe("IQD");
    });

    it("should update notification preferences", async () => {
      const userData = createUserData();
      const [user] = await db.insert(users).values(userData).returning();

      const preferencesData = createUserPreferencesData(user.id);
      const [preferences] = await db
        .insert(userPreferences)
        .values(preferencesData)
        .returning();

      const newNotifications = {
        email: {
          orderUpdates: false,
          promotions: false,
          newsletter: false,
          accountActivity: true,
        },
        sms: {
          orderUpdates: false,
          promotions: false,
        },
        push: {
          orderUpdates: true,
          promotions: false,
          newArrivals: false,
        },
      };

      const [updated] = await db
        .update(userPreferences)
        .set({ notifications: newNotifications })
        .where(eq(userPreferences.id, preferences.id))
        .returning();

      expect(updated.notifications.email.orderUpdates).toBe(false);
      expect(updated.notifications.push.orderUpdates).toBe(true);
    });
  });
});
