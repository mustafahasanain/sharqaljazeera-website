import { Suspense } from "react";
import { Card } from "@/components";
import Filters from "@/components/Filters";
import Sort from "@/components/Sort";
import {
  parseFilters,
  getActiveFilters,
  removeFilter,
} from "@/lib/utils/query";
import { getProducts } from "@/data/products";
import Link from "next/link";
import { X } from "lucide-react";

interface ProductsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

// Loading component for Suspense
function ProductsLoading() {
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

// Active filters component
function ActiveFilters({ searchParamsString }: { searchParamsString: string }) {
  const activeFilters = getActiveFilters(searchParamsString);

  if (activeFilters.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-body-medium text-dark-700">Active filters:</span>
      {activeFilters.map((filter, index) => {
        const newQuery = removeFilter(
          searchParamsString,
          filter.key,
          filter.value === "price" ? undefined : filter.value
        );

        return (
          <Link
            key={`${filter.key}-${filter.value}-${index}`}
            href={`?${newQuery}`}
            scroll={false}
            className="group flex items-center gap-1.5 rounded-full bg-orange/10 px-3 py-1 text-caption text-orange hover:bg-orange hover:text-light-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-orange focus-visible:ring-offset-2"
          >
            <span>{filter.label}</span>
            <X className="h-3 w-3" />
          </Link>
        );
      })}
    </div>
  );
}

// Main products content component
async function ProductsContent({ searchParams }: ProductsPageProps) {
  // Parse search params
  const params = await searchParams;
  const searchParamsString = new URLSearchParams(
    params as Record<string, string>
  ).toString();

  const filters = parseFilters(searchParamsString);

  // Get filtered and sorted products
  const products = getProducts({
    brands: filters.brands,
    categories: filters.categories,
    priceMin: filters.priceMin,
    priceMax: filters.priceMax,
    sort: filters.sort,
  });

  const resultCount = products.length;

  return (
    <>
      {/* Header with results count, filters, and sort */}
      <div className="mb-6 flex flex-col gap-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-heading-2 text-dark-900 mb-2">Shop</h1>
            <p className="text-body text-dark-700">
              Showing {resultCount} {resultCount === 1 ? "product" : "products"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Filters />
            <Sort />
          </div>
        </div>

        {/* Active filters */}
        <ActiveFilters searchParamsString={searchParamsString} />
      </div>

      {/* Products grid */}
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => {
            // Get the base variant for pricing
            const baseVariant = product.variants[0];
            const displayPrice = baseVariant?.salePrice || baseVariant?.price;
            const colorCount = product.variants.length;

            return (
              <Card
                key={product.id}
                title={product.name}
                description={product.categoryName}
                subtitle={product.brandName}
                meta={
                  colorCount > 1
                    ? `${colorCount} ${colorCount === 1 ? "Color" : "Colors"}`
                    : undefined
                }
                imageSrc={product.imageSrc}
                price={displayPrice}
                badge={product.badge}
                href={`/products/${product.id}`}
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
          <h2 className="mb-2 text-heading-3 text-dark-900">
            No products found
          </h2>
          <p className="mb-6 text-body text-dark-700">
            Try adjusting your filters to see more results.
          </p>
          <Link
            href="/shop"
            className="rounded-lg bg-dark-900 px-6 py-3 text-body-medium text-light-100 hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-900 focus-visible:ring-offset-2 transition-colors"
          >
            Clear All Filters
          </Link>
        </div>
      )}
    </>
  );
}

export default function ProductsPage(props: ProductsPageProps) {
  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <Suspense fallback={<ProductsLoading />}>
        <ProductsContent {...props} />
      </Suspense>
    </main>
  );
}
