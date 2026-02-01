import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { CourseGrid } from "../components/CourseGrid";
import { Categories } from "../components/Categories";
import { Footer } from "../components/Footer";
import { courses } from "../lib/data";
import { PageTransition } from "../components/PageTransition";

export function Home() {
    return (
<<<<<<< HEAD
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
                <CourseGrid title="Cursos más utilizacos de la plataforma" courses={courses.slice(4, 8)} />
            </main>
            <Footer />
        </div>
=======
        <PageTransition>
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
        </PageTransition>
>>>>>>> 1757fca133b755706192132b48270f6fd8fadaa1
    );
}
