import { Link } from "react-router-dom";
import { Users, ThumbsUp, ShoppingCart } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

/**
 * CourseCard component displays a single course
 * @param {Object} props
 * @param {import('../lib/data').Course} props.course
 */
export function CourseCard({ course }) {
    return (
        <article className="group bg-card rounded-lg overflow-hidden border border-border hover:shadow-lg transition-shadow">
            <Link to={`/curso/${course.id}`} className="block relative aspect-video">
                {course.badge && (
                    <Badge className="absolute top-3 left-3 z-10 bg-primary text-primary-foreground">{course.badge}</Badge>
                )}
                <img
                    src={course.image || "/placeholder.svg"}
                    alt={course.title}
                    className="w-full h-full object-cover"
                />
            </Link>
            <div className="p-4 space-y-3">
                <Link to={`/curso/${course.id}`}>
                    <h3 className="font-semibold line-clamp-2 group-hover:text-primary transition-colors">{course.title}</h3>
                </Link>
                <p className="text-sm text-muted-foreground">Un curso de {course.instructor}</p>
                <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        <span>{course.students.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3" />
                        <span>
                            {course.rating}% ({(course.reviews / 1000).toFixed(1)}K)
                        </span>
                    </div>
                </div>
                <Button
                    variant="outline"
                    className="w-full mt-2 group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-colors bg-transparent"
                >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Comprar · ${course.price}
                </Button>
            </div>
        </article>
    );
}
