import { useState, memo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, ChevronDown } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { categories } from "../lib/data";
import { CartIcon } from "./CartIcon";
import logo from "../assets/Logo_Nuevo.svg";

// Memoized Logo component - never changes
const Logo = memo(() => (
    <Link to="/" className="flex items-center gap-2">
        <div className="w-48 h-20 rounded-lg flex items-center justify-center">
            <img src={logo} alt="Logo" className="w-full h-full object-contain" />
        </div>
    </Link>
));
Logo.displayName = 'Logo';

// Memoized Desktop Navigation
const DesktopNav = memo(() => (
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
));
DesktopNav.displayName = 'DesktopNav';

export const Header = memo(function Header() {
    // Combinar estados para optimizar y usar un solo objeto
    const [uiState, setUiState] = useState({ menuOpen: false, searchOpen: false });

    // Optimizar manejadores con useCallback
    const toggleMenu = useCallback(() => {
        setUiState(prev => ({ ...prev, menuOpen: !prev.menuOpen }));
    }, []);

    const toggleSearch = useCallback(() => {
        setUiState(prev => ({ ...prev, searchOpen: !prev.searchOpen }));
    }, []);

    const closeMenu = useCallback(() => {
        setUiState(prev => ({ ...prev, menuOpen: false }));
    }, []);

    return (
        <header className="sticky top-0 z-50 bg-card border-b border-border">
            <div className="max-w-7xl mx-auto px-4">
                <div className="flex items-center justify-evenly h-16">
                    {/* Logo */}
                    <Logo />

                    {/* Desktop Navigation */}
                    <DesktopNav />

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-6">
                        <div className="relative w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar cursos..." className="pl-10 bg-muted border-0" />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button className="md:hidden p-2 hover:bg-muted rounded-lg" onClick={toggleSearch}>
                            <Search className="w-5 h-5" />
                        </button>
                        <CartIcon />

                        <button className="lg:hidden p-2 hover:bg-muted rounded-lg" onClick={toggleMenu}>
                            {uiState.menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search */}
                {uiState.searchOpen && (
                    <div className="md:hidden pb-4">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                            <Input type="search" placeholder="Buscar cursos..." className="pl-10 bg-muted border-0" />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {uiState.menuOpen && (
                    <nav className="lg:hidden pb-4 border-t border-border pt-4">
                        <div className="space-y-2">
                            <p className="text-xs font-semibold text-muted-foreground uppercase px-3">Categorías</p>
                            {categories.map((cat) => (
                                <Link
                                    key={cat.id}
                                    to={`/cursos/${cat.id}`}
                                    className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-muted"
                                    onClick={closeMenu}
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
});
