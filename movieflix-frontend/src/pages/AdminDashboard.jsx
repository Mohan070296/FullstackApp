import React from 'react';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
        <div className="bg-[#1f1f1f] p-6 rounded-sm text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">1,234</div>
          <div className="text-gray-400">Total Users</div>
        </div>
        <div className="bg-[#1f1f1f] p-6 rounded-sm text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">5,678</div>
          <div className="text-gray-400">Total Movies</div>
        </div>
        <div className="bg-[#1f1f1f] p-6 rounded-sm text-center">
          <div className="text-4xl font-bold text-red-600 mb-2">1,234</div>
          <div className="text-gray-400">Active Subscribers</div>
        </div>
        <div className="bg-[#1f1f1f] p-6 rounded-sm text-center">
          <div className="text-4xl font-bold text-green-600 mb-2">₹45,67,890</div>
          <div className="text-gray-400">Monthly Revenue</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Quick Actions */}
        <div className="bg-[#1f1f1f] p-6 rounded-sm">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="space-y-4">
            <Link
              to="/admin/movies"
              className="block p-4 bg-[#2a2a2a] rounded-sm hover:bg-[#333] transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">Manage Movies</h3>
              <p className="text-gray-400 text-sm mt-1">Add, edit, or delete movies</p>
            </Link>
            <Link
              to="/admin/users"
              className="block p-4 bg-[#2a2a2a] rounded-sm hover:bg-[#333] transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">Manage Users</h3>
              <p className="text-gray-400 text-sm mt-1">View and manage user accounts</p>
            </Link>
            <Link
              to="/admin/payments"
              className="block p-4 bg-[#2a2a2a] rounded-sm hover:bg-[#333] transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">Manage Payments</h3>
              <p className="text-gray-400 text-sm mt-1">View and verify payments</p>
            </Link>
            <Link
              to="/admin/categories"
              className="block p-4 bg-[#2a2a2a] rounded-sm hover:bg-[#333] transition-colors"
            >
              <h3 className="text-lg font-semibold text-white">Manage Categories</h3>
              <p className="text-gray-400 text-sm mt-1">Add or edit movie categories</p>
            </Link>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-[#1f1f1f] p-6 rounded-sm">
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((item) => (
              <div key={item} className="flex items-start space-x-4 pb-4 border-b border-gray-700 last:border-0">
                <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                <div>
                  <p className="text-gray-300 text-sm">
                    New user registered: <span className="text-white">user{item}@example.com</span>
                  </p>
                  <p className="text-gray-500 text-xs">2 hours ago</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#1f1f1f] p-6 rounded-sm">
          <h2 className="text-2xl font-bold mb-6">Monthly Subscriptions</h2>
          <div className="h-64 flex items-end space-x-4 justify-center">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <div key={month} className="flex flex-col items-center">
                <div
                  className="w-12 bg-red-600"
                  style={{ height: `${100 + Math.random() * 100}px` }}
                ></div>
                <span className="text-gray-400 mt-2 text-sm">{month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1f1f1f] p-6 rounded-sm">
          <h2 className="text-2xl font-bold mb-6">Movies Added</h2>
          <div className="h-64 flex items-end space-x-4 justify-center">
            {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, index) => (
              <div key={month} className="flex flex-col items-center">
                <div
                  className="w-12 bg-green-600"
                  style={{ height: `${80 + Math.random() * 80}px` }}
                ></div>
                <span className="text-gray-400 mt-2 text-sm">{month}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;