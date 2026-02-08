import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { getCourseById } from '../lib/data'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { PageTransition } from '../components/PageTransition'
import { Button } from '../components/ui/Button'
import { motion } from 'framer-motion'
import { Clock, ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react'

const Quiz = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const { getMyEnrollment, hasAccess } = useEnrollment()
  
  const course = getCourseById(id)
  const enrollment = getMyEnrollment(id)
  
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(300) // 5 minutes in seconds
  const [quizStarted, setQuizStarted] = useState(false)

  // Redirect if no access
  useEffect(() => {
    if (!hasAccess(id)) {
      navigate(`/curso/${id}`)
    }
  }, [id, hasAccess, navigate])

  // Timer countdown
  useEffect(() => {
    if (!quizStarted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          handleSubmitQuiz()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [quizStarted, timeLeft])

  if (!course || !enrollment) {
    return null
  }

  // Sample questions (in real app, these would come from a database)
  const questions = [
    {
      id: 1,
      question: '¿Cuál es el concepto más importante que aprendiste en este curso?',
      options: [
        'Los fundamentos teóricos',
        'Las técnicas prácticas',
        'Las herramientas utilizadas',
        'La metodología de trabajo'
      ]
    },
    {
      id: 2,
      question: '¿Qué herramienta es esencial para el desarrollo de proyectos?',
      options: [
        'Software especializado',
        'Creatividad y práctica',
        'Recursos en línea',
        'Todas las anteriores'
      ]
    },
    {
      id: 3,
      question: '¿Cuál es el primer paso para iniciar un proyecto?',
      options: [
        'Planificación y bocetos',
        'Comprar materiales',
        'Empezar a trabajar directamente',
        'Buscar referencias'
      ]
    },
    {
      id: 4,
      question: '¿Qué característica define un buen proyecto final?',
      options: [
        'Complejidad técnica',
        'Originalidad y ejecución',
        'Uso de múltiples herramientas',
        'Tiempo invertido'
      ]
    },
    {
      id: 5,
      question: '¿Cuál es la mejor forma de mejorar tus habilidades?',
      options: [
        'Ver más tutoriales',
        'Práctica constante',
        'Copiar proyectos existentes',
        'Leer teoría'
      ]
    }
  ]

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleAnswerSelect = (questionId, optionIndex) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: optionIndex
    }))
  }

  const handleSubmitQuiz = () => {
    // Calculate score (in real app, compare with correct answers)
    const answeredQuestions = Object.keys(answers).length
    const score = Math.round((answeredQuestions / questions.length) * 100)
    
    // Navigate to results with score
    navigate(`/resultados/${id}`, { 
      state: { 
        score, 
        answers,
        timeUsed: 300 - timeLeft,
        totalQuestions: questions.length,
        answeredQuestions
      } 
    })
  }

  const canSubmit = Object.keys(answers).length === questions.length

  if (!quizStarted) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-background flex flex-col">
          <Header />
          
          <main className="flex-1 flex items-center justify-center p-4">
            <motion.div
              className="max-w-2xl w-full bg-card border border-border rounded-xl p-8 text-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-12 h-12 text-primary" />
              </div>
              
              <h1 className="text-3xl font-bold mb-4">Examen Final</h1>
              <h2 className="text-xl text-muted-foreground mb-6">{course.title}</h2>
              
              <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
                <h3 className="font-semibold mb-4">Instrucciones:</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Tienes <strong className="text-foreground">5 minutos</strong> para completar el examen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>El examen consta de <strong className="text-foreground">{questions.length} preguntas</strong> de opción múltiple</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Debes responder todas las preguntas para enviar el examen</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>Necesitas al menos <strong className="text-foreground">70%</strong> para aprobar</span>
                  </li>
                </ul>
              </div>

              <div className="flex gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => navigate(`/aprender/${id}`)}
                >
                  Volver al Curso
                </Button>
                <Button onClick={() => setQuizStarted(true)}>
                  Comenzar Examen
                </Button>
              </div>
            </motion.div>
          </main>

          <Footer />
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="min-h-screen bg-background flex flex-col">
        <Header />
        
        <main className="flex-1">
          {/* Timer and Progress Bar */}
          <div className="border-b border-border bg-card sticky top-0 z-10">
            <div className="max-w-4xl mx-auto px-4 py-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  <span className={`font-mono text-lg font-bold ${timeLeft < 60 ? 'text-red-500' : 'text-foreground'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </div>
                <span className="text-sm text-muted-foreground">
                  Pregunta {currentQuestion + 1} de {questions.length}
                </span>
              </div>
              
              {/* Progress bar */}
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>
          </div>

          <div className="max-w-4xl mx-auto px-4 py-8">
            <motion.div
              key={currentQuestion}
              className="bg-card border border-border rounded-xl p-8"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              {/* Question */}
              <h2 className="text-2xl font-bold mb-8">
                {questions[currentQuestion].question}
              </h2>

              {/* Options */}
              <div className="space-y-3 mb-8">
                {questions[currentQuestion].options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                    className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                      answers[questions[currentQuestion].id] === index
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        answers[questions[currentQuestion].id] === index
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}>
                        {answers[questions[currentQuestion].id] === index && (
                          <div className="w-3 h-3 rounded-full bg-white" />
                        )}
                      </div>
                      <span>{option}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
                  disabled={currentQuestion === 0}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Anterior
                </Button>

                {currentQuestion === questions.length - 1 ? (
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={!canSubmit}
                  >
                    Enviar Examen
                    <CheckCircle2 className="w-4 h-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={() => setCurrentQuestion(prev => Math.min(questions.length - 1, prev + 1))}
                  >
                    Siguiente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                )}
              </div>
            </motion.div>

            {/* Question indicators */}
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {questions.map((q, index) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentQuestion(index)}
                  className={`w-10 h-10 rounded-lg border-2 font-semibold transition ${
                    currentQuestion === index
                      ? 'border-primary bg-primary text-primary-foreground'
                      : answers[q.id] !== undefined
                      ? 'border-green-500 bg-green-500/10 text-green-600'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </PageTransition>
  )
}

export default Quiz
