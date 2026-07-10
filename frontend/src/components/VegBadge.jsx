export default function VegBadge({ isVeg }) {
  return (
    <span
      className={`inline-flex h-4 w-4 items-center justify-center rounded border-2 ${
        isVeg ? 'border-green-600' : 'border-red-600'
      }`}
      title={isVeg ? 'Vegetarian' : 'Non-Vegetarian'}
    >
      <span
        className={`h-2 w-2 rounded-full ${isVeg ? 'bg-green-600' : 'bg-red-600'}`}
      />
    </span>
  );
}
