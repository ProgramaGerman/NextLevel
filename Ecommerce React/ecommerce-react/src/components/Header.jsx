import { useState } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { categories } from "../lib/data";

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-primary-foreground font-bold text-sm">NLA</span>
                        </div>
                        <span className="font-bold text-lg hidden sm:block">NextLevelAcademy</span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center gap-6">
                        <div className="relative group">
                            <button className="flex items-center gap-1 text-sm font-medium hover:text-primary">
                                Cursos <ChevronDown className="w-4 h-4" />
                            </button>
                            <div className="absolute top-full left-0 pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-opacity">
                                <div className="bg-card border border-border rounded-lg shadow-lg p-4 min-w-64">
                                    {categories.map((cat) => (
                                        <Link
                                            key={cat.id}
                                            to={`/cursos/${cat.id}`}
                                            className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
                                        >
                                            <span>{cat.icon}</span>
                                            <span className="text-sm">{cat.name}</span>
                                            <span className="text-xs text-muted-foreground ml-auto">{cat.count}</span>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <Link to="/proyectos" className="text-sm font-medium hover:text-primary">
                            Proyectos
                        </Link>
                    </nav>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar cursos..." className="pl-10 bg-muted border-0" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button className="md:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <Search className="w-5 h-5" />
                        </button>
                        <button className="p-2 hover:bg-muted rounded-lg relative">
                            <ShoppingCart className="w-5 h-5" />
                            <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-primary-foreground text-xs rounded-full flex items-center justify-center">
                                0
                            </span>
                        </button>

                        <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {isSearchOpen && (
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar cursos..." className="pl-10 bg-muted border-0" />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <nav className="lg:hidden pb-4 border-t border-border pt-4">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase px-3">Categorías</p>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/cursos/${cat.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>{cat.icon}</span>
                                    <span className="text-sm">{cat.name}</span>
                                </Link>
                            ))}
                        </div>
                    </nav>
                )}
            </div>
        </header>
    );
}
