import { ShoppingCart } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { motion, AnimatePresence } from 'framer-motion'

export const CartIcon = () => {
    const { getCartItemCount } = useCart()
    const itemCount = getCartItemCount()

    return (
        <Link 
            to="/carrito" 
            className="relative group"
        >
            <motion.div
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-primary/10 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
            >
                <ShoppingCart className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
                
                <AnimatePresence mode="wait">
                    {itemCount > 0 && (
                        <motion.div
                            key={itemCount}
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                            className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center"
                        >
                            {itemCount > 9 ? '9+' : itemCount}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>
        </Link>
    )
}
