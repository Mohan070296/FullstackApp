import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserFavorites, removeFavorite } from '../redux/slice/userSlice';

const MyList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { favorites, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserFavorites());
  }, [dispatch]);

  const handleRemove = (movieId) => {
    dispatch(removeFavorite(movieId));
  };

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">My List</h1>

      {favorites.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-2xl mb-4">Your list is empty</p>
          <p>Start adding movies to your list by clicking the "Add to My List" button.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {favorites.map((favorite) => (
            <div key={favorite.id} className="group relative">
              <div
                className="aspect-video rounded-sm overflow-hidden cursor-pointer"
                onClick={() => handleMovieClick(favorite.movie)}
              >
                <img
                  src={favorite.movie.poster}
                  alt={favorite.movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="mt-2 text-sm font-medium text-gray-300 group-hover:text-white truncate">
                {favorite.movie.title}
              </h3>
              <button
                onClick={() => handleRemove(favorite.movie.id)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-sm text-xs hover:bg-red-700"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyList;