import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Provider } from 'react-redux';
import { store } from './redux/store';

// Layouts
import Header from './layouts/Header';
import Footer from './layouts/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import MoviePlayer from './pages/MoviePlayer';
import Search from './pages/Search';
import Subscription from './pages/Subscription';
import Profile from './pages/Profile';
import MyList from './pages/MyList';
import WatchHistory from './pages/WatchHistory';
import Contact from './pages/Contact';
import About from './pages/About';
import AdminDashboard from './pages/AdminDashboard';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  
  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }
  
  return children;
};

function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <BrowserRouter>
          <div className="min-h-screen bg-black">
            <Header />
            <main className="pt-16">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                
                {/* Protected Routes */}
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/movie/:id" element={<ProtectedRoute><MovieDetails /></ProtectedRoute>} />
                <Route path="/player/:movieId" element={<ProtectedRoute><MoviePlayer /></ProtectedRoute>} />
                <Route path="/search" element={<ProtectedRoute><Search /></ProtectedRoute>} />
                <Route path="/subscription" element={<ProtectedRoute><Subscription /></ProtectedRoute>} />
                <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path="/my-list" element={<ProtectedRoute><MyList /></ProtectedRoute>} />
                <Route path="/watch-history" element={<ProtectedRoute><WatchHistory /></ProtectedRoute>} />
                
                {/* Admin Routes */}
                <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
              </Routes>
            </main>
            <Footer />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </Provider>
  );
}

export default App;