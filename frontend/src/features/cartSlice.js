import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getCart,
  addCartItem,
  updateCartItem,
  removeCartItem,
  clearCart as clearCartApi,
} from '../api/cartApi';
import { getErrorMessage } from '../utils/formatters';

export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue }) => {
    try {
      return await getCart();
    } catch (error) {
      if (error?.response?.status === 401) return null;
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ foodItemId, quantity = 1 }, { rejectWithValue }) => {
    try {
      return await addCartItem(foodItemId, quantity);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const updateCartItemQty = createAsyncThunk(
  'cart/updateCartItemQty',
  async ({ id, quantity }, { rejectWithValue }) => {
    try {
      return await updateCartItem(id, quantity);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (id, { rejectWithValue }) => {
    try {
      return await removeCartItem(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue }) => {
    try {
      await clearCartApi();
      return null;
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: null,
    loading: false,
    error: null,
  },
  reducers: {
    resetCartError: (state) => {
      state.error = null;
    },
    clearCartState: (state) => {
      state.cart = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const setCart = (state, action) => {
      state.cart = action.payload;
      state.loading = false;
    };

    builder
      .addCase(fetchCart.pending, (state) => { state.loading = true; })
      .addCase(fetchCart.fulfilled, setCart)
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(addToCart.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addToCart.fulfilled, setCart)
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateCartItemQty.fulfilled, setCart)
      .addCase(removeFromCart.fulfilled, setCart)
      .addCase(clearCart.fulfilled, (state) => {
        state.cart = null;
        state.loading = false;
      });
  },
});

export const { resetCartError, clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
