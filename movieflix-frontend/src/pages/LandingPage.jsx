import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home');
    }
  }, [isAuthenticated, navigate]);

  return (
    <div className="relative w-full h-[100vh]">
      {/* Hero Background */}
      <div className="absolute inset-0">
        <img
          src="https://assets.nflxext.com/ffe/siteui/vlv3/f480b04f-735f-4c44-ba3f-2e4323187036/f480b04f-735f-4c44-ba3f-2e4323187036/US-en-20240108-popsignuptwoweeks-perspective_alpha_website_large.jpg"
          alt="Hero"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black" />
      </div>

      {/* Content */}
      <div className="relative container mx-auto px-4 pt-32 md:pt-48">
        <div className="max-w-2xl space-y-6">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tighter">
            Unlimited movies,<br />
            TV shows, and more
          </h1>
          <p className="text-xl md:text-2xl text-white mb-6">
            Watch anywhere. Cancel anytime.
          </p>
          <p className="text-lg text-gray-300 mb-8 max-w-xl">
            Ready to watch? Enter your email to create or restart your membership.
          </p>

          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <input
              type="email"
              placeholder="Email address"
              className="bg-[#2a2a2a] text-white px-6 py-3 rounded-sm w-full md:w-auto min-w-[300px] focus:outline-none focus:ring-1 focus:ring-white"
            />
            <button className="bg-red-600 text-white px-8 py-3 rounded-sm font-bold text-lg hover:bg-red-700 transition-colors w-full md:w-auto">
              Get Started
            </button>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="relative bg-[#141414] py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Enjoy on your TV</h2>
              <p className="text-gray-300 text-lg">
                Watch on Smart TVs, Playstation, Xbox, Chromecast, Apple TV, Blu-ray players and more.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Download your shows to watch offline</h2>
              <p className="text-gray-300 text-lg">
                Save your favourites easily and always have something to watch.
              </p>
            </div>
            <div className="space-y-4">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Watch everywhere</h2>
              <p className="text-gray-300 text-lg">
                Stream unlimited movies and TV shows on your phone, tablet, laptop, and TV without paying more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;