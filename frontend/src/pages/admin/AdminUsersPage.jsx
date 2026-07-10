import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { adminFetchUsers, adminUpdateUserRole } from '../../features/adminSlice';
import { showToast } from '../../features/uiSlice';
import DataTable from '../../components/DataTable';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatDate } from '../../utils/formatters';
import { ROLES } from '../../utils/constants';

export default function AdminUsersPage() {
  const dispatch = useAppDispatch();
  const { users, loading } = useAppSelector((s) => s.admin);

  useEffect(() => {
    dispatch(adminFetchUsers());
  }, [dispatch]);

  const handleRoleChange = async (id, role) => {
    const result = await dispatch(adminUpdateUserRole({ id, role }));
    if (adminUpdateUserRole.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Role updated', type: 'success' }));
      dispatch(adminFetchUsers());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
    }
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'role', label: 'Role' },
    { key: 'createdAt', label: 'Joined', render: (r) => formatDate(r.createdAt) },
  ];

  if (loading && !users.length) return <LoadingSpinner />;

  return (
    <div>
      <h2 className="mb-4 text-xl font-bold">Users</h2>
      <DataTable
        columns={columns}
        data={users}
        actions={(row) => (
          <select
            value={row.role}
            onChange={(e) => handleRoleChange(row.id, e.target.value)}
            className="rounded border border-gray-300 px-2 py-1 text-xs"
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        )}
      />
    </div>
  );
}
