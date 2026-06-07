export default function Input({ label, error, icon: Icon, type = 'text', required = false, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <input
          type={type}
          className={`
            w-full px-4 py-3 rounded-xl border
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            outline-none transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : ''}
          `}
          {...rest}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}

export function Textarea({ label, error, icon: Icon, required = false, className = '', ...rest }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="absolute left-3 top-4 text-gray-400">
            <Icon className="w-5 h-5" />
          </div>
        )}
        <textarea
          className={`
            w-full px-4 py-3 rounded-xl border min-h-[120px] resize-none
            border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-800
            text-gray-900 dark:text-white
            placeholder-gray-400 dark:placeholder-gray-500
            focus:ring-2 focus:ring-purple-500 focus:border-transparent
            outline-none transition-all duration-200
            ${Icon ? 'pl-11' : ''}
            ${error ? 'border-red-400 dark:border-red-500 focus:ring-red-500' : ''}
          `}
          {...rest}
        />
      </div>
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  )
}
