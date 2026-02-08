import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import StatCard from '../components/StatCard'
import EnrollmentCard from '../components/EnrollmentCard'
import { getCourseById } from '../lib/data'
import { motion } from 'framer-motion'
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  TrendingUp,
  GraduationCap 
} from 'lucide-react'

const Dashboard = () => {
  const { currentUser } = useAuth()
  const { getMyEnrollments, getMyStats, filterByStatus } = useEnrollment()
  const [activeTab, setActiveTab] = useState('all')

  const stats = getMyStats()
  const enrollments = activeTab === 'all' 
    ? getMyEnrollments() 
    : filterByStatus(activeTab)

  const tabs = [
    { id: 'all', label: 'Todos', count: stats.total },
    { id: 'in_progress', label: 'En Progreso', count: stats.inProgress },
    { id: 'completed', label: 'Completados', count: stats.completed },
    { id: 'not_started', label: 'Por Empezar', count: stats.notStarted }
  ]

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 px-4 py-8">
          <div className="max-w-7xl mx-auto">
            {/* Header Section */}
            <div className="mb-8">
              <div className="flex items-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-foreground">
                    {currentUser.name?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div>
                  <h1 className="text-3xl font-bold">
                    ¡Hola, {currentUser.name}!
                  </h1>
                  <p className="text-muted-foreground">
                    Continúa tu camino de aprendizaje
                  </p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                icon={<BookOpen className="w-6 h-6 text-primary" />}
                label="En Progreso"
                value={stats.inProgress}
                color="primary"
              />
              <StatCard
                icon={<CheckCircle2 className="w-6 h-6 text-green-600" />}
                label="Completados"
                value={stats.completed}
                color="green"
              />
              <StatCard
                icon={<Clock className="w-6 h-6 text-orange-600" />}
                label="Por Empezar"
                value={stats.notStarted}
                color="orange"
              />
              <StatCard
                icon={<TrendingUp className="w-6 h-6 text-blue-600" />}
                label="Promedio"
                value={`${stats.avgScore}%`}
                color="blue"
              />
            </div>

            {/* Tabs */}
            <div className="border-b border-border mb-8">
              <div className="flex gap-6 overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`pb-3 px-1 border-b-2 transition whitespace-nowrap ${
                      activeTab === tab.id
                        ? 'border-primary text-primary font-semibold'
                        : 'border-transparent text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            </div>

            {/* Courses Grid */}
            {enrollments.length > 0 ? (
              <motion.div
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {enrollments.map((enrollment) => {
                  const course = getCourseById(enrollment.courseId)
                  if (!course) return null
                  
                  return (
                    <EnrollmentCard
                      key={enrollment.id}
                      enrollment={enrollment}
                      course={course}
                    />
                  )
                })}
              </motion.div>
            ) : (
              <motion.div
                className="text-center py-16"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="w-12 h-12 text-muted-foreground" />
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  {activeTab === 'all' 
                    ? 'No tienes cursos inscritos' 
                    : `No tienes cursos ${tabs.find(t => t.id === activeTab)?.label.toLowerCase()}`
                  }
                </h3>
                <p className="text-muted-foreground mb-6">
                  {activeTab === 'all'
                    ? 'Explora nuestro catálogo y comienza a aprender'
                    : 'Explora otros cursos o cambia de filtro'
                  }
                </p>
                {activeTab === 'all' && (
                  <a
                    href="/"
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
                  >
                    Explorar Cursos
                  </a>
                )}
              </motion.div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export default Dashboard
