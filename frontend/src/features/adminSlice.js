import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as adminApi from '../api/adminApi';
import { getErrorMessage } from '../utils/formatters';

const createAdminThunk = (name, fn) =>
  createAsyncThunk(`admin/${name}`, async (args, { rejectWithValue }) => {
    try {
      return await fn(args);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });

export const adminFetchRestaurants = createAsyncThunk(
  'admin/fetchRestaurants',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      return await adminApi.adminGetRestaurants(page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminFetchFoods = createAsyncThunk(
  'admin/fetchFoods',
  async ({ restaurantId, page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      return await adminApi.adminGetFoods(restaurantId, page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminFetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await adminApi.adminGetCategories();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminFetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      return await adminApi.adminGetOrders(page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminFetchUsers = createAsyncThunk(
  'admin/fetchUsers',
  async ({ page = 0, size = 20 } = {}, { rejectWithValue }) => {
    try {
      return await adminApi.adminGetUsers(page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const adminCreateRestaurant = createAdminThunk('createRestaurant', adminApi.adminCreateRestaurant);
export const adminUpdateRestaurant = createAdminThunk('updateRestaurant', ({ id, data }) =>
  adminApi.adminUpdateRestaurant(id, data)
);
export const adminDeleteRestaurant = createAdminThunk('deleteRestaurant', adminApi.adminDeleteRestaurant);
export const adminCreateFood = createAdminThunk('createFood', adminApi.adminCreateFood);
export const adminUpdateFood = createAdminThunk('updateFood', ({ id, data }) =>
  adminApi.adminUpdateFood(id, data)
);
export const adminDeleteFood = createAdminThunk('deleteFood', adminApi.adminDeleteFood);
export const adminCreateCategory = createAdminThunk('createCategory', adminApi.adminCreateCategory);
export const adminUpdateCategory = createAdminThunk('updateCategory', ({ id, data }) =>
  adminApi.adminUpdateCategory(id, data)
);
export const adminDeleteCategory = createAdminThunk('deleteCategory', adminApi.adminDeleteCategory);
export const adminUpdateOrderStatus = createAdminThunk('updateOrderStatus', ({ id, status }) =>
  adminApi.adminUpdateOrderStatus(id, status)
);
export const adminUpdateUserRole = createAdminThunk('updateUserRole', ({ id, role }) =>
  adminApi.adminUpdateUserRole(id, role)
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    restaurants: [],
    foods: [],
    categories: [],
    orders: [],
    users: [],
    pagination: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearAdminError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminFetchRestaurants.pending, (state) => { state.loading = true; })
      .addCase(adminFetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        state.restaurants = action.payload.content;
        state.pagination = action.payload;
      })
      .addCase(adminFetchFoods.fulfilled, (state, action) => {
        state.foods = action.payload.content;
      })
      .addCase(adminFetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(adminFetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload.content;
      })
      .addCase(adminFetchUsers.fulfilled, (state, action) => {
        state.users = action.payload.content;
      })
      .addMatcher(
        (action) => action.type.startsWith('admin/') && action.type.endsWith('/rejected'),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAdminError } = adminSlice.actions;
export default adminSlice.reducer;
