export interface Offer {
  id: number;
  slug: string;
  title: string;
  description: string;
  imageUrl: string;
  date: Date;
}

export const offersData: Offer[] = [
  {
    id: 1,
    slug: "summer-networking-package",
    title: "Summer Networking Package",
    description:
      "Get up to 30% off on enterprise networking equipment including switches, routers, and access points. Perfect for businesses looking to upgrade their infrastructure.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-03-15"),
  },
  {
    id: 2,
    slug: "wireless-solution-bundle",
    title: "Wireless Solution Bundle",
    description:
      "Complete wireless networking solution with installation and configuration included. Ideal for medium to large office spaces with up to 500 users.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-03-10"),
  },
  {
    id: 3,
    slug: "security-system-upgrade",
    title: "Security System Upgrade",
    description:
      "Upgrade your network security with our comprehensive package including firewalls, VPN solutions, and 24/7 monitoring support at special rates.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-03-05"),
  },
  {
    id: 4,
    slug: "fiber-optic-installation",
    title: "Fiber Optic Installation",
    description:
      "Limited time offer on fiber optic cable installation services. Get high-speed connectivity with professional installation and testing included.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-02-28"),
  },
  {
    id: 5,
    slug: "maintenance-contract-deal",
    title: "Annual Maintenance Contract",
    description:
      "Subscribe to our annual maintenance service and get 3 months free. Includes regular checkups, priority support, and replacement parts coverage.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-02-20"),
  },
  {
    id: 6,
    slug: "voip-communication-package",
    title: "VoIP Communication Package",
    description:
      "Transform your business communication with our VoIP solution. Package includes hardware, software licensing, and setup at discounted prices.",
    imageUrl: "/offers/network-offer.webp",
    date: new Date("2024-02-15"),
  },
];
