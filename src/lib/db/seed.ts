import { db } from './index';
import { products } from './schema';

async function seed() {
  console.log('Seeding database...');

  const sampleProducts = [
    {
      name: 'Wireless Headphones',
      description: 'High-quality wireless headphones with noise cancellation',
      price: '149.99',
      imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500',
    },
    {
      name: 'Smart Watch',
      description: 'Feature-packed smartwatch with fitness tracking',
      price: '299.99',
      imageUrl: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500',
    },
    {
      name: 'Laptop Stand',
      description: 'Ergonomic aluminum laptop stand for better posture',
      price: '49.99',
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=500',
    },
    {
      name: 'Mechanical Keyboard',
      description: 'Premium mechanical keyboard with RGB backlighting',
      price: '129.99',
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=500',
    },
    {
      name: 'USB-C Hub',
      description: '7-in-1 USB-C hub with HDMI and card reader',
      price: '39.99',
      imageUrl: 'https://images.unsplash.com/photo-1625948515291-69613efd103f?w=500',
    },
    {
      name: 'Webcam HD',
      description: '1080p HD webcam with auto-focus and built-in mic',
      price: '79.99',
      imageUrl: 'https://images.unsplash.com/photo-1585507252242-11fe632c26e8?w=500',
    },
  ];

  await db.insert(products).values(sampleProducts);

  console.log('Seeding completed!');
  process.exit(0);
}

seed().catch((error) => {
  console.error('Error seeding database:', error);
  process.exit(1);
});
