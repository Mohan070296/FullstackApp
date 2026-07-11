import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserHistory } from '../redux/slice/userSlice';

const WatchHistory = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { watchHistory, loading } = useSelector(state => state.user);

  useEffect(() => {
    dispatch(fetchUserHistory());
  }, [dispatch]);

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
      <h1 className="text-4xl font-bold mb-8">Watch History</h1>

      {watchHistory.length === 0 ? (
        <div className="text-center text-gray-400 mt-20">
          <p className="text-2xl mb-4">No watch history yet</p>
          <p>Start watching movies to see your history here.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {watchHistory.map((history) => (
            <div
              key={history.id}
              className="flex items-center space-x-6 p-4 bg-[#1f1f1f] rounded-sm hover:bg-[#2a2a2a] cursor-pointer transition-colors"
              onClick={() => handleMovieClick(history.movie)}
            >
              <img
                src={history.movie.poster}
                alt={history.movie.title}
                className="w-24 h-16 object-cover rounded-sm flex-shrink-0"
              />
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white">{history.movie.title}</h3>
                <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                  <span>{history.watchedAt ? new Date(history.watchedAt).toLocaleDateString() : 'Unknown date'}</span>
                  <span>{history.watchDuration ? `${history.watchDuration}s watched` : '0s watched'}</span>
                  <span>{Math.round(history.progress)}% complete</span>
                </div>
              </div>
              {history.completed && (
                <div className="text-green-500 font-bold">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;