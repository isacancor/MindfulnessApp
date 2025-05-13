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
    AlertCircle,
    ArrowRight,
    ListChecks,
    FileText
} from 'lucide-react';
import api from '@/config/axios';
import ProgresoPrograma from '@/components/ProgresoPrograma';

const ParticipanteDashboard = () => {
    const { user, logout } = useAuth();
    const [progreso, setProgreso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [programaFinalizado, setProgramaFinalizado] = useState(false);
    const [cuestionarioPreRespondido, setCuestionarioPreRespondido] = useState(false);
    const [cuestionarioPostRespondido, setCuestionarioPostRespondido] = useState(false);
    const [proximaAccion, setProximaAccion] = useState(null);

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

                    // Obtener el estado de los cuestionarios
                    setCuestionarioPreRespondido(programaData.cuestionario_pre_respondido || false);
                    setCuestionarioPostRespondido(programaData.cuestionario_post_respondido || false);

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
                        setProximaAccion({
                            tipo: 'sesion',
                            titulo: `Sesión ${proxima.semana}: ${proxima.titulo}`,
                            descripcion: `Tu próxima sesión de mindfulness, duración aproximada: ${proxima.duracion_estimada} minutos.`,
                            url: `/miprograma/sesion/${proxima.id}`,
                            icono: <Play className="h-6 w-6 text-emerald-600" />
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

                    // Determinar próxima acción
                    if (!cuestionarioPreRespondido) {
                        setProximaAccion({
                            tipo: 'cuestionarioPre',
                            titulo: 'Completar cuestionario inicial',
                            descripcion: 'Necesitas completar el cuestionario de evaluación inicial para comenzar las sesiones.',
                            url: '/miprograma/cuestionario-pre',
                            icono: <FileText className="h-6 w-6 text-blue-600" />
                        });
                    } else if (sesionesCompletadas === sesionesConEstado.length && !cuestionarioPostRespondido) {
                        setProximaAccion({
                            tipo: 'cuestionarioPost',
                            titulo: 'Completar cuestionario final',
                            descripcion: '¡Has completado todas las sesiones! Es momento de finalizar el programa con el cuestionario de evaluación.',
                            url: '/miprograma/cuestionario-post',
                            icono: <FileText className="h-6 w-6 text-purple-600" />
                        });
                    }
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

            {/* Próxima acción */}
            {proximaAccion && !programaFinalizado && (
                <div className="max-w-3xl mx-auto mb-8">
                    <div className="bg-white rounded-xl shadow-sm p-6 border-l-4 border-l-indigo-500">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-xl font-semibold text-gray-900">Tu próxima acción</h2>
                            {proximaAccion.icono}
                        </div>

                        <div className="mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{proximaAccion.titulo}</h3>
                            <p className="text-gray-600 mt-1">{proximaAccion.descripcion}</p>
                        </div>

                        <Link
                            to={proximaAccion.url}
                            className="inline-flex items-center justify-center px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1"
                        >
                            {proximaAccion.tipo === 'sesion' ? 'Comenzar sesión' : 'Completar cuestionario'}
                            <ArrowRight className="ml-2 h-5 w-5" />
                        </Link>
                    </div>
                </div>
            )}

            {/* Progreso */}
            {progreso && !programaFinalizado && (
                <div className="max-w-3xl mx-auto mb-8">
                    <ProgresoPrograma
                        progreso={progreso}
                        cuestionarioPreRespondido={cuestionarioPreRespondido}
                        cuestionarioPostRespondido={cuestionarioPostRespondido}
                        mostrarDetalles={false}
                    />

                    <div className="flex justify-center mt-5">
                        <Link
                            to="/miprograma"
                            className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                        >
                            <span className="relative flex items-center text-white font-semibold">
                                <ListChecks className="h-5 w-5 mr-3" />
                                Ver todos los detalles de mi programa
                                <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
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