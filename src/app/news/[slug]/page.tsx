import { newsData } from "@/data/news";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  Clock,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { notFound } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import NewsCard from "@/components/NewsCard";
import ImageGallery from "@/components/ImageGallery";

interface NewsPostPageProps {
  params: Promise<{
    slug: string;
  }>;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export async function generateStaticParams() {
  return newsData.map((post) => ({
    slug: post.slug,
  }));
}

export default async function NewsPostPage({ params }: NewsPostPageProps) {
  const { slug } = await params;
  const post = newsData.find((p) => p.slug === slug);

  if (!post) {
    notFound();
  }

  // Get sorted news posts (same order as news page - newest first)
  const sortedPosts = [...newsData].sort(
    (a, b) => b.date.getTime() - a.date.getTime()
  );
  const currentIndex = sortedPosts.findIndex((p) => p.slug === slug);

  // Get previous and next posts
  const previousPost = currentIndex > 0 ? sortedPosts[currentIndex - 1] : null;
  const nextPost =
    currentIndex < sortedPosts.length - 1
      ? sortedPosts[currentIndex + 1]
      : null;

  // Get related posts (exclude current post, max 3)
  const relatedPosts = newsData.filter((p) => p.slug !== slug).slice(0, 3);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button */}
        <Link
          href="/news"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-dark-700 transition-colors hover:text-dark-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to News
        </Link>

        {/* Article Container */}
        <article className="mx-auto max-w-4xl">
          {/* Title */}
          <h1 className="mb-6 text-4xl font-bold leading-tight text-dark-900 sm:text-5xl">
            {post.title}
          </h1>

          {/* Metadata */}
          <div className="mb-8 flex flex-wrap items-center gap-4 border-b border-light-300 pb-6 text-sm text-dark-700">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(post.date)}</span>
            </div>
            {post.readingTime && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                <span>{post.readingTime}</span>
              </div>
            )}
          </div>

          {/* Hero Image */}
          <div className="mb-10 overflow-hidden rounded-2xl">
            <div className="relative aspect-[16/9]">
              <Image
                src={post.imageUrl}
                alt={post.title}
                fill
                sizes="(min-width: 1024px) 896px, 90vw"
                className="object-cover"
                priority
              />
            </div>
          </div>

          {/* Article Content */}
          <div className="prose prose-lg max-w-none">
            <p className="text-lg leading-relaxed text-dark-800">
              {post.description}
            </p>
          </div>

          {/* Additional Images Gallery */}
          {post.images && post.images.length > 0 && (
            <div className="mt-12 border-t border-light-300 pt-12">
              <h2 className="mb-6 text-2xl font-bold text-dark-900">
                Image Gallery
              </h2>
              <ImageGallery images={post.images} title={post.title} />
            </div>
          )}
        </article>

        {/* Post Navigation */}
        <div className="mx-auto mt-16 max-w-4xl border-t border-light-300 pt-12">
          <div className="grid gap-8 md:grid-cols-2">
            {/* Previous Post */}
            {previousPost ? (
              <Link
                href={`/news/${previousPost.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-light-300 p-6 transition-all hover:border-blue-600 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-100 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  <ChevronLeft className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="mb-1 text-sm text-dark-600">Previous Post</p>
                  <h3 className="font-semibold text-dark-900 transition-colors group-hover:text-blue-600">
                    {previousPost.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div />
            )}

            {/* Next Post */}
            {nextPost ? (
              <Link
                href={`/news/${nextPost.slug}`}
                className="group flex items-start gap-4 rounded-xl border border-light-300 p-6 transition-all hover:border-blue-600 hover:shadow-md md:text-right"
              >
                <div className="flex-1 md:order-1">
                  <p className="mb-1 text-sm text-dark-600">Next Post</p>
                  <h3 className="font-semibold text-dark-900 transition-colors group-hover:text-blue-600">
                    {nextPost.title}
                  </h3>
                </div>
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-light-100 transition-colors group-hover:bg-blue-600 group-hover:text-white md:order-2">
                  <ChevronRight className="h-5 w-5" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>

        {/* Related Articles */}
        {relatedPosts.length > 0 && (
          <section className="mx-auto mt-20 max-w-7xl border-t border-light-300 pt-16">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-dark-900">
                Related Articles
              </h2>
              <p className="mt-2 text-dark-700">
                Continue exploring our latest insights
              </p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPosts.map((relatedPost) => (
                <NewsCard
                  key={relatedPost.id}
                  slug={relatedPost.slug}
                  title={relatedPost.title}
                  description={relatedPost.description}
                  imageUrl={relatedPost.imageUrl}
                  date={relatedPost.date}
                  readingTime={relatedPost.readingTime}
                />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
