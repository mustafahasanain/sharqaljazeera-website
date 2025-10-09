import OfferCard from "@/components/OfferCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { offersData } from "@/data/offers";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Offers",
};

export default function OffersPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {/* Page Header */}
        <section className="mb-12">
          <h1 className="mb-4 text-4xl font-bold text-dark-900 md:text-5xl">
            Special Offers
          </h1>
          <p className="text-lg text-dark-700">
            Discover our latest deals and exclusive packages
          </p>
        </section>

        {/* Offers List */}
        <section>
          <div className="flex flex-col gap-6">
            {offersData.map((offer) => (
              <OfferCard
                key={offer.id}
                slug={offer.slug}
                title={offer.title}
                description={offer.description}
                imageUrl={offer.imageUrl}
                date={offer.date}
              />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
