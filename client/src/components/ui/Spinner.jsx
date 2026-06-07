import { motion } from 'framer-motion'

const sizes = {
  sm: 'w-5 h-5 border-2',
  md: 'w-8 h-8 border-[3px]',
  lg: 'w-12 h-12 border-4',
}

export default function Spinner({ size = 'md', className = '' }) {
  return (
    <motion.div
      className={`${sizes[size]} rounded-full border-purple-200 border-t-purple-600 dark:border-purple-800 dark:border-t-purple-400 animate-spin ${className}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    />
  )
}
