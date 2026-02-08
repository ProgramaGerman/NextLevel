import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useReviews } from '../context/ReviewContext'
import { useEnrollment } from '../context/EnrollmentContext'
import { RatingStars } from './RatingStars'
import { Button } from './ui/Button'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, AlertCircle, CheckCircle2 } from 'lucide-react'

export const ReviewForm = ({ courseId, onReviewSubmitted }) => {
  const { currentUser } = useAuth()
  const { addReview, getUserReview } = useReviews()
  const { hasCompletedCourse } = useEnrollment()
  const [rating, setRating] = useState(0)
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Check if user already reviewed
  const existingReview = currentUser ? getUserReview(currentUser.id, courseId) : null
  
  // Check if user completed the course
  const courseCompleted = currentUser ? hasCompletedCourse(currentUser.id, courseId) : false

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!currentUser) {
      setError('Debes iniciar sesión para dejar una reseña')
      return
    }

    if (existingReview) {
      setError('Ya has dejado una reseña para este curso')
      return
    }

    if (rating === 0) {
      setError('Por favor selecciona una calificación')
      return
    }

    if (comment.trim().length < 10) {
      setError('El comentario debe tener al menos 10 caracteres')
      return
    }

    setIsSubmitting(true)

    try {
      const reviewData = {
        userId: currentUser.id,
        userName: `${currentUser.name} ${currentUser.lastname}`,
        rating,
        comment: comment.trim(),
        verified: courseCompleted
      }

      addReview(courseId, reviewData)
      setSuccess(true)
      setRating(0)
      setComment('')

      // Call callback if provided
      if (onReviewSubmitted) {
        onReviewSubmitted()
      }

      // Reset success message after 3 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 3000)
    } catch (err) {
      setError('Error al enviar la reseña. Intenta nuevamente.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!currentUser) {
    return (
      <div className="bg-muted/50 border border-border rounded-xl p-6 text-center">
        <AlertCircle className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
        <p className="text-muted-foreground">
          Inicia sesión para dejar una reseña
        </p>
      </div>
    )
  }

  if (existingReview) {
    return (
      <div className="bg-primary/5 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-2">
          <CheckCircle2 className="w-5 h-5 text-primary" />
          <p className="font-semibold">Ya has dejado tu reseña</p>
        </div>
        <p className="text-sm text-muted-foreground">
          Gracias por compartir tu opinión sobre este curso
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="bg-card border border-border rounded-xl p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h3 className="text-xl font-bold mb-4">Deja tu reseña</h3>

      {courseCompleted && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-green-600" />
          <span className="text-sm text-green-600 font-medium">
            Completaste este curso - Tu reseña será verificada
          </span>
        </div>
      )}

      <AnimatePresence>
        {error && (
          <motion.div
            className="bg-destructive/10 border border-destructive/20 rounded-lg p-3 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <AlertCircle className="w-4 h-4 text-destructive" />
            <span className="text-sm text-destructive">{error}</span>
          </motion.div>
        )}

        {success && (
          <motion.div
            className="bg-green-500/10 border border-green-500/20 rounded-lg p-3 mb-4 flex items-center gap-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <span className="text-sm text-green-600">¡Reseña publicada exitosamente!</span>
          </motion.div>
        )}
      </AnimatePresence>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Rating */}
        <div>
          <label className="block text-sm font-medium mb-3">
            Calificación
          </label>
          <div className="flex items-center gap-2">
            <RatingStars
              rating={rating}
              onRatingChange={setRating}
              size="lg"
              interactive
            />
            {rating > 0 && (
              <span className="text-sm text-muted-foreground">
                ({rating} {rating === 1 ? 'estrella' : 'estrellas'})
              </span>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium mb-2">
            Tu opinión
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Comparte tu experiencia con este curso..."
            rows={4}
            className="w-full px-4 py-3 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            disabled={isSubmitting}
          />
          <p className="text-xs text-muted-foreground mt-1">
            Mínimo 10 caracteres ({comment.length}/10)
          </p>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting || rating === 0 || comment.trim().length < 10}
          className="w-full"
        >
          {isSubmitting ? 'Publicando...' : 'Publicar Reseña'}
        </Button>
      </form>
    </motion.div>
  )
}
