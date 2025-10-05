import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export interface NewsCardProps {
  id: string;
  title: string;
  text: string;
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
  id,
  title,
  text,
  imageUrl,
  date,
  category = "News",
  featured = false,
  readingTime,
}: NewsCardProps) {
  const formattedDate = formatDate(date);

  if (featured) {
    return (
      <article className="group relative overflow-hidden rounded-2xl bg-white shadow-lg transition-shadow hover:shadow-xl">
        <div className="relative aspect-[16/9] overflow-hidden">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 1280px) 1200px, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            priority
          />
        </div>
        <div className="p-8">
          <div className="mb-4 flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-sm font-medium text-white">
              {category}
            </span>
            {readingTime && (
              <span className="text-sm text-dark-700">{readingTime}</span>
            )}
          </div>
          <h2 className="mb-4 text-3xl font-bold text-dark-900 transition-colors group-hover:text-blue-600">
            {title}
          </h2>
          <p className="mb-6 text-base leading-relaxed text-dark-700">
            {truncateText(text, 200)}
          </p>
          <Link
            href={`/news/${id}`}
            className="inline-flex items-center gap-2 font-medium text-blue-600 transition-colors hover:text-blue-700"
          >
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </article>
    );
  }

  return (
    <Link href={`/news/${id}`} className="group block h-full">
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
          <div className="mb-3 flex items-center justify-between gap-2">
            <span className="text-sm font-medium text-orange-600">
              {category}
            </span>
            <span className="text-sm text-dark-700">{formattedDate}</span>
          </div>
          <h3 className="mb-3 text-xl font-bold text-dark-900 transition-colors group-hover:text-blue-600">
            {title}
          </h3>
          <p className="mb-4 flex-1 text-sm leading-relaxed text-dark-700">
            {truncateText(text)}
          </p>
          <div className="flex items-center gap-2 font-medium text-blue-600 transition-colors group-hover:text-blue-700">
            Read More
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </div>
        </div>
      </article>
    </Link>
  );
}
