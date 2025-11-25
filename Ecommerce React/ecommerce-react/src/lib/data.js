/**
 * @typedef {Object} Course
 * @property {string} id
 * @property {string} title
 * @property {string} instructor
 * @property {string} description
 * @property {string} image
 * @property {number} price
 * @property {number} originalPrice
 * @property {number} rating
 * @property {number} reviews
 * @property {number} students
 * @property {string} category
 * @property {string} [badge]
 */

/**
 * @typedef {Object} Category
 * @property {string} id
 * @property {string} name
 * @property {string} icon
 * @property {number} count
 */

/** @type {Category[]} */
export const categories = [
    { id: "illustration", name: "Ilustración", icon: "🎨", count: 245 },
    { id: "design", name: "Diseño", icon: "✏️", count: 189 },
    { id: "photography", name: "Fotografía", icon: "📷", count: 156 },
    { id: "video", name: "Video", icon: "🎬", count: 98 },
    { id: "3d", name: "3D y Animación", icon: "🎮", count: 87 },
    { id: "marketing", name: "Marketing", icon: "📈", count: 124 },
    { id: "web", name: "Web y Apps", icon: "💻", count: 167 },
    { id: "craft", name: "Craft", icon: "🧵", count: 76 },
];

/** @type {Course[]} */
export const courses = [
    {
        id: "1",
        title: "Dibujo para principiantes nivel -1",
        instructor: "Puño",
        description: "Realiza tu primer cuaderno de dibujante aplicando técnicas básicas de dibujo",
        image: "/drawing-sketchbook-illustration-art.jpg",
        price: 5.99,
        originalPrice: 39.99,
        rating: 99,
        reviews: 10430,
        students: 271730,
        category: "illustration",
        badge: "Top ventas",
    },
    {
        id: "2",
        title: "Técnicas modernas de acuarela",
        instructor: "Ana Victoria Calderon",
        description: "Pinta con acuarelas de forma precisa y creativa dominando las técnicas modernas",
        image: "/watercolor-painting-art-supplies.jpg",
        price: 6.99,
        originalPrice: 39.99,
        rating: 99,
        reviews: 10180,
        students: 227017,
        category: "illustration",
        badge: "Top ventas",
    },
    {
        id: "3",
        title: "Fotografía profesional para Instagram",
        instructor: "Mina Barrio",
        description: "Aprende todos los trucos para hacer y editar fotografías para redes sociales",
        image: "/instagram-photography-camera-social-media.jpg",
        price: 7.99,
        originalPrice: 39.99,
        rating: 99,
        reviews: 10870,
        students: 280261,
        category: "photography",
        badge: "Top ventas",
    },
    {
        id: "4",
        title: "De principiante a superdibujante",
        instructor: "Puño",
        description: "Mejora tus habilidades de dibujo y desbloquea tu creatividad con ejercicios prácticos",
        image: "/creative-drawing-illustration-pencil-art.jpg",
        price: 8.99,
        originalPrice: 39.99,
        rating: 99,
        reviews: 4500,
        students: 175836,
        category: "illustration",
        badge: "Top ventas",
    },
    {
        id: "5",
        title: "Introducción a After Effects",
        instructor: "Carlos Zenzuke Alba",
        description: "Aprende After Effects sin conocimientos previos y domina la animación",
        image: "/after-effects-motion-graphics-animation.jpg",
        price: 11.99,
        originalPrice: 39.99,
        rating: 97,
        reviews: 4910,
        students: 294134,
        category: "video",
        badge: "Básicos",
    },
    {
        id: "6",
        title: "Ilustración para desbloquear tu creatividad",
        instructor: "Adolfo Serra",
        description: "Crea un cuaderno de artista y desarrolla tu propio universo de ilustración",
        image: "/creative-illustration-art-journal-sketchbook.jpg",
        price: 12.99,
        originalPrice: 39.99,
        rating: 99,
        reviews: 6030,
        students: 190935,
        category: "illustration",
        badge: "Top ventas",
    },
    {
        id: "7",
        title: "Introducción a Adobe Photoshop",
        instructor: "Carles Marsal",
        description: "Aprende Adobe Photoshop desde cero y domina el mejor software de edición",
        image: "/photoshop-editing-digital-art-design.jpg",
        price: 4.99,
        originalPrice: 39.99,
        rating: 100,
        reviews: 10130,
        students: 379072,
        category: "design",
        badge: "Básicos",
    },
    {
        id: "8",
        title: "Creación de contenido para Instagram",
        instructor: "Mina Barrio",
        description: "Descubre los secretos de fotografía y video para triunfar en redes sociales",
        image: "/content-creation-instagram-social-media-photograph.jpg",
        price: 13.99,
        originalPrice: 39.99,
        rating: 98,
        reviews: 6330,
        students: 265841,
        category: "marketing",
        badge: "Top ventas",
    },
];

export const featuredCourse = {
    title: "Especialización en Diseño Gráfico y Comunicación Visual",
    description:
        "Maestría en diseño gráfico: domina color, composición y percepción visual para crear identidades visuales impactantes.",
    students: 18401,
    rating: 100,
    reviews: 260,
    image: "/graphic-design-colorful-creative-visual-communicat.jpg",
};
