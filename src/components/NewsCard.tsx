import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface NewsCardProps {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string | Date;
  category?: string;
  featured?: boolean;
  readingTime?: string;
}

function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function truncateText(text: string, maxLength: number = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function NewsCard({
  slug,
  title,
  description,
  imageUrl,
  date,
  category = "News",
  featured = false,
  readingTime,
}: NewsCardProps) {
  const formattedDate = formatDate(date);

  if (featured) {
    return (
      <Link href={`/news/${slug}`} className="group block">
        <article className="overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={imageUrl}
              alt={title}
              fill
              sizes="(min-width: 1280px) 1200px, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              priority
            />
          </div>
          <div className="p-8">
            <div className="mb-4 flex items-center gap-3 text-sm text-dark-700">
              <span>{formattedDate}</span>
              {readingTime && (
                <>
                  <span>•</span>
                  <span>{readingTime}</span>
                </>
              )}
            </div>
            <h2 className="mb-4 text-3xl font-bold text-dark-900 transition-colors group-hover:text-site-blue">
              {title}
            </h2>
            <p className="mb-6 text-base leading-relaxed text-dark-700">
              {truncateText(description, 200)}
            </p>
            <div className="inline-flex items-center gap-2 font-medium text-site-blue transition-colors group-hover:text-orange">
              Read More
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </article>
      </Link>
    );
  }

  return (
    <Link href={`/news/${slug}`} className="group block h-full">
      <article className="flex h-full flex-col overflow-hidden rounded-xl bg-white shadow transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1280px) 360px, (min-width: 768px) 45vw, 90vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        </div>
        <div className="flex flex-1 flex-col p-6">
          <div className="mb-3 flex items-center gap-3 text-sm text-dark-700">
            <span>{formattedDate}</span>
            {readingTime && (
              <>
                <span>•</span>
                <span>{readingTime}</span>
              </>
            )}
          </div>
          <h3 className="mb-3 text-xl font-bold text-dark-900 transition-colors group-hover:text-site-blue">
            {title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-dark-700">
            {truncateText(description)}
          </p>
          <div className="flex items-center gap-2 font-medium text-site-blue transition-colors group-hover:text-orange">
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
