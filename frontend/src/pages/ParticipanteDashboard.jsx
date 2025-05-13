import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ErrorAlert from '@/components/ErrorAlert';
import {
    Play,
    ClipboardList,
    Calendar,
    LogOut,
    BookOpen,
    User,
    ChevronRight,
    CheckCircle2,
    Star,
    AlertCircle
} from 'lucide-react';
import api from '@/config/axios';

const ParticipanteDashboard = () => {
    const { user, logout } = useAuth();
    const [proximaSesion, setProximaSesion] = useState(null);
    const [progreso, setProgreso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [programaFinalizado, setProgramaFinalizado] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await api.get('programas/mi-programa');
                const programaData = response.data;

                if (programaData) {
                    // Verificar si el programa está finalizado
                    if (programaData.estado_publicacion === 'finalizado') {
                        setProgramaFinalizado(true);
                        setLoading(false);
                        return;
                    }

                    // Verificar el estado de cada sesión
                    const sesionesConEstado = await Promise.all(
                        programaData.sesiones?.map(async (sesion) => {
                            try {
                                const diarioResponse = await api.get(`sesiones/${sesion.id}/diario_info`);
                                return {
                                    ...sesion,
                                    completada: !!diarioResponse.data
                                };
                            } catch (error) {
                                console.error(`Error al verificar diario de sesión ${sesion.id}:`, error);
                                return {
                                    ...sesion,
                                    completada: false
                                };
                            }
                        }) || []
                    );

                    // Encontrar la próxima sesión no completada
                    const proxima = sesionesConEstado.find(s => !s.completada);
                    if (proxima) {
                        setProximaSesion({
                            id: proxima.id,
                            titulo: proxima.titulo,
                            fecha: new Date(proxima.fecha_programada).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }),
                            hora: new Date(proxima.fecha_programada).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
                            duracion: `${proxima.duracion_estimada} minutos`
                        });
                    }

                    // Calcular progreso
                    const sesionesCompletadas = sesionesConEstado.filter(s => s.completada).length;
                    const minutosCompletados = sesionesConEstado.reduce((acc, s) => acc + (s.completada ? s.duracion_estimada : 0), 0);

                    setProgreso({
                        sesionesCompletadas,
                        totalSesiones: sesionesConEstado.length,
                        minutosCompletados
                    });
                }
            } catch (err) {
                console.error('Error al cargar los datos:', err);
                setError('Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Cargando...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Saludo y bienvenida */}
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Hola, {user?.nombre || 'Participante'}!
                </h1>
                <p className="text-gray-600">
                    Bienvenido/a a tu espacio de mindfulness
                </p>
            </div>

            <ErrorAlert
                message={error}
                onClose={() => setError(null)}
            />

            {/* Próxima sesión */}
            {proximaSesion && !programaFinalizado && (
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Tu próxima sesión</h2>
                            <Calendar className="h-6 w-6 text-blue-600" />
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                            <div>
                                <p className="text-lg font-medium text-gray-900 mb-1">{proximaSesion.titulo}</p>
                                <p className="text-gray-600">
                                    {proximaSesion.duracion}
                                </p>
                            </div>
                            <Link
                                to={`/miprograma/sesion/${proximaSesion.id}`}
                                className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                <Play className="h-5 w-5 mr-2" />
                                Comenzar Sesión
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            {/* Progreso */}
            {progreso && !programaFinalizado && (
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-xl font-semibold text-gray-900">Tu progreso</h2>
                            <CheckCircle2 className="h-6 w-6 text-green-600" />
                        </div>
                        <div className="space-y-4">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span className="text-gray-600">Sesiones completadas</span>
                                    <span className="font-medium text-gray-900">
                                        {progreso.sesionesCompletadas} de {progreso.totalSesiones}
                                    </span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                    <div
                                        className="bg-green-600 h-2.5 rounded-full"
                                        style={{ width: `${(progreso.sesionesCompletadas / progreso.totalSesiones) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-green-600 font-medium">
                                    ¡Has meditado {progreso.minutosCompletados} minutos en total!
                                </p>
                                <Link
                                    to="/miprograma"
                                    className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    Ver detalles de mi programa
                                    <ChevronRight className="h-4 w-4 ml-2" />
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Acciones principales */}
            <div className="max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
                <Link
                    to="/explorar"
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Explorar Programas</h3>
                            <p className="text-sm text-gray-500">Ver programas disponibles</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <Link
                    to="/perfil"
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <User className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Mi Perfil</h3>
                            <p className="text-sm text-gray-500">Ver mi información</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <Link
                    to="/completados"
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <Star className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Programas Completados</h3>
                            <p className="text-sm text-gray-500">Ver mis programas finalizados</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center justify-between w-full text-left p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-red-300 transition-colors"
                >
                    <div className="flex items-center">
                        <LogOut className="h-6 w-6 text-red-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Cerrar Sesión</h3>
                        </div>
                    </div>
                </button>
            </div>
        </div>
    );
};

export default ParticipanteDashboard; 