import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const updateUser = createAsyncThunk(
  'user/updateUser',
  async ({ id, userData }) => {
    const response = await api.put(`/users/${id}`, userData);
    return response.data;
  }
);

export const fetchUserFavorites = createAsyncThunk(
  'user/fetchUserFavorites',
  async () => {
    const response = await api.get('/favorites');
    return response.data;
  }
);

export const fetchUserHistory = createAsyncThunk(
  'user/fetchUserHistory',
  async () => {
    const response = await api.get('/history');
    return response.data;
  }
);

export const addFavorite = createAsyncThunk(
  'user/addFavorite',
  async (movieId) => {
    const response = await api.post(`/favorites/${movieId}`);
    return response.data;
  }
);

export const removeFavorite = createAsyncThunk(
  'user/removeFavorite',
  async (movieId) => {
    await api.delete(`/favorites/${movieId}`);
    return movieId;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState: {
    profile: null,
    favorites: [],
    watchHistory: [],
    loading: false,
    error: null,
  },
  reducers: {
    setProfile: (state, action) => {
      state.profile = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Update user
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch favorites
      .addCase(fetchUserFavorites.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserFavorites.fulfilled, (state, action) => {
        state.loading = false;
        state.favorites = action.payload;
      })
      .addCase(fetchUserFavorites.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch history
      .addCase(fetchUserHistory.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.watchHistory = action.payload;
      })
      .addCase(fetchUserHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Add favorite
      .addCase(addFavorite.fulfilled, (state, action) => {
        state.favorites.push(action.payload);
      })
      // Remove favorite
      .addCase(removeFavorite.fulfilled, (state, action) => {
        state.favorites = state.favorites.filter(fav => fav.id !== action.payload);
      });
  },
});

export const { setProfile } = userSlice.actions;
export default userSlice.reducer;