import { Suspense } from "react";
import { Card } from "@/components";
import { getBrands, getBrandCount } from "@/data/brands";
import { getProductCountsByBrand } from "@/data/products";

// Loading component for Suspense
function BrandsLoading() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="h-96 animate-pulse rounded-xl bg-light-200"
        ></div>
      ))}
    </div>
  );
}

// Main brands content component
async function BrandsContent() {
  // Get all brands with dynamic product counts
  const productCounts = getProductCountsByBrand();
  const brands = getBrands(productCounts);
  const brandCount = getBrandCount();

  return (
    <>
      {/* Header with results count */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-heading-2 text-dark-900 mb-2">Brands</h1>
            <p className="text-body text-dark-700">
              Showing {brandCount} {brandCount === 1 ? "brand" : "brands"}
            </p>
          </div>
        </div>
      </div>

      {/* Brands grid */}
      {brands.length > 0 ? (
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand) => {
            return (
              <Card
                key={brand.id}
                title={brand.name}
                description={`${brand.productCount || 0} ${
                  brand.productCount === 1 ? "Product" : "Products"
                }`}
                imageSrc={brand.logoSrc}
                href={`/shop?brands=${brand.name}`}
              />
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-4 rounded-full bg-light-200 p-6">
            <svg
              className="h-12 w-12 text-dark-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h2 className="mb-2 text-heading-3 text-dark-900">No brands found</h2>
          <p className="mb-6 text-body text-dark-700">
            No brands are currently available.
          </p>
        </div>
      )}
    </>
  );
}

export default function BrandsPage() {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<BrandsLoading />}>
        <BrandsContent />
      </Suspense>
    </main>
  );
}
