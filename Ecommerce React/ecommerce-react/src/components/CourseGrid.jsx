import { motion } from "framer-motion";
import { memo } from "react";
import { CourseCard } from "./CourseCard";

/**
 * CourseGrid component displays a grid of courses
 * @param {Object} props
 * @param {string} props.title
 * @param {string} [props.subtitle]
 * @param {import('../lib/data').Course[]} props.courses
 */
export const CourseGrid = memo(function CourseGrid({ title, subtitle, courses }) {
    // Container variants para stagger animations más eficientes
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05, // Más eficiente que delay individual
                delayChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    return (
        <motion.section
            className="py-12"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
        >
            <div className="max-w-7xl mx-auto px-4">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold">{title}</h2>
                    {subtitle && <p className="text-muted-foreground mt-2">{subtitle}</p>}
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {courses.map((course) => (
                        <motion.div
                            key={course.id}
                            variants={itemVariants}
                            layout="position"
                        >
                            <CourseCard course={course} />
                        </motion.div>
                    ))}
                </div>
            </div>
        </motion.section>
    );
});
