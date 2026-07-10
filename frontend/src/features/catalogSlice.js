import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getRestaurants, searchRestaurants, getRestaurant } from '../api/restaurantApi';
import { getFoods, searchFoods, getFood, getFoodsByRestaurant } from '../api/foodApi';
import { getCategories } from '../api/categoryApi';
import { getErrorMessage } from '../utils/formatters';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export const fetchRestaurants = createAsyncThunk(
  'catalog/fetchRestaurants',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getRestaurants({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        ...params,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const searchRestaurantsAction = createAsyncThunk(
  'catalog/searchRestaurants',
  async ({ q, page = 0, size = DEFAULT_PAGE_SIZE }, { rejectWithValue }) => {
    try {
      return await searchRestaurants(q, page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchRestaurantById = createAsyncThunk(
  'catalog/fetchRestaurantById',
  async (id, { rejectWithValue }) => {
    try {
      return await getRestaurant(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFoods = createAsyncThunk(
  'catalog/fetchFoods',
  async (params = {}, { rejectWithValue }) => {
    try {
      return await getFoods({
        page: 0,
        size: DEFAULT_PAGE_SIZE,
        ...params,
      });
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const searchFoodsAction = createAsyncThunk(
  'catalog/searchFoods',
  async ({ q, page = 0, size = DEFAULT_PAGE_SIZE }, { rejectWithValue }) => {
    try {
      return await searchFoods(q, page, size);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFoodById = createAsyncThunk(
  'catalog/fetchFoodById',
  async (id, { rejectWithValue }) => {
    try {
      return await getFood(id);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchFoodsByRestaurant = createAsyncThunk(
  'catalog/fetchFoodsByRestaurant',
  async (restaurantId, { rejectWithValue }) => {
    try {
      return await getFoodsByRestaurant(restaurantId);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

export const fetchCategories = createAsyncThunk(
  'catalog/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      return await getCategories();
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  }
);

const catalogSlice = createSlice({
  name: 'catalog',
  initialState: {
    restaurants: [],
    foods: [],
    categories: [],
    currentRestaurant: null,
    currentFood: null,
    restaurantFoods: [],
    pagination: { page: 0, totalPages: 0, totalElements: 0 },
    filters: { city: '', minRating: '', categoryId: '', minPrice: '', maxPrice: '', restaurantId: '' },
    searchQuery: '',
    activeTab: 'restaurants',
    loading: false,
    error: null,
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    clearCurrentRestaurant: (state) => {
      state.currentRestaurant = null;
      state.restaurantFoods = [];
    },
    clearCurrentFood: (state) => {
      state.currentFood = null;
    },
  },
  extraReducers: (builder) => {
    const handlePage = (state, action) => {
      state.restaurants = action.payload.content;
      state.pagination = {
        page: action.payload.page,
        totalPages: action.payload.totalPages,
        totalElements: action.payload.totalElements,
      };
    };

    builder
      .addCase(fetchRestaurants.pending, (state) => { state.loading = true; })
      .addCase(fetchRestaurants.fulfilled, (state, action) => {
        state.loading = false;
        handlePage(state, action);
      })
      .addCase(fetchRestaurants.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchRestaurantsAction.pending, (state) => { state.loading = true; })
      .addCase(searchRestaurantsAction.fulfilled, (state, action) => {
        state.loading = false;
        handlePage(state, action);
      })
      .addCase(fetchRestaurantById.fulfilled, (state, action) => {
        state.currentRestaurant = action.payload;
      })
      .addCase(fetchFoods.pending, (state) => { state.loading = true; })
      .addCase(fetchFoods.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      })
      .addCase(searchFoodsAction.pending, (state) => { state.loading = true; })
      .addCase(searchFoodsAction.fulfilled, (state, action) => {
        state.loading = false;
        state.foods = action.payload.content;
        state.pagination = {
          page: action.payload.page,
          totalPages: action.payload.totalPages,
          totalElements: action.payload.totalElements,
        };
      })
      .addCase(fetchFoodById.fulfilled, (state, action) => {
        state.currentFood = action.payload;
      })
      .addCase(fetchFoodsByRestaurant.fulfilled, (state, action) => {
        state.restaurantFoods = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setFilters, setSearchQuery, setActiveTab, clearCurrentRestaurant, clearCurrentFood } =
  catalogSlice.actions;
export default catalogSlice.reducer;
