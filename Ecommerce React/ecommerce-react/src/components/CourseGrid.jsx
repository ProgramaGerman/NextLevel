import { CourseCard } from "./CourseCard";

/**
 * CourseGrid component displays a grid of courses
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {import('../lib/data').Course[]} props.courses
 */
export function CourseGrid({ title, subtitle, courses }) {
    return (
        <section className="py-12">
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </section>
    );
}
