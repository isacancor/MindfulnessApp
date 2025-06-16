import { Link, useLocation } from 'react-router-dom';
import { LogOut, FileText, BarChart2, Calendar, ClipboardList, Settings, PieChart, Download, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const getNavButtonClass = (path) => {
        const isActive = location.pathname === path;
        return `group relative flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
            : 'text-purple-200 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
            }`;
    };

    const isActivePath = (basePath) => {
        return location.pathname.startsWith(basePath);
    };

    const getActivePathClass = (basePath) => {
        const isActive = isActivePath(basePath);
        return `group relative flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 ${isActive
            ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
            : 'text-purple-200 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm'
            }`;
    };

    const SidebarContent = () => (
        <>
            <div className="p-6 border-b border-white/10">
                <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-purple-400 to-violet-500 shadow-lg">
                        <Sparkles className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-xl font-bold text-white">Mindfluence</h2>
                        <p className="text-xl font-bold text-purple-200">Research Menú</p>
                    </div>
                </div>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                <Link
                    to="/dashboard"
                    className={getNavButtonClass('/dashboard')}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <BarChart2 size={20} />
                    <span>Inicio</span>
                </Link>

                <Link
                    to="/programas"
                    className={getActivePathClass('/programas')}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <FileText size={20} />
                    <span>Mis Programas</span>
                </Link>

                <Link
                    to="/analisis"
                    className={getActivePathClass('/analisis')}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <PieChart size={20} />
                    <span>Análisis</span>
                </Link>

                <Link
                    to="/exportar"
                    className={getActivePathClass('/exportar')}
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Download size={20} />
                    <span>Exportar Datos</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    to="/perfil"
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-purple-200 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <Settings size={20} />
                    <span>Mi Perfil</span>
                </Link>

                <button
                    onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center space-x-3 w-full px-4 py-3 text-sm font-medium text-rose-300 hover:text-white hover:bg-rose-500/20 rounded-xl transition-all duration-200"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>
            </div>
        </>
    );

    return (
        <>
            {/* Mobile menu button */}
            <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 flex items-center justify-center w-12 h-12 bg-white/10 backdrop-blur-xl rounded-full text-white shadow-lg border border-white/20"
            >
                {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            {/* Mobile sidebar overlay */}
            {isMobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside
                className={`fixed top-0 left-0 h-full w-64 bg-white/5 backdrop-blur-xl border-r border-white/10 shadow-2xl transition-transform duration-300 z-40 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    } md:translate-x-0 flex flex-col`}
            >
                <SidebarContent />
            </aside>
        </>
    );
};

export default Sidebar; 