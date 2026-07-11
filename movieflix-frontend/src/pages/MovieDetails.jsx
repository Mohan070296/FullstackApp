import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovieById } from '../redux/slice/moviesSlice';
import { addFavorite, removeFavorite } from '../redux/slice/userSlice';
import { addToHistory } from '../redux/slice/historySlice';
import { useAuth } from '../contexts/AuthContext';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useAuth();

  const { currentMovie, loading } = useSelector(state => state.movies);
  const { favorites } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchMovieById(id));
  }, [dispatch, id]);

  const handlePlay = () => {
    navigate(`/player/${id}`);
  };

  const handleAddToHistory = () => {
    dispatch(addToHistory({ movieId: id, duration: 0, progress: 0 }));
  };

  const toggleFavoriteHandler = () => {
    const isFavorite = favorites.some(f => f.movie.id === parseInt(id));
    if (isFavorite) {
      dispatch(removeFavorite(parseInt(id)));
    } else {
      dispatch(addFavorite(parseInt(id)));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-600"></div>
      </div>
    );
  }

  if (!currentMovie) {
    return <div className="container mx-auto px-4 py-8">Movie not found</div>;
  }

  const isFavorite = favorites.some(f => f.movie.id === parseInt(id));

  return (
    <div className="relative min-h-screen">
      {/* Banner */}
      <div className="relative w-full h-[60vh]">
        <img
          src={currentMovie.banner || currentMovie.poster}
          alt={currentMovie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/50 to-black" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 -mt-32 md:-mt-48 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* Poster */}
          <div className="w-48 md:w-64 flex-shrink-0">
            <img
              src={currentMovie.poster}
              alt={currentMovie.title}
              className="w-full rounded-sm shadow-2xl"
            />
          </div>

          {/* Details */}
          <div className="flex-1 space-y-6">
            <h1 className="text-4xl md:text-6xl font-bold text-white">
              {currentMovie.title}
            </h1>

            <div className="flex items-center space-x-4 text-lg">
              <span className="text-green-500 font-bold">98% Match</span>
              <span>{currentMovie.releaseDate?.split('-')[0]}</span>
              <span>{currentMovie.duration || '2h 15m'}</span>
              <span className="border border-gray-600 px-1 rounded">{currentMovie.rating || 'NR'}</span>
              <span>{currentMovie.category?.name || 'Movie'}</span>
              <span>{currentMovie.language}</span>
            </div>

            <p className="text-lg text-gray-200 leading-relaxed">
              {currentMovie.description}
            </p>

            <div className="flex items-center space-x-4 pt-4">
              <button
                onClick={handlePlay}
                className="flex items-center space-x-2 bg-white text-black px-8 py-3 rounded-sm hover:bg-white/80 transition-colors font-bold"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
                <span>Play</span>
              </button>

              <button
                onClick={toggleFavoriteHandler}
                className={`flex items-center space-x-2 px-6 py-3 rounded-sm font-bold transition-colors ${
                  isFavorite ? 'bg-green-600 text-white' : 'bg-gray-600/70 text-white hover:bg-gray-600'
                }`}
              >
                <svg className="w-6 h-6" fill={isFavorite ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{isFavorite ? 'In My List' : 'Add to My List'}</span>
              </button>

              <button
                onClick={handleAddToHistory}
                className="flex items-center space-x-2 bg-gray-600/70 text-white px-6 py-3 rounded-sm hover:bg-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>History</span>
              </button>
            </div>

            {/* Cast */}
            {currentMovie.cast && currentMovie.cast.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-white mb-4">Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {currentMovie.cast.map((actor) => (
                    <div key={actor.id} className="flex flex-col items-center">
                      <div className="w-16 h-16 bg-gray-700 rounded-full mb-2 flex items-center justify-center">
                        <span className="text-2xl">👤</span>
                      </div>
                      <span className="text-sm text-gray-300">{actor.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;