/**
 * Mock product data for the Products page
 * This data structure mirrors the database schema
 */

import { brandsData, type BrandData } from './brands';

export interface MockBrand {
  id: string;
  name: string;
  slug: string;
}

export interface MockCategory {
  id: string;
  name: string;
  slug: string;
}

export interface MockColor {
  id: string;
  name: string;
  hexCode: string;
}

export interface MockVariant {
  id: string;
  productId: string;
  sku: string;
  price: number;
  salePrice?: number;
  colorId: string;
  colorName: string;
  inStock: number;
}

export interface MockProduct {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  categoryName: string;
  brandId: string;
  brandName: string;
  imageSrc: string;
  variants: MockVariant[];
  badge?: { label: string; tone?: 'red' | 'green' | 'orange' };
  createdAt: Date;
}

// Use brands from brands.ts
export const mockBrands: MockBrand[] = brandsData.map((brand) => ({
  id: brand.id,
  name: brand.name,
  slug: brand.slug,
}));

// Mock categories
export const mockCategories: MockCategory[] = [
  { id: '1', name: 'Routers', slug: 'routers' },
  { id: '2', name: 'Switches', slug: 'switches' },
  { id: '3', name: 'Access Points', slug: 'access-points' },
  { id: '4', name: 'Network Adapters', slug: 'network-adapters' },
  { id: '5', name: 'Range Extenders', slug: 'range-extenders' },
  { id: '6', name: 'Modems', slug: 'modems' },
];

// Mock colors
export const mockColors: MockColor[] = [
  { id: '1', name: 'Black', hexCode: '#000000' },
  { id: '2', name: 'White', hexCode: '#FFFFFF' },
  { id: '3', name: 'Blue', hexCode: '#0066CC' },
  { id: '4', name: 'Gray', hexCode: '#808080' },
  { id: '5', name: 'Silver', hexCode: '#C0C0C0' },
];

