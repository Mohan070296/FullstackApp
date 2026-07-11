import React from 'react';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, movies, onMovieClick }) => {
  if (!movies || movies.length === 0) return null;

  return (
    <div className="mb-8">
      <h2 className="text-lg md:text-xl font-semibold text-gray-200 mb-4 hover:text-white cursor-pointer transition-colors">
        {title}
      </h2>

      <div className="relative">
        <div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-hide">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="flex-none w-32 md:w-48 lg:w-64 cursor-pointer group"
              onClick={() => onMovieClick(movie)}
            >
              <div className="relative aspect-video rounded-sm overflow-hidden">
                <img
                  src={movie.poster}
                  alt={movie.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:shadow-xl"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              <h3 className="mt-2 text-sm md:text-base font-medium text-gray-300 group-hover:text-white truncate">
                {movie.title}
              </h3>

              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-400">
                <span className="text-green-500 font-medium">{Math.round(movie.rating * 10)}%</span>
                <span>{movie.duration || '1h 30m'}</span>
                <span className="border border-gray-600 px-0.5 rounded">{movie.rating || 'NR'}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MovieRow;