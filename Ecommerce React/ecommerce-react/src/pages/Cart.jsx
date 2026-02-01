import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { PageTransition } from '../components/PageTransition'
import { motion, AnimatePresence } from 'framer-motion'
import { Trash2, ShoppingBag, ArrowRight, ArrowLeft } from 'lucide-react'

const Cart = () => {
    const { cart, removeFromCart, getCartTotal, clearCart } = useCart()
    const navigate = useNavigate()
    const [removingId, setRemovingId] = useState(null)

    const handleRemove = (courseId, planId) => {
        setRemovingId(`${courseId}-${planId}`)
        setTimeout(() => {
            removeFromCart(courseId, planId)
            setRemovingId(null)
        }, 300)
    }

    const handleCheckout = () => {
        if (cart.length === 0) return
        navigate('/pago/carrito', {
            state: {
                cartItems: cart,
                totalAmount: getCartTotal()
            }
        })
    }

    if (cart.length === 0) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-background flex flex-col">
                    <Header />
                    
                    <div className="flex-1 flex items-center justify-center px-4 py-16">
                        <motion.div
                            className="text-center max-w-md"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: 'spring' }}
                                className="mb-6"
                            >
                                <ShoppingBag className="w-24 h-24 mx-auto text-muted-foreground opacity-50" />
                            </motion.div>
                            
                            <h1 className="text-3xl font-bold mb-3">Tu carrito está vacío</h1>
                            <p className="text-muted-foreground mb-8">
                                Agrega cursos a tu carrito para comenzar tu aprendizaje
                            </p>
                            
                            <Link to="/">
                                <Button className="bg-primary hover:bg-primary/90">
                                    <ArrowLeft className="w-4 h-4 mr-2" />
                                    Explorar Cursos
                                </Button>
                            </Link>
                        </motion.div>
                    </div>
                    
                    <Footer />
                </div>
            </PageTransition>
        )
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                <Header />
                
                <div className="container mx-auto px-4 py-12">
                    {/* Header */}
                    <motion.div
                        className="mb-8"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <h1 className="text-4xl font-bold mb-2">Carrito de Compras</h1>
                        <p className="text-muted-foreground">
                            {cart.length} {cart.length === 1 ? 'curso' : 'cursos'} en tu carrito
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Lista de cursos */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {cart.map((item, index) => (
                                    <motion.div
                                        key={`${item.id}-${item.plan?.id}`}
                                        layout
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ 
                                            opacity: removingId === `${item.id}-${item.plan?.id}` ? 0 : 1,
                                            x: 0,
                                            scale: removingId === `${item.id}-${item.plan?.id}` ? 0.9 : 1
                                        }}
                                        exit={{ opacity: 0, x: -20 }}
                                        transition={{ duration: 0.3, delay: index * 0.05 }}
                                        className="bg-card border border-border rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                                    >
                                        <div className="p-4 md:p-6">
                                            <div className="flex gap-4">
                                                {/* Imagen */}
                                                <div className="flex-shrink-0">
                                                    <Link to={`/curso/${item.id}`}>
                                                        <img
                                                            src={item.image || '/placeholder.svg'}
                                                            alt={item.title}
                                                            className="w-24 h-24 md:w-32 md:h-32 object-cover rounded-lg hover:opacity-80 transition-opacity"
                                                        />
                                                    </Link>
                                                </div>

                                                {/* Detalles */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-4">
                                                        <div className="flex-1">
                                                            <Link 
                                                                to={`/curso/${item.id}`}
                                                                className="hover:text-primary transition-colors"
                                                            >
                                                                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                                                                    {item.title}
                                                                </h3>
                                                            </Link>
                                                            <p className="text-sm text-muted-foreground mb-2">
                                                                Por {item.instructor}
                                                            </p>
                                                            
                                                            {item.plan && (
                                                                <Badge variant="secondary" className="mb-2">
                                                                    Plan {item.plan.name} · {item.plan.duration}
                                                                </Badge>
                                                            )}
                                                        </div>

                                                        {/* Precio y eliminar */}
                                                        <div className="text-right space-y-2">
                                                            <div>
                                                                <p className="text-2xl font-bold text-primary">
                                                                    ${item.plan?.price || item.price}
                                                                </p>
                                                                {item.plan?.originalPrice && (
                                                                    <p className="text-sm text-muted-foreground line-through">
                                                                        ${item.plan.originalPrice}
                                                                    </p>
                                                                )}
                                                            </div>
                                                            
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={() => handleRemove(item.id, item.plan?.id)}
                                                                className="text-red-500 hover:text-red-600 hover:bg-red-500/10"
                                                            >
                                                                <Trash2 className="w-4 h-4 mr-1" />
                                                                Eliminar
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Botón limpiar carrito */}
                            {cart.length > 1 && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                >
                                    <Button
                                        variant="outline"
                                        onClick={clearCart}
                                        className="w-full text-red-500 hover:text-red-600 hover:bg-red-500/10 border-red-200"
                                    >
                                        <Trash2 className="w-4 h-4 mr-2" />
                                        Vaciar Carrito
                                    </Button>
                                </motion.div>
                            )}
                        </div>

                        {/* Resumen */}
                        <motion.div
                            className="lg:col-span-1"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <div className="bg-card border border-border rounded-xl p-6 shadow-lg sticky top-24">
                                <h2 className="text-xl font-bold mb-4">Resumen del Pedido</h2>
                                
                                <div className="space-y-3 mb-6">
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span className="font-semibold">${getCartTotal()}</span>
                                    </div>
                                    
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Descuento</span>
                                        <span className="font-semibold text-green-500">
                                            ${cart.reduce((total, item) => {
                                                const original = item.plan?.originalPrice || item.originalPrice || 0
                                                const current = item.plan?.price || item.price || 0
                                                return total + (original - current)
                                            }, 0).toFixed(2)}
                                        </span>
                                    </div>
                                    
                                    <div className="border-t border-border pt-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-lg font-bold">Total</span>
                                            <span className="text-2xl font-bold text-primary">
                                                ${getCartTotal()}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Button
                                    onClick={handleCheckout}
                                    className="w-full bg-gradient-to-r from-primary to-green-600 hover:from-primary/90 hover:to-green-600/90 text-lg py-6 shadow-lg shadow-primary/30"
                                >
                                    Proceder al Pago
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>

                                <Link to="/">
                                    <Button variant="ghost" className="w-full mt-3">
                                        <ArrowLeft className="w-4 h-4 mr-2" />
                                        Seguir Comprando
                                    </Button>
                                </Link>

                                <div className="mt-6 p-4 bg-primary/10 rounded-lg">
                                    <p className="text-xs text-muted-foreground text-center">
                                        🔒 Pago seguro y encriptado
                                    </p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
                
                <Footer />
            </div>
        </PageTransition>
    )
}

export default Cart
