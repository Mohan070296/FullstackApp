import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchOrderById, cancelOrderAction } from '../features/orderSlice';
import { showToast } from '../features/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import { formatPrice, formatDate } from '../utils/formatters';

const CANCELLABLE = ['PENDING', 'CONFIRMED'];

export default function OrderDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentOrder } = useAppSelector((s) => s.order);

  useEffect(() => {
    dispatch(fetchOrderById(id));
  }, [dispatch, id]);

  const handleCancel = async () => {
    const result = await dispatch(cancelOrderAction(id));
    if (cancelOrderAction.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Order cancelled', type: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Cannot cancel', type: 'error' }));
    }
  };

  if (!currentOrder) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-2xl">
      <Link to="/orders" className="mb-4 inline-block text-sm text-primary hover:underline">
        ← Back to orders
      </Link>
      <div className="rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Order #{currentOrder.id}</h1>
            <p className="text-gray-500">{currentOrder.restaurantName}</p>
          </div>
          <StatusBadge status={currentOrder.status} />
        </div>

        <div className="mt-6 space-y-2 border-t pt-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Placed</span>
            <span>{formatDate(currentOrder.placedAt)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Delivery address</span>
            <span className="max-w-xs text-right">{currentOrder.deliveryAddress}</span>
          </div>
          {currentOrder.payment && (
            <div className="flex justify-between">
              <span className="text-gray-500">Payment</span>
              <StatusBadge status={currentOrder.payment.status} />
            </div>
          )}
        </div>

        <div className="mt-6 border-t pt-4">
          <h3 className="mb-3 font-semibold">Items</h3>
          {currentOrder.items?.map((item) => (
            <div key={item.id} className="flex justify-between py-2 text-sm">
              <span>{item.foodItemName} × {item.quantity}</span>
              <span>{formatPrice(item.subtotal ?? item.unitPrice * item.quantity)}</span>
            </div>
          ))}
          <div className="mt-2 flex justify-between border-t pt-2 font-bold">
            <span>Total</span>
            <span>{formatPrice(currentOrder.totalAmount)}</span>
          </div>
        </div>

        {CANCELLABLE.includes(currentOrder.status) && (
          <button
            type="button"
            onClick={handleCancel}
            className="mt-6 w-full rounded-lg border border-red-300 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            Cancel Order
          </button>
        )}
      </div>
    </div>
  );
}
