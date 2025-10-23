import { defineConfig } from "vitest/config";
import path from "path";
import { config as dotenvConfig } from "dotenv";

// Load environment variables from .env.local before running tests
dotenvConfig({ path: path.resolve(__dirname, ".env.local") });

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["src/__tests__/**/*.test.ts"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      include: ["src/**/*.ts"],
      exclude: [
        "src/__tests__/**",
        "src/types/**",
        "**/*.d.ts",
        "**/*.config.ts",
      ],
    },
    testTimeout: 30000,
    hookTimeout: 30000,
    // Run tests sequentially to avoid database conflicts
    pool: "forks",
    poolOptions: {
      forks: {
        singleFork: true,
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
