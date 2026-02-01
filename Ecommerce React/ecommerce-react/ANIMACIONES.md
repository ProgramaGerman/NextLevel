# 🎬 Animaciones y Transiciones

Este documento explica las animaciones implementadas en la aplicación para crear una experiencia de usuario premium y fluida.

## 📦 Tecnología Utilizada

**Framer Motion** - La biblioteca líder para animaciones en React
- Instalación: `npm install framer-motion`
- Documentación: https://www.framer.com/motion/

## 🎨 Animaciones Implementadas

### 1. **Transiciones de Página** (`PageTransition.jsx`)

Componente reutilizable que envuelve cada página para crear transiciones suaves:

```javascript
- Fade-in: Opacidad de 0 a 1
- Slide-up: Movimiento vertical de 20px hacia arriba
- Duración: 0.4 segundos
- Easing: Curva personalizada [0.22, 1, 0.36, 1] para un efecto profesional
```

**Uso:**
- Página Home: Envuelta en `<PageTransition>`
- Página Product: Envuelta en `<PageTransition>`

### 2. **Página de Producto** (`product.jsx`)

#### Imagen del Curso
```javascript
- Inicial: Opacidad 0, escala 0.9
- Final: Opacidad 1, escala 1
- Delay: 0.2 segundos
- Efecto: Aparece con zoom-in suave
```

#### Detalles del Curso
```javascript
- Inicial: Opacidad 0, desplazamiento 30px a la derecha
- Final: Opacidad 1, posición normal
- Delay: 0.3 segundos
- Efecto: Se desliza desde la derecha
```

#### Cursos Relacionados
```javascript
- Contenedor: Fade-in con slide-up, delay 0.5s
- Tarjetas individuales: Stagger effect (escalonado)
  - Cada tarjeta tiene un delay adicional de 0.1s
  - Efecto: Aparecen una tras otra en secuencia
```

### 3. **Tarjetas de Curso** (`CourseCard.jsx`)

#### Hover en la Tarjeta
```javascript
- Efecto: Elevación (lift)
- Movimiento: -8px en el eje Y
- Duración: 0.3 segundos
- Resultado: La tarjeta "flota" al pasar el mouse
```

#### Hover en la Imagen
```javascript
- Efecto: Zoom
- Escala: 1.05 (5% más grande)
- Duración: 0.4 segundos
- Resultado: La imagen se amplía suavemente
```

## 🔧 Configuración en App.jsx

```javascript
<AnimatePresence mode="wait">
  <Routes location={location} key={location.pathname}>
    {/* Rutas */}
  </Routes>
</AnimatePresence>
```

**`mode="wait"`**: Espera a que la página actual termine su animación de salida antes de mostrar la nueva página.

**`key={location.pathname}`**: Asegura que React reconozca el cambio de ruta y active las animaciones.

## 🎯 Beneficios de las Animaciones

1. **Experiencia Premium**: Las transiciones suaves hacen que la aplicación se sienta más profesional
2. **Feedback Visual**: Los usuarios saben que algo está sucediendo
3. **Jerarquía Visual**: Las animaciones escalonadas guían la atención del usuario
4. **Engagement**: Las interacciones animadas son más satisfactorias
5. **Percepción de Velocidad**: Las animaciones bien diseñadas hacen que la app se sienta más rápida

## 🚀 Mejores Prácticas Aplicadas

- ✅ Duraciones cortas (0.3-0.5s) para mantener la fluidez
- ✅ Easing curves personalizadas para movimientos naturales
- ✅ Delays estratégicos para crear jerarquía
- ✅ Animaciones sutiles que no distraen
- ✅ Performance optimizado (GPU-accelerated transforms)

## 📝 Cómo Agregar Más Animaciones

### Ejemplo: Animar un nuevo componente

```javascript
import { motion } from "framer-motion";

function MiComponente() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Contenido */}
    </motion.div>
  );
}
```

### Ejemplo: Stagger children (efecto cascada)

```javascript
<motion.div
  initial="hidden"
  animate="visible"
  variants={{
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }}
>
  {items.map(item => (
    <motion.div
      key={item.id}
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0 }
      }}
    >
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## 🎨 Personalización

Para ajustar las animaciones, modifica estos valores:

- **Duración**: Cambia `duration` en los objetos `transition`
- **Easing**: Modifica el array `ease` para diferentes curvas
- **Distancia**: Ajusta los valores de `x`, `y` en `initial`
- **Delays**: Modifica el valor `delay` para cambiar el timing

---

**Nota**: Todas las animaciones están optimizadas para performance usando propiedades que activan la aceleración por GPU (transform, opacity).
