import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../features/authSlice';
import { clearCartState } from '../features/cartSlice';
import { showToast, setMobileMenuOpen } from '../features/uiSlice';

export const useAppDispatch = () => useDispatch();
export const useAppSelector = useSelector;

export function useLogout() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  return useCallback(async () => {
    await dispatch(logoutUser());
    dispatch(clearCartState());
    dispatch(setMobileMenuOpen(false));
    dispatch(showToast({ message: 'Logged out successfully', type: 'success' }));
    navigate('/');
  }, [dispatch, navigate]);
}

export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
