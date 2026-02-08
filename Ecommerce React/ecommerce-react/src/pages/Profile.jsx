import React from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { motion } from 'framer-motion'
import {
  User,
  BookOpen,
  Trophy,
  TrendingUp,
  Calendar,
  Award,
  Clock,
  CreditCard,
  LogOut
} from 'lucide-react'

const Profile = () => {
  const navigate = useNavigate()
  const { currentUser, logout } = useAuth()
  const { getMyEnrollments, getMyStats } = useEnrollment()

  if (!currentUser) {
    navigate('/login')
    return null
  }

  const stats = getMyStats()
  const enrollments = getMyEnrollments()

  // Calculate category progress
  const categoryProgress = enrollments.reduce((acc, enrollment) => {
    const category = enrollment.courseCategory || 'otros'
    if (!acc[category]) {
      acc[category] = { total: 0, completed: 0 }
    }
    acc[category].total++
    if (enrollment.status === 'completed') {
      acc[category].completed++
    }
    return acc
  }, {})

  const getCategoryName = (key) => {
    const names = {
      illustration: 'Ilustración',
      design: 'Diseño',
      photography: 'Fotografía',
      video: 'Video',
      '3d': '3D',
      marketing: 'Marketing',
      web: 'Desarrollo Web',
      craft: 'Manualidades',
      otros: 'Otros'
    }
    return names[key] || key
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    const date = new Date(dateString)
    return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
  }

  const estimatedHours = stats.total * 8 // Aproximadamente 8 horas por curso

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />

        <main className="flex-1">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <motion.div
              className="bg-gradient-to-br from-primary/20 via-primary/10 to-background rounded-xl p-8 mb-8 border border-border"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex flex-col md:flex-row items-center gap-6">
                {/* Avatar */}
                <div className="w-24 h-24 rounded-full bg-primary flex items-center justify-center text-4xl font-bold text-primary-foreground">
                  {currentUser.name?.charAt(0)?.toUpperCase() || 'U'}
                </div>

                {/* User Info */}
                <div className="flex-1 text-center md:text-left">
                  <h1 className="text-3xl font-bold mb-2">
                    {currentUser.name} {currentUser.lastname}
                  </h1>
                  <p className="text-muted-foreground mb-3">
                    Cédula: {currentUser.cedula}
                  </p>
                  <div className="flex items-center gap-2 justify-center md:justify-start text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4" />
                    <span>Miembro desde {formatDate(currentUser.createdAt)}</span>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => navigate('/dashboard')}>
                    <BookOpen className="w-4 h-4 mr-2" />
                    Mis Cursos
                  </Button>
                  <Button variant="outline" onClick={logout}>
                    <LogOut className="w-4 h-4 mr-2" />
                    Cerrar Sesión
                  </Button>
                </div>
              </div>
            </motion.div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Left Column - Stats */}
              <div className="lg:col-span-1 space-y-6">
                {/* Main Stats */}
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-primary" />
                    Estadísticas
                  </h2>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Total de cursos</span>
                      </div>
                      <span className="font-bold text-xl">{stats.total}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-green-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Award className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">Completados</span>
                      </div>
                      <span className="font-bold text-xl text-green-600">{stats.completed}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-primary" />
                        <span className="text-sm text-muted-foreground">Promedio</span>
                      </div>
                      <span className="font-bold text-xl text-primary">{stats.avgScore}%</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-orange-600" />
                        <span className="text-sm text-muted-foreground">Horas estimadas</span>
                      </div>
                      <span className="font-bold text-xl text-orange-600">{estimatedHours}h</span>
                    </div>
                  </div>
                </motion.div>

                {/* Quick Links */}
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold mb-4">Acciones Rápidas</h2>
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate('/dashboard')}
                    >
                      <BookOpen className="w-4 h-4 mr-2" />
                      Ver Mis Cursos
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => navigate('/')}
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Explorar Cursos
                    </Button>
                  </div>
                </motion.div>
              </div>

              {/* Right Column - Progress by Category */}
              <div className="lg:col-span-2 space-y-6">
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Progreso por Categoría
                  </h2>

                  {Object.keys(categoryProgress).length > 0 ? (
                    <div className="space-y-4">
                      {Object.entries(categoryProgress).map(([category, data]) => {
                        const percentage = data.total > 0 ? Math.round((data.completed / data.total) * 100) : 0
                        
                        return (
                          <div key={category} className="space-y-2">
                            <div className="flex items-center justify-between">
                              <span className="font-medium">{getCategoryName(category)}</span>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-muted-foreground">
                                  {data.completed}/{data.total}
                                </span>
                                <Badge variant="outline">{percentage}%</Badge>
                              </div>
                            </div>
                            <div className="h-3 bg-muted rounded-full overflow-hidden">
                              <motion.div
                                className="h-full bg-gradient-to-r from-primary to-primary/70"
                                initial={{ width: 0 }}
                                animate={{ width: `${percentage}%` }}
                                transition={{ duration: 1, delay: 0.2 }}
                              />
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-muted-foreground">
                      <BookOpen className="w-12 h-12 mx-auto mb-4 opacity-50" />
                      <p>Aún no tienes cursos inscritos</p>
                      <Button
                        className="mt-4"
                        onClick={() => navigate('/')}
                      >
                        Explorar Cursos
                      </Button>
                    </div>
                  )}
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-lg font-semibold mb-4">Actividad Reciente</h2>
                  <div className="space-y-3">
                    {enrollments.slice(0, 5).map((enrollment, index) => (
                      <div
                        key={enrollment.id}
                        className="flex items-center justify-between p-3 bg-muted/30 rounded-lg hover:bg-muted/50 transition"
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${
                            enrollment.status === 'completed' ? 'bg-green-500' :
                            enrollment.status === 'in_progress' ? 'bg-primary' :
                            'bg-muted-foreground'
                          }`} />
                          <div>
                            <p className="font-medium text-sm">{enrollment.courseTitle}</p>
                            <p className="text-xs text-muted-foreground">
                              {enrollment.status === 'completed' ? 'Completado' :
                               enrollment.status === 'in_progress' ? 'En progreso' :
                               'Por iniciar'}
                            </p>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => navigate(`/aprender/${enrollment.courseId}`)}
                        >
                          Ver
                        </Button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export default Profile
