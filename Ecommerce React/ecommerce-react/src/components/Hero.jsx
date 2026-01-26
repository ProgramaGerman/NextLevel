import { Link } from "react-router-dom";
import { Users, ThumbsUp } from "lucide-react";
import { Button } from "./ui/Button";
import { featuredCourse } from "../lib/data";

export function Hero() {
  return (
    <section className="bg-foreground text-background">
      <div className="max-w-7xl mx-auto px-4 py-12 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <h1 className="text-3xl lg:text-4xl font-bold text-balance">
              {featuredCourse.title}
            </h1>
            <p className="text-background/80 text-lg">
              {featuredCourse.description}
            </p>
            <div className="flex items-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span>{featuredCourse.students.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <ThumbsUp className="w-4 h-4" />
                <span>
                  {featuredCourse.rating}% ({featuredCourse.reviews})
                </span>
              </div>
            </div>
            <Button
              asChild
              size="lg"
              className="bg-card text-card-foreground hover:bg-card/90"
            >
              <Link to={`/curso/${featuredCourse.id}`}>Ver curso</Link>
            </Button>
          </div>
          <div className="relative">
            <div className="aspect-video rounded-xl overflow-hidden">
              <img
                src={featuredCourse.image || "/placeholder.svg"}
                alt={featuredCourse.title}
                loading="lazy"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
