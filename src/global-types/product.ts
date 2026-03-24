export interface ProductVariant {
  id: string
  label: string
  value: string
  extraPrice: number
}

export interface Product {
  id: string
  name: string
  description: string
  category: string
  imageUrl: string
  gallery: string[]
  price: number
  originalPrice?: number
  stock: number
  rating: number
  variants: ProductVariant[]
}

export interface ProductFilterRequest {
  keyword?: string
  category?: string
  sortBy?: 'price-asc' | 'price-desc' | 'rating-desc'
}

export interface ProductListResponse {
  products: Product[]
}
