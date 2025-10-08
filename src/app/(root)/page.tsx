import { Card } from "@/components";
import HeroSlider from "@/components/HeroSlider";
import { getCurrentUser } from "@/lib/auth/actions";
import { getProducts } from "@/data/products";

export const dynamic = "force-dynamic";

const Home = async () => {
  const { products } = getProducts({ sort: "newest", limit: 4 });

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest" className="pb-12">
        <HeroSlider />

        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Latest Products
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card
              key={p.id}
              title={p.name}
              imageSrc={p.imageSrc}
              price={p.variants[0]?.salePrice || p.variants[0]?.price || 0}
              badge={p.badge}
              href={`/products/${p.id}`}
              titleSize="small"
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
