import { Link } from "react-router-dom";
import { categories } from "../lib/data";

export function Categories() {
    return (
        <section className="py-12 bg-muted/50">
            <div className="max-w-7xl mx-auto px-4">
                <h2 className="text-2xl font-bold mb-8">Explora por categoría</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
                    {categories.map((category) => (
                        <Link
                            key={category.id}
                            to={`/cursos/${category.id}`}
                            className="flex flex-col items-center gap-3 p-4 bg-card rounded-lg border border-border hover:border-primary hover:shadow-md transition-all"
                        >
                            <span className="text-3xl">{category.icon}</span>
                            <span className="text-sm font-medium text-center">{category.name}</span>
                            <span className="text-xs text-muted-foreground">{category.count} cursos</span>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
