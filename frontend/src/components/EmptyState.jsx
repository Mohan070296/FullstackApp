export default function EmptyState({ title, message, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 text-5xl">🍽️</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="mt-2 max-w-sm text-sm text-gray-500">{message}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
