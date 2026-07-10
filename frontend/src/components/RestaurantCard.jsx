import { Link } from 'react-router-dom';
import { PLACEHOLDER_IMAGE, FOOD_PLACEHOLDER } from '../utils/constants';
import { formatPrice } from '../utils/formatters';
import VegBadge from './VegBadge';

export default function RestaurantCard({ restaurant }) {
  return (
    <Link
      to={`/restaurants/${restaurant.id}`}
      className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md"
    >
      <div className="aspect-[4/3] overflow-hidden">
        <img
          src={restaurant.imageUrl || PLACEHOLDER_IMAGE}
          alt={restaurant.name}
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 group-hover:text-primary">{restaurant.name}</h3>
        <p className="mt-1 text-sm text-gray-500">{restaurant.city}</p>
        {restaurant.rating != null && (
          <div className="mt-2 flex items-center gap-1 text-sm">
            <span className="rounded bg-green-600 px-1.5 py-0.5 text-xs font-medium text-white">
              ★ {restaurant.rating.toFixed(1)}
            </span>
          </div>
        )}
        {restaurant.description && (
          <p className="mt-2 line-clamp-2 text-xs text-gray-400">{restaurant.description}</p>
        )}
      </div>
    </Link>
  );
}

export function FoodCard({ food, onAddToCart, showAddButton = true }) {
  return (
    <div className="overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-md">
      <Link to={`/foods/${food.id}`}>
        <div className="aspect-[4/3] overflow-hidden">
          <img
            src={food.imageUrl || FOOD_PLACEHOLDER}
            alt={food.name}
            className="h-full w-full object-cover"
          />
        </div>
      </Link>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <Link to={`/foods/${food.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-primary">{food.name}</h3>
          </Link>
          <VegBadge isVeg={food.isVeg} />
        </div>
        {food.categoryName && (
          <p className="mt-1 text-xs text-gray-400">{food.categoryName}</p>
        )}
        {food.restaurantName && (
          <p className="mt-1 text-xs text-gray-500">{food.restaurantName}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <span className="font-semibold text-gray-900">{formatPrice(food.price)}</span>
          {showAddButton && onAddToCart && (
            <button
              type="button"
              onClick={() => onAddToCart(food)}
              className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-dark"
            >
              Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
