import type { CheckoutRequest, ProductFilterRequest } from '@/global-types'
import { authService } from '@/service/auth-service'
import { orderService } from '@/service/order-service'
import { productService } from '@/service/product-service'
import type { AppDispatch, RootState } from '@/store/app-store'
import { addCartItem, clearCart } from '@/store/slices/cart-slice'
import { setLatestOrder, setOrderLoading, setOrders } from '@/store/slices/order-slice'
import { setProductLoading, setProducts, setSelectedProduct } from '@/store/slices/product-slice'
import { setGlobalLoading } from '@/store/slices/ui-slice'
import {
  calculateDiscount,
  calculateGrandTotal,
  calculateShippingFee,
  calculateSubtotal,
} from '@/utils/cart-calculations'

export const fetchProductsThunk = (filter?: ProductFilterRequest) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setProductLoading(true))

    try {
      const response = await productService.fetchProducts(filter)
      dispatch(setProducts(response.products))
    } finally {
      dispatch(setProductLoading(false))
    }
  }
}

export const fetchProductDetailThunk = (productId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(setProductLoading(true))

    try {
      const product = await productService.fetchProductDetail(productId)
      dispatch(setSelectedProduct(product))
    } finally {
      dispatch(setProductLoading(false))
    }
  }
}

export const addToCartThunk = (request: {
  productId: string
  quantity: number
  selectedVariant?: string
}) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const product = getState().product.products.find((item) => item.id === request.productId)

    if (!product) {
      return
    }

    dispatch(
      addCartItem({
        productId: product.id,
        name: product.name,
        imageUrl: product.imageUrl,
        price: product.price,
        quantity: request.quantity,
        selectedVariant: request.selectedVariant,
      }),
    )
  }
}

export const checkoutThunk = (customer: CheckoutRequest) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const { cart } = getState()
    const subtotal = calculateSubtotal(cart.items)
    const shippingFee = calculateShippingFee(subtotal, customer.shippingMethod)
    const discount = calculateDiscount(subtotal, cart.couponCode)
    const total = calculateGrandTotal(subtotal, shippingFee, discount)

    dispatch(setGlobalLoading(true))
    dispatch(setOrderLoading(true))

    try {
      const response = await orderService.checkout({
        customer,
        items: cart.items,
        subtotal,
        shippingFee,
        discount,
        total,
      })
      dispatch(setLatestOrder(response.order))
      dispatch(clearCart())
    } finally {
      dispatch(setGlobalLoading(false))
      dispatch(setOrderLoading(false))
    }
  }
}

export const fetchOrderHistoryThunk = () => {
  return async (dispatch: AppDispatch) => {
    dispatch(setOrderLoading(true))

    try {
      const orders = await orderService.getOrderHistory()
      dispatch(setOrders(orders))
    } finally {
      dispatch(setOrderLoading(false))
    }
  }
}

export const logoutThunk = () => {
  return async () => {
    authService.logout()
  }
}
