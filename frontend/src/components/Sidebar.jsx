import { Link, useLocation } from 'react-router-dom';
import { LogOut, FileText, BarChart2, Calendar, ClipboardList, Settings, PieChart, Download } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
    const { logout } = useAuth();
    const location = useLocation();

    const getNavButtonClass = (path) => {
        return `flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${location.pathname === path ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`;
    };

    const isActivePath = (basePath) => {
        return location.pathname.startsWith(basePath);
    };

    return (
        <aside className="w-64 bg-white shadow-md hidden md:flex flex-col fixed h-full">
            <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-800">Mindfluence Research</h2>
                <p className="text-sm text-gray-600 mt-1">Menú de Investigador</p>
            </div>

            <nav className="flex-1 px-4">
                <div className="space-y-2">
                    <Link
                        to="/dashboard"
                        className={getNavButtonClass('/dashboard')}
                    >
                        <BarChart2 size={20} />
                        <span>Inicio</span>
                    </Link>

                    <Link
                        to="/programas"
                        className={`flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${isActivePath('/programas') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        <FileText size={20} />
                        <span>Mis Programas</span>
                    </Link>

                    <Link
                        to="/analisis"
                        className={`flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${isActivePath('/analisis') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        <PieChart size={20} />
                        <span>Análisis</span>
                    </Link>

                    <Link
                        to="/exportar"
                        className={`flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${isActivePath('/exportar') ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                        <Download size={20} />
                        <span>Exportar Datos</span>
                    </Link>
                </div>
            </nav>


            <div className="p-4 border-t space-y-2">
                <Link
                    to="/perfil"
                    className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                >
                    <Settings size={20} />
                    <span>Mi Perfil</span>
                </Link>

                <hr className="border-t border-gray-200 my-2" />

                <button
                    onClick={() => logout()}
                    className="flex items-center space-x-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg"
                >
                    <LogOut size={20} />
                    <span>Cerrar Sesión</span>
                </button>

            </div>
        </aside>
    );
};

export default Sidebar; 