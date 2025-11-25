import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CourseGrid } from "../components/CourseGrid";
import { Categories } from "../components/Categories";
import { Footer } from "../components/Footer";
import { courses } from "../lib/data";

export function Home() {
    return (
        <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
                <Hero />
                <CourseGrid
                    title="Aprende participando"
                    subtitle="Accede a los mejores cursos online para creativos. Interactúa con los mejores profesionales."
                    courses={courses.slice(0, 4)}
                />
                <Categories />
                <CourseGrid title="Cursos más populares" courses={courses.slice(4, 8)} />
            </main>
            <Footer />
        </div>
    );
}
