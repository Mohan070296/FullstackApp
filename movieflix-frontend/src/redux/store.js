import { configureStore } from '@reduxjs/toolkit';
import moviesReducer from './slice/moviesSlice';
import userReducer from './slice/userSlice';
import favoritesReducer from './slice/favoritesSlice';
import historyReducer from './slice/historySlice';

export const store = configureStore({
  reducer: {
    movies: moviesReducer,
    user: userReducer,
    favorites: favoritesReducer,
    history: historyReducer,
  },
});