import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ErrorAlert from '@/components/ErrorAlert';
import MobileNavBar from '@/components/MobileNavBar';
import { Play, LogOut, Search, User, ChevronRight, CheckCircle2, Star, ArrowRight, ListChecks, FileText, Sparkles, Bell, Loader2 } from 'lucide-react';
import api from '@/config/axios';
import ProgresoPrograma from '@/components/ProgresoPrograma';
import CTOExplorar from '@/components/CTOExplorar';
import PageHeader from '@/components/PageHeader';

const ParticipanteDashboard = () => {
    const { user, logout } = useAuth();
    const [progreso, setProgreso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [programaFinalizado, setProgramaFinalizado] = useState(false);
    const [cuestionarioPreRespondido, setCuestionarioPreRespondido] = useState(false);
    const [cuestionarioPostRespondido, setCuestionarioPostRespondido] = useState(false);
    const [proximaAccion, setProximaAccion] = useState(null);
    const [programaNoEncontrado, setProgramaNoEncontrado] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProgramaNoEncontrado(false)
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
                    if (!programaData.cuestionario_pre_respondido) {
                        setProximaAccion({
                            tipo: 'cuestionarioPre',
                            titulo: 'Completar cuestionario inicial',
                            descripcion: 'Necesitas completar el cuestionario de evaluación inicial para comenzar las sesiones.',
                            url: '/miprograma/cuestionario-pre',
                            icono: <FileText className="h-6 w-6 text-blue-600" />
                        });
                    } else if (sesionesCompletadas === sesionesConEstado.length && !programaData.cuestionario_post_respondido) {
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
                if (err.response?.status === 403) {
                    setError('No tienes permisos de participante. Por favor, contacta al administrador.');
                    console.error('Error al cargar los datos:', err);
                } else if (err.response?.status === 404) {
                    setError('')
                    setProgramaNoEncontrado(true)
                } else {
                    setError('Error al cargar los datos. Por favor, intenta nuevamente.');
                    console.error('Error al cargar los datos:', err);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white flex flex-col items-center justify-center pb-16 md:pb-0">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 text-indigo-600 animate-spin mx-auto mb-6" />
                    <p className="text-lg text-indigo-700 font-medium animate-pulse">Preparando tu espacio de paz y calma...</p>
                </div>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title={`¡Hola, ${user?.nombre || 'Participante'}!`}
                    subtitle="Bienvenido/a a tu espacio personal de mindfulness"
                    showBackButton={false}
                />

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programaNoEncontrado && (
                    <CTOExplorar
                        titulo="No tienes un programa activo"
                        descripcion="Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness."
                        buttonText="Explorar Programas"
                    />
                )}

                {/* Próxima acción */}
                {proximaAccion && !programaFinalizado && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 p-[2px] rounded-2xl shadow-xl overflow-hidden">
                            <div className="bg-white p-6 md:p-8 rounded-2xl relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-50 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center mb-4 md:mb-6">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-100 mr-4">
                                            <Bell className="h-5 w-5 text-indigo-600" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-gray-800">Tu próxima acción</h2>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-600 mr-4">
                                                {proximaAccion.icono}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">{proximaAccion.titulo}</h3>
                                                <p className="text-gray-600 mt-1">{proximaAccion.descripcion}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={proximaAccion.url}
                                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
                                    >
                                        <span className="absolute right-full w-12 h-32 -mt-12 transition-all duration-1000 transform translate-x-12 bg-white opacity-10 rotate-12 group-hover:-translate-x-96 ease"></span>
                                        <span className="relative flex items-center justify-center">
                                            {proximaAccion.tipo === 'sesion' ? 'Comenzar sesión' : 'Completar cuestionario'}
                                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                                        </span>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Progreso */}
                {progreso && !programaFinalizado && (
                    <div className="mb-8">
                        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-indigo-100">
                            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6 flex items-center">
                                <CheckCircle2 className="h-6 w-6 text-indigo-600 mr-3" />
                                Tu progreso
                            </h2>

                            <ProgresoPrograma
                                progreso={progreso}
                                cuestionarioPreRespondido={cuestionarioPreRespondido}
                                cuestionarioPostRespondido={cuestionarioPostRespondido}
                                mostrarDetalles={false}
                            />

                            <div className="flex justify-center mt-8">
                                <Link
                                    to="/miprograma"
                                    className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105"
                                >
                                    <span className="absolute left-0 w-8 h-32 -mt-12 transition-all duration-1000 transform -translate-x-12 bg-white opacity-10 rotate-12 group-hover:translate-x-96 ease"></span>
                                    <span className="relative flex items-center justify-center text-white font-semibold">
                                        <ListChecks className="h-5 w-5 mr-3" />
                                        Ver detalles de mi programa
                                        <ChevronRight className="h-5 w-5 ml-3 group-hover:translate-x-1 transition-transform" />
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                )}

                {/* Acciones rápidas - Solo visible en escritorio */}
                <div className="hidden md:block mt-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center pl-2">
                        <Star className="h-5 w-5 text-amber-500 mr-2" />
                        Acciones rápidas
                    </h2>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <Link
                            to="/explorar"
                            className="group bg-white rounded-xl shadow-md border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-blue-50 mr-4 group-hover:bg-blue-100 transition-colors">
                                        <Search className="h-6 w-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors">Explorar Programas</h3>
                                        <p className="text-sm text-gray-500">Descubre nuevos caminos de mindfulness</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/perfil"
                            className="group bg-white rounded-xl shadow-md border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-50 mr-4 group-hover:bg-indigo-100 transition-colors">
                                        <User className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-indigo-700 transition-colors">Mi Perfil</h3>
                                        <p className="text-sm text-gray-500">Gestiona tu información personal</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-indigo-600 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/completados"
                            className="group bg-white rounded-xl shadow-md border border-gray-100 hover:border-indigo-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-amber-50 mr-4 group-hover:bg-amber-100 transition-colors">
                                        <Star className="h-6 w-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">Programas Completados</h3>
                                        <p className="text-sm text-gray-500">Revisa tus logros de mindfulness</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <button
                            onClick={logout}
                            className="group bg-white rounded-xl shadow-md border border-gray-100 hover:border-red-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 text-left w-full"
                        >
                            <div className="p-5">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mr-4 group-hover:bg-red-100 transition-colors">
                                        <LogOut className="h-6 w-6 text-red-500" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">Cerrar Sesión</h3>
                                        <p className="text-sm text-gray-500">Hasta pronto</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-gray-400 ml-auto group-hover:text-red-500 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </button>
                    </div>
                </div>
            </div>

            <MobileNavBar />
        </div>
    );
};

export default ParticipanteDashboard; 