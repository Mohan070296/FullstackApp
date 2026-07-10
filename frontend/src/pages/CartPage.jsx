import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCart, updateCartItemQty, removeFromCart, clearCart } from '../features/cartSlice';
import { showToast } from '../features/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { formatPrice } from '../utils/formatters';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart, loading } = useAppSelector((s) => s.cart);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQtyChange = async (id, quantity) => {
    if (quantity < 1) return;
    await dispatch(updateCartItemQty({ id, quantity }));
  };

  const handleRemove = async (id) => {
    await dispatch(removeFromCart(id));
    dispatch(showToast({ message: 'Item removed', type: 'info' }));
  };

  const handleClear = async () => {
    await dispatch(clearCart());
    dispatch(showToast({ message: 'Cart cleared', type: 'info' }));
  };

  if (loading && !cart) return <LoadingSpinner />;

  if (!cart?.items?.length) {
    return (
      <EmptyState
        title="Your cart is empty"
        message="Add some delicious food to get started"
        action={
          <Link to="/" className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white">
            Browse Food
          </Link>
        }
      />
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Cart</h1>
        <button type="button" onClick={handleClear} className="text-sm text-red-600 hover:underline">
          Clear cart
        </button>
      </div>

      {cart.restaurantName && (
        <p className="mb-4 text-sm text-gray-500">From: {cart.restaurantName}</p>
      )}

      <div className="space-y-3">
        {cart.items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 rounded-xl bg-white p-4 shadow-sm">
            {item.foodItemImage && (
              <img src={item.foodItemImage} alt="" className="h-16 w-16 rounded-lg object-cover" />
            )}
            <div className="flex-1">
              <h3 className="font-medium">{item.foodItemName}</h3>
              <p className="text-sm text-gray-500">{formatPrice(item.unitPrice)} each</p>
            </div>
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => handleQtyChange(item.id, item.quantity - 1)}
                className="px-2 py-1 hover:bg-gray-50"
              >
                −
              </button>
              <span className="px-3 py-1 text-sm font-medium">{item.quantity}</span>
              <button
                type="button"
                onClick={() => handleQtyChange(item.id, item.quantity + 1)}
                className="px-2 py-1 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <p className="w-16 text-right font-semibold">{formatPrice(item.subtotal)}</p>
            <button
              type="button"
              onClick={() => handleRemove(item.id)}
              className="text-red-500 hover:text-red-700"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6 rounded-xl bg-white p-6 shadow-sm">
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span>{formatPrice(cart.totalAmount)}</span>
        </div>
        <button
          type="button"
          onClick={() => navigate('/checkout')}
          className="mt-4 w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-dark"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
