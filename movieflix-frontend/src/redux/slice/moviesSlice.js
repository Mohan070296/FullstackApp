import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchMovies = createAsyncThunk(
  'movies/fetchMovies',
  async () => {
    const response = await api.get('/movies');
    return response.data;
  }
);

export const fetchMovieById = createAsyncThunk(
  'movies/fetchMovieById',
  async (id) => {
    const response = await api.get(`/movies/${id}`);
    return response.data;
  }
);

export const searchMovies = createAsyncThunk(
  'movies/searchMovies',
  async (keyword) => {
    const response = await api.get(`/movies/search?keyword=${keyword}`);
    return response.data;
  }
);

export const fetchTrendingMovies = createAsyncThunk(
  'movies/fetchTrendingMovies',
  async () => {
    const response = await api.get('/movies/trending');
    return response.data;
  }
);

export const fetchLatestMovies = createAsyncThunk(
  'movies/fetchLatestMovies',
  async () => {
    const response = await api.get('/movies/latest');
    return response.data;
  }
);

const moviesSlice = createSlice({
  name: 'movies',
  initialState: {
    movies: [],
    currentMovie: null,
    trendingMovies: [],
    latestMovies: [],
    searchResults: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearSearch: (state) => {
      state.searchResults = [];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all movies
      .addCase(fetchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.movies = action.payload;
      })
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch movie by ID
      .addCase(fetchMovieById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMovieById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentMovie = action.payload;
      })
      .addCase(fetchMovieById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Search movies
      .addCase(searchMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(searchMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.searchResults = action.payload;
      })
      .addCase(searchMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch trending movies
      .addCase(fetchTrendingMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTrendingMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.trendingMovies = action.payload;
      })
      .addCase(fetchTrendingMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch latest movies
      .addCase(fetchLatestMovies.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLatestMovies.fulfilled, (state, action) => {
        state.loading = false;
        state.latestMovies = action.payload;
      })
      .addCase(fetchLatestMovies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      });
  },
});

export const { clearSearch } = moviesSlice.actions;
export default moviesSlice.reducer;