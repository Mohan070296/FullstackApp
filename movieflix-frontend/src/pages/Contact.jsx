import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Contact = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post('/contact', formData);
      setSuccess(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (error) {
      console.error('Message failed:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8 text-center">Contact Us</h1>

      {success && (
        <div className="bg-green-500/20 border border-green-500 text-green-500 px-4 py-3 rounded mb-6 text-center">
          Message sent successfully! We'll get back to you soon.
        </div>
      )}

      <div className="max-w-2xl mx-auto">
        <div className="bg-[#1f1f1f] rounded-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
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
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Subject
              </label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Message
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows="5"
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-sm font-bold hover:bg-red-700 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Message'}
            </button>
          </form>
        </div>

        <div className="mt-8 text-center text-gray-400">
          <p className="mb-4">You can also reach us at:</p>
          <p>support@movieflix.com</p>
          <p>1-800-MOVIEFLIX</p>
        </div>
      </div>
    </div>
  );
};

export default Contact;