import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { generateQr, getPaymentStatus, confirmPayment } from '../api/paymentApi';
import { getErrorMessage } from '../utils/formatters';

export const generateQrAction = createAsyncThunk(
  'payment/generateQr',
  async (orderId, { rejectWithValue }) => {
    try {
      return await generateQr(orderId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const pollPaymentStatus = createAsyncThunk(
  'payment/pollStatus',
  async (paymentId, { rejectWithValue }) => {
    try {
      return await getPaymentStatus(paymentId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const confirmPaymentAction = createAsyncThunk(
  'payment/confirm',
  async (paymentId, { rejectWithValue }) => {
    try {
      return await confirmPayment(paymentId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const paymentSlice = createSlice({
  name: 'payment',
  initialState: {
    payment: null,
    loading: false,
    error: null,
  },
  reducers: {
    clearPayment: (state) => {
      state.payment = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateQrAction.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(generateQrAction.fulfilled, (state, action) => {
        state.loading = false;
        state.payment = action.payload;
      })
      .addCase(generateQrAction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(pollPaymentStatus.fulfilled, (state, action) => {
        state.payment = action.payload;
      })
      .addCase(confirmPaymentAction.fulfilled, (state, action) => {
        state.payment = action.payload;
      });
  },
});

export const { clearPayment } = paymentSlice.actions;
export default paymentSlice.reducer;
