import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  cart: null,
  itemCount: 0,
  loading: false,
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload
      state.itemCount = action.payload?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
    },
    clearCart: (state) => {
      state.cart = null
      state.itemCount = 0
    },
    setCartLoading: (state, action) => { state.loading = action.payload },
    incrementItemCount: (state) => { state.itemCount += 1 },
  },
})

export const { setCart, clearCart, setCartLoading, incrementItemCount } = cartSlice.actions
export default cartSlice.reducer
