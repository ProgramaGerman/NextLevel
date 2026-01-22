//seccion que muestra y visualiza el producto seleccionado, donde se muestra con mas detalles la informacion del 
//producto seleccionado y realizar la compra

import { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getCourseById, getRelatedCourses } from "../lib/data";
import { Users, ThumbsUp, ShoppingCart, ArrowLeft, Star } from "lucide-react";
import { Button } from "../components/ui/Button";
import { Badge } from "../components/ui/Badge";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";
import { motion } from "framer-motion";
import { PageTransition } from "../components/PageTransition";

const Product = () => {
    const { id } = useParams();
    
    // Use optimized lookup function
    const course = getCourseById(id);
    
    // Memoize related courses to avoid recalculation
    const relatedCourses = useMemo(() => {
        return course ? getRelatedCourses(id, 3) : [];
    }, [id, course]);

    // Si no se encuentra el curso, mostrar mensaje
    if (!course) {
        return (
            <PageTransition>
                <div className="min-h-screen bg-background flex items-center justify-center">
                    <div className="text-center">
                        <h1 className="text-4xl font-bold mb-4">Curso no encontrado</h1>
                        <Link to="/" className="text-primary hover:underline">
                            Volver al inicio
                        </Link>
                    </div>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-background">
                {/* Header con navegación */}
                <Header />

                {/* Contenido principal */}
                <div className="container mx-auto px-4 py-16">
                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* Imagen del curso */}
                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            {course.badge && (
                                <Badge className="absolute top-4 left-4 z-10 bg-primary text-primary-foreground">
                                    {course.badge}
                                </Badge>
                            )}
                            <img
                                src={course.image || "/placeholder.svg"}
                                alt={course.title}
                                loading="lazy"
                                className="w-full h-auto rounded-lg shadow-lg object-cover aspect-video"
                            />
                        </motion.div>

                        {/* Detalles del curso */}
                        <motion.div
                            className="space-y-6 py-8"
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                        >
                            <div>
                                <h1 className="text-4xl font-bold mb-2">{course.title}</h1>
                                <p className="text-xl text-muted-foreground">
                                    Un curso de <span className="font-semibold text-foreground">{course.instructor}</span>
                                </p>
                            </div>

                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {course.description}
                            </p>

                            {/* Estadísticas */}
                            <div className="flex flex-wrap gap-6 py-4 border-y border-border">
                                <div className="flex items-center gap-2">
                                    <Users className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Estudiantes</p>
                                        <p className="font-semibold">{course.students.toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <ThumbsUp className="w-5 h-5 text-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Valoración</p>
                                        <p className="font-semibold">
                                            {course.rating}% ({(course.reviews / 1000).toFixed(1)}K reseñas)
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Star className="w-5 h-5 text-primary fill-primary" />
                                    <div>
                                        <p className="text-sm text-muted-foreground">Categoría</p>
                                        <p className="font-semibold capitalize">{course.category}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Precio y compra */}
                            <div className="space-y-4">
                                <div className="flex items-baseline gap-3">
                                    <span className="text-5xl font-bold text-primary">${course.price}</span>
                                    {course.originalPrice && (
                                        <span className="text-2xl text-muted-foreground line-through">
                                            ${course.originalPrice}
                                        </span>
                                    )}
                                    {course.originalPrice && (
                                        <Badge variant="secondary" className="ml-2">
                                            {Math.round((1 - course.price / course.originalPrice) * 100)}% OFF
                                        </Badge>
                                    )}
                                </div>

                                <Button className="w-full text-lg py-6 bg-primary hover:bg-primary/90">
                                    <ShoppingCart className="w-5 h-5 mr-2" />
                                    Añadir al carrito
                                </Button>

                                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                                    <h3 className="font-semibold">Lo que aprenderás:</h3>
                                    <ul className="space-y-1 text-sm text-muted-foreground">
                                        <li>✓ Técnicas profesionales de {course.instructor}</li>
                                        <li>✓ Acceso ilimitado al contenido del curso</li>
                                        <li>✓ Certificado de finalización</li>
                                        <li>✓ Recursos descargables y material complementario</li>
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Cursos relacionados */}
                    {relatedCourses.length > 0 && (
                        <motion.div
                            className="mt-16"
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.5 }}
                        >
                            <h2 className="text-3xl font-bold mb-6">Cursos relacionados</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {relatedCourses.map((relatedCourse, index) => (
                                    <motion.div
                                        key={relatedCourse.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.4, delay: 0.6 + index * 0.1 }}
                                    >
                                        <Link
                                            to={`/curso/${relatedCourse.id}`}
                                            className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-all block"
                                        >
                                            <div className="relative aspect-video">
                                                {relatedCourse.badge && (
                                                    <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">
                                                        {relatedCourse.badge}
                                                    </Badge>
                                                )}
                                                <img
                                                    src={relatedCourse.image || "/placeholder.svg"}
                                                    alt={relatedCourse.title}
                                                    loading="lazy"
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="p-4 space-y-2">
                                                <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">
                                                    {relatedCourse.title}
                                                </h3>
                                                <p className="text-sm text-muted-foreground">
                                                    {relatedCourse.instructor}
                                                </p>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg font-bold text-primary">
                                                        ${relatedCourse.price}
                                                    </span>
                                                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                        <ThumbsUp className="w-3 h-3" />
                                                        <span>{relatedCourse.rating}%</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.div>
                    )}
                </div>

                <Footer />
            </div>
        </PageTransition>
    );
};

export default Product;
