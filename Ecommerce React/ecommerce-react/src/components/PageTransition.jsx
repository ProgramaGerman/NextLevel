import { motion } from "framer-motion";

/**
 * PageTransition - Componente wrapper para animaciones de transición entre páginas
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página
 */
export function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.4,
                ease: [0.22, 1, 0.36, 1], // Easing suave y profesional
            }}
        >
            {children}
        </motion.div>
    );
}
