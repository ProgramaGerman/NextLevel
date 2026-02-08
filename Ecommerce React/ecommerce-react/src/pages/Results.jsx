import React, { useEffect } from 'react'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { getCourseById } from '../lib/data'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import CircularProgress from '../components/CircularProgress'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'
import { Trophy, Clock, CheckCircle2, XCircle, Home, RotateCcw } from 'lucide-react'

const Results = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const location = useLocation()
  const { currentUser } = useAuth()
  const { completeCourse, getMyEnrollment } = useEnrollment()
  
  const course = getCourseById(id)
  const enrollment = getMyEnrollment(id)
  const { score, timeUsed, totalQuestions, answeredQuestions } = location.state || {}

  // Redirect if no results data
  useEffect(() => {
    if (!score && score !== 0) {
      navigate(`/quiz/${id}`)
    }
  }, [score, id, navigate])

  // Complete course if passed
  useEffect(() => {
    if (enrollment && score >= 70) {
      completeCourse(enrollment.id, score)
    }
  }, [enrollment, score, completeCourse])

  if (!course || !enrollment || (!score && score !== 0)) {
    return null
  }

  const passed = score >= 70
  const correctAnswers = Math.round((score / 100) * totalQuestions)
  const incorrectAnswers = totalQuestions - correctAnswers

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}m ${secs}s`
  }

  const getMessageByScore = (score) => {
    if (score >= 90) return { title: '¡Excelente!', message: 'Dominas completamente el contenido del curso.' }
    if (score >= 80) return { title: '¡Muy bien!', message: 'Tienes un gran entendimiento del curso.' }
    if (score >= 70) return { title: '¡Aprobado!', message: 'Has completado el curso satisfactoriamente.' }
    return { title: 'No aprobaste', message: 'Te recomendamos revisar el contenido y volver a intentarlo.' }
  }

  const { title, message } = getMessageByScore(score)

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1 flex items-center justify-center p-4">
          <motion.div
            className="max-w-3xl w-full"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Results Card */}
            <div className="bg-card border border-border rounded-xl p-8 mb-6">
              {/* Icon and Badge */}
              <div className="text-center mb-8">
                <motion.div
                  className={`w-24 h-24 rounded-full mx-auto mb-6 flex items-center justify-center ${
                    passed ? 'bg-green-500/10' : 'bg-red-500/10'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', duration: 0.6 }}
                >
                  {passed ? (
                    <Trophy className="w-12 h-12 text-green-500" />
                  ) : (
                    <XCircle className="w-12 h-12 text-red-500" />
                  )}
                </motion.div>

                <h1 className="text-3xl font-bold mb-2">{title}</h1>
                <p className="text-muted-foreground">{message}</p>
              </div>

              {/* Score Circle */}
              <div className="flex justify-center mb-8">
                <CircularProgress 
                  percentage={score} 
                  size={160}
                  strokeWidth={12}
                  color={passed ? 'green' : 'orange'}
                />
              </div>

              {/* Course Title */}
              <div className="text-center mb-8">
                <h2 className="text-xl font-semibold">{course.title}</h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm text-muted-foreground">Correctas</span>
                  </div>
                  <p className="text-2xl font-bold text-green-600">{correctAnswers}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="text-sm text-muted-foreground">Incorrectas</span>
                  </div>
                  <p className="text-2xl font-bold text-red-600">{incorrectAnswers}</p>
                </div>

                <div className="bg-muted/50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Clock className="w-5 h-5 text-primary" />
                    <span className="text-sm text-muted-foreground">Tiempo</span>
                  </div>
                  <p className="text-2xl font-bold">{formatTime(timeUsed)}</p>
                </div>
              </div>

              {/* Pass/Fail Message */}
              {passed ? (
                <motion.div
                  className="bg-green-500/10 border border-green-500/20 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <Trophy className="w-6 h-6 text-green-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-green-600 mb-1">
                        ¡Felicitaciones! Has completado el curso
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Tu calificación de <strong>{score}%</strong> ha sido registrada. 
                        Ahora puedes ver todos tus logros en tu dashboard.
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  className="bg-orange-500/10 border border-orange-500/20 rounded-lg p-6 mb-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="flex items-start gap-3">
                    <RotateCcw className="w-6 h-6 text-orange-500 mt-1" />
                    <div>
                      <h3 className="font-semibold text-orange-600 mb-1">
                        Puedes intentarlo de nuevo
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Necesitas al menos <strong>70%</strong> para aprobar. 
                        Te recomendamos revisar las lecciones y volver a intentar el examen.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => navigate('/dashboard')}
                >
                  <Home className="w-4 h-4 mr-2" />
                  Ir al Dashboard
                </Button>
                
                {!passed && (
                  <Button
                    className="flex-1"
                    onClick={() => navigate(`/aprender/${id}`)}
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Revisar Lecciones
                  </Button>
                )}
                
                {passed && (
                  <Button
                    className="flex-1"
                    onClick={() => navigate('/')}
                  >
                    Explorar Más Cursos
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export default Results
