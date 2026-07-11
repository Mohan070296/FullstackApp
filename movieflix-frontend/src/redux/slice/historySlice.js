import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchHistory = createAsyncThunk(
  'history/fetchHistory',
  async () => {
    const response = await api.get('/history');
    return response.data;
  }
);

export const addToHistory = createAsyncThunk(
  'history/addToHistory',
  async ({ movieId, duration, progress }) => {
    const response = await api.post(`/history/${movieId}?duration=${duration || 0}&progress=${progress || 0}`);
    return response.data;
  }
);

const historySlice = createSlice({
  name: 'history',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearHistory: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(addToHistory.fulfilled, (state, action) => {
        const existingIndex = state.items.findIndex(
          item => item.movie.id === action.payload.movie.id
        );
        if (existingIndex >= 0) {
          state.items[existingIndex] = action.payload;
        } else {
          state.items.unshift(action.payload);
        }
      });
  },
});

export const { clearHistory } = historySlice.actions;
export default historySlice.reducer;