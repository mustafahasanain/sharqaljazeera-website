"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export interface ProductCardProps {
  title: string;
  category: string;
  brand: string;
  imageSrc: string;
  imageAlt?: string;
  price: number;
  salePrice?: number;
  href: string;
  categoryHref: string;
  brandHref: string;
  className?: string;
}

export default function ProductCard({
  title,
  category,
  brand,
  imageSrc,
  imageAlt = title,
  price,
  salePrice,
  href,
  categoryHref,
  brandHref,
  className = "",
}: ProductCardProps) {
  const router = useRouter();
  const formatPrice = (p: number) => `$${p.toFixed(2)}`;

  // Calculate discount percentage
  const discountPercent =
    salePrice !== undefined
      ? Math.round(((price - salePrice) / price) * 100)
      : undefined;

  const displayPrice = formatPrice(price);
  const displaySalePrice =
    salePrice !== undefined ? formatPrice(salePrice) : undefined;

  const handleCardClick = () => {
    router.push(href);
  };

  return (
    <article
      onClick={handleCardClick}
      className={`group flex h-full flex-col rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-orange cursor-pointer ${className}`}
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover"
        />
        {discountPercent && discountPercent > 0 && (
          <div className="absolute left-2 top-2 rounded bg-orange px-2 py-1 text-caption-medium text-white">
            {discountPercent}% off
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="flex flex-col gap-2 p-4">
        {/* Desktop layout: Title and Price side by side */}
        <div className="hidden sm:flex items-start justify-between gap-2">
          <h3 className="text-heading-3 text-dark-900">{title}</h3>
          <div className="flex-shrink-0 text-right mt-[5px]">
            {displaySalePrice ? (
              <div className="flex flex-col items-end gap-0.5">
                <span className="text-body-medium text-dark-900 whitespace-nowrap">
                  {displaySalePrice}
                </span>
                <span className="text-caption text-dark-500 line-through">
                  {displayPrice}
                </span>
              </div>
            ) : (
              <span className="text-body-medium text-dark-900 whitespace-nowrap">
                {displayPrice}
              </span>
            )}
          </div>
        </div>

        {/* Desktop: Brand */}
        <Link
          href={brandHref}
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:block text-body text-dark-700 hover:text-orange transition-colors w-fit"
        >
          {brand}
        </Link>

        {/* Desktop: Category */}
        <Link
          href={categoryHref}
          onClick={(e) => e.stopPropagation()}
          className="hidden sm:block text-body text-dark-700 hover:text-orange transition-colors w-fit"
        >
          {category}
        </Link>

        {/* Mobile layout: Category, Title, Price stacked */}
        <div className="flex sm:hidden flex-col gap-1">
          {/* Category */}
          <Link
            href={categoryHref}
            onClick={(e) => e.stopPropagation()}
            className="text-[12px] text-dark-700 hover:text-orange transition-colors uppercase"
          >
            {category}
          </Link>

          {/* Title */}
          <h3 className="text-body-medium text-dark-900">{title}</h3>

          {/* Price */}
          <div className="flex items-center gap-2">
            {displaySalePrice ? (
              <>
                <span className="text-body text-dark-900">
                  {displaySalePrice}
                </span>
                <span className="text-caption text-dark-500 line-through">
                  {displayPrice}
                </span>
              </>
            ) : (
              <span className="text-body text-dark-900">{displayPrice}</span>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