// Mock products - comprehensive list matching the design
export const mockProducts: MockProduct[] = [
  {
    id: '1',
    name: 'AX1800 Dual Band WiFi 6 Router',
    description: 'Next-gen WiFi 6 router with speeds up to 1.8 Gbps',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-1.png',
    badge: { label: 'Best Seller', tone: 'red' },
    createdAt: new Date('2024-03-15'),
    variants: [
      {
        id: '1-1',
        productId: '1',
        sku: 'TPL-AX1800-BLK',
        price: 89.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 50,
      },
      {
        id: '1-2',
        productId: '1',
        sku: 'TPL-AX1800-WHT',
        price: 89.99,
        colorId: '2',
        colorName: 'White',
        inStock: 30,
      },
    ],
  },
  {
    id: '2',
    name: 'AC1900 Dual Band Smart WiFi Router',
    description: 'Powerful WiFi router with MU-MIMO technology',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '4',
    brandName: 'MIKROTIK',
    imageSrc: '/products/product-2.png',
    badge: { label: 'Extra 20% off', tone: 'green' },
    createdAt: new Date('2024-02-20'),
    variants: [
      {
        id: '2-1',
        productId: '2',
        sku: 'MKR-AC1900-BLK',
        price: 119.99,
        salePrice: 95.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 25,
      },
    ],
  },
  {
    id: '3',
    name: 'UniFi Dream Machine Pro',
    description: 'All-in-one enterprise network solution',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '2',
    brandName: 'UBIQUITI',
    imageSrc: '/products/product-3.png',
    badge: { label: 'Sustainable Materials', tone: 'green' },
    createdAt: new Date('2024-01-10'),
    variants: [
      {
        id: '3-1',
        productId: '3',
        sku: 'UBI-UDMP-SLV',
        price: 379.99,
        colorId: '5',
        colorName: 'Silver',
        inStock: 15,
      },
    ],
  },
  {
    id: '4',
    name: '24-Port Gigabit Managed Switch',
    description: 'Enterprise-grade managed switch with PoE+',
    categoryId: '2',
    categoryName: 'Switches',
    brandId: '12',
    brandName: 'CISCO',
    imageSrc: '/products/product-4.png',
    createdAt: new Date('2024-03-01'),
    variants: [
      {
        id: '4-1',
        productId: '4',
        sku: 'CSC-SW24G-GRY',
        price: 299.99,
        colorId: '4',
        colorName: 'Gray',
        inStock: 20,
      },
    ],
  },
  {
    id: '5',
    name: 'AX3000 WiFi 6 Router',
    description: 'High-speed WiFi 6 with advanced security features',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-1.png',
    badge: { label: 'Best Seller', tone: 'red' },
    createdAt: new Date('2024-03-20'),
    variants: [
      {
        id: '5-1',
        productId: '5',
        sku: 'TPL-AX3000-BLK',
        price: 149.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 40,
      },
      {
        id: '5-2',
        productId: '5',
        sku: 'TPL-AX3000-BLU',
        price: 149.99,
        colorId: '3',
        colorName: 'Blue',
        inStock: 25,
      },
    ],
  },
  {
    id: '6',
    name: 'WiFi 6E Tri-Band Router',
    description: 'Next-generation WiFi 6E with 6GHz band support',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '9',
    brandName: 'HUAWEI',
    imageSrc: '/products/product-2.png',
    badge: { label: 'Extra 20% off', tone: 'green' },
    createdAt: new Date('2024-02-15'),
    variants: [
      {
        id: '6-1',
        productId: '6',
        sku: 'HW-WIFI6E-WHT',
        price: 399.99,
        salePrice: 319.99,
        colorId: '2',
        colorName: 'White',
        inStock: 18,
      },
    ],
  },
  {
    id: '7',
    name: 'AC1200 WiFi Range Extender',
    description: 'Boost your WiFi coverage with dual-band technology',
    categoryId: '5',
    categoryName: 'Range Extenders',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-3.png',
    createdAt: new Date('2024-01-25'),
    variants: [
      {
        id: '7-1',
        productId: '7',
        sku: 'TPL-AC1200-WHT',
        price: 39.99,
        colorId: '2',
        colorName: 'White',
        inStock: 60,
      },
    ],
  },
  {
    id: '8',
    name: 'UniFi 6 Long-Range Access Point',
    description: 'High-performance WiFi 6 access point for large areas',
    categoryId: '3',
    categoryName: 'Access Points',
    brandId: '2',
    brandName: 'UBIQUITI',
    imageSrc: '/products/product-4.png',
    badge: { label: 'Best Seller', tone: 'red' },
    createdAt: new Date('2024-03-10'),
    variants: [
      {
        id: '8-1',
        productId: '8',
        sku: 'UBI-U6LR-WHT',
        price: 179.99,
        colorId: '2',
        colorName: 'White',
        inStock: 35,
      },
    ],
  },
  {
    id: '9',
    name: '8-Port Gigabit Smart Switch',
    description: 'Compact managed switch with VLAN support',
    categoryId: '2',
    categoryName: 'Switches',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-1.png',
    createdAt: new Date('2024-02-05'),
    variants: [
      {
        id: '9-1',
        productId: '9',
        sku: 'TPL-SW8G-BLK',
        price: 79.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 45,
      },
    ],
  },
  {
    id: '10',
    name: 'AX5400 Gaming Router',
    description: 'Ultra-fast gaming router with QoS and low latency',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '4',
    brandName: 'MIKROTIK',
    imageSrc: '/products/product-2.png',
    badge: { label: 'Extra 10% off', tone: 'green' },
    createdAt: new Date('2024-03-25'),
    variants: [
      {
        id: '10-1',
        productId: '10',
        sku: 'MKR-AX5400-BLK',
        price: 229.99,
        salePrice: 206.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 22,
      },
      {
        id: '10-2',
        productId: '10',
        sku: 'MKR-AX5400-BLU',
        price: 229.99,
        salePrice: 206.99,
        colorId: '3',
        colorName: 'Blue',
        inStock: 15,
      },
    ],
  },
  {
    id: '11',
    name: 'USB 3.0 Wireless Adapter',
    description: 'High-speed wireless adapter with dual-band support',
    categoryId: '4',
    categoryName: 'Network Adapters',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-3.png',
    createdAt: new Date('2024-01-15'),
    variants: [
      {
        id: '11-1',
        productId: '11',
        sku: 'TPL-USB3-BLK',
        price: 29.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 75,
      },
    ],
  },
  {
    id: '12',
    name: 'Cable Modem with DOCSIS 3.1',
    description: 'High-speed cable modem for gigabit internet',
    categoryId: '6',
    categoryName: 'Modems',
    brandId: '1',
    brandName: 'NETRIX',
    imageSrc: '/products/product-4.png',
    badge: { label: 'Sustainable Materials', tone: 'green' },
    createdAt: new Date('2024-02-10'),
    variants: [
      {
        id: '12-1',
        productId: '12',
        sku: 'NTX-CM1200-WHT',
        price: 169.99,
        colorId: '2',
        colorName: 'White',
        inStock: 30,
      },
    ],
  },
  {
    id: '13',
    name: 'Mesh WiFi System 3-Pack',
    description: 'Whole-home mesh WiFi system with seamless roaming',
    categoryId: '1',
    categoryName: 'Routers',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-1.png',
    badge: { label: 'Best Seller', tone: 'red' },
    createdAt: new Date('2024-03-18'),
    variants: [
      {
        id: '13-1',
        productId: '13',
        sku: 'TPL-MESH3-WHT',
        price: 199.99,
        colorId: '2',
        colorName: 'White',
        inStock: 28,
      },
    ],
  },
  {
    id: '14',
    name: '16-Port PoE+ Gigabit Switch',
    description: 'Managed switch with 16 PoE+ ports for IP cameras',
    categoryId: '2',
    categoryName: 'Switches',
    brandId: '2',
    brandName: 'UBIQUITI',
    imageSrc: '/products/product-2.png',
    createdAt: new Date('2024-02-28'),
    variants: [
      {
        id: '14-1',
        productId: '14',
        sku: 'UBI-SW16POE-GRY',
        price: 249.99,
        colorId: '4',
        colorName: 'Gray',
        inStock: 20,
      },
    ],
  },
  {
    id: '15',
    name: 'WiFi 6 USB Adapter',
    description: 'Latest WiFi 6 technology in a compact USB adapter',
    categoryId: '4',
    categoryName: 'Network Adapters',
    brandId: '3',
    brandName: 'TP-LINK',
    imageSrc: '/products/product-3.png',
    badge: { label: 'Extra 20% off', tone: 'green' },
    createdAt: new Date('2024-03-05'),
    variants: [
      {
        id: '15-1',
        productId: '15',
        sku: 'TPL-USB6-BLK',
        price: 49.99,
        salePrice: 39.99,
        colorId: '1',
        colorName: 'Black',
        inStock: 55,
      },
    ],
  },
];

