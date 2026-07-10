import { useEffect, useCallback, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector, useDebounce } from '../app/hooks';
import {
  fetchRestaurants,
  fetchFoods,
  fetchCategories,
  searchRestaurantsAction,
  searchFoodsAction,
  setFilters,
  setSearchQuery,
  setActiveTab,
} from '../features/catalogSlice';
import { fetchCurrentUser } from '../features/authSlice';
import { addToCart, fetchCart } from '../features/cartSlice';
import { showToast } from '../features/uiSlice';
import RestaurantCard from '../components/RestaurantCard';
import { FoodCard } from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import { DEFAULT_PAGE_SIZE } from '../utils/constants';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const [localSearch, setLocalSearch] = useState('');
  const debouncedSearch = useDebounce(localSearch, 400);
  const {
    restaurants,
    foods,
    categories,
    filters,
    searchQuery,
    activeTab,
    pagination,
    loading,
  } = useAppSelector((s) => s.catalog);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    dispatch(fetchCategories());
    if (searchParams.get('login') === 'success') {
      dispatch(fetchCurrentUser()).then((result) => {
        if (fetchCurrentUser.fulfilled.match(result) && result.payload) {
          dispatch(fetchCart());
          dispatch(showToast({ message: 'Welcome back!', type: 'success' }));
        }
      });
      setSearchParams({});
    }
  }, [dispatch, searchParams, setSearchParams]);

  const loadData = useCallback(
    (page = 0) => {
      const params = {
        page,
        size: DEFAULT_PAGE_SIZE,
        city: filters.city || undefined,
        minRating: filters.minRating ? parseFloat(filters.minRating) : undefined,
        categoryId: filters.categoryId || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
      };

      if (searchQuery.trim()) {
        if (activeTab === 'restaurants') {
          dispatch(searchRestaurantsAction({ q: searchQuery, page, size: DEFAULT_PAGE_SIZE }));
        } else {
          dispatch(searchFoodsAction({ q: searchQuery, page, size: DEFAULT_PAGE_SIZE }));
        }
      } else if (activeTab === 'restaurants') {
        dispatch(fetchRestaurants(params));
      } else {
        dispatch(fetchFoods(params));
      }
    },
    [dispatch, filters, searchQuery, activeTab]
  );

  useEffect(() => {
    dispatch(setSearchQuery(debouncedSearch.trim()));
  }, [debouncedSearch, dispatch]);

  useEffect(() => {
    loadData(0);
  }, [loadData]);

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(setSearchQuery(localSearch.trim()));
  };

  const handleAddToCart = async (food) => {
    if (!isAuthenticated) {
      dispatch(showToast({ message: 'Please login to add items', type: 'info' }));
      return;
    }
    const result = await dispatch(addToCart({ foodItemId: food.id }));
    if (addToCart.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Added to cart!', type: 'success' }));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to add', type: 'error' }));
    }
  };

  const items = activeTab === 'restaurants' ? restaurants : foods;

  return (
    <div>
      <section className="mb-8 rounded-2xl bg-gradient-to-r from-primary to-secondary p-6 text-white sm:p-10">
        <h1 className="text-2xl font-bold sm:text-3xl">Order food from the best restaurants</h1>
        <p className="mt-2 text-white/90">Discover restaurants and dishes near you</p>
        <form onSubmit={handleSearch} className="mt-6 flex gap-2">
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            placeholder="Search restaurants or food..."
            className="flex-1 rounded-lg px-4 py-3 text-gray-900 focus:outline-none"
          />
          {localSearch && (
            <button
              type="button"
              onClick={() => setLocalSearch('')}
              className="rounded-lg bg-white/90 px-4 py-3 font-medium text-gray-600 hover:bg-white"
              aria-label="Clear search"
            >
              Clear
            </button>
          )}
          <button
            type="submit"
            className="rounded-lg bg-white px-6 py-3 font-medium text-primary hover:bg-gray-100"
          >
            Search
          </button>
        </form>
        {localSearch && (
          <p className="mt-2 text-sm text-white/80">
            {loading ? 'Searching...' : `Showing results for "${localSearch.trim()}"`}
          </p>
        )}
      </section>

      <div className="mb-4 flex gap-2">
        {['restaurants', 'foods'].map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => dispatch(setActiveTab(tab))}
            className={`rounded-lg px-4 py-2 text-sm font-medium capitalize ${
              activeTab === tab ? 'bg-primary text-white' : 'bg-white text-gray-700 shadow-sm'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="hidden lg:block">
          <FilterBar
            filters={filters}
            categories={categories}
            onChange={(f) => dispatch(setFilters(f))}
            onApply={() => loadData(0)}
            onClear={() => {
              dispatch(setFilters({ city: '', minRating: '', categoryId: '', minPrice: '', maxPrice: '' }));
              dispatch(setSearchQuery(''));
              setLocalSearch('');
            }}
          />
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 lg:hidden">
            <FilterBar
              filters={filters}
              categories={categories}
              onChange={(f) => dispatch(setFilters(f))}
              onApply={() => loadData(0)}
              onClear={() => {
                dispatch(setFilters({ city: '', minRating: '', categoryId: '', minPrice: '', maxPrice: '' }));
              }}
            />
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : items.length === 0 ? (
            <EmptyState title="No results found" message="Try adjusting your filters or search" />
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {activeTab === 'restaurants'
                  ? restaurants.map((r) => <RestaurantCard key={r.id} restaurant={r} />)
                  : foods.map((f) => (
                      <FoodCard key={f.id} food={f} onAddToCart={handleAddToCart} />
                    ))}
              </div>
              <Pagination
                page={pagination.page}
                totalPages={pagination.totalPages}
                onPageChange={loadData}
              />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
