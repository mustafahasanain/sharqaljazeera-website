import { beforeAll, afterAll, beforeEach, afterEach } from "vitest";
import { cleanupTestDatabase, initializeTestDatabase } from "./helpers/db-helper";

// Global test setup - runs once before all tests
beforeAll(async () => {
  console.log("🚀 Initializing test database...");
  await initializeTestDatabase();
  console.log("✅ Test database initialized");
});

// Global test teardown - runs once after all tests
afterAll(async () => {
  console.log("🧹 Cleaning up test database...");
  await cleanupTestDatabase();
  console.log("✅ Test cleanup completed");
});

// Runs before each test - can be used for additional per-test setup
beforeEach(async () => {
  // This is where you could truncate tables between tests if needed
  // For now, we'll handle cleanup in individual test files
});

// Runs after each test
afterEach(async () => {
  // Individual test cleanup if needed
});
