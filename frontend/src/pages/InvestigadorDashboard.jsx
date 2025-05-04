import { useState, useEffect } from 'react';
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
import { Link } from 'react-router-dom';
import api from '../config/axios';

const InvestigadorDashboard = () => {
    const { user, logout } = useAuth();
    const [activeSection, setActiveSection] = useState('dashboard');
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await api.get('/programas');
                setProgramas(response.data);
            } catch (err) {
                setError('Error al cargar los programas');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramas();
    }, []);

    // Datos de ejemplo - En una implementación real vendrían de una API
    const estadisticas = {
        totalProgramas: programas.length,
        participantesActivos: programas.reduce((acc, p) => acc + (p.participantes?.length || 0), 0),
        sesionesCompletadas: 128,
        cuestionariosRespondidos: 256
    };

    const getNavButtonClass = (section) => {
        return `flex items-center space-x-3 w-full px-4 py-2 text-gray-700 rounded-lg ${activeSection === section ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100'
            }`;
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <aside className="w-64 bg-white shadow-md hidden md:flex flex-col fixed h-full">
                <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-800">Mindfluence Research</h2>
                    <p className="text-sm text-gray-600 mt-1">Menú de Investigador</p>
                </div>

                <nav className="flex-1 px-4">
                    <div className="space-y-2">
                        <button
                            onClick={() => setActiveSection('dashboard')}
                            className={getNavButtonClass('dashboard')}
                        >
                            <BarChart2 size={20} />
                            <span>Inicio</span>
                        </button>

                        <Link
                            to="/programas"
                            className={getNavButtonClass('programas')}
                        >
                            <FileText size={20} />
                            <span>Mis Programas</span>
                        </Link>

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

                        <Link
                            to="/perfil"
                            className={getNavButtonClass('perfil')}
                        >
                            <Settings size={20} />
                            <span>Mi Perfil</span>
                        </Link>
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
                            <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user.nombre}</h1>

                            <Link
                                to="/programas/crear"
                                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <PlusCircle size={20} />
                                <span>Nuevo Programa</span>
                            </Link>
                        </div>

                        {error && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                                <p className="text-red-700">{error}</p>
                            </div>
                        )}

                        {/* Estadísticas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Total Programas</h3>
                                <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.totalProgramas}</p>
                            </div>
                            <div className="bg-white p-6 rounded-xl shadow-sm">
                                <h3 className="text-gray-500 text-sm font-medium">Participantes</h3>
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

                        {/* Programas */}
                        <div className="bg-white rounded-xl shadow-sm p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-xl font-semibold text-gray-800">Mis Programas</h2>
                                <Link
                                    to="/programas"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                                >
                                    Ver todos
                                </Link>
                            </div>
                            <div className="space-y-4">
                                {programas.slice(0, 3).map((programa) => (
                                    <div
                                        key={programa.id}
                                        className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div>
                                            <h3 className="font-medium text-gray-800">{programa.nombre}</h3>
                                            <p className="text-sm text-gray-500">
                                                {programa.participantes?.length || 0} participantes · {programa.duracion_semanas} sesiones
                                            </p>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Link
                                                to={`/programas/${programa.id}`}
                                                className="p-2 text-gray-400 hover:text-blue-600"
                                            >
                                                <Eye size={18} />
                                            </Link>
                                            <button
                                                onClick={() => {
                                                    if (window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
                                                        api.delete(`/programa/${programa.id}/`)
                                                            .then(() => {
                                                                setProgramas(programas.filter(p => p.id !== programa.id));
                                                            })
                                                            .catch(err => console.error('Error:', err));
                                                    }
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
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
            </main>
        </div>
    );
};

export default InvestigadorDashboard; 