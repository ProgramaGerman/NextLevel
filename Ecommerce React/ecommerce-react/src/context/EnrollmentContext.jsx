import React, { createContext, useContext } from 'react'
import { useAuth } from './AuthContext'
import { useData } from './DataContext'

const EnrollmentContext = createContext(null)

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext)
  if (!context) {
    throw new Error('useEnrollment debe usarse dentro de EnrollmentProvider')
  }
  return context
}

export const EnrollmentProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const { 
    getUserEnrollments, 
    getEnrollmentByCourse,
    createEnrollment,
    updateEnrollment 
  } = useData()

  // Obtener todos los enrollments del usuario actual
  const getMyEnrollments = () => {
    if (!currentUser) return []
    return getUserEnrollments(currentUser.id)
  }

  // Verificar si el usuario tiene acceso a un curso
  const hasAccess = (courseId) => {
    if (!currentUser) return false
    const enrollment = getEnrollmentByCourse(currentUser.id, courseId)
    return !!enrollment
  }

  // Obtener enrollment específico del usuario
  const getMyEnrollment = (courseId) => {
    if (!currentUser) return null
    return getEnrollmentByCourse(currentUser.id, courseId)
  }

  // Crear enrollment (inscribir usuario a curso)
  const enroll = (courseId, courseTitle, courseCategory = 'otros') => {
    if (!currentUser) {
      throw new Error('Debes iniciar sesión para inscribirte')
    }

    const existingEnrollment = getEnrollmentByCourse(currentUser.id, courseId)
    if (existingEnrollment) {
      return existingEnrollment
    }

    return createEnrollment({
      userId: currentUser.id,
      courseId,
      courseTitle,
      courseCategory
    })
  }

  // Actualizar progreso de un curso
  const updateProgress = (enrollmentId, progress, status = null) => {
    const updates = { progress }
    
    if (status) {
      updates.status = status
    }

    // Si se completa, marcar fecha
    if (progress >= 100 && status === 'in_progress') {
      updates.status = 'in_progress' // Esperar a que complete el quiz
    }

    updateEnrollment(enrollmentId, updates)
  }

  // Completar curso con calificación
  const completeCourse = (enrollmentId, score) => {
    updateEnrollment(enrollmentId, {
      status: 'completed',
      progress: 100,
      score,
      completedAt: new Date().toISOString()
    })
  }

  // Obtener estadísticas del usuario
  const getMyStats = () => {
    const enrollments = getMyEnrollments()
    
    const inProgress = enrollments.filter(e => e.status === 'in_progress').length
    const completed = enrollments.filter(e => e.status === 'completed').length
    const notStarted = enrollments.filter(e => e.status === 'not_started').length
    
    const completedEnrollments = enrollments.filter(e => e.status === 'completed')
    const avgScore = completedEnrollments.length > 0
      ? Math.round(completedEnrollments.reduce((sum, e) => sum + e.score, 0) / completedEnrollments.length)
      : 0

    return {
      total: enrollments.length,
      inProgress,
      completed,
      notStarted,
      avgScore
    }
  }

  // Filtrar enrollments por estado
  const filterByStatus = (status) => {
    const enrollments = getMyEnrollments()
    if (status === 'all') return enrollments
    return enrollments.filter(e => e.status === status)
  }

  // Check if user has completed a specific course
  const hasCompletedCourse = (userId, courseId) => {
    if (!currentUser || currentUser.id !== userId) return false
    
    const allEnrollments = getMyEnrollments()
    const enrollment = allEnrollments.find(e => e.courseId === courseId)
    return enrollment?.status === 'completed'
  }

  const value = {
    getMyEnrollments,
    hasAccess,
    getMyEnrollment,
    enroll,
    updateProgress,
    completeCourse,
    getMyStats,
    filterByStatus,
    hasCompletedCourse
  }

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}
