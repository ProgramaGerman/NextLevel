import React from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Badge } from './ui/Badge'
import { Button } from './ui/Button'
import { Play, CheckCircle, Clock } from 'lucide-react'

const EnrollmentCard = ({ enrollment, course }) => {
  const navigate = useNavigate()

  const getStatusConfig = (status) => {
    const configs = {
      not_started: {
        label: 'Por Empezar',
        variant: 'secondary',
        icon: Clock,
        buttonText: 'Comenzar',
        buttonAction: () => navigate(`/course/${course.id}`)
      },
      in_progress: {
        label: 'En Progreso',
        variant: 'default',
        icon: Play,
        buttonText: 'Continuar',
        buttonAction: () => navigate(`/course/${course.id}`)
      },
      completed: {
        label: 'Completado',
        variant: 'outline',
        icon: CheckCircle,
        buttonText: 'Ver Curso',
        buttonAction: () => navigate(`/course/${course.id}`)
      }
    }
    return configs[status] || configs.not_started
  }

  const statusConfig = getStatusConfig(enrollment.status)
  const StatusIcon = statusConfig.icon

  return (
    <motion.div
      className="rounded-lg border border-border bg-card overflow-hidden hover:shadow-xl hover:border-primary/50 transition-all cursor-pointer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -4, scale: 1.02 }}
    >
      {/* Course Image */}
      <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center">
        <span className="text-6xl">{course.icon || '📚'}</span>
        <div className="absolute top-3 right-3">
          <Badge variant={statusConfig.variant} className="gap-1">
            <StatusIcon className="w-3 h-3" />
            {statusConfig.label}
          </Badge>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{course.title}</h3>
        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
          {course.description || 'Curso completo con contenido de alta calidad'}
        </p>

        {/* Progress Bar */}
        {enrollment.status !== 'not_started' && (
          <div className="mb-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Progreso</span>
              <span className="font-semibold">{enrollment.progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary"
                initial={{ width: 0 }}
                animate={{ width: `${enrollment.progress}%` }}
                transition={{ duration: 0.5, delay: 0.2 }}
              />
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2 mb-4">
          {enrollment.status === 'in_progress' && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => navigate(`/aprender/${enrollment.courseId}`)}
            >
              <Play className="w-4 h-4 mr-1" />
              Continuar
            </Button>
          )}
          {enrollment.status === 'not_started' && (
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={() => navigate(`/aprender/${enrollment.courseId}`)}
            >
              <Play className="w-4 h-4 mr-1" />
              Comenzar
            </Button>
          )}
          {enrollment.status === 'completed' && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={() => navigate(`/aprender/${enrollment.courseId}`)}
            >
              <RotateCcw className="w-4 h-4 mr-1" />
              Repasar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate(`/curso/${enrollment.courseId}`)}
          >
            Ver Detalles
          </Button>
        </div>

        {/* Score (if completed) */}
        {enrollment.status === 'completed' && enrollment.score > 0 && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Calificación Final</span>
              <span className="text-2xl font-bold text-green-600">{enrollment.score}%</span>
            </div>
          </div>
        )}

        {/* Action Button */}
        <Button
          onClick={statusConfig.buttonAction}
          className="w-full"
          variant={enrollment.status === 'completed' ? 'outline' : 'default'}
        >
          {statusConfig.buttonText}
        </Button>
      </div>
    </motion.div>
  )
}

export default EnrollmentCard
