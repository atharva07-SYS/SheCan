const statusColors = {
  'New': 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
  'In Progress': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
  'Resolved': 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
  'Archived': 'bg-gray-100 text-gray-800 dark:bg-gray-700/30 dark:text-gray-400',
}

const categoryColors = {
  'Volunteer': 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400',
  'Donation': 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400',
  'Partnership': 'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-400',
  'General Inquiry': 'bg-slate-100 text-slate-800 dark:bg-slate-700/30 dark:text-slate-400',
}

export default function Badge({ children, variant, className = '' }) {
  const colors = statusColors[variant] || categoryColors[variant] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${colors} ${className}`}>
      {children}
    </span>
  )
}
