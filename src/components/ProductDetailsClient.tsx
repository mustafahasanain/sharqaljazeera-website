"use client";

import { useState } from "react";
import { Star, Heart, ShoppingBag } from "lucide-react";
import ProductGallery, { ProductVariant } from "./ProductGallery";
import SizePicker from "./SizePicker";
import CollapsibleSection from "./CollapsibleSection";
import ColorSwatches from "./ColorSwatches";

interface ProductDetailsClientProps {
  product: {
    name: string;
    category: string;
    price: number;
    compareAtPrice?: number;
    description: string;
    rating: number;
    reviewCount: number;
    variants: ProductVariant[];
    sizes: string[];
    availableSizes: string[];
    details: {
      features: string[];
      specifications: string[];
    };
    badge?: { label: string; tone: "red" | "green" | "orange" };
  };
}

export default function ProductDetailsClient({
  product,
}: ProductDetailsClientProps) {
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  return (
    <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
      {/* Left Column - Gallery */}
      <section aria-label="Product images">
        <ProductGallery
          variants={product.variants}
          defaultVariantIndex={selectedVariantIndex}
        />
      </section>

      {/* Right Column - Product Info */}
      <section className="flex flex-col gap-6">
        {/* Header */}
        <div>
          {/* Highly Rated Badge */}
          <div className="mb-3 flex items-center gap-1.5">
            <Star size={18} className="fill-dark-900 text-dark-900" />
            <span className="text-body-medium text-dark-900">Highly Rated</span>
          </div>

          {/* Product Name */}
          <h1 className="text-heading-2 text-dark-900">{product.name}</h1>

          {/* Category */}
          <p className="mt-1 text-body text-dark-700">{product.category}</p>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-3">
          <span className="text-heading-3 text-dark-900">${product.price}</span>
          {product.compareAtPrice && (
            <span className="text-body text-dark-500 line-through">
              ${product.compareAtPrice}
            </span>
          )}
        </div>

        {/* Discount Badge */}
        {product.badge && (
          <div className="inline-flex w-fit rounded-lg bg-green-600 px-3 py-1.5 text-body-medium text-white">
            {product.badge.label}
          </div>
        )}

        {/* Color Swatches */}
        <ColorSwatches
          variants={product.variants}
          selectedIndex={selectedVariantIndex}
          onSelectVariant={setSelectedVariantIndex}
        />

        {/* Size Picker */}
        <SizePicker
          sizes={product.sizes}
          availableSizes={product.availableSizes}
        />

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-full bg-dark-900 py-4 text-body-medium text-white transition-all hover:bg-dark-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700">
            <ShoppingBag size={20} />
            <span>Add to Bag</span>
          </button>

          <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-dark-900 bg-white py-4 text-body-medium text-dark-900 transition-all hover:bg-light-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700">
            <Heart size={20} />
            <span>Favorite</span>
          </button>
        </div>

        {/* Collapsible Sections */}
        <div className="mt-4">
          <CollapsibleSection title="Product Details" defaultOpen={true}>
            <div className="space-y-4">
              <p>{product.description}</p>
              <ul className="list-inside space-y-1">
                {product.details.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1 w-1 flex-shrink-0 rounded-full bg-dark-700" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title="Shipping & Returns">
            <div className="space-y-3">
              <p>
                <strong>Free standard shipping</strong> on orders over $50.
              </p>
              <p>
                You can return your product for a full refund within 60 days of
                purchase. Items must be in new, unworn condition with original
                tags and packaging.
              </p>
              <p>
                <strong>Estimated delivery:</strong> 3-7 business days for
                standard shipping.
              </p>
            </div>
          </CollapsibleSection>

          <CollapsibleSection title={`Reviews (${product.reviewCount})`}>
            <div className="mb-4 flex items-center gap-2">
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={18}
                    className={
                      i < product.rating
                        ? "fill-dark-900 text-dark-900"
                        : "text-dark-500"
                    }
                  />
                ))}
              </div>
              <span className="text-body-medium text-dark-900">
                {product.rating} out of 5 stars
              </span>
            </div>
            <p className="text-body text-dark-700">
              No reviews yet. Be the first to review this product.
            </p>
          </CollapsibleSection>
        </div>
      </section>
    </div>
  );
}