/**
 * Get products with optional filtering and sorting
 */
export function getProducts({
  brands,
  categories,
  priceMin,
  priceMax,
  sort = 'featured',
  limit,
  page = 1,
}: {
  brands?: string[];
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  sort?: string;
  limit?: number;
  page?: number;
} = {}): { products: MockProduct[]; total: number } {
  let filtered = [...mockProducts];

  // Filter by brands
  if (brands && brands.length > 0) {
    const brandSlugs = brands.map((b) => b.toLowerCase());
    filtered = filtered.filter((p) =>
      brandSlugs.includes(p.brandName.toLowerCase())
    );
  }

  // Filter by categories
  if (categories && categories.length > 0) {
    const categorySlugs = categories.map((c) => c.toLowerCase());
    filtered = filtered.filter((p) =>
      categorySlugs.includes(p.categoryName.toLowerCase())
    );
  }

  // Filter by price range (using the base variant price)
  if (priceMin !== undefined || priceMax !== undefined) {
    filtered = filtered.filter((p) => {
      const basePrice = p.variants[0]?.salePrice || p.variants[0]?.price || 0;
      const matchesMin = priceMin === undefined || basePrice >= priceMin;
      const matchesMax = priceMax === undefined || basePrice <= priceMax;
      return matchesMin && matchesMax;
    });
  }

  // Sort products
  switch (sort) {
    case 'newest':
      filtered.sort(
        (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
      );
      break;
    case 'price_asc':
      filtered.sort((a, b) => {
        const priceA = a.variants[0]?.salePrice || a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.salePrice || b.variants[0]?.price || 0;
        return priceA - priceB;
      });
      break;
    case 'price_desc':
      filtered.sort((a, b) => {
        const priceA = a.variants[0]?.salePrice || a.variants[0]?.price || 0;
        const priceB = b.variants[0]?.salePrice || b.variants[0]?.price || 0;
        return priceB - priceA;
      });
      break;
    case 'featured':
    default:
      // Keep default order (featured products first)
      break;
  }

  // Get total count before pagination
  const total = filtered.length;

  // Apply pagination
  if (limit && limit > 0) {
    const offset = (page - 1) * limit;
    filtered = filtered.slice(offset, offset + limit);
  }

  return { products: filtered, total };
}

/**
 * Get unique brands from products
 */
export function getAvailableBrands(): MockBrand[] {
  return mockBrands;
}

/**
 * Get unique categories from products
 */
export function getAvailableCategories(): MockCategory[] {
  return mockCategories;
}

/**
 * Get price ranges for filtering
 */
export const priceRanges = [
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $100', min: 50, max: 100 },
  { label: '$100 - $200', min: 100, max: 200 },
  { label: '$200 - $300', min: 200, max: 300 },
  { label: 'Over $300', min: 300, max: 999999 },
];

/**
 * Get product counts by brand name
 */
export function getProductCountsByBrand(): Record<string, number> {
  const counts: Record<string, number> = {};

  mockProducts.forEach((product) => {
    const brandName = product.brandName;
    counts[brandName] = (counts[brandName] || 0) + 1;
  });

  return counts;
}
