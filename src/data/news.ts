export interface NewsPost {
  id: string;
  title: string;
  text: string;
  imageUrl: string;
  date: Date;
  category?: string;
  author?: string;
  readingTime?: string;
}

export const newsData: NewsPost[] = [
  {
    id: "1",
    title: "Unlocking Efficiency: The Power Of A Modern POS System",
    text: "In today's fast-paced business landscape, efficiency is key to success. From small local shops to large-scale enterprises, businesses are constantly seeking ways to streamline their operations and enhance customer experience. One powerful tool that has revolutionized the way businesses operate is the Point of Sale (POS) system.",
    imageUrl: "/news/news-1.webp",
    date: new Date("2024-04-20"),
    category: "News",
    author: "Sam Brick",
    readingTime: "8 mins read",
  },
  {
    id: "2",
    title:
      "Beyond Transactions: Unlocking the Full Potential of Your POS System",
    text: "In the ever-evolving landscape of modern operations, a Point of Sale (POS) system serves as more than just a transactional tool. It's a gateway to unlocking the full potential of your business, offering insights, efficiency, and enhanced customer experiences.",
    imageUrl: "/news/news-2.jpg",
    date: new Date("2024-04-20"),
    category: "Yuri Sawyer",
    author: "Yuri Sawyer",
    readingTime: "5 mins read",
  },
  {
    id: "3",
    title:
      "From Brick-and-Mortar to Online Storefront: Integrating Your POS with E-Commerce",
    text: "In the digital age, the line between physical and online retail continues to blur. Businesses that once relied solely on brick-and-mortar stores are now expanding their reach into the realm of e-commerce.",
    imageUrl: "/news/news-3.jpg",
    date: new Date("2024-04-20"),
    category: "Yuri Sawyer",
    author: "Yuri Sawyer",
    readingTime: "6 mins read",
  },
  {
    id: "4",
    title: "Security First: Protecting Your Business with Advanced POS Systems",
    text: "In an era where data breaches and cyber threats are increasingly common, safeguarding sensitive information has become paramount for businesses of all sizes. One of the primary functions of a POS system is to process transactions and handle customer data.",
    imageUrl: "/news/news-4.jpg",
    date: new Date("2024-04-19"),
    category: "Andrew Foxxie",
    author: "Andrew Foxxie",
    readingTime: "7 mins read",
  },
];
