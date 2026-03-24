import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { Order } from '@/global-types'

interface OrderState {
  orders: Order[]
  latestOrder?: Order
  loading: boolean
}

const initialState: OrderState = {
  orders: [],
  loading: false,
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrders: (state, action: PayloadAction<Order[]>) => {
      state.orders = action.payload
    },
    setLatestOrder: (state, action: PayloadAction<Order | undefined>) => {
      state.latestOrder = action.payload
    },
    setOrderLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload
    },
  },
})

export const { setOrders, setLatestOrder, setOrderLoading } = orderSlice.actions
export const orderReducer = orderSlice.reducer
