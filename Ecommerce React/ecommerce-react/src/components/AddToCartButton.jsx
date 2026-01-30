import { useState } from 'react'
import { ShoppingCart, Check } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { Button } from './ui/Button'
import { PlanSelectionModal } from './PlanSelectionModal'
import { motion, AnimatePresence } from 'framer-motion'

export const AddToCartButton = ({ 
    course, 
    plan = null, 
    variant = 'default',
    className = '',
    size = 'default',
    showIcon = true,
    children
}) => {
    const { addToCart, isInCart } = useCart()
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [isAdding, setIsAdding] = useState(false)
    const [justAdded, setJustAdded] = useState(false)
    
    const inCart = plan ? isInCart(course.id, plan?.id) : false

    const handleClick = (e) => {
        e.preventDefault()
        e.stopPropagation()
        
        if (inCart) return
        
        // If plan is provided (from Buy page), add directly
        if (plan) {
            handleAddToCart(plan)
        } else {
            // Otherwise, show modal to select plan
            setIsModalOpen(true)
        }
    }

    const handleAddToCart = (selectedPlan) => {
        setIsAdding(true)
        addToCart(course, selectedPlan)
        
        setTimeout(() => {
            setIsAdding(false)
            setJustAdded(true)
            
            setTimeout(() => {
                setJustAdded(false)
            }, 2000)
        }, 300)
    }

    const handlePlanSelect = (selectedPlan) => {
        handleAddToCart(selectedPlan)
    }

    return (
        <>
            <Button
                onClick={handleClick}
                disabled={isAdding || inCart}
                variant={variant}
                className={`${className} relative overflow-hidden`}
                size={size}
            >
                <AnimatePresence mode="wait">
                    {isAdding ? (
                        <motion.span
                            key="adding"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            Agregando...
                        </motion.span>
                    ) : justAdded || inCart ? (
                        <motion.span
                            key="added"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            {showIcon && <Check className="w-4 h-4" />}
                            {inCart ? 'En el Carrito' : '¡Agregado!'}
                        </motion.span>
                    ) : (
                        <motion.span
                            key="add"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="flex items-center gap-2"
                        >
                            {showIcon && <ShoppingCart className="w-4 h-4" />}
                            {children || 'Agregar al Carrito'}
                        </motion.span>
                    )}
                </AnimatePresence>
            </Button>

            <PlanSelectionModal
                course={course}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelectPlan={handlePlanSelect}
            />
        </>
    )
}
