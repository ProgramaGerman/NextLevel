import { Link } from "react-router-dom";

const footerLinks = {
    cursos: [
        { label: "Ilustración", href: "/cursos/illustration" },
        { label: "Diseño", href: "/cursos/design" },
        { label: "Fotografía", href: "/cursos/photography" },
        { label: "Video", href: "/cursos/video" },
        { label: "Marketing", href: "/cursos/marketing" },
    ],
    informacion: [
        { label: "Sobre nosotros", href: "/sobre-nosotros" },
        { label: "Blog", href: "/blog" },
        { label: "Trabaja con nosotros", href: "/trabaja" },
        { label: "Contacto", href: "/contacto" },
    ],
    soporte: [
        { label: "Ayuda", href: "/ayuda" },
        { label: "Términos", href: "/terminos" },
        { label: "Privacidad", href: "/privacidad" },
        { label: "Cookies", href: "/cookies" },
    ],
};

export function Footer() {
    return (
        <footer className="bg-foreground text-background">
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                                <span className="text-primary-foreground font-bold text-sm">NLA</span>
                            </div>
                            <span className="font-bold">NextLevelAcademy</span>
                        </div>
                        <p className="text-sm text-background/70">Aprende de los mejores profesionales creativos del mundo.</p>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Cursos</h3>
                        <ul className="space-y-2">
                            {footerLinks.cursos.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-background/70 hover:text-background">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Información</h3>
                        <ul className="space-y-2">
                            {footerLinks.informacion.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-background/70 hover:text-background">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h3 className="font-semibold mb-4">Soporte</h3>
                        <ul className="space-y-2">
                            {footerLinks.soporte.map((link) => (
                                <li key={link.href}>
                                    <Link to={link.href} className="text-sm text-background/70 hover:text-background">
                                        {link.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <div className="border-t border-background/20 mt-8 pt-8 text-center text-sm text-background/60">
                    © {new Date().getFullYear()} NextLevelAcademy. Todos los derechos reservados.
                </div>
            </div>
        </footer>
    );
}
