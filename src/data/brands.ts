/**
 * Mock brand data for the Brands page
 * Based on the brands from your screenshot
 * Product counts are calculated dynamically from the products data
 */

export interface BrandData {
  id: string;
  name: string;
  slug: string;
  logoSrc: string;
  productCount?: number;
}

// All brands from your screenshot
export const brandsData: BrandData[] = [
  {
    id: "1",
    name: "NETRIX",
    slug: "netrix",
    logoSrc: "/brands/netrix.webp",
  },
  {
    id: "2",
    name: "UBIQUITI",
    slug: "ubiquiti",
    logoSrc: "/brands/ubiquiti.png",
  },
  {
    id: "3",
    name: "TP-LINK",
    slug: "tp-link",
    logoSrc: "/brands/tp-link.png",
  },
  {
    id: "4",
    name: "MIKROTIK",
    slug: "mikrotik",
    logoSrc: "/brands/mikrotik.png",
  },
  {
    id: "5",
    name: "MIMOSA",
    slug: "mimosa",
    logoSrc: "/brands/mimosa.png",
  },
  {
    id: "6",
    name: "BLUESTORM",
    slug: "bluestorm",
    logoSrc: "/brands/bluestorm.png",
  },
  {
    id: "7",
    name: "FANVIL",
    slug: "fanvil",
    logoSrc: "/brands/fanvil.png",
  },
  {
    id: "8",
    name: "COMMUNICATION ANTENNAS",
    slug: "communication-antennas",
    logoSrc: "/brands/communication-antennas.png",
  },
  {
    id: "9",
    name: "HUAWEI",
    slug: "huawei",
    logoSrc: "/brands/huawei.png",
  },
  {
    id: "10",
    name: "SOPTO",
    slug: "sopto",
    logoSrc: "/brands/sopto.png",
  },
  {
    id: "11",
    name: "UCL SWIFT",
    slug: "ucl-swift",
    logoSrc: "/brands/ucl-swift.png",
  },
  {
    id: "12",
    name: "CISCO",
    slug: "cisco",
    logoSrc: "/brands/cisco.png",
  },
  {
    id: "13",
    name: "POWER SOLUTIONS",
    slug: "power-solutions",
    logoSrc: "/brands/power-solutions.png",
  },
  {
    id: "14",
    name: "SOLAR POWER SYSTEM",
    slug: "solar-power-system",
    logoSrc: "/brands/solar-power-system.png",
  },
  {
    id: "15",
    name: "TENDA",
    slug: "tenda",
    logoSrc: "/brands/tenda.png",
  },
];

/**
 * Get all brands with product counts
 * To avoid circular dependencies, product counts can be passed in
 */
export function getBrands(productCounts?: Record<string, number>): BrandData[] {
  if (!productCounts) {
    return brandsData;
  }

  return brandsData.map((brand) => ({
    ...brand,
    productCount: productCounts[brand.name] || 0,
  }));
}

/**
 * Get brand by slug
 */
export function getBrandBySlug(slug: string, productCount?: number): BrandData | undefined {
  const brand = brandsData.find((brand) => brand.slug === slug);
  if (!brand) return undefined;

  return {
    ...brand,
    productCount,
  };
}

/**
 * Get total brand count
 */
export function getBrandCount(): number {
  return brandsData.length;
}
