export const formatPrice = (amount) => {
  if (amount == null) return '₹0';
  const num = typeof amount === 'number' ? amount : parseFloat(amount);
  return `₹${num.toFixed(0)}`;
};

export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || 'Something went wrong';
