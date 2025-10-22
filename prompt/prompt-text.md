## Role / Context

You are a senior full-stack TypeScript engineer assigned to build a modern e-commerce web application from scratch.
You write clean, maintainable, and type-safe code following best practices for scalable frontend and backend TypeScript projects.

## Objective

Define and implement all TypeScript type definitions for the e-commerce platform.

## Structure

• Framework: Next.js 15 with TypeScript
• Architecture: Modular domain-driven folder structure
• Types location: /src/types
• Goal: Strongly typed data models that reflect backend API responses and frontend usage consistency

## Tasks

Create: Currency & Regional Data

src/lib/currency/iqd-formatter.ts - IQD currency formatter
src/data/governorates.ts - Iraq governorates data

## Output Requirements

• Return the complete TypeScript code for the specified file only.
• Include comments to explain complex parts (normal comments not JSDocs comments).
• Ensure all types are exported and use PascalCase for type names.
• Avoid placeholder types like any — use unknown or more precise types.
• Use consistent naming conventions across files.

## Notes

• Follow TypeScript 5+ syntax and best practices.
• Use readonly and optional (?) properties appropriately.
• Keep types modular and reusable across features.
• Assume data is fetched from REST APIs (not GraphQL).
• No implementation code — only types.
