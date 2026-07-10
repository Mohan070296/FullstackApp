export default function FilterBar({ filters, categories, onChange, onApply, onClear }) {
  return (
    <div className="space-y-4 rounded-xl bg-white p-4 shadow-sm">
      <h3 className="font-semibold text-gray-900">Filters</h3>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">City</label>
        <input
          type="text"
          value={filters.city || ''}
          onChange={(e) => onChange({ city: e.target.value })}
          placeholder="e.g. Mumbai"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Min Rating</label>
        <input
          type="number"
          min="0"
          max="5"
          step="0.5"
          value={filters.minRating || ''}
          onChange={(e) => onChange({ minRating: e.target.value })}
          placeholder="e.g. 4.0"
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-xs font-medium text-gray-600">Category</label>
        <select
          value={filters.categoryId || ''}
          onChange={(e) => onChange({ categoryId: e.target.value })}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Min Price</label>
          <input
            type="number"
            min="0"
            value={filters.minPrice || ''}
            onChange={(e) => onChange({ minPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-gray-600">Max Price</label>
          <input
            type="number"
            min="0"
            value={filters.maxPrice || ''}
            onChange={(e) => onChange({ maxPrice: e.target.value })}
            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={onApply}
          className="flex-1 rounded-lg bg-primary py-2 text-sm font-medium text-white hover:bg-primary-dark"
        >
          Apply
        </button>
        <button
          type="button"
          onClick={onClear}
          className="rounded-lg border border-gray-300 px-4 py-2 text-sm hover:bg-gray-50"
        >
          Clear
        </button>
      </div>
    </div>
  );
}
