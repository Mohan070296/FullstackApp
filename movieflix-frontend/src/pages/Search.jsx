import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchMovies, clearSearch } from '../redux/slice/moviesSlice';

const Search = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { searchResults, loading } = useSelector(state => state.movies);

  useEffect(() => {
    if (query.length > 2) {
      dispatch(searchMovies(query));
    } else {
      dispatch(clearSearch());
    }
  }, [query, dispatch]);

  const handleMovieClick = (movie) => {
    navigate(`/movie/${movie.id}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.length > 2) {
      dispatch(searchMovies(query));
    }
  };

  return (
    <div className="min-h-screen pt-20 container mx-auto px-4">
      <h1 className="text-3xl font-bold mb-8">Search Movies</h1>

      <form onSubmit={handleSubmit} className="mb-8 relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for movies, TV shows, actors..."
          className="w-full bg-[#333] text-white px-6 py-4 rounded-sm focus:outline-none focus:ring-1 focus:ring-white text-lg"
        />
        <button
          type="submit"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-red-600 text-white px-4 py-2 rounded-sm hover:bg-red-700"
        >
          Search
        </button>
      </form>

      {loading && (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
        </div>
      )}

      {query.length <= 2 && !searchResults.length && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">Start typing to search for movies...</p>
          <p className="mt-2 text-sm">Try searching for popular movies like "Inception" or "The Matrix"</p>
        </div>
      )}

      {searchResults.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {searchResults.map((movie) => (
            <div
              key={movie.id}
              className="cursor-pointer group"
              onClick={() => handleMovieClick(movie)}
            >
              <div className="aspect-video rounded-sm overflow-hidden mb-2">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
              </div>
              <h3 className="text-sm font-medium text-gray-300 group-hover:text-white truncate">
                {movie.title}
              </h3>
              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                <span>{movie.releaseDate?.split('-')[0]}</span>
                <span className="border border-gray-600 px-0.5 rounded">{movie.rating || 'NR'}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {query.length > 2 && searchResults.length === 0 && !loading && (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-xl">No movies found for "{query}"</p>
        </div>
      )}
    </div>
  );
};

export default Search;