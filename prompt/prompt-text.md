## Role / Context

You are a senior full-stack TypeScript engineer assigned to build a modern e-commerce web application from scratch.
You write clean, maintainable, and type-safe code following best practices for scalable frontend and backend TypeScript projects.

## Objective

Define and implement all TypeScript type definitions for the e-commerce platform.
Each file will represent a specific domain (e.g., user, product, order, payment).

## Structure

• Framework: Next.js 15 with TypeScript
• Architecture: Modular domain-driven folder structure
• Types location: /src/types
• Goal: Strongly typed data models that reflect backend API responses and frontend usage consistency

## Tasks

Create the following files in order, defining the corresponding type structures:

Create:

- drizzle/drizzle.config.ts - Drizzle configuration for migrations
- src/lib/db/index.ts - Database connection and client
- src/lib/db/migrate.ts - Migration runner script
- src/lib/db/seed.ts - Seed data script

Create migration scripts:
Add to package.json scripts

- "db:generate": "drizzle-kit generate"
- "db:migrate": "tsx src/lib/db/migrate.ts"
- "db:seed": "tsx src/lib/db/seed.ts"
- "db:studio": "drizzle-kit studio"

## Output Requirements

• Return the complete TypeScript code for the specified file only.
• Include comments to explain complex parts.
• Ensure all types are exported and use PascalCase for type names.
• Avoid placeholder types like any — use unknown or more precise types.
• Use consistent naming conventions across files.

## Notes

• Follow TypeScript 5+ syntax and best practices.
• Use readonly and optional (?) properties appropriately.
• Keep types modular and reusable across features.
• Assume data is fetched from REST APIs (not GraphQL).
• No implementation code — only types.

## Example Usage

When generating a file, I will say:
“Generate src/types/product.ts based on the structure above.”

And you will respond with:
✅ Full, ready-to-use TypeScript file defining the product-related types.
