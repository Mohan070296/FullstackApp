import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAppDispatch } from './app/hooks';
import { fetchCurrentUser } from './features/authSlice';
import { fetchCart } from './features/cartSlice';
import MainLayout from './layouts/MainLayout';
import AdminLayout from './layouts/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import HomePage from './pages/HomePage';
import RestaurantDetailsPage from './pages/RestaurantDetailsPage';
import FoodDetailsPage from './pages/FoodDetailsPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderSuccessPage from './pages/OrderSuccessPage';
import OrdersPage from './pages/OrdersPage';
import OrderDetailsPage from './pages/OrderDetailsPage';
import AdminRestaurantsPage from './pages/admin/AdminRestaurantsPage';
import AdminFoodsPage from './pages/admin/AdminFoodsPage';
import AdminCategoriesPage from './pages/admin/AdminCategoriesPage';
import AdminOrdersPage from './pages/admin/AdminOrdersPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';

function AuthInitializer({ children }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(fetchCurrentUser()).then((result) => {
      if (fetchCurrentUser.fulfilled.match(result) && result.payload) {
        dispatch(fetchCart());
      }
    });
  }, [dispatch]);

  return children;
}

export default function App() {
  return (
    <AuthInitializer>
      <Routes>
        <Route element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="restaurants/:id" element={<RestaurantDetailsPage />} />
          <Route path="foods/:id" element={<FoodDetailsPage />} />
          <Route path="login" element={<LoginPage />} />
          <Route path="cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="order-success/:id" element={<ProtectedRoute><OrderSuccessPage /></ProtectedRoute>} />
          <Route path="orders" element={<ProtectedRoute><OrdersPage /></ProtectedRoute>} />
          <Route path="orders/:id" element={<ProtectedRoute><OrderDetailsPage /></ProtectedRoute>} />
          <Route path="profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        </Route>

        <Route path="admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<Navigate to="restaurants" replace />} />
          <Route path="restaurants" element={<AdminRestaurantsPage />} />
          <Route path="foods" element={<AdminFoodsPage />} />
          <Route path="categories" element={<AdminCategoriesPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
          <Route path="users" element={<AdminUsersPage />} />
        </Route>
      </Routes>
    </AuthInitializer>
  );
}
