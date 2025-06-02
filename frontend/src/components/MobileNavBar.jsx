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
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden">
            <div className="flex justify-around items-center h-16">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            className={`flex flex-col items-center justify-center flex-1 h-full
                                ${isActive(item.path)
                                    ? 'text-indigo-600'
                                    : 'text-gray-500 hover:text-indigo-600'}`}
                        >
                            <Icon className="h-6 w-6" />
                            <span className="text-xs mt-1">{item.label}</span>
                        </Link>
                    )
                })}
            </div>
        </nav>
    );
};

export default MobileNavBar; 