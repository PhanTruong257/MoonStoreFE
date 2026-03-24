import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { CartItem, CartState } from '@/global-types'

const initialState: CartState = {
  items: [],
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    hydrateCart: (_, action: PayloadAction<CartState>) => action.payload,
    addCartItem: (state, action: PayloadAction<CartItem>) => {
      const index = state.items.findIndex(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedVariant === action.payload.selectedVariant,
      )

      if (index >= 0) {
        state.items[index].quantity += action.payload.quantity
      } else {
        state.items.push(action.payload)
      }
    },
    updateCartQuantity: (
      state,
      action: PayloadAction<{ productId: string; quantity: number; selectedVariant?: string }>,
    ) => {
      const target = state.items.find(
        (item) =>
          item.productId === action.payload.productId &&
          item.selectedVariant === action.payload.selectedVariant,
      )

      if (target) {
        target.quantity = Math.max(action.payload.quantity, 1)
      }
    },
    removeCartItem: (
      state,
      action: PayloadAction<{ productId: string; selectedVariant?: string }>,
    ) => {
      state.items = state.items.filter(
        (item) =>
          !(
            item.productId === action.payload.productId &&
            item.selectedVariant === action.payload.selectedVariant
          ),
      )
    },
    applyCoupon: (state, action: PayloadAction<string>) => {
      state.couponCode = action.payload
    },
    clearCart: (state) => {
      state.items = []
      state.couponCode = undefined
    },
  },
})

export const {
  hydrateCart,
  addCartItem,
  updateCartQuantity,
  removeCartItem,
  applyCoupon,
  clearCart,
} = cartSlice.actions
export const cartReducer = cartSlice.reducer
