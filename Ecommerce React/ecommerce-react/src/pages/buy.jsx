/**
 Pagina que se encarga de la logica de compra, donde se muestra el carrito y el precio total, con una
 confirmacion antes de pasar a los metodos de pago 
 */

import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getCourseById } from '../lib/data'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageTransition } from '../components/PageTransition'
import { motion } from 'framer-motion'
import { Check, Star, Users, Clock, Download, Award, CheckCircle2 } from 'lucide-react'

const Buy = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const course = getCourseById(id)
    const [selectedPlan, setSelectedPlan] = useState(null)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [tempSelectedPlan, setTempSelectedPlan] = useState(null)

    // Scroll al inicio cuando se carga la página
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    // Nombres de planes según la categoría del curso
    const getPlanNames = (category) => {
        const planNamesByCategory = {
            illustration: ['Principiante', 'Dibujante', 'Artista'],
            design: ['Aprendiz', 'Diseñador', 'Creativo'],
            photography: ['Aficionado', 'Fotógrafo', 'Profesional'],
            video: ['Novato', 'Editor', 'Cineasta'],
            '3d': ['Iniciado', 'Modelador', 'Animator'],
            marketing: ['Estudiante', 'Estratega', 'Experto'],
            web: ['Junior', 'Developer', 'Senior'],
            craft: ['Aprendiz', 'Artesano', 'Maestro']
        }
        return planNamesByCategory[category] || ['Básico', 'Estándar', 'Premium']
    }

    const planNames = getPlanNames(course?.category)

    // Planes de compra disponibles
    const plans = [
        {
            id: 'basic',
            name: planNames[0],
            price: course?.price || 5.99,
            originalPrice: course?.originalPrice || 39.99,
            duration: '3 meses de acceso',
            features: [
                'Acceso al curso completo',
                'Videos en calidad HD',
                'Recursos descargables',
                'Comunidad de estudiantes',
                'Soporte por email'
            ],
            popular: false,
            color: 'from-gray-500 to-gray-700'
        },
        {
            id: 'standard',
            name: planNames[1],
            price: ((course?.price || 5.99) * 1.5).toFixed(2),
            originalPrice: ((course?.originalPrice || 39.99) * 1.5).toFixed(2),
            duration: '6 meses de acceso',
            features: [
                `Todo lo del plan ${planNames[0]}`,
                'Videos en calidad 4K',
                'Proyectos prácticos adicionales',
                'Certificado de finalización',
                'Soporte prioritario',
                'Actualizaciones del curso'
            ],
            popular: true,
            color: 'from-primary to-green-600'
        },
        {
            id: 'premium',
            name: planNames[2],
            price: ((course?.price || 5.99) * 2.2).toFixed(2),
            originalPrice: ((course?.originalPrice || 39.99) * 2.2).toFixed(2),
            duration: 'Acceso de por vida',
            features: [
                `Todo lo del plan ${planNames[1]}`,
                'Acceso ilimitado de por vida',
                'Sesión 1-a-1 con el instructor',
                'Material exclusivo premium',
                'Acceso a todos los cursos futuros',
                'Membresía en comunidad VIP',
                'Soporte 24/7'
            ],
            popular: false,
            color: 'from-yellow-500 to-orange-600'
        }
    ]

    if (!course) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Curso no encontrado</h1>
                        <Button onClick={() => navigate('/')}>Volver al inicio</Button>
                    </div>
                </div>
            </PageTransition>
        )
    }

    const handleOpenModal = () => {
        setTempSelectedPlan(selectedPlan)
        setIsModalOpen(true)
    }

    const handleConfirmSelection = () => {
        setSelectedPlan(tempSelectedPlan)
        setIsModalOpen(false)
    }

    const handleContinue = () => {
        if (!selectedPlan) {
            alert('Por favor selecciona un plan para continuar')
            return
        }
        // Navegar a la página de pago con los datos del curso y plan
        navigate(`/pago/${id}`, {
            state: {
                plan: selectedPlan,
                planData: selectedPlanData
            }
        })
    }

    const selectedPlanData = plans.find(p => p.id === selectedPlan)

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Header />
                
                <div className="container mx-auto px-4 py-12">
                    {/* Información del curso con selector de plan */}
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-lg">
                            <div className="grid md:grid-cols-3 gap-6 p-6">
                                <div className="md:col-span-1">
                                    <div className="relative">
                                        {course.badge && (
                                            <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">
                                                {course.badge}
                                            </Badge>
                                        )}
                                        <img
                                            src={course.image || "/placeholder.svg"}
                                            alt={course.title}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    </div>
                                </div>
                                <div className="md:col-span-2 space-y-4">
                                    <div>
                                        <h1 className="text-3xl md:text-4xl font-bold mb-2">{course.title}</h1>
                                        <p className="text-lg text-muted-foreground">
                                            Por <span className="font-semibold text-foreground">{course.instructor}</span>
                                        </p>
                                    </div>
                                    
                                    <p className="text-muted-foreground leading-relaxed">
                                        {course.description}
                                    </p>
                                    
                                    <div className="flex flex-wrap gap-6 pt-4 border-t border-border">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Estudiantes</p>
                                                <p className="font-semibold">{course.students.toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Star className="w-5 h-5 text-primary fill-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Valoración</p>
                                                <p className="font-semibold">{course.rating}% ({(course.reviews / 1000).toFixed(1)}K reseñas)</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Award className="w-5 h-5 text-primary" />
                                            <div>
                                                <p className="text-sm text-muted-foreground">Categoría</p>
                                                <p className="font-semibold capitalize">{course.category}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Mostrar plan seleccionado o botón para seleccionar */}
                                    <div className="pt-4 border-t border-border">
                                        {selectedPlan ? (
                                            <div className="flex items-center justify-between bg-primary/10 rounded-lg p-4">
                                                <div>
                                                    <p className="text-sm text-muted-foreground mb-1">Plan seleccionado</p>
                                                    <p className="font-bold text-primary text-lg">{selectedPlanData?.name}</p>
                                                    <p className="text-sm text-muted-foreground">${selectedPlanData?.price} · {selectedPlanData?.duration}</p>
                                                </div>
                                                <Button 
                                                    onClick={handleOpenModal}
                                                    variant="outline"
                                                    className="text-sm py-2 px-4"
                                                >
                                                    Cambiar Plan
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button 
                                                onClick={handleOpenModal}
                                                className="w-full bg-primary hover:bg-primary/90 text-lg py-6"
                                            >
                                                Seleccionar Plan
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Botón de continuar al pago */}
                    <motion.div
                        className="text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <Button
                            onClick={handleContinue}
                            disabled={!selectedPlan}
                            className={`px-8 py-4 text-base font-semibold ${
                                selectedPlan 
                                    ? 'bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 shadow-lg shadow-primary/30' 
                                    : 'bg-muted text-muted-foreground cursor-not-allowed'
                            }`}
                        >
                            {selectedPlan ? 'Continuar al Pago' : 'Selecciona un plan para continuar'}
                        </Button>
                    </motion.div>
                </div>

                {/* Modal flotante para selección de planes */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                        <motion.div
                            className="bg-background border border-border rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            <div className="sticky top-0 bg-background border-b border-border px-6 py-4 flex items-center justify-between">
                                <div>
                                    <h2 className="text-2xl font-bold">Selecciona tu plan</h2>
                                    <p className="text-sm text-muted-foreground">Elige el plan que mejor se adapte a ti</p>
                                </div>
                                <Button
                                    onClick={() => setIsModalOpen(false)}
                                    variant="outline"
                                    className="rounded-full w-8 h-8 p-0"
                                >
                                    ✕
                                </Button>
                            </div>

                            <div className="p-6">
                                {/* Cards de planes en el modal */}
                                <div className="grid md:grid-cols-3 gap-6 mb-6">
                                    {plans.map((plan, index) => (
                                        <motion.div
                                            key={plan.id}
                                            className={`relative bg-card border-2 rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 cursor-pointer ${
                                                tempSelectedPlan === plan.id 
                                                    ? 'border-primary shadow-xl shadow-primary/20' 
                                                    : 'border-border hover:border-primary/50'
                                            }`}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.3, delay: index * 0.1 }}
                                            onClick={() => setTempSelectedPlan(plan.id)}
                                        >
                                            {/* Badge popular */}
                                            {plan.popular && (
                                                <div className={`absolute top-0 left-0 right-0 bg-gradient-to-r ${plan.color} text-white text-center py-2 font-semibold text-sm`}>
                                                    ⭐ MÁS POPULAR
                                                </div>
                                            )}

                                            {/* Indicador de selección */}
                                            {tempSelectedPlan === plan.id && (
                                                <div className="absolute top-3 right-3 z-10">
                                                    <CheckCircle2 className="w-7 h-7 text-primary fill-primary" />
                                                </div>
                                            )}

                                            <div className={`p-5 ${plan.popular ? 'pt-14' : 'pt-5'}`}>
                                                {/* Header del plan */}
                                                <div className="text-center mb-4">
                                                    <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                                                    <div className="flex items-center justify-center gap-2 mb-2">
                                                        <span className="text-3xl font-bold text-primary">${plan.price}</span>
                                                        <span className="text-base text-muted-foreground line-through">${plan.originalPrice}</span>
                                                    </div>
                                                    <Badge variant="secondary" className="mb-2">
                                                        {Math.round((1 - plan.price / plan.originalPrice) * 100)}% OFF
                                                    </Badge>
                                                    <div className="flex items-center justify-center gap-1 text-sm text-muted-foreground">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{plan.duration}</span>
                                                    </div>
                                                </div>

                                                {/* Características */}
                                                <div className="space-y-2 mb-4">
                                                    {plan.features.map((feature, idx) => (
                                                        <div key={idx} className="flex items-start gap-2">
                                                            <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                                                            <span className="text-sm text-muted-foreground">{feature}</span>
                                                        </div>
                                                    ))}
                                                </div>

                                                {/* Botón de selección */}
                                                <Button
                                                    className={`w-full ${
                                                        tempSelectedPlan === plan.id
                                                            ? 'bg-primary hover:bg-primary/90'
                                                            : 'bg-secondary hover:bg-secondary/80'
                                                    }`}
                                                    onClick={() => setTempSelectedPlan(plan.id)}
                                                >
                                                    {tempSelectedPlan === plan.id ? 'Seleccionado' : 'Seleccionar'}
                                                </Button>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Botón confirmar */}
                                <div className="flex justify-center gap-3">
                                    <Button
                                        onClick={() => setIsModalOpen(false)}
                                        variant="outline"
                                        className="px-8 py-3"
                                    >
                                        Cancelar
                                    </Button>
                                    <Button
                                        onClick={handleConfirmSelection}
                                        disabled={!tempSelectedPlan}
                                        className={`px-8 py-3 ${
                                            tempSelectedPlan
                                                ? 'bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90'
                                                : 'bg-muted text-muted-foreground cursor-not-allowed'
                                        }`}
                                    >
                                        Continuar
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}

                <Footer />
            </div>
        </PageTransition>
    )
}

export default Buy


