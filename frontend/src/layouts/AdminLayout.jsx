import { NavLink, Outlet } from 'react-router-dom';
import Toast from '../components/Toast';
import { useLogout } from '../app/hooks';

const links = [
  { to: '/admin/restaurants', label: 'Restaurants' },
  { to: '/admin/foods', label: 'Foods' },
  { to: '/admin/categories', label: 'Categories' },
  { to: '/admin/orders', label: 'Orders' },
  { to: '/admin/users', label: 'Users' },
];

export default function AdminLayout() {
  const handleLogout = useLogout();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="border-b bg-white px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-xl font-bold text-primary">Admin Dashboard</h1>
          <div className="flex items-center gap-4">
            <NavLink to="/" className="text-sm text-gray-600 hover:text-primary">
              ← Back to App
            </NavLink>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-50"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row">
        <aside className="lg:w-56">
          <nav className="flex gap-2 overflow-x-auto rounded-xl bg-white p-2 shadow-sm lg:flex-col lg:overflow-visible">
            {links.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium ${
                    isActive ? 'bg-primary text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </aside>
        <div className="flex-1">
          <Outlet />
        </div>
      </div>
      <Toast />
    </div>
  );
}
