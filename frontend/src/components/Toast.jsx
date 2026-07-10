import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { hideToast } from '../features/uiSlice';

export default function Toast() {
  const dispatch = useAppDispatch();
  const toast = useAppSelector((s) => s.ui.toast);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => dispatch(hideToast()), 3000);
    return () => clearTimeout(timer);
  }, [toast, dispatch]);

  if (!toast) return null;

  const colors = {
    success: 'bg-green-600',
    error: 'bg-red-600',
    info: 'bg-gray-800',
  };

  return (
    <div
      className={`fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-lg px-4 py-3 text-sm text-white shadow-lg ${colors[toast.type] || colors.info}`}
    >
      {toast.message}
    </div>
  );
}
