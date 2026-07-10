import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../app/hooks';
import { fetchCart } from '../features/cartSlice';
import { placeOrderAction, clearCurrentOrder } from '../features/orderSlice';
import { generateQrAction, confirmPaymentAction, clearPayment } from '../features/paymentSlice';
import { showToast } from '../features/uiSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatPrice } from '../utils/formatters';

export default function CheckoutPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { cart } = useAppSelector((s) => s.cart);
  const { currentOrder, loading: orderLoading } = useAppSelector((s) => s.order);
  const { payment, loading: paymentLoading } = useAppSelector((s) => s.payment);
  const [address, setAddress] = useState('');
  const [step, setStep] = useState('address');

  useEffect(() => {
    dispatch(fetchCart());
    return () => {
      dispatch(clearCurrentOrder());
      dispatch(clearPayment());
    };
  }, [dispatch]);

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!address.trim()) {
      dispatch(showToast({ message: 'Please enter delivery address', type: 'error' }));
      return;
    }
    const result = await dispatch(placeOrderAction(address));
    if (placeOrderAction.fulfilled.match(result)) {
      setStep('payment');
      await dispatch(generateQrAction(result.payload.id));
    } else {
      dispatch(showToast({ message: result.payload || 'Failed to place order', type: 'error' }));
    }
  };

  const handleConfirmPayment = async () => {
    if (!payment?.id) return;
    const result = await dispatch(confirmPaymentAction(payment.id));
    if (confirmPaymentAction.fulfilled.match(result)) {
      dispatch(showToast({ message: 'Payment successful!', type: 'success' }));
      navigate(`/order-success/${currentOrder.id}`);
    } else {
      dispatch(showToast({ message: result.payload || 'Payment failed', type: 'error' }));
    }
  };

  if (!cart?.items?.length) {
    return (
      <div className="py-12 text-center">
        <p className="text-gray-500">Your cart is empty</p>
      </div>
    );
  }

  if (step === 'address') {
    return (
      <div className="mx-auto max-w-lg">
        <h1 className="mb-6 text-2xl font-bold">Checkout</h1>
        <div className="mb-6 rounded-xl bg-white p-4 shadow-sm">
          <p className="text-sm text-gray-500">{cart.totalItems} items</p>
          <p className="text-xl font-bold">{formatPrice(cart.totalAmount)}</p>
        </div>
        <form onSubmit={handlePlaceOrder} className="rounded-xl bg-white p-6 shadow-sm">
          <label className="mb-2 block text-sm font-medium">Delivery Address</label>
          <textarea
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            rows={3}
            required
            placeholder="Enter your full delivery address"
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
          <button
            type="submit"
            disabled={orderLoading}
            className="mt-4 w-full rounded-lg bg-primary py-3 font-medium text-white hover:bg-primary-dark disabled:opacity-50"
          >
            {orderLoading ? 'Placing order...' : 'Place Order & Pay'}
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg text-center">
      <h1 className="mb-2 text-2xl font-bold">Complete Payment</h1>
      <p className="mb-6 text-gray-500">Scan the QR code or simulate payment below</p>

      {paymentLoading ? (
        <LoadingSpinner />
      ) : payment?.qrCodeData ? (
        <div className="rounded-xl bg-white p-6 shadow-sm">
          <img
            src={`data:image/png;base64,${payment.qrCodeData}`}
            alt="Payment QR Code"
            className="mx-auto h-64 w-64"
          />
          <p className="mt-4 text-lg font-bold">{formatPrice(payment.amount)}</p>
          <p className="text-sm text-gray-500">Order #{currentOrder?.id}</p>
          <button
            type="button"
            onClick={handleConfirmPayment}
            className="mt-6 w-full rounded-lg bg-green-600 py-3 font-medium text-white hover:bg-green-700"
          >
            Simulate Payment Success
          </button>
        </div>
      ) : (
        <p className="text-red-500">Failed to generate QR code</p>
      )}
    </div>
  );
}
