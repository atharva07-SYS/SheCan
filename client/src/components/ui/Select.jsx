export default function Select({ label, error, options = [], placeholder = 'Select an option', required = false, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <select
        className={`
          w-full px-4 py-3 rounded-xl border appearance-none
          border-gray-200 dark:border-gray-700
          bg-white dark:bg-gray-800
          text-gray-900 dark:text-white
          focus:ring-2 focus:ring-purple-500 focus:border-transparent
          outline-none transition-all duration-200 cursor-pointer
          ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : ''}
        `}
        {...rest}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
