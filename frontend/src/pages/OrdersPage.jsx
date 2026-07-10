import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrders } from '../features/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import StatusBadge from '../components/StatusBadge';
import Pagination from '../components/Pagination';
import { formatPrice, formatDate } from '../utils/formatters';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, pagination, loading } = useAppSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchOrders({ page: 0 }));
  }, [dispatch]);

  const handlePageChange = (page) => {
    dispatch(fetchOrders({ page }));
  };

  if (loading && !orders.length) return <LoadingSpinner />;

  if (!orders.length) {
    return (
      <EmptyState
        title="No orders yet"
        message="Your order history will appear here"
        action={
          <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
            Order Now
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold">Order History</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            to={`/orders/${order.id}`}
            className="block rounded-xl bg-white p-4 shadow-sm transition hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold">{order.restaurantName}</h3>
                <p className="text-sm text-gray-500">Order #{order.id}</p>
                <p className="mt-1 text-xs text-gray-400">{formatDate(order.placedAt)}</p>
              </div>
              <div className="text-right">
                <StatusBadge status={order.status} />
                <p className="mt-2 font-bold">{formatPrice(order.totalAmount)}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      <Pagination
        page={pagination.page}
        totalPages={pagination.totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
}
