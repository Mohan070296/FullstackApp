import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { updateUser } from '../redux/slice/userSlice';
import api from '../services/api';

const Profile = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    mobile: '',
    profilePhoto: '',
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        mobile: user.mobile || '',
        profilePhoto: user.profilePhoto || '',
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await dispatch(updateUser({ id: user.id, userData: profileData })).unwrap();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (error) {
      console.error('Update failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Profile</h1>

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded mb-6">
          Profile updated successfully!
        </div>
      )}

      <div className="max-w-2xl">
        <div className="bg-[#1f1f1f] rounded-sm p-8">
          <div className="flex items-center space-x-8 mb-8">
            <div className="w-24 h-24 bg-gray-700 rounded-full flex items-center justify-center text-4xl">
              {profileData.profilePhoto ? (
                <img
                  src={profileData.profilePhoto}
                  alt="Profile"
                  className="w-full h-full rounded-full object-cover"
                />
              ) : (
                '👤'
              )}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{profileData.name}</h2>
              <p className="text-gray-400">{profileData.email}</p>
              <p className="text-gray-400">{profileData.mobile}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={profileData.name}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Mobile Number
              </label>
              <input
                type="tel"
                name="mobile"
                value={profileData.mobile}
                onChange={handleChange}
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Profile Photo URL
              </label>
              <input
                type="text"
                name="profilePhoto"
                value={profileData.profilePhoto}
                onChange={handleChange}
                placeholder="https://example.com/photo.jpg"
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="bg-red-600 text-white px-8 py-3 rounded-sm font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Profile'}
            </button>
          </form>
        </div>

        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-6">Settings</h2>
          <div className="space-y-4">
            <div className="bg-[#1f1f1f] rounded-sm p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Account</h3>
                <p className="text-gray-400 text-sm">Manage your account settings</p>
              </div>
              <button
                onClick={() => navigate('/subscription')}
                className="text-red-600 hover:underline"
              >
                Manage Subscription
              </button>
            </div>

            <div className="bg-[#1f1f1f] rounded-sm p-6 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">Password</h3>
                <p className="text-gray-400 text-sm">Change your password</p>
              </div>
              <button className="text-red-600 hover:underline">
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;