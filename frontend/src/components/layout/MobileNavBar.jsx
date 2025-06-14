import { Link, useLocation } from 'react-router-dom';
import { Home, Search, BookOpen, Star, User } from 'lucide-react';

const MobileNavBar = () => {
    const location = useLocation();

    const isActive = (path) => location.pathname === path;

    const navItems = [
        { path: '/home', icon: Home, label: 'Inicio' },
        { path: '/explorar', icon: Search, label: 'Explorar' },
        { path: '/miprograma', icon: BookOpen, label: 'Mi Programa' },
        { path: '/completados', icon: Star, label: 'Completados' },
        { path: '/perfil', icon: User, label: 'Perfil' }
    ];

    return (
        <nav className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-blue-900 via-sky-800 to-blue-950 border-t border-blue-800/50 backdrop-blur-xl md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full transition-all duration-300
                                ${isActive(item.path)
                                    ? 'text-sky-300'
                                    : 'text-blue-200 hover:text-sky-300'}`}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs mt-1 font-medium">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};

export default MobileNavBar; 