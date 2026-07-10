import { createSlice } from '@reduxjs/toolkit';

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    toast: null,
    mobileMenuOpen: false,
    filterDrawerOpen: false,
  },
  reducers: {
    showToast: (state, action) => {
      state.toast = action.payload;
    },
    hideToast: (state) => {
      state.toast = null;
    },
    toggleMobileMenu: (state) => {
      state.mobileMenuOpen = !state.mobileMenuOpen;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    toggleFilterDrawer: (state) => {
      state.filterDrawerOpen = !state.filterDrawerOpen;
    },
    setFilterDrawerOpen: (state, action) => {
      state.filterDrawerOpen = action.payload;
    },
  },
});

export const {
  showToast,
  hideToast,
  toggleMobileMenu,
  setMobileMenuOpen,
  toggleFilterDrawer,
  setFilterDrawerOpen,
} = uiSlice.actions;
export default uiSlice.reducer;
