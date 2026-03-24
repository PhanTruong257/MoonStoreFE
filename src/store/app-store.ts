import { configureStore } from '@reduxjs/toolkit'

import { STORAGE_KEYS } from '@/constants/storage-keys'
import type { CartState } from '@/global-types'
import { authReducer } from '@/store/slices/auth-slice'
import { cartReducer, hydrateCart } from '@/store/slices/cart-slice'
import { orderReducer } from '@/store/slices/order-slice'
import { productReducer } from '@/store/slices/product-slice'
import { uiReducer } from '@/store/slices/ui-slice'

const loadCartFromStorage = (): CartState => {
  const raw = localStorage.getItem(STORAGE_KEYS.CART)

  if (!raw) {
    return { items: [] }
  }

  try {
    return JSON.parse(raw) as CartState
  } catch {
    return { items: [] }
  }
}

export const appStore = configureStore({
  reducer: {
    auth: authReducer,
    product: productReducer,
    cart: cartReducer,
    order: orderReducer,
    ui: uiReducer,
  },
})

appStore.dispatch(hydrateCart(loadCartFromStorage()))

appStore.subscribe(() => {
  const cartState = appStore.getState().cart
  localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartState))
})

export type RootState = ReturnType<typeof appStore.getState>
export type AppDispatch = typeof appStore.dispatch
