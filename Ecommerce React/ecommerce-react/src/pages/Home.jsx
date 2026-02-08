import { useMemo } from "react";
import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CourseGrid } from "../components/CourseGrid";
import { Categories } from "../components/Categories";
import { Footer } from "../components/Footer";
import { courses } from "../lib/data";
import { PageTransition } from "../components/PageTransition";
import { useSearch } from "../context/SearchContext";

export function Home() {
    const { searchQuery } = useSearch();

    // Filter courses based on search query
    const filteredCourses = useMemo(() => {
        if (!searchQuery.trim()) {
            return courses;
        }

        const query = searchQuery.toLowerCase().trim();
        return courses.filter((course) => {
            return (
                course.title.toLowerCase().includes(query) ||
                course.description.toLowerCase().includes(query) ||
                course.instructor.toLowerCase().includes(query)
            );
        });
    }, [searchQuery]);

    return (
        <PageTransition>
            <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                    <Hero />
                    {filteredCourses.length > 0 ? (
                        <>
                            <CourseGrid
                                title={searchQuery ? `Resultados de búsqueda: "${searchQuery}"` : "Aprende participando"}
                                subtitle={searchQuery ? `${filteredCourses.length} curso${filteredCourses.length !== 1 ? 's' : ''} encontrado${filteredCourses.length !== 1 ? 's' : ''}` : "Accede a los mejores cursos online para creativos. Interactúa con los mejores profesionales."}
                                courses={filteredCourses.slice(0, 4)}
                            />
                            {!searchQuery && <Categories />}
                            {filteredCourses.length > 4 && (
                                <CourseGrid 
                                    title={searchQuery ? "Más resultados" : "Cursos más populares"} 
                                    courses={filteredCourses.slice(4, 8)} 
                                />
                            )}
                        </>
                    ) : (
                        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
                            <div className="mb-4 text-6xl">🔍</div>
                            <h2 className="text-2xl font-bold mb-2">No se encontraron cursos</h2>
                            <p className="text-muted-foreground">
                                No hay cursos que coincidan con "{searchQuery}". Intenta con otros términos de búsqueda.
                            </p>
                        </div>
                    )}
                </main>
                <Footer />
            </div>
        </PageTransition>
    );
}
