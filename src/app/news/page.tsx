import { NewsCard } from "@/components";
import { newsData } from "@/data/news";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function NewsPage() {
  // Get all news posts ordered by date (newest first)
  const newsPosts = [...newsData].sort((a, b) => b.date.getTime() - a.date.getTime());

  // Separate featured post (most recent) from the rest
  const [featuredPost, ...recentPosts] = newsPosts;

  return (
    <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      {/* Featured News Section */}
      {featuredPost && (
        <section className="mb-16">
          <NewsCard
            id={featuredPost.id}
            title={featuredPost.title}
            text={featuredPost.text}
            imageUrl={featuredPost.imageUrl}
            date={featuredPost.date}
            featured
            readingTime="8 mins read"
          />
        </section>
      )}

      {/* Recent Articles Section */}
      {recentPosts.length > 0 && (
        <section>
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold text-dark-900">
                Our Recent Articles
              </h2>
              <p className="mt-2 text-dark-700">
                Stay Informed with Our Latest Insights
              </p>
            </div>
            <div className="flex gap-2">
              <button
                className="rounded-full border border-light-300 p-2 transition-colors hover:border-dark-900 hover:bg-light-100"
                aria-label="Previous articles"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              <button
                className="rounded-full border border-light-300 p-2 transition-colors hover:border-dark-900 hover:bg-light-100"
                aria-label="Next articles"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recentPosts.map((post) => (
              <NewsCard
                key={post.id}
                id={post.id}
                title={post.title}
                text={post.text}
                imageUrl={post.imageUrl}
                date={post.date}
              />
            ))}
          </div>
        </section>
      )}

      {/* Empty State */}
      {newsPosts.length === 0 && (
        <div className="flex min-h-[400px] flex-col items-center justify-center rounded-xl border-2 border-dashed border-light-300 bg-light-50 px-4 py-16">
          <p className="text-xl font-medium text-dark-700">
            No news articles yet
          </p>
          <p className="mt-2 text-dark-600">
            Check back later for the latest updates
          </p>
        </div>
      )}
    </main>
  );
}
