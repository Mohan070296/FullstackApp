import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovies, fetchTrendingMovies, fetchLatestMovies, searchMovies } from '../redux/slice/moviesSlice';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../layouts/HeroSection';
import MovieRow from '../layouts/MovieRow';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { movies, trendingMovies, latestMovies, loading } = useSelector(state => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
    dispatch(fetchTrendingMovies());
    dispatch(fetchLatestMovies());
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
    <div className="pb-12">
      {/* Hero Section - Show first movie as hero */}
      {movies.length > 0 && (
        <HeroSection movie={movies[0]} onPlay={(movie) => navigate(`/player/${movie.id}`)} />
      )}

      {/* Movie Rows */}
      <div className="mt-8">
        {trendingMovies.length > 0 && (
          <MovieRow title="Trending Now" movies={trendingMovies} onMovieClick={handleMovieClick} />
        )}
        
        {latestMovies.length > 0 && (
          <MovieRow title="New Releases" movies={latestMovies} onMovieClick={handleMovieClick} />
        )}

        {movies.length > 0 && (
          <MovieRow title="Continue Watching" movies={movies.slice(0, 10)} onMovieClick={handleMovieClick} />
        )}

        <MovieRow title="Popular Movies" movies={movies.slice(10, 20)} onMovieClick={handleMovieClick} />
        <MovieRow title="Action Movies" movies={movies.slice(20, 30)} onMovieClick={handleMovieClick} />
        <MovieRow title="Comedy Movies" movies={movies.slice(30, 40)} onMovieClick={handleMovieClick} />
        <MovieRow title="Horror Movies" movies={movies.slice(40, 50)} onMovieClick={handleMovieClick} />
        <MovieRow title="Romance Movies" movies={movies.slice(50, 60)} onMovieClick={handleMovieClick} />
      </div>
    </div>
  );
};

export default Home;