"use client";

import Image from "next/image";
import Link from "next/link";

export type BadgeTone = "red" | "green" | "orange";

export interface CardProps {
  title: string;
  category?: string;
  brand?: string;
  // meta?: string | string[];
  imageSrc: string;
  imageAlt?: string;
  price?: string | number;
  salePrice?: string | number;
  href?: string;
  badge?: { label: string; tone?: BadgeTone };
  className?: string;
  categoryHref?: string;
  brandHref?: string;
  titleSize?: "small" | "default";
}

const toneToBg: Record<BadgeTone, string> = {
  red: "text-[--color-red]",
  green: "text-[--color-green]",
  orange: "text-[--color-orange]",
};

export default function Card({
  title,
  category,
  brand,
  // meta,
  imageSrc,
  imageAlt = title,
  price,
  salePrice,
  href,
  badge,
  className = "",
  categoryHref,
  brandHref,
  titleSize = "default",
}: CardProps) {
  const formatPrice = (p: string | number) =>
    typeof p === "number" ? `$${p.toFixed(2)}` : p;

  // Calculate discount percentage before formatting
  const discountPercent =
    price !== undefined && salePrice !== undefined
      ? Math.round(((Number(price) - Number(salePrice)) / Number(price)) * 100)
      : undefined;

  const displayPrice = price !== undefined ? formatPrice(price) : undefined;
  const displaySalePrice =
    salePrice !== undefined ? formatPrice(salePrice) : undefined;

  const content = (
    <article
      className={`group flex h-full flex-col rounded-xl bg-light-100 ring-1 ring-light-300 transition-colors hover:ring-orange ${className}`}
    >
      <div className="relative aspect-square overflow-hidden rounded-t-xl bg-light-200">
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(min-width: 1280px) 360px, (min-width: 1024px) 300px, (min-width: 640px) 45vw, 90vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />
        {discountPercent && discountPercent > 0 && (
          <div className="absolute left-3 top-3 rounded-lg bg-orange px-2.5 py-1 text-caption-medium text-white shadow-md">
            -{discountPercent}%
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-baseline justify-between gap-3">
          <h3 className={`${titleSize === "small" ? "text-body-medium" : "text-heading-3"} text-dark-900`}>{title}</h3>
          {(displaySalePrice || displayPrice) && (
            <div className="flex flex-col items-end gap-0.5">
              {displaySalePrice ? (
                <>
                  <span className="text-body-medium text-dark-900">
                    {displaySalePrice}
                  </span>
                  <span className="text-caption text-dark-500 line-through">
                    {displayPrice}
                  </span>
                </>
              ) : (
                <span className="text-body-medium text-dark-900">
                  {displayPrice}
                </span>
              )}
            </div>
          )}
        </div>
        {category &&
          (categoryHref ? (
            <Link
              href={categoryHref}
              onClick={(e) => e.stopPropagation()}
              className="text-body text-dark-700 hover:text-orange transition-colors underline decoration-transparent hover:decoration-orange"
            >
              {category}
            </Link>
          ) : (
            <p className="text-body text-dark-700">{category}</p>
          ))}
        {brand &&
          (brandHref ? (
            <Link
              href={brandHref}
              onClick={(e) => e.stopPropagation()}
              className="text-body text-dark-700 hover:text-orange transition-colors underline decoration-transparent hover:decoration-orange"
            >
              {brand}
            </Link>
          ) : (
            <p className="text-body text-dark-700">{brand}</p>
          ))}
        {/* {meta && (
          <p className="mt-1 text-caption text-dark-700">
            {Array.isArray(meta) ? meta.join(" • ") : meta}
          </p>
        )} */}
      </div>
    </article>
  );

  return href ? (
    <Link
      href={href}
      aria-label={title}
      className="block h-full rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-[--color-dark-700]"
    >
      {content}
    </Link>
  ) : (
    content
  );
}
