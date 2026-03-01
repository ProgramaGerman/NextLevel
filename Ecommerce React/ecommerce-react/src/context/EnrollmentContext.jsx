import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../env/KeySupabase'
import { useAuth } from './AuthContext'

const EnrollmentContext = createContext(null)

export const useEnrollment = () => {
  const context = useContext(EnrollmentContext)
  if (!context) throw new Error('useEnrollment debe usarse dentro de EnrollmentProvider')
  return context
}

export const EnrollmentProvider = ({ children }) => {
  const { currentUser } = useAuth()
  const [enrollments, setEnrollments] = useState([])
  const [loadingEnrollments, setLoadingEnrollments] = useState(false)

  // Cargar enrollments cuando cambia el usuario
  const loadEnrollments = useCallback(async () => {
    if (!currentUser) { setEnrollments([]); return }
    setLoadingEnrollments(true)
    const { data, error } = await supabase
      .from('enrollments')
      .select('*')
      .eq('user_id', currentUser.id)
    if (!error && data) setEnrollments(data)
    setLoadingEnrollments(false)
  }, [currentUser])

  useEffect(() => { loadEnrollments() }, [loadEnrollments])

  // Obtener todos los enrollments del usuario
  const getMyEnrollments = () => enrollments

  // Verificar si el usuario tiene acceso a un curso
  const hasAccess = (courseId) => {
    if (!currentUser) return false
    return enrollments.some(e => e.course_id === courseId)
  }

  // Obtener enrollment específico de un curso
  const getMyEnrollment = (courseId) => {
    if (!currentUser) return null
    return enrollments.find(e => e.course_id === courseId) || null
  }

  // Inscribir usuario a curso
  const enroll = async (courseId, courseTitle, courseCategory = 'otros') => {
    if (!currentUser) throw new Error('Debes iniciar sesión para inscribirte')

    const existing = enrollments.find(e => e.course_id === courseId)
    if (existing) return existing

    const newEnrollment = {
      id: `enrollment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      user_id: currentUser.id,
      course_id: courseId,
      status: 'not_started',
      progress: 0,
      score: 0,
      created_at: new Date().toISOString(),
    }

    const { data, error } = await supabase
      .from('enrollments')
      .insert(newEnrollment)
      .select()
      .single()

    if (error) throw new Error('Error al inscribirse: ' + error.message)
    setEnrollments(prev => [...prev, data])
    return data
  }

  // Actualizar progreso — auto-sets in_progress status
  const updateProgress = async (enrollmentId, progress, status = null) => {
    const updates = {
      progress,
      status: status || 'in_progress', // siempre pasa a in_progress al actualizar
    }

    const { error } = await supabase
      .from('enrollments')
      .update(updates)
      .eq('id', enrollmentId)

    if (!error) {
      setEnrollments(prev =>
        prev.map(e => e.id === enrollmentId ? { ...e, ...updates } : e)
      )
    }
  }

  // Completar curso
  const completeCourse = async (enrollmentId, score) => {
    const updates = {
      status: 'completed',
      progress: 100,
      score,
      // completed_at no incluido — columna puede no existir aún en la DB
    }

    const { error } = await supabase
      .from('enrollments')
      .update(updates)
      .eq('id', enrollmentId)

    if (!error) {
      setEnrollments(prev =>
        prev.map(e => e.id === enrollmentId ? { ...e, ...updates } : e)
      )
    } else {
      console.error('Error al completar curso:', error.message)
    }
  }

  // Estadísticas del usuario (síncrono porque enrollments está en estado)
  const getMyStats = () => {
    const inProgress  = enrollments.filter(e => e.status === 'in_progress').length
    const completed   = enrollments.filter(e => e.status === 'completed').length
    const notStarted  = enrollments.filter(e => e.status === 'not_started').length
    const completedList = enrollments.filter(e => e.status === 'completed')
    const avgScore = completedList.length > 0
      ? Math.round(completedList.reduce((sum, e) => sum + e.score, 0) / completedList.length)
      : 0

    return { total: enrollments.length, inProgress, completed, notStarted, avgScore }
  }

  // Filtrar por estado
  const filterByStatus = (status) => {
    if (status === 'all') return enrollments
    return enrollments.filter(e => e.status === status)
  }

  // Verificar si completó un curso específico
  const hasCompletedCourse = (userId, courseId) => {
    const enrollment = enrollments.find(e => e.course_id === courseId)
    return enrollment?.status === 'completed'
  }

  const value = {
    enrollments,
    loadingEnrollments,
    getMyEnrollments,
    hasAccess,
    getMyEnrollment,
    enroll,
    updateProgress,
    completeCourse,
    getMyStats,
    filterByStatus,
    hasCompletedCourse,
    refreshEnrollments: loadEnrollments,
  }

  return <EnrollmentContext.Provider value={value}>{children}</EnrollmentContext.Provider>
}
