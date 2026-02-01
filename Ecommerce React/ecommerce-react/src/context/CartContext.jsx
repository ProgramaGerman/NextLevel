import { createContext, useContext, useState, useEffect } from 'react'

const CartContext = createContext()

export const useCart = () => {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}

export const CartProvider = ({ children }) => {
    const CART_STORAGE_KEY = 'nextlevel_cart'
    
    // Inicializar el carrito desde localStorage
    const [cart, setCart] = useState(() => {
        try {
            const savedCart = localStorage.getItem(CART_STORAGE_KEY)
            return savedCart ? JSON.parse(savedCart) : []
        } catch (error) {
            console.error('Error loading cart from localStorage:', error)
            return []
        }
    })

    // Guardar el carrito en localStorage cada vez que cambie
    useEffect(() => {
        try {
            localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
        } catch (error) {
            console.error('Error saving cart to localStorage:', error)
        }
    }, [cart])

    // Agregar curso al carrito
    const addToCart = (course, plan = null) => {
        setCart(prevCart => {
            // Verificar si el curso ya está en el carrito
            const existingItemIndex = prevCart.findIndex(
                item => item.id === course.id && item.plan?.id === plan?.id
            )

            if (existingItemIndex > -1) {
                // Si ya existe, no hacer nada (o podrías incrementar cantidad si implementas eso)
                return prevCart
            }

            // Agregar nuevo item al carrito
            const newItem = {
                ...course,
                plan: plan || {
                    id: 'basic',
                    name: 'Básico',
                    price: course.price,
                    originalPrice: course.originalPrice,
                    duration: '3 meses de acceso'
                },
                addedAt: new Date().toISOString()
            }

            return [...prevCart, newItem]
        })
    }

    // Eliminar curso del carrito
    const removeFromCart = (courseId, planId = null) => {
        setCart(prevCart => 
            prevCart.filter(item => {
                if (planId) {
                    return !(item.id === courseId && item.plan?.id === planId)
                }
                return item.id !== courseId
            })
        )
    }

    // Limpiar todo el carrito
    const clearCart = () => {
        setCart([])
    }

    // Obtener cantidad de items en el carrito
    const getCartItemCount = () => {
        return cart.length
    }

    // Obtener precio total del carrito
    const getCartTotal = () => {
        return cart.reduce((total, item) => {
            const price = item.plan?.price || item.price
            return total + parseFloat(price)
        }, 0).toFixed(2)
    }

    // Verificar si un curso está en el carrito
    const isInCart = (courseId, planId = null) => {
        return cart.some(item => {
            if (planId) {
                return item.id === courseId && item.plan?.id === planId
            }
            return item.id === courseId
        })
    }

    const value = {
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        getCartItemCount,
        getCartTotal,
        isInCart
    }

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    )
}
