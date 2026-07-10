import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchFoodById, clearCurrentFood } from '../features/catalogSlice';
import { addToCart } from '../features/cartSlice';
import { showToast } from '../features/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import VegBadge from '../components/VegBadge';
import { FOOD_PLACEHOLDER } from '../utils/constants';
import { formatPrice } from '../utils/formatters';

export default function FoodDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentFood } = useAppSelector((s) => s.catalog);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    dispatch(fetchFoodById(id));
    return () => dispatch(clearCurrentFood());
  }, [dispatch, id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to add items', type: 'info' }));
      return;
    }
    const result = await dispatch(addToCart({ foodItemId: currentFood.id, quantity }));
    if (addToCart.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Added to cart!', type: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to add', type: 'error' }));
    }
  };

  if (!currentFood) return <LoadingSpinner />;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="aspect-video overflow-hidden">
          <img
            src={currentFood.imageUrl || FOOD_PLACEHOLDER}
            alt={currentFood.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between">
            <h1 className="text-2xl font-bold">{currentFood.name}</h1>
            <VegBadge isVeg={currentFood.isVeg} />
          </div>
          {currentFood.categoryName && (
            <p className="mt-1 text-sm text-gray-500">{currentFood.categoryName}</p>
          )}
          {currentFood.restaurantName && (
            <Link
              to={`/restaurants/${currentFood.restaurantId}`}
              className="mt-1 inline-block text-sm text-primary hover:underline"
            >
              {currentFood.restaurantName}
            </Link>
          )}
          {currentFood.description && (
            <p className="mt-4 text-gray-600">{currentFood.description}</p>
          )}
          <p className="mt-4 text-2xl font-bold text-gray-900">{formatPrice(currentFood.price)}</p>

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-lg border border-gray-300">
              <button
                type="button"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 hover:bg-gray-50"
              >
                −
              </button>
              <span className="px-4 py-2 font-medium">{quantity}</span>
              <button
                type="button"
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 hover:bg-gray-50"
              >
                +
              </button>
            </div>
            <button
              type="button"
              onClick={handleAddToCart}
              disabled={currentFood.isAvailable === false}
              className="flex-1 rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
