import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import api from '../services/api';

const Subscription = () => {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [paymentStep, setPaymentStep] = useState('select');

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const plans = [
    {
      id: 1,
      name: 'Basic',
      price: 299,
      duration: '30 Days',
      features: ['HD Quality', '1 Screen at a time', 'Mobile & Tablet'],
    },
    {
      id: 2,
      name: 'Premium',
      price: 699,
      duration: '90 Days',
      features: ['4K Ultra HD', '4 Screens at a time', 'Download movies', 'Mobile & Tablet'],
    },
    {
      id: 3,
      name: 'Family',
      price: 2999,
      duration: '365 Days',
      features: ['4K Ultra HD', '6 Screens at a time', 'Download movies', 'Mobile & Tablet', 'Kids Profile'],
    },
  ];

  const handleSelectPlan = (plan) => {
    setSelectedPlan(plan);
  };

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // Simulate payment
      await api.post('/payments', {
        amount: selectedPlan.price,
        currency: 'INR',
        paymentMethod: 'UPI',
        transactionId: `TXN${Date.now()}`,
      });
      
      // Subscribe
      await api.post(`/subscriptions/subscribe?planType=${selectedPlan.name}`);
      
      setPaymentStep('success');
      setTimeout(() => {
        navigate('/home');
      }, 3000);
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (paymentStep === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="text-center space-y-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-4xl font-bold text-green-500">Payment Successful!</h1>
          <p className="text-xl">Your subscription has been activated.</p>
          <p className="text-gray-400">Redirecting to home...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 container mx-auto px-4">
      <h1 className="text-4xl font-bold mb-8">Choose Your Plan</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        {plans.map((plan) => (
          <div
            key={plan.id}
            onClick={() => handleSelectPlan(plan)}
            className={`border-2 rounded-sm p-6 cursor-pointer transition-all ${
              selectedPlan?.id === plan.id
                ? 'border-red-600 bg-[#1f1f1f]'
                : 'border-gray-700 hover:border-gray-500'
            }`}
          >
            <h2 className="text-2xl font-bold mb-4">{plan.name}</h2>
            <div className="text-4xl font-bold mb-2">
              ₹{plan.price}
              <span className="text-lg font-normal text-gray-400">/{plan.duration}</span>
            </div>
            <ul className="space-y-2 text-gray-300">
              {plan.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-green-500 mr-2">✓</span>
                  {feature}
                </li>
              ))}
            </ul>
            {selectedPlan?.id === plan.id && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setPaymentStep('payment');
                }}
                className="mt-6 w-full bg-red-600 text-white py-3 rounded-sm font-bold hover:bg-red-700"
              >
                Select
              </button>
            )}
          </div>
        ))}
      </div>

      {selectedPlan && paymentStep === 'payment' && (
        <div className="bg-[#1f1f1f] rounded-sm p-8 max-w-lg mx-auto">
          <h2 className="text-2xl font-bold mb-6">Payment Details</h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Plan Details</h3>
            <p>Plan: <span className="text-white">{selectedPlan.name}</span></p>
            <p>Duration: <span className="text-white">{selectedPlan.duration}</span></p>
            <p className="text-2xl font-bold mt-2">
              Total: ₹{selectedPlan.price}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">UPI ID</label>
              <input
                type="text"
                placeholder="Enter your UPI ID (e.g., username@upi)"
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Transaction ID</label>
              <input
                type="text"
                placeholder="Enter transaction ID"
                className="w-full bg-[#333] text-white px-4 py-2 rounded-sm focus:outline-none focus:ring-1 focus:ring-white"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <button
              onClick={() => setPaymentStep('select')}
              className="flex-1 bg-gray-600 text-white py-3 rounded-sm font-bold hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              onClick={handlePayment}
              disabled={loading}
              className="flex-1 bg-green-600 text-white py-3 rounded-sm font-bold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </div>
        </div>
      )}

      <div className="mt-12 text-center text-gray-400">
        <p>All plans include unlimited access to movies and TV shows.</p>
        <p className="mt-2">Cancel anytime, no questions asked.</p>
      </div>
    </div>
  );
};

export default Subscription;