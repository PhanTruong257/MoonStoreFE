import type { Order, Product, UserProfile } from '@/global-types'

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 'p-1',
    name: 'Nebula Running Shoes',
    description: 'Breathable mesh sneakers for daily commute and gym.',
    category: 'shoes',
    imageUrl: '/images/products/product-1.jpg',
    gallery: ['/images/products/product-1.jpg', '/images/products/product-2.jpg'],
    price: 1290000,
    originalPrice: 1590000,
    stock: 20,
    rating: 4.7,
    variants: [
      { id: 'v-1', label: 'Size', value: '40', extraPrice: 0 },
      { id: 'v-2', label: 'Size', value: '41', extraPrice: 0 },
    ],
  },
  {
    id: 'p-2',
    name: 'Terra Urban Backpack',
    description: 'Water-resistant backpack with laptop compartment.',
    category: 'bags',
    imageUrl: '/images/products/product-2.jpg',
    gallery: ['/images/products/product-2.jpg', '/images/products/product-3.jpg'],
    price: 890000,
    stock: 36,
    rating: 4.5,
    variants: [{ id: 'v-3', label: 'Color', value: 'Black', extraPrice: 0 }],
  },
  {
    id: 'p-3',
    name: 'Aura Smart Bottle',
    description: 'Temperature indicator bottle with 12-hour insulation.',
    category: 'lifestyle',
    imageUrl: '/images/products/product-3.jpg',
    gallery: ['/images/products/product-3.jpg', '/images/products/product-1.jpg'],
    price: 490000,
    stock: 50,
    rating: 4.4,
    variants: [{ id: 'v-4', label: 'Color', value: 'Mint', extraPrice: 0 }],
  },
]

export const MOCK_USER: UserProfile = {
  id: 'u-1',
  name: 'Demo User',
  email: 'demo@shop.local',
  phone: '0900000000',
}

export const MOCK_ORDERS: Order[] = []
