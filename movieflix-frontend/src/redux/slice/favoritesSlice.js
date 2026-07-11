import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchFavorites = createAsyncThunk(
  'favorites/fetchFavorites',
  async () => {
    const response = await api.get('/favorites');
    return response.data;
  }
);

export const toggleFavorite = createAsyncThunk(
  'favorites/toggleFavorite',
  async ({ movieId, isFavorite }) => {
    if (isFavorite) {
      await api.delete(`/favorites/${movieId}`);
      return { movieId, isFavorite: false };
    } else {
      const response = await api.post(`/favorites/${movieId}`);
      return { movieId, isFavorite: true };
    }
  }
);

const favoritesSlice = createSlice({
  name: 'favorites',
  initialState: {
    items: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearFavorites: (state) => {
      state.items = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        const { movieId, isFavorite } = action.payload;
        if (isFavorite) {
          state.items.push({ movie: { id: movieId } });
        } else {
          state.items = state.items.filter(item => item.movie.id !== movieId);
        }
      });
  },
});

export const { clearFavorites } = favoritesSlice.actions;
export default favoritesSlice.reducer;