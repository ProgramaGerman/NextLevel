import React, { createContext, useContext, useState, useEffect } from 'react'

const ReviewContext = createContext()

export const useReviews = () => {
  const context = useContext(ReviewContext)
  if (!context) {
    throw new Error('useReviews must be used within ReviewProvider')
  }
  return context
}

export const ReviewProvider = ({ children }) => {
  const [reviews, setReviews] = useState([])

  // Load reviews from localStorage on mount
  useEffect(() => {
    const storedReviews = localStorage.getItem('course_reviews')
    if (storedReviews) {
      try {
        setReviews(JSON.parse(storedReviews))
      } catch (error) {
        console.error('Error loading reviews:', error)
      }
    }
  }, [])

  // Save reviews to localStorage whenever they change
  useEffect(() => {
    if (reviews.length > 0) {
      localStorage.setItem('course_reviews', JSON.stringify(reviews))
    }
  }, [reviews])

  // Add a new review
  const addReview = (courseId, reviewData) => {
    const newReview = {
      id: `review-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      courseId,
      userId: reviewData.userId,
      userName: reviewData.userName,
      rating: reviewData.rating,
      comment: reviewData.comment,
      date: new Date().toISOString(),
      helpful: 0,
      verified: reviewData.verified || false // Usuario verificó que completó el curso
    }

    setReviews(prev => [newReview, ...prev])
    return newReview
  }

  // Get reviews for a specific course
  const getCourseReviews = (courseId) => {
    return reviews.filter(review => review.courseId === courseId)
  }

  // Get user's review for a course
  const getUserReview = (userId, courseId) => {
    return reviews.find(review => 
      review.userId === userId && review.courseId === courseId
    )
  }

  // Update a review
  const updateReview = (reviewId, updates) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId ? { ...review, ...updates } : review
      )
    )
  }

  // Delete a review
  const deleteReview = (reviewId) => {
    setReviews(prev => prev.filter(review => review.id !== reviewId))
  }

  // Mark review as helpful
  const markHelpful = (reviewId) => {
    setReviews(prev =>
      prev.map(review =>
        review.id === reviewId
          ? { ...review, helpful: review.helpful + 1 }
          : review
      )
    )
  }

  // Get average rating for a course
  const getCourseRating = (courseId) => {
    const courseReviews = getCourseReviews(courseId)
    if (courseReviews.length === 0) return 0

    const totalRating = courseReviews.reduce((sum, review) => sum + review.rating, 0)
    return (totalRating / courseReviews.length).toFixed(1)
  }

  // Get rating distribution for a course
  const getRatingDistribution = (courseId) => {
    const courseReviews = getCourseReviews(courseId)
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }

    courseReviews.forEach(review => {
      distribution[review.rating]++
    })

    return distribution
  }

  const value = {
    reviews,
    addReview,
    getCourseReviews,
    getUserReview,
    updateReview,
    deleteReview,
    markHelpful,
    getCourseRating,
    getRatingDistribution
  }

  return (
    <ReviewContext.Provider value={value}>
      {children}
    </ReviewContext.Provider>
  )
}
