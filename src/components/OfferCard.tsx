import Image from "next/image";
import Link from "next/link";
import { Calendar, ArrowRight } from "lucide-react";

export interface OfferCardProps {
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  date: string | Date;
}

function formatDate(date: string | Date): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;
  return dateObj.toLocaleDateString("en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncateText(text: string, maxLength: number = 180): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + "...";
}

export default function OfferCard({
  slug,
  title,
  description,
  imageUrl,
  date,
}: OfferCardProps) {
  const formattedDate = formatDate(date);

  return (
    <Link href={`/offers/${slug}`} className="group block">
      <article className="relative flex flex-col overflow-hidden rounded-2xl border border-light-300 bg-gradient-to-br from-white to-light-200 transition-all hover:border-site-blue hover:shadow-2xl md:flex-row">
        {/* Image Section */}
        <div className="relative h-64 w-full overflow-hidden md:h-auto md:w-2/5">
          <Image
            src={imageUrl}
            alt={title}
            fill
            sizes="(min-width: 768px) 40vw, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-dark-900/50 to-transparent md:bg-gradient-to-r"></div>
        </div>

        {/* Content Section */}
        <div className="flex flex-1 flex-col justify-between p-6 md:p-8">
          <div>
            <div className="mb-4 flex items-center gap-2 text-sm text-dark-700">
              <Calendar className="h-4 w-4" />
              <span>{formattedDate}</span>
            </div>

            <h3 className="mb-4 text-2xl font-bold leading-tight text-dark-900 transition-colors group-hover:text-site-blue md:text-3xl">
              {title}
            </h3>

            <p className="mb-6 text-base leading-relaxed text-dark-700">
              {truncateText(description)}
            </p>
          </div>

          <div className="flex items-center justify-between">
            <span className="inline-flex items-center gap-2 font-semibold text-site-blue transition-all group-hover:gap-4 group-hover:text-orange">
              Discover Offer
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-2" />
            </span>
          </div>
        </div>

        {/* Decorative Element */}
        <div className="absolute right-0 top-0 h-24 w-24 translate-x-12 -translate-y-12 rounded-full bg-orange/10 blur-2xl transition-all group-hover:translate-x-8 group-hover:-translate-y-8 group-hover:bg-site-blue/20"></div>
      </article>
    </Link>
  );
}
