import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { adminFetchOrders, adminUpdateOrderStatus } from '../../features/adminSlice';
import { showToast } from '../../features/uiSlice';
import DataTable from '../../components/DataTable';
import StatusBadge from '../../components/StatusBadge';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice, formatDate } from '../../utils/formatters';
import { ORDER_STATUSES } from '../../utils/constants';

export default function AdminOrdersPage() {
  const dispatch = useAppDispatch();
  const { orders, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(adminFetchOrders());
  }, [dispatch]);

  const handleStatusChange = async (id, status) => {
    const result = await dispatch(adminUpdateOrderStatus({ id, status }));
    if (adminUpdateOrderStatus.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Status updated', type: 'success' }));
      dispatch(adminFetchOrders());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'userName', label: 'Customer' },
    { key: 'restaurantName', label: 'Restaurant' },
    { key: 'totalAmount', label: 'Total', render: (r) => formatPrice(r.totalAmount) },
    { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
    { key: 'placedAt', label: 'Placed', render: (r) => formatDate(r.placedAt) },
  ];

  if (loading && !orders.length) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Orders</h2>
      <DataTable
        columns={columns}
        data={orders}
        actions={(row) => (
          <select
            value={row.status}
            onChange={(e) => handleStatusChange(row.id, e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs"
          >
            {ORDER_STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
