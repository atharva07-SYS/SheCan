import { motion } from 'framer-motion'

export default function Card({ children, className = '', hoverable = false }) {
  return (
    <motion.div
      className={`
        glass-light rounded-2xl p-6 transition-all duration-300
        ${hoverable ? 'hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-1 cursor-pointer' : ''}
        ${className}
      `}
      layout
    >
      {children}
    </motion.div>
  )
}
