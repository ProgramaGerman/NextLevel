import React, { useState } from 'react'
import { useReviews } from '../context/ReviewContext'
import { RatingStars } from './RatingStars'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { motion } from 'framer-motion'
import { 
  ThumbsUp, 
  CheckCircle, 
  Calendar,
  TrendingUp,
  Filter
} from 'lucide-react'

export const ReviewList = ({ courseId }) => {
  const { getCourseReviews, getCourseRating, getRatingDistribution, markHelpful } = useReviews()
  const [sortBy, setSortBy] = useState('recent') // recent, rating, helpful
  const [filterBy, setFilterBy] = useState('all') // all, verified, 5, 4, 3, 2, 1

  const allReviews = getCourseReviews(courseId)
  const averageRating = getCourseRating(courseId)
  const distribution = getRatingDistribution(courseId)

  // Sort reviews
  const sortedReviews = [...allReviews].sort((a, b) => {
    switch (sortBy) {
      case 'rating':
        return b.rating - a.rating
      case 'helpful':
        return b.helpful - a.helpful
      case 'recent':
      default:
        return new Date(b.date) - new Date(a.date)
    }
  })

  // Filter reviews
  const filteredReviews = sortedReviews.filter(review => {
    if (filterBy === 'all') return true
    if (filterBy === 'verified') return review.verified
    return review.rating === parseInt(filterBy)
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now - date)
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'Hoy'
    if (diffDays === 1) return 'Ayer'
    if (diffDays < 7) return `Hace ${diffDays} días`
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`
    
    return date.toLocaleDateString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })
  }

  const getRatingPercentage = (stars) => {
    const total = allReviews.length
    if (total === 0) return 0
    return Math.round((distribution[stars] / total) * 100)
  }

  if (allReviews.length === 0) {
    return (
      <div className="bg-muted/50 border border-border rounded-xl p-8 text-center">
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
          <TrendingUp className="w-8 h-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">Sin reseñas aún</h3>
        <p className="text-sm text-muted-foreground">
          Sé el primero en compartir tu opinión sobre este curso
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Rating Overview */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Average Rating */}
          <div className="text-center md:text-left">
            <div className="flex flex-col md:flex-row items-center gap-4">
              <div className="text-center">
                <p className="text-5xl font-bold mb-2">{averageRating}</p>
                <RatingStars rating={parseFloat(averageRating)} size="lg" />
                <p className="text-sm text-muted-foreground mt-2">
                  {allReviews.length} {allReviews.length === 1 ? 'reseña' : 'reseñas'}
                </p>
              </div>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map(stars => (
              <div key={stars} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-16">
                  <span className="text-sm font-medium">{stars}</span>
                  <span className="text-yellow-500">★</span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${getRatingPercentage(stars)}%` }}
                  />
                </div>
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {getRatingPercentage(stars)}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Ordenar por</label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="recent">Más recientes</option>
            <option value="rating">Mejor valoradas</option>
            <option value="helpful">Más útiles</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="block text-sm font-medium mb-2">Filtrar por</label>
          <select
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="w-full px-4 py-2 rounded-lg border border-input bg-background focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="all">Todas las reseñas</option>
            <option value="verified">Verificadas</option>
            <option value="5">5 estrellas</option>
            <option value="4">4 estrellas</option>
            <option value="3">3 estrellas</option>
            <option value="2">2 estrellas</option>
            <option value="1">1 estrella</option>
          </select>
        </div>
      </div>

      {/* Reviews List */}
      {filteredReviews.length > 0 ? (
        <div className="space-y-4">
          {filteredReviews.map((review, index) => (
            <motion.div
              key={review.id}
              className="bg-card border border-border rounded-xl p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              {/* Review Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                      <span className="text-lg font-bold text-primary-foreground">
                        {review.userName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold">{review.userName}</h4>
                        {review.verified && (
                          <Badge variant="secondary" className="gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Verificado
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(review.date)}
                      </div>
                    </div>
                  </div>
                </div>
                <RatingStars rating={review.rating} />
              </div>

              {/* Review Content */}
              <p className="text-sm mb-4 leading-relaxed">{review.comment}</p>

              {/* Review Footer */}
              <div className="flex items-center gap-4 pt-4 border-t border-border">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markHelpful(review.id)}
                  className="gap-2"
                >
                  <ThumbsUp className="w-4 h-4" />
                  Útil ({review.helpful})
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <Filter className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
          <p className="text-muted-foreground">
            No hay reseñas que coincidan con los filtros seleccionados
          </p>
        </div>
      )}
    </div>
  )
}
