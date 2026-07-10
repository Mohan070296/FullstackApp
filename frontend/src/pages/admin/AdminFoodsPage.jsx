import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  adminFetchFoods,
  adminFetchRestaurants,
  adminFetchCategories,
  adminCreateFood,
  adminUpdateFood,
  adminDeleteFood,
} from '../../features/adminSlice';
import { showToast } from '../../features/uiSlice';
import DataTable from '../../components/DataTable';
import FormModal, { FormField, inputClass } from '../../components/FormModal';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatPrice } from '../../utils/formatters';

const emptyForm = {
  name: '', description: '', price: '', imageUrl: '',
  isVeg: true, isAvailable: true, restaurantId: '', categoryId: '',
};

export default function AdminFoodsPage() {
  const dispatch = useAppDispatch();
  const { foods, restaurants, categories, loading } = useAppSelector((s) => s.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    dispatch(adminFetchFoods());
    dispatch(adminFetchRestaurants());
    dispatch(adminFetchCategories());
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
      price: row.price ?? '',
      imageUrl: row.imageUrl || '',
      isVeg: row.isVeg ?? true,
      isAvailable: row.isAvailable ?? true,
      restaurantId: row.restaurantId ?? '',
      categoryId: row.categoryId ?? '',
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const data = {
      ...form,
      price: parseFloat(form.price),
      restaurantId: parseInt(form.restaurantId, 10),
      categoryId: parseInt(form.categoryId, 10),
    };
    const action = editing
      ? adminUpdateFood({ id: editing.id, data })
      : adminCreateFood(data);
    const result = await dispatch(action);
    if (action.fulfilled.match(result)) {
      dispatch(showToast({ message: editing ? 'Updated' : 'Created', type: 'success' }));
      setModalOpen(false);
      dispatch(adminFetchFoods());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this food item?')) return;
    await dispatch(adminDeleteFood(id));
    dispatch(showToast({ message: 'Deleted', type: 'info' }));
    dispatch(adminFetchFoods());
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'restaurantName', label: 'Restaurant' },
    { key: 'categoryName', label: 'Category' },
    { key: 'price', label: 'Price', render: (r) => formatPrice(r.price) },
    { key: 'isVeg', label: 'Veg', render: (r) => (r.isVeg ? 'Yes' : 'No') },
  ];

  if (loading && !foods.length) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Food Items</h2>
        <button type="button" onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Add Food
        </button>
      </div>
      <DataTable
        columns={columns}
        data={foods}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => openEdit(row)} className="text-primary hover:underline">Edit</button>
            <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
      <FormModal title={editing ? 'Edit Food' : 'Add Food'} open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit}>
        <FormField label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Description"><textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
        <FormField label="Price"><input className={inputClass} type="number" step="0.01" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required /></FormField>
        <FormField label="Restaurant">
          <select className={inputClass} value={form.restaurantId} onChange={(e) => setForm({ ...form, restaurantId: e.target.value })} required>
            <option value="">Select restaurant</option>
            {restaurants.map((r) => <option key={r.id} value={r.id}>{r.name}</option>)}
          </select>
        </FormField>
        <FormField label="Category">
          <select className={inputClass} value={form.categoryId} onChange={(e) => setForm({ ...form, categoryId: e.target.value })} required>
            <option value="">Select category</option>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </FormField>
        <FormField label="Image URL"><input className={inputClass} value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} /></FormField>
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isVeg} onChange={(e) => setForm({ ...form, isVeg: e.target.checked })} /> Vegetarian</label>
          <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={form.isAvailable} onChange={(e) => setForm({ ...form, isAvailable: e.target.checked })} /> Available</label>
        </div>
      </FormModal>
    </div>
  );
}
