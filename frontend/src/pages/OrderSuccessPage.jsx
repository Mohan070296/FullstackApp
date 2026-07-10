import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderById } from '../features/orderSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatPrice, formatDate } from '../utils/formatters';

export default function OrderSuccessPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  if (!currentOrder) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-lg text-center">
      <div className="rounded-2xl bg-white p-8 shadow-sm">
        <div className="mb-4 text-6xl">✅</div>
        <h1 className="text-2xl font-bold text-green-600">Order Placed Successfully!</h1>
        <p className="mt-2 text-gray-500">Order #{currentOrder.id}</p>
        <div className="mt-6 space-y-2 text-left">
          <div className="flex justify-between">
            <span className="text-gray-500">Restaurant</span>
            <span className="font-medium">{currentOrder.restaurantName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Total</span>
            <span className="font-bold">{formatPrice(currentOrder.totalAmount)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Status</span>
            <StatusBadge status={currentOrder.status} />
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Placed at</span>
            <span>{formatDate(currentOrder.placedAt)}</span>
          </div>
        </div>
        <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <Link
            to={`/orders/${currentOrder.id}`}
            className="rounded-lg border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary/5"
          >
            View Details
          </Link>
          <Link
            to="/"
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
