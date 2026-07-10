import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import catalogReducer from '../features/catalogSlice';
import cartReducer from '../features/cartSlice';
import orderReducer from '../features/orderSlice';
import paymentReducer from '../features/paymentSlice';
import adminReducer from '../features/adminSlice';
import uiReducer from '../features/uiSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    catalog: catalogReducer,
    cart: cartReducer,
    order: orderReducer,
    payment: paymentReducer,
    admin: adminReducer,
    ui: uiReducer,
  },
});
