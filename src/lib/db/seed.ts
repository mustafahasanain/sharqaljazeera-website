import * as dotenv from 'dotenv';

// Load environment variables before any other imports
dotenv.config({ path: '.env.local' });

import { db } from '@/lib/db';
import { eq } from 'drizzle-orm';
import {
  brands,
  colors,
  sizes,
  models,
  lengths,
  productTypes,
  categories,
  collections,
  products,
  productVariants,
  productImages,
  productSpecifications,
  productCollections,
} from './schema';

/**
 * Seed script for populating the database with realistic networking/IT products
 *
 * Run with: npm run db:seed
 */

// Color codes for console output
const colors_console = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
};

function log(message: string, color: keyof typeof colors_console = 'reset') {
  console.log(`${colors_console[color]}${message}${colors_console.reset}`);
}

async function main() {
  try {
    log('\n🚀 Starting database seeding...', 'bright');

    // Step 1: Clean existing data (optional - for idempotency)
    log('\n📦 Cleaning existing data...', 'cyan');
    await db.delete(productCollections);
    await db.delete(productSpecifications);
    await db.delete(productImages);
    await db.delete(productVariants);
    await db.delete(products);
    await db.delete(collections);
    await db.delete(categories);
    await db.delete(productTypes);
    await db.delete(brands);
    await db.delete(colors);
    await db.delete(sizes);
    await db.delete(models);
    await db.delete(lengths);
    log('✅ Existing data cleaned', 'green');

    // Step 2: Seed Brands
    log('\n🏢 Seeding brands...', 'cyan');
    const brandsData = await db.insert(brands).values([
      { name: 'Ubiquiti', slug: 'ubiquiti', logoUrl: null },
      { name: 'TP-Link', slug: 'tp-link', logoUrl: null },
      { name: 'Cisco', slug: 'cisco', logoUrl: null },
      { name: 'Netgear', slug: 'netgear', logoUrl: null },
      { name: 'MikroTik', slug: 'mikrotik', logoUrl: null },
      { name: 'D-Link', slug: 'd-link', logoUrl: null },
    ]).returning();
    log(`✅ Created ${brandsData.length} brands`, 'green');

    // Step 3: Seed Colors
    log('\n🎨 Seeding colors...', 'cyan');
    const colorsData = await db.insert(colors).values([
      { name: 'Black', slug: 'black', hexCode: '#000000', sortOrder: 1 },
      { name: 'White', slug: 'white', hexCode: '#FFFFFF', sortOrder: 2 },
      { name: 'Gray', slug: 'gray', hexCode: '#808080', sortOrder: 3 },
      { name: 'Blue', slug: 'blue', hexCode: '#0000FF', sortOrder: 4 },
    ]).returning();
    log(`✅ Created ${colorsData.length} colors`, 'green');

    // Step 4: Seed Sizes
    log('\n📏 Seeding sizes...', 'cyan');
    const sizesData = await db.insert(sizes).values([
      { name: '4U', slug: '4u', sortOrder: 1 },
      { name: '8U', slug: '8u', sortOrder: 2 },
      { name: '12U', slug: '12u', sortOrder: 3 },
      { name: '24U', slug: '24u', sortOrder: 4 },
      { name: '42U', slug: '42u', sortOrder: 5 },
    ]).returning();
    log(`✅ Created ${sizesData.length} sizes`, 'green');

    // Step 5: Seed Lengths
    log('\n📐 Seeding lengths...', 'cyan');
    const lengthsData = await db.insert(lengths).values([
      { name: '0.5M', slug: '0-5m', sortOrder: 1 },
      { name: '1M', slug: '1m', sortOrder: 2 },
      { name: '2M', slug: '2m', sortOrder: 3 },
      { name: '3M', slug: '3m', sortOrder: 4 },
      { name: '5M', slug: '5m', sortOrder: 5 },
      { name: '10M', slug: '10m', sortOrder: 6 },
      { name: '20M', slug: '20m', sortOrder: 7 },
    ]).returning();
    log(`✅ Created ${lengthsData.length} lengths`, 'green');

    // Step 6: Seed Models
    log('\n🔧 Seeding models...', 'cyan');
    const modelsData = await db.insert(models).values([
      { name: 'UAP-AC-PRO', slug: 'uap-ac-pro', sortOrder: 1 },
      { name: 'USW-24-POE', slug: 'usw-24-poe', sortOrder: 2 },
      { name: 'EdgeRouter X', slug: 'edgerouter-x', sortOrder: 3 },
      { name: 'Archer AX50', slug: 'archer-ax50', sortOrder: 4 },
      { name: 'TL-SG1024D', slug: 'tl-sg1024d', sortOrder: 5 },
      { name: 'Cat6', slug: 'cat6', sortOrder: 6 },
      { name: 'Cat6A', slug: 'cat6a', sortOrder: 7 },
      { name: 'Cat7', slug: 'cat7', sortOrder: 8 },
    ]).returning();
    log(`✅ Created ${modelsData.length} models`, 'green');

    // Step 7: Seed Product Types
    log('\n📦 Seeding product types...', 'cyan');
    const productTypesData = await db.insert(productTypes).values([
      { name: 'Router', slug: 'router' },
      { name: 'Switch', slug: 'switch' },
      { name: 'Access Point', slug: 'access-point' },
      { name: 'Ethernet Cable', slug: 'ethernet-cable' },
      { name: 'Fiber Optic Cable', slug: 'fiber-optic-cable' },
      { name: 'Server Rack', slug: 'server-rack' },
      { name: 'Patch Panel', slug: 'patch-panel' },
    ]).returning();
    log(`✅ Created ${productTypesData.length} product types`, 'green');

    // Step 8: Seed Categories
    log('\n📁 Seeding categories...', 'cyan');
    const categoriesData = await db.insert(categories).values([
      { name: 'Networking Equipment', slug: 'networking-equipment', parentId: null },
      { name: 'Routers', slug: 'routers', parentId: null },
      { name: 'Switches', slug: 'switches', parentId: null },
      { name: 'Access Points', slug: 'access-points', parentId: null },
      { name: 'Cables', slug: 'cables', parentId: null },
      { name: 'Server Infrastructure', slug: 'server-infrastructure', parentId: null },
    ]).returning();
    log(`✅ Created ${categoriesData.length} categories`, 'green');

    // Step 9: Seed Collections
    log('\n🗂️  Seeding collections...', 'cyan');
    const collectionsData = await db.insert(collections).values([
      { name: 'Best Sellers', slug: 'best-sellers', description: 'Our most popular networking products', isActive: true },
      { name: 'New Arrivals', slug: 'new-arrivals', description: 'Recently added products', isActive: true },
      { name: 'Enterprise Grade', slug: 'enterprise-grade', description: 'Professional networking equipment', isActive: true },
    ]).returning();
    log(`✅ Created ${collectionsData.length} collections`, 'green');

    // Step 10: Seed Products
    log('\n🛍️  Seeding products...', 'cyan');

    const productsData = [
      {
        name: 'Ubiquiti UniFi AC Pro Access Point',
        description: 'High-performance 802.11ac Wave 2 Access Point with dual-band support and seamless roaming capabilities. Perfect for enterprise deployments.',
        categoryId: categoriesData[3].id,
        productTypeId: productTypesData[2].id,
        brandId: brandsData[0].id,
        isPublished: true,
        specs: [
          { key: 'Wireless Standard', value: '802.11ac Wave 2', unit: null, group: 'Wireless' },
          { key: 'Max Speed', value: '1750', unit: 'Mbps', group: 'Performance' },
          { key: 'Range', value: '122', unit: 'm', group: 'Coverage' },
          { key: 'PoE Support', value: 'Yes (802.3af)', unit: null, group: 'Power' },
          { key: 'Concurrent Users', value: '250+', unit: 'users', group: 'Capacity' },
        ],
        variants: [
          { color: 0, model: 0, price: '149.99', stock: 50 },
        ],
      },
      {
        name: 'Ubiquiti UniFi Switch 24 PoE',
        description: '24-port Gigabit managed switch with PoE+ support on all ports. Ideal for powering access points, cameras, and VoIP phones.',
        categoryId: categoriesData[2].id,
        productTypeId: productTypesData[1].id,
        brandId: brandsData[0].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '24', unit: 'ports', group: 'Connectivity' },
          { key: 'PoE Budget', value: '250', unit: 'W', group: 'Power' },
          { key: 'Switching Capacity', value: '52', unit: 'Gbps', group: 'Performance' },
          { key: 'Management', value: 'UniFi Controller', unit: null, group: 'Features' },
        ],
        variants: [
          { color: 0, model: 1, price: '399.99', stock: 30 },
        ],
      },
      {
        name: 'Ubiquiti EdgeRouter X',
        description: 'Advanced gigabit router with EdgeOS providing enterprise-level features for home and office networks.',
        categoryId: categoriesData[1].id,
        productTypeId: productTypesData[0].id,
        brandId: brandsData[0].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '5', unit: 'ports', group: 'Connectivity' },
          { key: 'Throughput', value: '1', unit: 'Gbps', group: 'Performance' },
          { key: 'CPU', value: 'Dual-Core 880 MHz', unit: null, group: 'Hardware' },
          { key: 'RAM', value: '256', unit: 'MB', group: 'Hardware' },
        ],
        variants: [
          { color: 0, model: 2, price: '59.99', stock: 75 },
        ],
      },
      {
        name: 'TP-Link Archer AX50 WiFi 6 Router',
        description: 'Next-generation WiFi 6 router with AX3000 speeds, OFDMA, and MU-MIMO technology for lag-free gaming and streaming.',
        categoryId: categoriesData[1].id,
        productTypeId: productTypesData[0].id,
        brandId: brandsData[1].id,
        isPublished: true,
        specs: [
          { key: 'WiFi Standard', value: 'WiFi 6 (802.11ax)', unit: null, group: 'Wireless' },
          { key: 'Speed', value: '3000', unit: 'Mbps', group: 'Performance' },
          { key: 'Antennas', value: '4', unit: null, group: 'Hardware' },
          { key: 'Ethernet Ports', value: '4', unit: 'ports', group: 'Connectivity' },
        ],
        variants: [
          { color: 0, model: 3, price: '129.99', stock: 60 },
        ],
      },
      {
        name: 'TP-Link 24-Port Gigabit Switch',
        description: 'Reliable unmanaged switch with 24 Gigabit ports for expanding network connectivity in homes and offices.',
        categoryId: categoriesData[2].id,
        productTypeId: productTypesData[1].id,
        brandId: brandsData[1].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '24', unit: 'ports', group: 'Connectivity' },
          { key: 'Speed', value: '1000', unit: 'Mbps', group: 'Performance' },
          { key: 'Switching Capacity', value: '48', unit: 'Gbps', group: 'Performance' },
          { key: 'Type', value: 'Unmanaged', unit: null, group: 'Features' },
        ],
        variants: [
          { color: 0, model: 4, price: '89.99', stock: 45 },
        ],
      },
      {
        name: 'Cat6 Ethernet Cable',
        description: 'High-quality Cat6 Ethernet cable with gold-plated connectors. Supports speeds up to 10 Gbps at 55 meters.',
        categoryId: categoriesData[4].id,
        productTypeId: productTypesData[3].id,
        brandId: brandsData[1].id,
        isPublished: true,
        specs: [
          { key: 'Category', value: 'Cat6', unit: null, group: 'Specifications' },
          { key: 'Max Speed', value: '10', unit: 'Gbps', group: 'Performance' },
          { key: 'Connector', value: 'RJ45 Gold-Plated', unit: null, group: 'Hardware' },
        ],
        variants: [
          { color: 2, length: 1, price: '4.99', stock: 200 },
          { color: 2, length: 2, price: '6.99', stock: 180 },
          { color: 2, length: 4, price: '9.99', stock: 150 },
          { color: 2, length: 5, price: '14.99', stock: 120 },
          { color: 2, length: 6, price: '24.99', stock: 80 },
        ],
      },
      {
        name: 'Cat6A Shielded Ethernet Cable',
        description: 'Premium shielded Cat6A cable for 10 Gigabit networks. Ideal for data centers and high-interference environments.',
        categoryId: categoriesData[4].id,
        productTypeId: productTypesData[3].id,
        brandId: brandsData[2].id,
        isPublished: true,
        specs: [
          { key: 'Category', value: 'Cat6A', unit: null, group: 'Specifications' },
          { key: 'Max Speed', value: '10', unit: 'Gbps', group: 'Performance' },
          { key: 'Shielding', value: 'S/FTP', unit: null, group: 'Features' },
          { key: 'Connector', value: 'RJ45', unit: null, group: 'Hardware' },
        ],
        variants: [
          { color: 2, length: 2, price: '9.99', stock: 150 },
          { color: 2, length: 4, price: '14.99', stock: 130 },
          { color: 2, length: 5, price: '22.99', stock: 100 },
        ],
      },
      {
        name: 'Cisco Catalyst 2960X Switch',
        description: 'Enterprise-grade Layer 2 switch with 24 Gigabit ports and advanced security features.',
        categoryId: categoriesData[2].id,
        productTypeId: productTypesData[1].id,
        brandId: brandsData[2].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '24', unit: 'ports', group: 'Connectivity' },
          { key: 'Uplinks', value: '4 x 1G SFP', unit: null, group: 'Connectivity' },
          { key: 'Switching Capacity', value: '108', unit: 'Gbps', group: 'Performance' },
          { key: 'Features', value: 'Layer 2, PoE+, FlexStack-Plus', unit: null, group: 'Features' },
        ],
        variants: [
          { color: 2, price: '1299.99', stock: 15 },
        ],
      },
      {
        name: 'MikroTik hEX S Gigabit Router',
        description: 'Powerful router with SFP port, hardware encryption, and RouterOS for advanced configurations.',
        categoryId: categoriesData[1].id,
        productTypeId: productTypesData[0].id,
        brandId: brandsData[4].id,
        isPublished: true,
        specs: [
          { key: 'Ethernet Ports', value: '5', unit: 'ports', group: 'Connectivity' },
          { key: 'SFP Port', value: '1', unit: 'port', group: 'Connectivity' },
          { key: 'CPU', value: 'Dual-Core 880 MHz', unit: null, group: 'Hardware' },
          { key: 'Throughput', value: '1', unit: 'Gbps', group: 'Performance' },
        ],
        variants: [
          { color: 0, price: '69.99', stock: 55 },
        ],
      },
      {
        name: 'Netgear Nighthawk AX12 WiFi 6 Router',
        description: 'Ultra-fast WiFi 6 router with AX6000 speeds, 12-stream connectivity, and 2.5G Multi-Gig port.',
        categoryId: categoriesData[1].id,
        productTypeId: productTypesData[0].id,
        brandId: brandsData[3].id,
        isPublished: true,
        specs: [
          { key: 'WiFi Standard', value: 'WiFi 6 (802.11ax)', unit: null, group: 'Wireless' },
          { key: 'Speed', value: '6000', unit: 'Mbps', group: 'Performance' },
          { key: 'Streams', value: '12', unit: null, group: 'Wireless' },
          { key: 'Multi-Gig Port', value: '2.5', unit: 'Gbps', group: 'Connectivity' },
        ],
        variants: [
          { color: 0, price: '349.99', stock: 25 },
        ],
      },
      {
        name: 'D-Link 48-Port Gigabit PoE Switch',
        description: 'High-density PoE switch with 48 Gigabit ports and 4 SFP+ uplinks for enterprise deployments.',
        categoryId: categoriesData[2].id,
        productTypeId: productTypesData[1].id,
        brandId: brandsData[5].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '48', unit: 'ports', group: 'Connectivity' },
          { key: 'PoE Budget', value: '370', unit: 'W', group: 'Power' },
          { key: 'Uplinks', value: '4 x 10G SFP+', unit: null, group: 'Connectivity' },
          { key: 'Switching Capacity', value: '176', unit: 'Gbps', group: 'Performance' },
        ],
        variants: [
          { color: 0, price: '899.99', stock: 20 },
        ],
      },
      {
        name: 'Server Rack 42U',
        description: 'Professional server rack cabinet with ventilation, cable management, and lockable front and rear doors.',
        categoryId: categoriesData[5].id,
        productTypeId: productTypesData[5].id,
        brandId: brandsData[3].id,
        isPublished: true,
        specs: [
          { key: 'Height', value: '42', unit: 'U', group: 'Dimensions' },
          { key: 'Depth', value: '1000', unit: 'mm', group: 'Dimensions' },
          { key: 'Width', value: '600', unit: 'mm', group: 'Dimensions' },
          { key: 'Weight Capacity', value: '800', unit: 'kg', group: 'Capacity' },
        ],
        variants: [
          { color: 0, size: 4, price: '599.99', stock: 10 },
        ],
      },
      {
        name: 'Server Rack 24U',
        description: 'Compact server rack ideal for small to medium deployments with professional cable management.',
        categoryId: categoriesData[5].id,
        productTypeId: productTypesData[5].id,
        brandId: brandsData[3].id,
        isPublished: true,
        specs: [
          { key: 'Height', value: '24', unit: 'U', group: 'Dimensions' },
          { key: 'Depth', value: '800', unit: 'mm', group: 'Dimensions' },
          { key: 'Width', value: '600', unit: 'mm', group: 'Dimensions' },
          { key: 'Weight Capacity', value: '600', unit: 'kg', group: 'Capacity' },
        ],
        variants: [
          { color: 0, size: 3, price: '449.99', stock: 15 },
        ],
      },
      {
        name: '24-Port Cat6 Patch Panel',
        description: 'High-density patch panel with 24 RJ45 ports and color-coded labels for easy cable organization.',
        categoryId: categoriesData[5].id,
        productTypeId: productTypesData[6].id,
        brandId: brandsData[1].id,
        isPublished: true,
        specs: [
          { key: 'Port Count', value: '24', unit: 'ports', group: 'Specifications' },
          { key: 'Category', value: 'Cat6', unit: null, group: 'Specifications' },
          { key: 'Mount Type', value: '1U Rack Mount', unit: null, group: 'Installation' },
          { key: 'Connector Type', value: 'RJ45', unit: null, group: 'Hardware' },
        ],
        variants: [
          { color: 0, price: '39.99', stock: 80 },
        ],
      },
      {
        name: 'Fiber Optic Cable Single Mode',
        description: 'High-performance single-mode fiber optic cable for long-distance, high-bandwidth connections.',
        categoryId: categoriesData[4].id,
        productTypeId: productTypesData[4].id,
        brandId: brandsData[2].id,
        isPublished: true,
        specs: [
          { key: 'Type', value: 'Single Mode', unit: null, group: 'Specifications' },
          { key: 'Core Size', value: '9', unit: 'μm', group: 'Specifications' },
          { key: 'Max Distance', value: '10', unit: 'km', group: 'Performance' },
          { key: 'Connector', value: 'LC/UPC', unit: null, group: 'Hardware' },
        ],
        variants: [
          { color: 3, length: 2, price: '19.99', stock: 60 },
          { color: 3, length: 4, price: '29.99', stock: 50 },
          { color: 3, length: 5, price: '39.99', stock: 40 },
          { color: 3, length: 6, price: '59.99', stock: 30 },
        ],
      },
    ];

    let productCount = 0;
    let variantCount = 0;
    let specCount = 0;

    for (const productData of productsData) {
      // Insert product
      const [product] = await db.insert(products).values({
        name: productData.name,
        description: productData.description,
        categoryId: productData.categoryId,
        productTypeId: productData.productTypeId,
        brandId: productData.brandId,
        isPublished: productData.isPublished,
      }).returning();

      productCount++;
      log(`  ➤ Created product: ${product.name}`, 'blue');

      // Insert specifications
      for (const spec of productData.specs) {
        await db.insert(productSpecifications).values({
          productId: product.id,
          specKey: spec.key,
          specValue: spec.value,
          specUnit: spec.unit,
          specGroup: spec.group,
        });
        specCount++;
      }

      // Insert variants
      let firstVariantId: string | null = null;
      for (const variantData of productData.variants) {
        const [variant] = await db.insert(productVariants).values({
          productId: product.id,
          sku: `${product.name.substring(0, 3).toUpperCase()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
          price: variantData.price,
          colorId: 'color' in variantData && variantData.color !== undefined ? colorsData[variantData.color].id : null,
          sizeId: 'size' in variantData && variantData.size !== undefined ? sizesData[variantData.size].id : null,
          modelId: 'model' in variantData && variantData.model !== undefined ? modelsData[variantData.model].id : null,
          lengthId: 'length' in variantData && variantData.length !== undefined ? lengthsData[variantData.length].id : null,
          inStock: variantData.stock,
          minStockLevel: 5,
        }).returning();

        if (!firstVariantId) {
          firstVariantId = variant.id;
        }

        variantCount++;

        // Insert product images
        const imageIndex = (productCount % 4) + 1;
        await db.insert(productImages).values([
          {
            productId: product.id,
            variantId: variant.id,
            url: `/products/product-${imageIndex}.png`,
            altText: product.name,
            sortOrder: 0,
            isPrimary: true,
          },
        ]);
      }

      // Set default variant
      if (firstVariantId) {
        await db.update(products)
          .set({ defaultVariantId: firstVariantId })
          .where(eq(products.id, product.id));
      }
    }

    log(`✅ Created ${productCount} products with ${variantCount} variants and ${specCount} specifications`, 'green');

    // Step 11: Link products to collections
    log('\n🔗 Linking products to collections...', 'cyan');
    const allProducts = await db.select().from(products);
    let collectionLinkCount = 0;

    // Add first 5 products to Best Sellers
    for (let i = 0; i < Math.min(5, allProducts.length); i++) {
      await db.insert(productCollections).values({
        productId: allProducts[i].id,
        collectionId: collectionsData[0].id,
        sortOrder: i,
      });
      collectionLinkCount++;
    }

    // Add last 5 products to New Arrivals
    for (let i = Math.max(0, allProducts.length - 5); i < allProducts.length; i++) {
      await db.insert(productCollections).values({
        productId: allProducts[i].id,
        collectionId: collectionsData[1].id,
        sortOrder: i,
      });
      collectionLinkCount++;
    }

    // Add Cisco and Ubiquiti products to Enterprise Grade
    const enterpriseProducts = allProducts.filter(p =>
      [brandsData[0].id, brandsData[2].id].includes(p.brandId)
    );
    for (let i = 0; i < enterpriseProducts.length; i++) {
      await db.insert(productCollections).values({
        productId: enterpriseProducts[i].id,
        collectionId: collectionsData[2].id,
        sortOrder: i,
      });
      collectionLinkCount++;
    }

    log(`✅ Created ${collectionLinkCount} product-collection links`, 'green');

    log('\n✨ Database seeding completed successfully!', 'bright');
    log(`\n📊 Summary:`, 'yellow');
    log(`  - ${brandsData.length} brands`, 'reset');
    log(`  - ${colorsData.length} colors`, 'reset');
    log(`  - ${sizesData.length} sizes`, 'reset');
    log(`  - ${lengthsData.length} lengths`, 'reset');
    log(`  - ${modelsData.length} models`, 'reset');
    log(`  - ${productTypesData.length} product types`, 'reset');
    log(`  - ${categoriesData.length} categories`, 'reset');
    log(`  - ${collectionsData.length} collections`, 'reset');
    log(`  - ${productCount} products`, 'reset');
    log(`  - ${variantCount} product variants`, 'reset');
    log(`  - ${specCount} specifications`, 'reset');
    log(`  - ${collectionLinkCount} collection links`, 'reset');

  } catch (error) {
    log(`\n❌ Error during seeding:`, 'red');
    console.error(error);
    process.exit(1);
  }
}

main()
  .then(() => {
    log('\n👋 Seeding process finished. Exiting...', 'cyan');
    process.exit(0);
  })
  .catch((error) => {
    log('\n❌ Fatal error:', 'red');
    console.error(error);
    process.exit(1);
  });
