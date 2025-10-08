"use client";

import Image from "next/image";
import Link from "next/link";

export interface BrandCardProps {
  brandName: string;
  imageSrc: string;
  imageAlt?: string;
  productCount: number;
  href: string;
  className?: string;
}

export default function BrandCard({
  brandName,
  imageSrc,
  imageAlt = brandName,
  productCount,
  href,
  className = "",
}: BrandCardProps) {
  return (
    <Link
      href={href}
      aria-label={`View ${brandName} products`}
      className={`block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-dark-700 ${className}`}
    >
      <article className="group flex h-full flex-col rounded-xl bg-light-100 ring-1 ring-light-300 transition-all hover:ring-2 hover:ring-orange hover:shadow-lg">
        {/* Image Section */}
        <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200 p-8">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
            className="object-contain p-8 transition-transform duration-300 group-hover:scale-110"
          />
        </div>

        {/* Content Section */}
        <div className="flex flex-col gap-1 p-4">
          {/* Brand Name */}
          <h3 className="text-heading-3 text-dark-900">{brandName}</h3>

          {/* Product Count */}
          <p className="text-body text-dark-700">
            {productCount} {productCount === 1 ? "Product" : "Products"}
          </p>
        </div>
      </article>
    </Link>
  );
}
