import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LogOut,
    PlusCircle,
    Users,
    FileText,
    BarChart2,
    Calendar,
    ClipboardList,
    Settings,
    ChevronRight,
    Download,
    Edit,
    Trash2,
    Eye
} from 'lucide-react';

const InvestigadorDashboard = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');

    // Datos de ejemplo - En una implementación real vendrían de una API
    const programas = [
        {
            id: 1,
            nombre: 'Programa de Mindfulness para Reducción de Estrés',
            participantes: 15,
            sesiones: 8,
            estado: 'activo'
        },
        {
            id: 2,
            nombre: 'Meditación para Profesionales de la Salud',
            participantes: 12,
            sesiones: 6,
            estado: 'activo'
        }
    ];

    const estadisticas = {
        totalProgramas: 5,
        participantesActivos: 42,
        sesionesCompletadas: 128,
        cuestionariosRespondidos: 256
    };

    const getNavButtonClass = (section) => {
        return `flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${activeSection === section ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`;
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col fixed h-full">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">MindfulnessApp</h2>
                    <p className="text-sm text-gray-600 mt-1">Panel de Investigador</p>
                </div>

                <nav className="flex-1 px-4">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveSection('dashboard')}
                            className={getNavButtonClass('dashboard')}
                        >
                            <BarChart2 size={20} />
                            <span>Dashboard</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('programas')}
                            className={getNavButtonClass('programas')}
                        >
                            <FileText size={20} />
                            <span>Mis Programas</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('participantes')}
                            className={getNavButtonClass('participantes')}
                        >
                            <Users size={20} />
                            <span>Participantes</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('sesiones')}
                            className={getNavButtonClass('sesiones')}
                        >
                            <Calendar size={20} />
                            <span>Sesiones</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('cuestionarios')}
                            className={getNavButtonClass('cuestionarios')}
                        >
                            <ClipboardList size={20} />
                            <span>Cuestionarios</span>
                        </button>

                        <button
                            onClick={() => setActiveSection('perfil')}
                            className={getNavButtonClass('perfil')}
                        >
                            <Settings size={20} />
                            <span>Mi Perfil</span>
                        </button>
                    </div>
                </nav>

                <div className="p-4 border-t">
                    <button
                        onClick={() => logout()}
                        className="flex items-center space-x-3 w-full px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
                    >
                        <LogOut size={20} />
                        <span>Cerrar Sesión</span>
                    </button>
                </div>
            </aside>

            {/* Contenido principal */}
            <main className="flex-1 ml-64 p-8">
                {activeSection === 'dashboard' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                            <button
                                onClick={() => setActiveSection('programas')}
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <PlusCircle size={20} />
                                <span>Nuevo Programa</span>
                            </button>
                        </div>

                        {/* Estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Total Programas</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.totalProgramas}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Participantes Activos</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.participantesActivos}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Sesiones Completadas</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.sesionesCompletadas}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Cuestionarios Respondidos</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.cuestionariosRespondidos}</p>
                            </div>
                        </div>

                        {/* Programas Activos */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Programas Activos</h2>
                                <button
                                    onClick={() => setActiveSection('programas')}
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Ver todos
                                </button>
                            </div>
                            <div className="space-y-4">
                                {programas.map((programa) => (
                                    <div
                                        key={programa.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-800">{programa.nombre}</h3>
                                            <p className="text-sm text-gray-500">
                                                {programa.participantes} participantes · {programa.sesiones} sesiones
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <button className="p-2 text-gray-400 hover:text-blue-600">
                                                <Eye size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-green-600">
                                                <Edit size={18} />
                                            </button>
                                            <button className="p-2 text-gray-400 hover:text-red-600">
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeSection === 'programas' && (
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <h1 className="text-2xl font-bold text-gray-800">Mis Programas</h1>
                            <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                                <PlusCircle size={20} />
                                <span>Crear Programa</span>
                            </button>
                        </div>
                        {/* Aquí irá la lista completa de programas */}
                    </div>
                )}

                {activeSection === 'participantes' && (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Participantes</h1>
                        {/* Aquí irá la gestión de participantes */}
                    </div>
                )}

                {activeSection === 'sesiones' && (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Sesiones</h1>
                        {/* Aquí irá la gestión de sesiones */}
                    </div>
                )}

                {activeSection === 'cuestionarios' && (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-800">Gestión de Cuestionarios</h1>
                        {/* Aquí irá la gestión de cuestionarios */}
                    </div>
                )}

                {activeSection === 'perfil' && (
                    <div className="space-y-6">
                        <h1 className="text-2xl font-bold text-gray-800">Mi Perfil</h1>
                        {/* Aquí irá la gestión del perfil */}
                    </div>
                )}
            </main>
        </div>
    );
};

export default InvestigadorDashboard; 