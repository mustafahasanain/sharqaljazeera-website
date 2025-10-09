export interface NewsPost {
  id: string;
  slug: string; // URL-friendly version of the title
  title: string;
  description: string;
  imageUrl: string; // Main/featured image
  images?: string[]; // Additional images for the article
  date: Date;
  category?: string;
  author?: string;
  readingTime?: string;
}

export const newsData: NewsPost[] = [
  {
    id: "1",
    title: "The Evolution of POS: From Cash Registers to Smart Systems",
    slug: "the-evolution-of-pos-from-cash-registers-to-smart-systems",
    description:
      "From bulky registers to sleek, smart devices, POS systems have undergone a massive transformation, reflecting the needs of modern businesses.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-09"),
    category: "Innovation",
    author: "Henry Adams",
    readingTime: "5 mins read",
  },
  {
    id: "2",
    title: "POS Security Upgrades: Staying Ahead of Cyber Threats",
    slug: "pos-security-upgrades-staying-ahead-of-cyber-threats",
    description:
      "Cybersecurity is a growing concern. POS systems now incorporate advanced encryption and fraud detection to protect sensitive customer data.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-10"),
    category: "Cybersecurity",
    author: "Grace Howard",
    readingTime: "7 mins read",
  },
  {
    id: "3",
    title: "Omnichannel Success: Connecting In-Store and Online Sales",
    slug: "omnichannel-success-connecting-in-store-and-online-sales",
    description:
      "Today’s customers expect seamless experiences. POS systems integrate offline and online sales channels, creating a unified shopping journey.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-11"),
    category: "E-Commerce",
    author: "Oliver Scott",
    readingTime: "6 mins read",
  },
  {
    id: "4",
    title:
      "Cloud-Based POS: Flexibility and Accessibility for Modern Businesses",
    slug: "cloud-based-pos-flexibility-and-accessibility-for-modern-businesses",
    description:
      "Cloud-based POS systems offer the ability to access sales data from anywhere, ensuring flexibility and scalability for businesses on the move.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-12"),
    category: "Cloud Tech",
    author: "Amelia White",
    readingTime: "8 mins read",
  },
  {
    id: "5",
    title: "Sustainability Through POS: Going Paperless in Transactions",
    slug: "sustainability-through-pos-going-paperless-in-transactions",
    description:
      "Eco-friendly businesses are adopting digital receipts and paperless systems through POS technology, reducing waste while offering convenience to customers.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-13"),
    category: "Sustainability",
    author: "Ethan Ross",
    readingTime: "5 mins read",
  },
  {
    id: "6",
    title: "POS Systems in Hospitality: Enhancing the Guest Experience",
    slug: "pos-systems-in-hospitality-enhancing-the-guest-experience",
    description:
      "Restaurants, hotels, and cafes benefit greatly from POS systems that simplify ordering, billing, and customer service, leading to smoother operations and happier guests.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-14"),
    category: "Hospitality",
    author: "Sophia Carter",
    readingTime: "6 mins read",
  },
  {
    id: "7",
    title: "Inventory Made Simple: POS Systems as Stock Management Tools",
    slug: "inventory-made-simple-pos-systems-as-stock-management-tools",
    description:
      "Keeping track of inventory can be challenging, but advanced POS systems provide real-time insights into stock levels, helping businesses reduce waste and avoid shortages.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-15"),
    category: "Management",
    author: "Daniel Lee",
    readingTime: "7 mins read",
  },
  {
    id: "8",
    title: "POS Systems for Small Businesses: Affordable and Effective",
    slug: "pos-systems-for-small-businesses-affordable-and-effective",
    description:
      "Small businesses often face budget constraints, but modern POS systems offer cost-effective solutions that streamline operations and improve customer satisfaction.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-16"),
    category: "Small Business",
    author: "Maya Robinson",
    readingTime: "4 mins read",
  },
  {
    id: "9",
    title: "The Future of Payments: Contactless and Mobile POS Solutions",
    slug: "the-future-of-payments-contactless-and-mobile-pos-solutions",
    description:
      "With the rise of contactless payments and mobile wallets, POS systems are evolving to keep pace with consumer expectations, making transactions faster and more secure.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-17"),
    category: "Technology",
    author: "James Miller",
    readingTime: "5 mins read",
  },
  {
    id: "10",
    title: "Revolutionizing Retail: How POS Analytics Drive Growth",
    slug: "revolutionizing-retail-how-pos-analytics-drive-growth",
    description:
      "Modern POS systems are no longer limited to transaction handling—they provide valuable analytics that help businesses track sales, customer behavior, and growth opportunities.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-18"),
    category: "Business",
    author: "Laura Kent",
    readingTime: "6 mins read",
  },
];
