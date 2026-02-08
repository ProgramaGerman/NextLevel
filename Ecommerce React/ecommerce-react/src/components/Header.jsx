import { useState, memo, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, ShoppingCart, Menu, X, ChevronDown, User, LogOut, LayoutDashboard, Receipt } from "lucide-react";
import { Button } from "./ui/Button";
import { Input } from "./ui/Input";
import { categories } from "../lib/data";
import { CartIcon } from "./CartIcon";
import { useAuth } from "../context/AuthContext";
import { useSearch } from "../context/SearchContext";
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

// User Menu Component
const UserMenu = memo(({ user, onLogout }) => {
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false);

    const handleDashboard = () => {
        navigate('/dashboard');
        setIsOpen(false);
    };

    const handleProfile = () => {
        navigate('/perfil');
        setIsOpen(false);
    };

    const handleLogout = () => {
        onLogout();
        setIsOpen(false);
    };

    return (
        <div className="relative">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition"
            >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center">
                    <span className="text-sm font-bold text-primary-foreground">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                    </span>
                </div>
                <span className="hidden sm:block text-sm font-medium">{user.name || 'Usuario'}</span>
                <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsOpen(false)} />
                    <div className="absolute right-0 top-full mt-2 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-20">
                        <div className="px-4 py-3 border-b border-border">
                            <p className="text-sm font-semibold">{user.name} {user.lastname}</p>
                            <p className="text-xs text-muted-foreground">{user.cedula}</p>
                        </div>
                        <button
                            onClick={handleDashboard}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition"
                        >
                            <LayoutDashboard className="w-4 h-4" />
                            Dashboard
                        </button>
                        <button
                            onClick={handleProfile}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition"
                        >
                            <User className="w-4 h-4" />
                            Mi Perfil
                        </button>
                        <button
                            onClick={() => {
                                navigate('/pagos')
                                setIsOpen(false)
                            }}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition"
                        >
                            <Receipt className="w-4 h-4" />
                            Historial de Pagos
                        </button>
                        <div className="border-t border-border my-2" />
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition"
                        >
                            <LogOut className="w-4 h-4" />
                            Cerrar Sesión
                        </button>
                    </div>
                </>
            )}
        </div>
    );
});
UserMenu.displayName = 'UserMenu';

export const Header = memo(function Header() {
    const { isAuthenticated, currentUser, logout } = useAuth();
    const { searchQuery, setSearchQuery } = useSearch();
    const navigate = useNavigate();
    const [uiState, setUiState] = useState({ menuOpen: false, searchOpen: false });

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
                            <Input 
                                type="search" 
                                placeholder="Buscar cursos..." 
                                className="pl-10 bg-muted border-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        <button className="md:hidden p-2 hover:bg-muted rounded-lg" onClick={toggleSearch}>
                            <Search className="w-5 h-5" />
                        </button>
                        <CartIcon />

                        {/* Auth Buttons or User Menu */}
                        {isAuthenticated ? (
                            <UserMenu user={currentUser} onLogout={logout} />
                        ) : (
                            <div className="hidden sm:flex items-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => navigate('/login')}
                                >
                                    Iniciar Sesión
                                </Button>
                                <Button
                                    size="sm"
                                    onClick={() => navigate('/register')}
                                >
                                    Registrarse
                                </Button>
                            </div>
                        )}

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
                            <Input 
                                type="search" 
                                placeholder="Buscar cursos..." 
                                className="pl-10 bg-muted border-0"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                {/* Mobile Menu */}
                {uiState.menuOpen && (
                    <nav className="lg:hidden pb-4 border-t border-border pt-4">
                        <div className="space-y-2">
                            {/* Auth buttons mobile */}
                            {!isAuthenticated && (
                                <div className="sm:hidden flex flex-col gap-2 px-3 pb-4 border-b border-border">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            navigate('/login');
                                            closeMenu();
                                        }}
                                    >
                                        Iniciar Sesión
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={() => {
                                            navigate('/register');
                                            closeMenu();
                                        }}
                                    >
                                        Registrarse
                                    </Button>
                                </div>
                            )}
                            
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
