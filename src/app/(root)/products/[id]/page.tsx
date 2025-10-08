import { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductVariant } from "@/components/ProductGallery";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import ProductCard from "@/components/ProductCard";

// Mock product data
interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  compareAtPrice?: number;
  description: string;
  rating: number;
  reviewCount: number;
  variants: ProductVariant[];
  sizes: string[];
  availableSizes: string[];
  details: {
    features: string[];
    specifications: string[];
  };
  badge?: { label: string; tone: "red" | "green" | "orange" };
}

const MOCK_PRODUCTS: Record<string, Product> = {
  "1": {
    id: "1",
    name: "Nike Air Max Pulse",
    category: "Men's Shoes",
    price: 140,
    compareAtPrice: undefined,
    description:
      "The Air Max Pulse stays true to its running roots with the iconic Waffle sole, stitched overlays and classic TPU details. Classic colors celebrate your fresh look while Max Air cushioning adds comfort to the journey.",
    rating: 5,
    reviewCount: 10,
    badge: { label: "Extra 20% off w/ code SPORT", tone: "green" },
    variants: [
      {
        color: "Red/White",
        images: ["/products/product-1.png"],
      },
      {
        color: "Blue/White",
        images: ["/products/product-2.png"],
      },
      {
        color: "Black/White",
        images: ["/products/product-3.png"],
      },
      {
        color: "Grey/White",
        images: ["/products/product-4.png"],
      },
      {
        color: "White/Black",
        images: ["/products/product-1.png"],
      },
      {
        color: "Light Grey",
        images: ["/products/product-2.png"],
      },
    ],
    sizes: [
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
      "10",
      "10.5",
      "11",
      "11.5",
      "12",
    ],
    availableSizes: [
      "5",
      "5.5",
      "6",
      "6.5",
      "7",
      "7.5",
      "8",
      "8.5",
      "9",
      "9.5",
    ],
    details: {
      features: [
        "Padded collar",
        "Foam midsole",
        "Shown: Dark Team Red/Pearl Pink/Pure Platinum/White",
        "Style: HM9451-600",
      ],
      specifications: [
        "Waffle outsole adds traction and durability",
        "Max Air unit in the heel provides cushioning",
        "Rubber toe tip adds durability",
      ],
    },
  },
  "2": {
    id: "2",
    name: "Nike Air Zoom",
    category: "Men's Shoes",
    price: 129.99,
    compareAtPrice: undefined,
    description:
      "The Air Zoom delivers a responsive ride with Zoom Air cushioning in the forefoot. Lightweight and breathable, perfect for speed training and race day.",
    rating: 4,
    reviewCount: 8,
    badge: { label: "Hot", tone: "red" },
    variants: [
      {
        color: "Blue/White",
        images: ["/products/product-2.png"],
      },
      {
        color: "Black/White",
        images: ["/products/product-3.png"],
      },
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    availableSizes: ["6", "7", "8", "9", "10"],
    details: {
      features: [
        "Zoom Air cushioning",
        "Breathable mesh upper",
        "Lightweight design",
        "Style: ZM2345-100",
      ],
      specifications: [
        "Rubber outsole for durability",
        "Responsive cushioning",
        "Secure fit system",
      ],
    },
  },
  "3": {
    id: "3",
    name: "Nike InfinityRN 4",
    category: "Men's Shoes",
    price: 159.99,
    compareAtPrice: undefined,
    description:
      "InfinityRN 4 delivers soft, stable cushioning with Nike React technology. Designed for runners seeking a plush ride that minimizes injury risk.",
    rating: 5,
    reviewCount: 15,
    badge: { label: "Trending", tone: "green" },
    variants: [
      {
        color: "Black/White",
        images: ["/products/product-3.png"],
      },
      {
        color: "Red/White",
        images: ["/products/product-1.png"],
      },
    ],
    sizes: ["7", "8", "9", "10", "11", "12"],
    availableSizes: ["7", "8", "9", "10", "11"],
    details: {
      features: [
        "Nike React foam",
        "Soft and stable cushioning",
        "Flyknit upper",
        "Style: IR4-789",
      ],
      specifications: [
        "Enhanced stability",
        "Breathable construction",
        "Durable outsole",
      ],
    },
  },
  "4": {
    id: "4",
    name: "Nike Metcon 9",
    category: "Men's Shoes",
    price: 139.99,
    compareAtPrice: undefined,
    description:
      "Metcon 9 is built for high-intensity training with a wide, flat heel for stability during lifts and responsive cushioning for cardio workouts.",
    rating: 4,
    reviewCount: 12,
    variants: [
      {
        color: "Grey/White",
        images: ["/products/product-4.png"],
      },
      {
        color: "Blue/White",
        images: ["/products/product-2.png"],
      },
    ],
    sizes: ["6", "7", "8", "9", "10", "11", "12"],
    availableSizes: ["6", "7", "8", "9", "10", "11"],
    details: {
      features: [
        "Wide, flat heel",
        "Responsive foam",
        "Durable construction",
        "Style: MT9-456",
      ],
      specifications: [
        "Stability for lifting",
        "Flexibility for cardio",
        "Reinforced toe",
      ],
    },
  },
};

// Related products for "You Might Also Like"
const RELATED_PRODUCTS = [
  {
    id: "2",
    title: "Nike Air Zoom",
    category: "Men's Shoes",
    brand: "Nike",
    price: 129.99,
    imageSrc: "/products/product-2.png",
  },
  {
    id: "3",
    title: "Nike InfinityRN 4",
    category: "Men's Shoes",
    brand: "Nike",
    price: 159.99,
    imageSrc: "/products/product-3.png",
  },
  {
    id: "4",
    title: "Nike Metcon 9",
    category: "Men's Shoes",
    brand: "Nike",
    price: 139.99,
    imageSrc: "/products/product-4.png",
  },
];

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const product = MOCK_PRODUCTS[params.id];

  if (!product) {
    return {
      title: "Product Not Found",
    };
  }

  return {
    title: `${product.name} - ${product.category}`,
    description: product.description,
  };
}

export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const product = MOCK_PRODUCTS[params.id];

  if (!product) {
    notFound();
  }

  const discountPercent = product.compareAtPrice
    ? Math.round(
        ((product.compareAtPrice - product.price) / product.compareAtPrice) *
          100
      )
    : 0;

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Product Section */}
      <ProductDetailsClient product={product} />

      {/* You Might Also Like Section */}
      <section className="mt-16" aria-labelledby="related-products-heading">
        <h2
          id="related-products-heading"
          className="mb-8 text-heading-2 text-dark-900"
        >
          You Might Also Like
        </h2>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {RELATED_PRODUCTS.map((relatedProduct) => (
            <ProductCard
              key={relatedProduct.id}
              title={relatedProduct.title}
              category={relatedProduct.category}
              brand={relatedProduct.brand}
              imageSrc={relatedProduct.imageSrc}
              price={relatedProduct.price}
              href={`/products/${relatedProduct.id}`}
              categoryHref={`/shop?categories=${relatedProduct.category}`}
              brandHref={`/shop?brands=${relatedProduct.brand}`}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
