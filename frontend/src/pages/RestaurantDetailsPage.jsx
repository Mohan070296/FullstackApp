import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchRestaurantById, fetchFoodsByRestaurant, clearCurrentRestaurant } from '../features/catalogSlice';
import { addToCart } from '../features/cartSlice';
import { showToast } from '../features/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import VegBadge from '../components/VegBadge';
import { PLACEHOLDER_IMAGE } from '../utils/constants';
import { formatPrice } from '../utils/formatters';

export default function RestaurantDetailsPage() {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const { currentRestaurant, restaurantFoods } = useAppSelector((s) => s.catalog);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchRestaurantById(id));
    dispatch(fetchFoodsByRestaurant(id));
    return () => dispatch(clearCurrentRestaurant());
  }, [dispatch, id]);

  const handleAddToCart = async (foodItemId) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to add items', type: 'info' }));
      return;
    }
    const result = await dispatch(addToCart({ foodItemId }));
    if (addToCart.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Added to cart!', type: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to add', type: 'error' }));
    }
  };

  if (!currentRestaurant) return <LoadingSpinner />;

  const grouped = restaurantFoods.reduce((acc, food) => {
    const cat = food.categoryName || 'Other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(food);
    return acc;
  }, {});

  return (
    <div>
      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="aspect-[3/1] max-h-64 overflow-hidden sm:max-h-80">
          <img
            src={currentRestaurant.imageUrl || PLACEHOLDER_IMAGE}
            alt={currentRestaurant.name}
            className="h-full w-full object-cover"
          />
        </div>
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900">{currentRestaurant.name}</h1>
          <p className="mt-1 text-gray-500">{currentRestaurant.address}, {currentRestaurant.city}</p>
          {currentRestaurant.rating != null && (
            <span className="mt-2 inline-block rounded bg-green-600 px-2 py-0.5 text-sm text-white">
              ★ {currentRestaurant.rating.toFixed(1)}
            </span>
          )}
          {currentRestaurant.description && (
            <p className="mt-4 text-gray-600">{currentRestaurant.description}</p>
          )}
        </div>
      </div>

      <div className="mt-8">
        <h2 className="mb-4 text-xl font-semibold">Menu</h2>
        {Object.keys(grouped).length === 0 ? (
          <p className="text-gray-500">No food items available</p>
        ) : (
          Object.entries(grouped).map(([category, items]) => (
            <div key={category} className="mb-8">
              <h3 className="mb-3 text-lg font-medium text-gray-800">{category}</h3>
              <div className="space-y-3">
                {items.map((food) => (
                  <div
                    key={food.id}
                    className="flex items-center justify-between rounded-xl bg-white p-4 shadow-sm"
                  >
                    <div className="flex flex-1 items-start gap-3">
                      <VegBadge isVeg={food.isVeg} />
                      <div>
                        <Link to={`/foods/${food.id}`} className="font-medium hover:text-primary">
                          {food.name}
                        </Link>
                        {food.description && (
                          <p className="mt-1 line-clamp-2 text-sm text-gray-500">{food.description}</p>
                        )}
                        <p className="mt-1 font-semibold">{formatPrice(food.price)}</p>
                      </div>
                    </div>
                    {food.isAvailable !== false && (
                      <button
                        type="button"
                        onClick={() => handleAddToCart(food.id)}
                        className="ml-4 rounded-lg border border-primary px-4 py-1.5 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                      >
                        Add
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
