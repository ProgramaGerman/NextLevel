import React from 'react'
import { motion } from 'framer-motion'

const StatCard = ({ icon, label, value, color = 'primary' }) => {
  const colorClasses = {
    primary: 'from-primary/20 to-primary/5 border-primary/20',
    green: 'from-green-500/20 to-green-500/5 border-green-500/20',
    blue: 'from-blue-500/20 to-blue-500/5 border-blue-500/20',
    orange: 'from-orange-500/20 to-orange-500/5 border-orange-500/20',
    purple: 'from-purple-500/20 to-purple-500/5 border-purple-500/20'
  }

  return (
    <motion.div
      className={`rounded-lg border bg-gradient-to-br p-6 ${colorClasses[color] || colorClasses.primary}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ scale: 1.02 }}
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-lg bg-background/50`}>
          {icon}
        </div>
        <div>
          <p className="text-3xl font-bold">{value}</p>
          <p className="text-sm text-muted-foreground">{label}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default StatCard
