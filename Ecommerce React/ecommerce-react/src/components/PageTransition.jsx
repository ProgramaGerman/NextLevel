import { motion } from "framer-motion";
import { memo } from "react";

/**
 * PageTransition - Componente wrapper para animaciones de transición entre páginas
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido de la página
 */
export const PageTransition = memo(function PageTransition({ children }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
                duration: 0.3, // Reducido de 0.4 a 0.3 para mejor percepción
                ease: [0.22, 1, 0.36, 1], // Easing suave y profesional
            }}
            layout="position" // Optimizar layout shifts
        >
            {children}
        </motion.div>
    );
});
