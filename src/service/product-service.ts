import { MOCK_PRODUCTS } from '@/constants/mock-data'
import type { Product, ProductFilterRequest, ProductListResponse } from '@/global-types'
import { apiClient } from '@/service/api-client'
import { API_ENDPOINTS } from '@/service/api-endpoints'

const applyFilter = (products: Product[], filter?: ProductFilterRequest): Product[] => {
  if (!filter) {
    return products
  }

  let result = [...products]

  if (filter.keyword) {
    const keyword = filter.keyword.toLowerCase()
    result = result.filter((product) => product.name.toLowerCase().includes(keyword))
  }

  if (filter.category) {
    result = result.filter((product) => product.category === filter.category)
  }

  if (filter.sortBy === 'price-asc') {
    result.sort((a, b) => a.price - b.price)
  }

  if (filter.sortBy === 'price-desc') {
    result.sort((a, b) => b.price - a.price)
  }

  if (filter.sortBy === 'rating-desc') {
    result.sort((a, b) => b.rating - a.rating)
  }

  return result
}

export const productService = {
  async fetchProducts(filter?: ProductFilterRequest): Promise<ProductListResponse> {
    try {
      const response = await apiClient.get<ProductListResponse>(API_ENDPOINTS.PRODUCTS, {
        params: filter,
      })
      return response.data
    } catch {
      return { products: applyFilter(MOCK_PRODUCTS, filter) }
    }
  },

  async fetchProductDetail(productId: string): Promise<Product> {
    try {
      const response = await apiClient.get<Product>(API_ENDPOINTS.PRODUCT_DETAIL(productId))
      return response.data
    } catch {
      const fallbackProduct = MOCK_PRODUCTS.find((product) => product.id === productId)

      if (fallbackProduct) {
        return fallbackProduct
      }

      throw new Error('Product not found')
    }
  },
}
