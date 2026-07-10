import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useLogout } from '../app/hooks';
import { setMobileMenuOpen } from '../features/uiSlice';

export default function Navbar() {
  const dispatch = useAppDispatch();
  const handleLogout = useLogout();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const cart = useAppSelector((s) => s.cart.cart);
  const mobileMenuOpen = useAppSelector((s) => s.ui.mobileMenuOpen);

  const navLinks = (
    <>
      <Link to="/" className="hover:text-primary" onClick={() => dispatch(setMobileMenuOpen(false))}>
        Home
      </Link>
      {isAuthenticated && (
        <>
          <Link to="/orders" className="hover:text-primary" onClick={() => dispatch(setMobileMenuOpen(false))}>
            Orders
          </Link>
          <Link to="/profile" className="hover:text-primary" onClick={() => dispatch(setMobileMenuOpen(false))}>
            Profile
          </Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="hover:text-primary" onClick={() => dispatch(setMobileMenuOpen(false))}>
              Admin
            </Link>
          )}
        </>
      )}
    </>
  );

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link to="/" className="text-xl font-bold text-primary">
          FoodExpress
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium text-gray-700 md:flex">
          {navLinks}
        </nav>

        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/cart"
              className="relative rounded-lg p-2 hover:bg-gray-100"
              aria-label="Cart"
            >
              🛒
              {cart?.totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs text-white">
                  {cart.totalItems}
                </span>
              )}
            </Link>
          )}

          {isAuthenticated ? (
            <div className="hidden items-center gap-3 md:flex">
              {user?.avatarUrl && (
                <img src={user.avatarUrl} alt="" className="h-8 w-8 rounded-full" />
              )}
              <span className="text-sm text-gray-600">{user?.name}</span>
              <button
                type="button"
                onClick={handleLogout}
                className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm hover:bg-gray-50"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark md:inline-block"
            >
              Login
            </Link>
          )}

          <button
            type="button"
            className="rounded-lg p-2 hover:bg-gray-100 md:hidden"
            onClick={() => dispatch(setMobileMenuOpen(!mobileMenuOpen))}
            aria-label="Menu"
          >
            ☰
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-gray-100 bg-white px-4 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm font-medium text-gray-700">
            {navLinks}
            {isAuthenticated ? (
              <button type="button" onClick={handleLogout} className="text-left text-red-600">
                Logout
              </button>
            ) : (
              <Link to="/login" className="text-primary" onClick={() => dispatch(setMobileMenuOpen(false))}>
                Login
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
