import { useState } from 'react'
import { X, Check, Star } from 'lucide-react'
import { Button } from './ui/Button'
import { Badge } from './ui/Badge'
import { motion, AnimatePresence } from 'framer-motion'

const plans = [
    {
        id: 'basic',
        name: 'Básico Learner',
        duration: 'Ilimitado',
        priceMultiplier: 1,
        features: ['Acceso al curso completo', 'Acceso a 50 curso basicos', 'Contenido limitado', 'Cursos escritos', 'Comunidad de estudiantes'],
        color: 'from-blue-500 to-blue-600'
    },
    {
        id: 'standard',
        name: 'Medium Academy',
        duration: 'Mensual',
        priceMultiplier: 1.5,
        features: ['Acceso a 100+ cursos', 'Acceso a todas las Especialuzaciones', 'Proyectos guiados y practicas', 'Evaluaciones para comprobar tu aprendizaje'],
        color: 'from-purple-500 to-purple-600',
        popular: true
    },
    {
        id: 'premium',
        name: 'Pro Education',
        duration: 'Mensual',
        priceMultiplier: 2,
        features: ['Clases en vivo', 'Evaluaciones personalizadas', 'Ejercicios precticos avanzados', 'Certificados Profesionales', 'Soporte dedicado 24/7', 'Contenido y rutas de aprendizaje exclusivas'],
        color: 'from-orange-500 to-red-600'
    }
]

export const PlanSelectionModal = ({ course, isOpen, onClose, onSelectPlan }) => {
    const [selectedPlan, setSelectedPlan] = useState('standard')

    if (!isOpen || !course) return null

    const handleConfirm = () => {
        const plan = plans.find(p => p.id === selectedPlan)
        if (plan) {
            const planData = {
                id: plan.id,
                name: plan.name,
                price: (course.price * plan.priceMultiplier).toFixed(2),
                originalPrice: course.originalPrice ? (course.originalPrice * plan.priceMultiplier).toFixed(2) : null,
                duration: plan.duration,
                features: plan.features
            }
            onSelectPlan(planData)
            onClose()
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="bg-card border border-border rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        initial={{ scale: 0.9, y: 20 }}
                        animate={{ scale: 1, y: 0 }}
                        exit={{ scale: 0.9, y: 20 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-start justify-between z-10">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">Selecciona tu Plan</h2>
                                <p className="text-sm text-muted-foreground">{course.title}</p>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-muted rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Plans Grid */}
                        <div className="p-6">
                            <div className="grid md:grid-cols-3 gap-4 mb-6">
                                {plans.map((plan) => (
                                    <motion.button
                                        key={plan.id}
                                        onClick={() => setSelectedPlan(plan.id)}
                                        className={`relative p-6 rounded-xl border-2 transition-all text-left h-[480px] flex flex-col ${
                                            selectedPlan === plan.id
                                                ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20'
                                                : 'border-border bg-card hover:border-primary/50'
                                        }`}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {plan.popular && (
                                            <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                                                Más Popular
                                            </Badge>
                                        )}

                                        {selectedPlan === plan.id && (
                                            <div className="absolute top-4 right-4">
                                                <div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                                                    <Check className="w-4 h-4 text-primary-foreground" />
                                                </div>
                                            </div>
                                        )}

                                        {/* Icon and Title - Fixed height */}
                                        <div className="flex-shrink-0">
                                            <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${plan.color} flex items-center justify-center mb-4`}>
                                                <Star className="w-6 h-6 text-white" />
                                            </div>

                                            <h3 className="text-xl font-bold mb-1">{plan.name}</h3>
                                            <p className="text-sm text-muted-foreground mb-4 h-10">{plan.duration}</p>
                                        </div>

                                        {/* Price - Fixed height */}
                                        <div className="mb-6 flex-shrink-0 h-12">
                                            <span className="text-3xl font-bold text-primary">
                                                ${(course.price * plan.priceMultiplier).toFixed(2)}
                                            </span>
                                            {course.originalPrice && (
                                                <div className="text-sm text-muted-foreground line-through mt-1">
                                                    ${(course.originalPrice * plan.priceMultiplier).toFixed(2)}
                                                </div>
                                            )}
                                        </div>

                                        {/* Features - Flex grow to fill remaining space */}
                                        <ul className="space-y-2.5 flex-grow">
                                            {plan.features.map((feature, idx) => (
                                                <li key={idx} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                                                    <span className="leading-tight">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.button>
                                ))}
                            </div>

                            {/* Confirm Button */}
                            <div className="flex gap-3">
                                <Button
                                    onClick={onClose}
                                    variant="outline"
                                    className="flex-1"
                                >
                                    Cancelar
                                </Button>
                                <Button
                                    onClick={handleConfirm}
                                    className="flex-1 bg-primary hover:bg-primary/90"
                                >
                                    Agregar al Carrito
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
