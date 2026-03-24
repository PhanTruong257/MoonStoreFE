import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Product, ProductFilterRequest } from '@/global-types'

interface ProductState {
  products: Product[]
  selectedProduct?: Product
  filter: ProductFilterRequest
  loading: boolean
}

const initialState: ProductState = {
  products: [],
  filter: {},
  loading: false,
}

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload
    },
    setSelectedProduct: (state, action: PayloadAction<Product | undefined>) => {
      state.selectedProduct = action.payload
    },
    setProductFilter: (state, action: PayloadAction<ProductFilterRequest>) => {
      state.filter = action.payload
    },
    setProductLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setProducts, setSelectedProduct, setProductFilter, setProductLoading } =
  productSlice.actions
export const productReducer = productSlice.reducer
