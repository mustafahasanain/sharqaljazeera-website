import { Card } from "@/components";
import HeroSlider from "@/components/HeroSlider";
import { getCurrentUser } from "@/lib/auth/actions";

export const dynamic = 'force-dynamic';

const products = [
  {
    id: 1,
    title: "Air Max Pulse",
    subtitle: "Men's Shoes",
    meta: "6 Colour",
    price: 149.99,
    imageSrc: "/products/product-1.png",
    badge: { label: "New", tone: "orange" as const },
  },
  {
    id: 2,
    title: "Air Zoom",
    subtitle: "Men's Shoes",
    meta: "4 Colour",
    price: 129.99,
    imageSrc: "/products/product-2.png",
    badge: { label: "Hot", tone: "red" as const },
  },
  {
    id: 3,
    title: "InfinityRN 4",
    subtitle: "Men's Shoes",
    meta: "6 Colour",
    price: 159.99,
    imageSrc: "/products/product-3.png",
    badge: { label: "Trending", tone: "green" as const },
  },
  {
    id: 4,
    title: "Metcon 9",
    subtitle: "Men's Shoes",
    meta: "3 Colour",
    price: 139.99,
    imageSrc: "/products/product-4.png",
  },
];

const Home = async () => {
  const user = await getCurrentUser();
  console.log("USER:", user);

  return (
    <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      <section aria-labelledby="latest" className="pb-12">
        {/* <div className="rounded"> */}
        <HeroSlider />
        {/* </div> */}

        <h2 id="latest" className="mb-6 text-heading-3 text-dark-900">
          Latest Products
        </h2>
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {products.map((p) => (
            <Card
              key={p.id}
              title={p.title}
              subtitle={p.subtitle}
              meta={p.meta}
              imageSrc={p.imageSrc}
              price={p.price}
              badge={p.badge}
              href={`/products/${p.id}`} // Individual product detail page
            />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Home;
