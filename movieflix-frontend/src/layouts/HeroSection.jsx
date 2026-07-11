import React from 'react';
import { Link } from 'react-router-dom';

const HeroSection = ({ movie, onPlay }) => {
  if (!movie) return null;

  return (
    <div className="relative w-full h-[60vh] md:h-[70vh] lg:h-[80vh]">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={movie.banner || movie.poster}
          alt={movie.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 h-full flex items-center">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            {movie.title}
          </h1>

          <div className="flex items-center space-x-4 text-sm md:text-base">
            <span className="text-green-500 font-medium">98% Match</span>
            <span className="text-gray-300">{movie.releaseDate?.split('-')[0]}</span>
            <span className="border border-gray-500 px-1 text-gray-300 text-xs">
              {movie.duration || '2h 15m'}
            </span>
            <span className="text-gray-300">{movie.rating ? `${movie.rating}★` : 'NR'}</span>
            <span className="text-gray-300">{movie.category?.name || 'Movie'}</span>
          </div>

          <p className="text-base md:text-lg text-gray-200 line-clamp-3 drop-shadow-md">
            {movie.description}
          </p>

          <div className="flex items-center space-x-4 mt-4">
            <button
              onClick={() => onPlay(movie)}
              className="flex items-center space-x-2 bg-white text-black px-6 py-2.5 rounded-sm hover:bg-white/80 transition-colors"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              <span className="font-bold text-lg">Play</span>
            </button>

            <button className="flex items-center space-x-2 bg-gray-600/70 text-white px-6 py-2.5 rounded-sm hover:bg-gray-600/80 transition-colors">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" />
              </svg>
              <span className="font-bold text-lg">More Info</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;