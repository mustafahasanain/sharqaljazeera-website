import { db, closeConnection } from "./index";
import {
  brands,
  categories,
  products,
  productImages,
  productSpecifications,
  productInventory,
  users,
  addresses,
  userPreferences,
} from "@/db/schema";
import * as dotenv from "dotenv";
import { eq } from "drizzle-orm";

dotenv.config({ path: ".env.local" });

// Check if running in safe environment
function checkEnvironment() {
  if (process.env.NODE_ENV === "production") {
    console.error("❌ Cannot run seed script in production!");
    console.error("   This would delete all production data.");
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }
}

async function clearData() {
  console.log("\n🗑️  Clearing existing data...");

  try {
    // Delete in order respecting foreign key constraints
    await db.delete(productInventory);
    await db.delete(productSpecifications);
    await db.delete(productImages);
    await db.delete(products);
    await db.delete(categories);
    await db.delete(brands);
    await db.delete(userPreferences);
    await db.delete(addresses);
    await db.delete(users);

    console.log("✅ Existing data cleared\n");
  } catch (error) {
    console.error("❌ Error clearing data:", error);
    throw error;
  }
}

async function seedBrands() {
  console.log("📦 Seeding brands...");

  const brandData = [
    {
      name: "Apple",
      slug: "apple",
      description: "Innovative technology products",
      status: "active" as const,
      featured: true,
      country: "USA",
      foundedYear: 1976,
      productCount: 0,
      displayOrder: 1,
    },
    {
      name: "Samsung",
      slug: "samsung",
      description: "Leading electronics manufacturer",
      status: "active" as const,
      featured: true,
      country: "South Korea",
      foundedYear: 1938,
      productCount: 0,
      displayOrder: 2,
    },
    {
      name: "Sony",
      slug: "sony",
      description: "Premium electronics and entertainment",
      status: "active" as const,
      featured: true,
      country: "Japan",
      foundedYear: 1946,
      productCount: 0,
      displayOrder: 3,
    },
    {
      name: "Dell",
      slug: "dell",
      description: "Computer technology solutions",
      status: "active" as const,
      featured: false,
      country: "USA",
      foundedYear: 1984,
      productCount: 0,
      displayOrder: 4,
    },
    {
      name: "HP",
      slug: "hp",
      description: "Hewlett-Packard computing devices",
      status: "active" as const,
      featured: false,
      country: "USA",
      foundedYear: 1939,
      productCount: 0,
      displayOrder: 5,
    },
  ];

  const insertedBrands = await db.insert(brands).values(brandData).returning();
  console.log(`✅ Seeded ${insertedBrands.length} brands\n`);
  return insertedBrands;
}

async function seedCategories() {
  console.log("📁 Seeding categories...");

  // Root categories
  const rootCategories = await db
    .insert(categories)
    .values([
      {
        name: "Electronics",
        slug: "electronics",
        description: "Electronic devices and accessories",
        parentId: null,
        level: 0,
        path: [],
        status: "active" as const,
        featured: true,
        displayOrder: 1,
        productCount: 0,
        showInMenu: true,
      },
      {
        name: "Computers",
        slug: "computers",
        description: "Laptops, desktops, and accessories",
        parentId: null,
        level: 0,
        path: [],
        status: "active" as const,
        featured: true,
        displayOrder: 2,
        productCount: 0,
        showInMenu: true,
      },
      {
        name: "Home & Garden",
        slug: "home-garden",
        description: "Home appliances and garden tools",
        parentId: null,
        level: 0,
        path: [],
        status: "active" as const,
        featured: false,
        displayOrder: 3,
        productCount: 0,
        showInMenu: true,
      },
    ])
    .returning();

  // Child categories
  const electronicsId = rootCategories[0].id;
  const computersId = rootCategories[1].id;

  const childCategories = await db
    .insert(categories)
    .values([
      {
        name: "Smartphones",
        slug: "smartphones",
        description: "Mobile phones and accessories",
        parentId: electronicsId,
        level: 1,
        path: [electronicsId],
        status: "active" as const,
        featured: true,
        displayOrder: 1,
        productCount: 0,
        showInMenu: true,
      },
      {
        name: "Tablets",
        slug: "tablets",
        description: "Tablet devices",
        parentId: electronicsId,
        level: 1,
        path: [electronicsId],
        status: "active" as const,
        featured: false,
        displayOrder: 2,
        productCount: 0,
        showInMenu: true,
      },
      {
        name: "Laptops",
        slug: "laptops",
        description: "Portable computers",
        parentId: computersId,
        level: 1,
        path: [computersId],
        status: "active" as const,
        featured: true,
        displayOrder: 1,
        productCount: 0,
        showInMenu: true,
      },
      {
        name: "Desktops",
        slug: "desktops",
        description: "Desktop computers",
        parentId: computersId,
        level: 1,
        path: [computersId],
        status: "active" as const,
        featured: false,
        displayOrder: 2,
        productCount: 0,
        showInMenu: true,
      },
    ])
    .returning();

  const totalCategories = rootCategories.length + childCategories.length;
  console.log(`✅ Seeded ${totalCategories} categories\n`);
  return { rootCategories, childCategories };
}

