import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { getCourseById } from '../lib/data'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import CircularProgress from '../components/CircularProgress'
import { Button } from '../components/ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Play, 
  Pause, 
  CheckCircle2, 
  Lock, 
  ArrowLeft,
  BookOpen,
  Clock,
  Award
} from 'lucide-react'

const CoursePlayer = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { getMyEnrollment, hasAccess, updateProgress } = useEnrollment()
  
  const course = getCourseById(id)
  const enrollment = getMyEnrollment(id)
  const [currentLesson, setCurrentLesson] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [videoProgress, setVideoProgress] = useState(0)

  // Redirect if no access
  useEffect(() => {
    if (!hasAccess(id)) {
      navigate(`/curso/${id}`)
    }
  }, [id, hasAccess, navigate])

  if (!course || !enrollment) {
    return null
  }

  // Simulated lessons data
  const lessons = [
    { id: 1, title: 'Introducción al curso', duration: '5:30', completed: enrollment.progress > 0 },
    { id: 2, title: 'Conceptos básicos', duration: '12:45', completed: enrollment.progress > 15 },
    { id: 3, title: 'Herramientas necesarias', duration: '8:20', completed: enrollment.progress > 30 },
    { id: 4, title: 'Primer proyecto práctico', duration: '18:30', completed: enrollment.progress > 45 },
    { id: 5, title: 'Técnicas avanzadas', duration: '15:00', completed: enrollment.progress > 60 },
    { id: 6, title: 'Proyecto final', duration: '25:00', completed: enrollment.progress > 80 },
    { id: 7, title: 'Conclusiones y próximos pasos', duration: '6:15', completed: enrollment.progress >= 100 }
  ]

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying)
  }

  const handleLessonComplete = () => {
    const newProgress = Math.min(((currentLesson + 1) / lessons.length) * 100, 100)
    updateProgress(enrollment.id, Math.round(newProgress))
    
    if (currentLesson < lessons.length - 1) {
      setCurrentLesson(currentLesson + 1)
      setIsPlaying(false)
      setVideoProgress(0)
    } else {
      // Course completed, navigate to quiz
      navigate(`/quiz/${id}`)
    }
  }

  const canAccessLesson = (lessonIndex) => {
    return lessonIndex === 0 || lessons[lessonIndex - 1].completed
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Back button */}
          <div className="border-b border-border">
            <div className="max-w-7xl mx-auto px-4 py-4">
              <button
                onClick={() => navigate('/dashboard')}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver al Dashboard
              </button>
            </div>
          </div>

          <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Video Player Section */}
              <div className="lg:col-span-2 space-y-6">
                {/* Video Player */}
                <motion.div
                  className="relative aspect-video bg-gradient-to-br from-primary/20 to-primary/5 rounded-xl overflow-hidden border border-border"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 rounded-full bg-background/50 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 cursor-pointer hover:scale-110 transition"
                        onClick={handlePlayPause}
                      >
                        {isPlaying ? (
                          <Pause className="w-12 h-12 text-primary" />
                        ) : (
                          <Play className="w-12 h-12 text-primary ml-1" />
                        )}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{lessons[currentLesson].title}</h3>
                      <p className="text-muted-foreground">{lessons[currentLesson].duration}</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-muted">
                    <motion.div
                      className="h-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${videoProgress}%` }}
                    />
                  </div>
                </motion.div>

                {/* Course Info */}
                <div className="bg-card border border-border rounded-xl p-6">
                  <h1 className="text-3xl font-bold mb-2">{course.title}</h1>
                  <p className="text-muted-foreground mb-4">Por {course.instructor}</p>
                  <p className="text-foreground">{course.description}</p>

                  {/* Action Button */}
                  <div className="mt-6">
                    <Button
                      onClick={handleLessonComplete}
                      className="w-full sm:w-auto"
                      disabled={!isPlaying && videoProgress < 80}
                    >
                      {currentLesson === lessons.length - 1 ? (
                        <>
                          <Award className="w-4 h-4 mr-2" />
                          Ir al Examen Final
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="w-4 h-4 mr-2" />
                          Marcar como Completada
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progress Card */}
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <h3 className="text-lg font-semibold mb-4">Tu Progreso</h3>
                  <div className="flex justify-center mb-4">
                    <CircularProgress percentage={Math.round(enrollment.progress)} />
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Completado</span>
                      <span className="font-semibold">{Math.round(enrollment.progress)}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Lecciones</span>
                      <span className="font-semibold">
                        {lessons.filter(l => l.completed).length}/{lessons.length}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* Lessons List */}
                <motion.div
                  className="bg-card border border-border rounded-xl p-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <BookOpen className="w-5 h-5" />
                    Contenido del Curso
                  </h3>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {lessons.map((lesson, index) => (
                      <button
                        key={lesson.id}
                        onClick={() => canAccessLesson(index) && setCurrentLesson(index)}
                        disabled={!canAccessLesson(index)}
                        className={`w-full text-left p-3 rounded-lg transition ${
                          currentLesson === index
                            ? 'bg-primary/10 border-2 border-primary'
                            : canAccessLesson(index)
                            ? 'bg-muted hover:bg-muted/80'
                            : 'bg-muted/50 opacity-50 cursor-not-allowed'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-semibold text-muted-foreground">
                                Lección {lesson.id}
                              </span>
                              {lesson.completed && (
                                <CheckCircle2 className="w-4 h-4 text-green-500" />
                              )}
                              {!canAccessLesson(index) && (
                                <Lock className="w-4 h-4 text-muted-foreground" />
                              )}
                            </div>
                            <p className="font-medium text-sm">{lesson.title}</p>
                            <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                              <Clock className="w-3 h-3" />
                              {lesson.duration}
                            </div>
                          </div>
                        </div>
                      </button>
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

export default CoursePlayer
