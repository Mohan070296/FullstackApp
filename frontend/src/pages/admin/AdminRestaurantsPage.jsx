import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  adminFetchRestaurants,
  adminCreateRestaurant,
  adminUpdateRestaurant,
  adminDeleteRestaurant,
} from '../../features/adminSlice';
import { showToast } from '../../features/uiSlice';
import DataTable from '../../components/DataTable';
import FormModal, { FormField, inputClass } from '../../components/FormModal';
import LoadingSpinner from '../../components/LoadingSpinner';

const emptyForm = {
  name: '', description: '', address: '', city: '',
  latitude: '', longitude: '', rating: '', imageUrl: '', isActive: true,
};

export default function AdminRestaurantsPage() {
  const dispatch = useAppDispatch();
  const { restaurants, loading } = useAppSelector((s) => s.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(adminFetchRestaurants());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({
      name: row.name || '',
      description: row.description || '',
      address: row.address || '',
      city: row.city || '',
      latitude: row.latitude ?? '',
      longitude: row.longitude ?? '',
      rating: row.rating ?? '',
      imageUrl: row.imageUrl || '',
      isActive: row.isActive ?? true,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : null,
      longitude: form.longitude ? parseFloat(form.longitude) : null,
      rating: form.rating ? parseFloat(form.rating) : null,
    };
    const action = editing
      ? adminUpdateRestaurant({ id: editing.id, data })
      : adminCreateRestaurant(data);
    const result = await dispatch(action);
    if (action.fulfilled.match(result)) {
      dispatch(showToast({ message: editing ? 'Updated' : 'Created', type: 'success' }));
      setModalOpen(false);
      dispatch(adminFetchRestaurants());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this restaurant?')) return;
    await dispatch(adminDeleteRestaurant(id));
    dispatch(showToast({ message: 'Deleted', type: 'info' }));
    dispatch(adminFetchRestaurants());
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'city', label: 'City' },
    { key: 'rating', label: 'Rating', render: (r) => r.rating?.toFixed(1) ?? '-' },
    { key: 'isActive', label: 'Active', render: (r) => (r.isActive ? 'Yes' : 'No') },
  ];

  if (loading && !restaurants.length) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Restaurants</h2>
        <button type="button" onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Add Restaurant
        </button>
      </div>
      <DataTable
        columns={columns}
        data={restaurants}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => openEdit(row)} className="text-primary hover:underline">Edit</button>
            <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
      <FormModal title={editing ? 'Edit Restaurant' : 'Add Restaurant'} open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit}>
        <FormField label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Description"><textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
        <FormField label="Address"><input className={inputClass} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} /></FormField>
        <FormField label="City"><input className={inputClass} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} /></FormField>
        <div className="grid grid-cols-2 gap-2">
          <FormField label="Latitude"><input className={inputClass} type="number" step="any" value={form.latitude} onChange={(e) => setForm({ ...form, latitude: e.target.value })} /></FormField>
          <FormField label="Longitude"><input className={inputClass} type="number" step="any" value={form.longitude} onChange={(e) => setForm({ ...form, longitude: e.target.value })} /></FormField>
        </div>
        <FormField label="Rating"><input className={inputClass} type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} /></FormField>
        <FormField label="Image URL"><input className={inputClass} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></FormField>
      </FormModal>
    </div>
  );
}
