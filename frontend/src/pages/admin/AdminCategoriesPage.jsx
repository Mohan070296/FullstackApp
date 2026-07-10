import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import {
  adminFetchCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
} from '../../features/adminSlice';
import { showToast } from '../../features/uiSlice';
import DataTable from '../../components/DataTable';
import FormModal, { FormField, inputClass } from '../../components/FormModal';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function AdminCategoriesPage() {
  const dispatch = useAppDispatch();
  const { categories, loading } = useAppSelector((s) => s.admin);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '' });

  useEffect(() => {
    dispatch(adminFetchCategories());
  }, [dispatch]);

  const openCreate = () => {
    setEditing(null);
    setForm({ name: '', description: '' });
    setModalOpen(true);
  };

  const openEdit = (row) => {
    setEditing(row);
    setForm({ name: row.name || '', description: row.description || '' });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const action = editing
      ? adminUpdateCategory({ id: editing.id, data: form })
      : adminCreateCategory(form);
    const result = await dispatch(action);
    if (action.fulfilled.match(result)) {
      dispatch(showToast({ message: editing ? 'Updated' : 'Created', type: 'success' }));
      setModalOpen(false);
      dispatch(adminFetchCategories());
    } else {
      dispatch(showToast({ message: result.payload, type: 'error' }));
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete this category?')) return;
    await dispatch(adminDeleteCategory(id));
    dispatch(showToast({ message: 'Deleted', type: 'info' }));
    dispatch(adminFetchCategories());
  };

  const columns = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name' },
    { key: 'description', label: 'Description' },
  ];

  if (loading && !categories.length) return <LoadingSpinner />;

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Categories</h2>
        <button type="button" onClick={openCreate} className="rounded-lg bg-primary px-4 py-2 text-sm text-white">
          Add Category
        </button>
      </div>
      <DataTable
        columns={columns}
        data={categories}
        actions={(row) => (
          <div className="flex justify-end gap-2">
            <button type="button" onClick={() => openEdit(row)} className="text-primary hover:underline">Edit</button>
            <button type="button" onClick={() => handleDelete(row.id)} className="text-red-600 hover:underline">Delete</button>
          </div>
        )}
      />
      <FormModal title={editing ? 'Edit Category' : 'Add Category'} open={modalOpen} onClose={() => setModalOpen(false)} onSubmit={handleSubmit}>
        <FormField label="Name"><input className={inputClass} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required /></FormField>
        <FormField label="Description"><textarea className={inputClass} rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
      </FormModal>
    </div>
  );
}
