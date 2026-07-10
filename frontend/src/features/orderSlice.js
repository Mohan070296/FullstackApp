import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { placeOrder, getOrders, getOrder, cancelOrder } from '../api/orderApi';
import { getErrorMessage } from '../utils/formatters';

export const placeOrderAction = createAsyncThunk(
  'order/placeOrder',
  async (deliveryAddress, { rejectWithValue }) => {
    try {
      return await placeOrder(deliveryAddress);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'order/fetchOrders',
  async ({ page = 0, size = 10 } = {}, { rejectWithValue }) => {
    try {
      return await getOrders(page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  'order/fetchOrderById',
  async (id, { rejectWithValue }) => {
    try {
      return await getOrder(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const cancelOrderAction = createAsyncThunk(
  'order/cancelOrder',
  async (id, { rejectWithValue }) => {
    try {
      return await cancelOrder(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const orderSlice = createSlice({
  name: 'order',
  initialState: {
    orders: [],
    currentOrder: null,
    pagination: { page: 0, totalPages: 0, totalElements: 0 },
    loading: false,
    error: null,
  },
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrderAction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(placeOrderAction.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(placeOrderAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchOrders.pending, (state) => { state.loading = true; })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
      })
      .addCase(cancelOrderAction.fulfilled, (state, action) => {
        state.currentOrder = action.payload;
        state.orders = state.orders.map((o) =>
          o.id === action.payload.id ? action.payload : o
        );
      });
  },
});

export const { clearCurrentOrder } = orderSlice.actions;
export default orderSlice.reducer;