async function seedProducts(
  brandsList: Awaited<ReturnType<typeof seedBrands>>,
  categoriesData: Awaited<ReturnType<typeof seedCategories>>
) {
  console.log("🛍️  Seeding products...");

  const appleBrand = brandsList.find((b) => b.slug === "apple")!;
  const samsungBrand = brandsList.find((b) => b.slug === "samsung")!;
  const smartphonesCategory = categoriesData.childCategories.find(
    (c) => c.slug === "smartphones"
  )!;
  const laptopsCategory = categoriesData.childCategories.find(
    (c) => c.slug === "laptops"
  )!;

  const productData = [
    {
      sku: "APPL-IP15-BLK-128",
      name: "iPhone 15 Pro",
      slug: "iphone-15-pro",
      description: "Latest iPhone with A17 Pro chip and titanium design",
      shortDescription: "Premium smartphone with advanced camera system",
      status: "active" as const,
      condition: "new" as const,
      brandId: appleBrand.id,
      categoryId: smartphonesCategory.id,
      price: "1199.99",
      compareAtPrice: "1299.99",
      currency: "USD",
      taxable: true,
      weight: 187,
      featured: true,
      isNew: true,
      isBestseller: true,
      tags: "smartphone,apple,iphone,5g",
      hasVariants: false,
      seoTitle: "Buy iPhone 15 Pro - Latest Apple Smartphone",
      seoDescription: "Get the new iPhone 15 Pro with A17 Pro chip",
      averageRating: "4.8",
    },
    {
      sku: "SAMS-S24-BLK-256",
      name: "Samsung Galaxy S24 Ultra",
      slug: "samsung-galaxy-s24-ultra",
      description: "Flagship Android phone with S Pen and AI features",
      shortDescription: "Ultimate Android flagship with 200MP camera",
      status: "active" as const,
      condition: "new" as const,
      brandId: samsungBrand.id,
      categoryId: smartphonesCategory.id,
      price: "1299.99",
      currency: "USD",
      taxable: true,
      weight: 232,
      featured: true,
      isNew: true,
      isBestseller: true,
      tags: "smartphone,samsung,galaxy,android,5g",
      hasVariants: false,
      seoTitle: "Samsung Galaxy S24 Ultra - Buy Now",
      seoDescription: "Latest Samsung flagship with S Pen",
      averageRating: "4.7",
    },
    {
      sku: "APPL-MBP-M3-14",
      name: 'MacBook Pro 14" M3',
      slug: "macbook-pro-14-m3",
      description: "Powerful laptop with M3 chip for professionals",
      shortDescription: "Professional laptop with incredible performance",
      status: "active" as const,
      condition: "new" as const,
      brandId: appleBrand.id,
      categoryId: laptopsCategory.id,
      price: "1999.99",
      currency: "USD",
      taxable: true,
      weight: 1600,
      featured: true,
      isNew: true,
      isBestseller: false,
      tags: "laptop,apple,macbook,m3",
      hasVariants: false,
      seoTitle: 'MacBook Pro 14" with M3 Chip',
      seoDescription: "Professional laptop for creative work",
      averageRating: "4.9",
    },
  ];

  const insertedProducts = await db
    .insert(products)
    .values(productData)
    .returning();

  // Add inventory for each product
  const inventoryData = insertedProducts.map((product) => ({
    productId: product.id,
    quantity: 50,
    policy: "track" as const,
    lowStockThreshold: 10,
    allowBackorder: false,
    reserved: 0,
  }));

  await db.insert(productInventory).values(inventoryData);

  console.log(`✅ Seeded ${insertedProducts.length} products with inventory\n`);
  return insertedProducts;
}

async function seedUsers() {
  console.log("👥 Seeding users...");

  const userData = [
    {
      email: "admin@sharqaljazeera.com",
      passwordHash: "$2a$10$dummyhashfordevonly123456789", // This should be properly hashed in production
      firstName: "Admin",
      lastName: "User",
      role: "admin" as const,
      status: "active" as const,
      emailVerified: true,
      phoneVerified: false,
    },
    {
      email: "customer@example.com",
      passwordHash: "$2a$10$dummyhashfordevonly123456789",
      firstName: "John",
      lastName: "Doe",
      role: "customer" as const,
      status: "active" as const,
      emailVerified: true,
      phoneVerified: false,
    },
  ];

  const insertedUsers = await db.insert(users).values(userData).returning();

  // Add preferences for each user
  const preferencesData = insertedUsers.map((user) => ({
    userId: user.id,
    language: "en" as const,
    currency: "USD" as const,
    theme: "light" as const,
    notifications: {
      email: {
        orderUpdates: true,
        promotions: true,
        newsletter: true,
        accountActivity: true,
      },
      sms: {
        orderUpdates: true,
        promotions: false,
      },
      push: {
        orderUpdates: true,
        promotions: false,
        newArrivals: true,
      },
    },
  }));

  await db.insert(userPreferences).values(preferencesData);

  console.log(`✅ Seeded ${insertedUsers.length} users with preferences\n`);
  return insertedUsers;
}

async function seed() {
  console.log("🌱 Starting database seeding...\n");

  try {
    checkEnvironment();

    // Clear existing data
    await clearData();

    // Seed data in order
    const brandsList = await seedBrands();
    const categoriesData = await seedCategories();
    const productsList = await seedProducts(brandsList, categoriesData);
    const usersList = await seedUsers();

    console.log("═══════════════════════════════════════");
    console.log("✨ Database seeding completed successfully!");
    console.log("═══════════════════════════════════════");
    console.log(`📦 Brands: ${brandsList.length}`);
    console.log(
      `📁 Categories: ${categoriesData.rootCategories.length + categoriesData.childCategories.length}`
    );
    console.log(`🛍️  Products: ${productsList.length}`);
    console.log(`👥 Users: ${usersList.length}`);
    console.log("═══════════════════════════════════════\n");
  } catch (error) {
    console.error("\n❌ Seeding failed:", error);
    throw error;
  } finally {
    await closeConnection();
  }
}

seed()
  .then(() => {
    console.log("🎉 Seeding process completed!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error during seeding:");
    console.error(error);
    process.exit(1);
  });
