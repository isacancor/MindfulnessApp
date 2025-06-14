import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import ErrorAlert from '@/components/ErrorAlert';
import MobileNavBar from '@/components/layout/MobileNavBar';
import { Play, LogOut, Search, User, ChevronRight, CheckCircle2, Star, ArrowRight, ListChecks, FileText, Sparkles, Bell, Loader2 } from 'lucide-react';
import api from '@/config/axios';
import ProgresoPrograma from '@/components/ProgresoPrograma';
import CTOExplorar from '@/components/CTOExplorar';
import PageHeader from '@/components/layout/PageHeader';

const ParticipanteDashboard = () => {
    const { user, logout } = useAuth();
    const [progreso, setProgreso] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cuestionarioPreRespondido, setCuestionarioPreRespondido] = useState(false);
    const [cuestionarioPostRespondido, setCuestionarioPostRespondido] = useState(false);
    const [proximaAccion, setProximaAccion] = useState(null);
    const [programaNoEncontrado, setProgramaNoEncontrado] = useState(false);
    const [programa, setPrograma] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                setProgramaNoEncontrado(false)
                const response = await api.get('programas/mi-programa');
                const programaData = response.data;
                setPrograma(programaData);

                if (programaData) {
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
                    if (programaData.tiene_cuestionarios && !programaData.cuestionario_pre_respondido) {
                        setProximaAccion({
                            tipo: 'cuestionarioPre',
                            titulo: 'Completar cuestionario inicial',
                            descripcion: 'Necesitas completar el cuestionario de evaluación inicial para comenzar las sesiones.',
                            url: '/miprograma/cuestionario-pre',
                            icono: <FileText className="h-6 w-6 text-white" />
                        });
                    } else if (sesionesCompletadas === sesionesConEstado.length && programaData.tiene_cuestionarios && !programaData.cuestionario_post_respondido) {
                        setProximaAccion({
                            tipo: 'cuestionarioPost',
                            titulo: 'Completar cuestionario final',
                            descripcion: '¡Has completado todas las sesiones! Es momento de finalizar el programa con el cuestionario de evaluación.',
                            url: '/miprograma/cuestionario-post',
                            icono: <FileText className="h-6 w-6 text-white" />
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
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-sky-800 to-blue-950 flex flex-col items-center justify-center pb-16 md:pb-0">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 text-sky-300 animate-spin mx-auto mb-6" />
                    <p className="text-lg text-sky-100 font-medium animate-pulse">Preparando tu espacio de paz y calma...</p>
                </div>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-bl from-indigo-950 via-sky-800 to-blue-900 py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">

            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title={`¡Hola, ${user?.nombre || 'Participante'}!`}
                    subtitle="Bienvenido/a a tu espacio personal de mindfulness"
                    showBackButton={false}
                    titleClassName="bg-gradient-to-r from-white via-indigo-200 to-indigo-400"
                    subtitleClassName="text-indigo-200"
                />

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programaNoEncontrado && (
                    <CTOExplorar
                        titulo="No tienes ningún programa activo"
                        descripcion="Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness."
                        buttonText="Explorar Programas"
                    />
                )}

                {/* Próxima acción */}
                {proximaAccion && (
                    <div className="mb-8">
                        <div className="bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 p-[2px] rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                            <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative overflow-hidden border border-white/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                                <div className="relative z-10">
                                    <div className="flex items-center mb-4 md:mb-6">
                                        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-500/20 mr-4">
                                            <Bell className="h-6 w-6 text-indigo-300" />
                                        </div>
                                        <h2 className="text-xl md:text-2xl font-bold text-white">Tu próxima acción</h2>
                                    </div>

                                    <div className="mb-6">
                                        <div className="flex items-start">
                                            <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-indigo-500/30 mr-4">
                                                {proximaAccion.icono}
                                            </div>
                                            <div>
                                                <h3 className="text-xl font-bold text-white">{proximaAccion.titulo}</h3>
                                                <p className="text-indigo-200 mt-1">{proximaAccion.descripcion}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <Link
                                        to={proximaAccion.url}
                                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 w-full md:w-auto"
                                    >
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
                {progreso && (
                    <div className="mb-8">
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl rounded-3xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl p-6 md:p-8 border border-white/10 shadow-lg">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-6 flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-violet-500/20 mr-4 group-hover:bg-violet-500/30 transition-colors">
                                        <CheckCircle2 className="h-6 w-6 text-violet-300" />
                                    </div>
                                    Tu progreso
                                </h2>

                                <ProgresoPrograma
                                    progreso={progreso}
                                    cuestionarioPreRespondido={cuestionarioPreRespondido}
                                    cuestionarioPostRespondido={cuestionarioPostRespondido}
                                    mostrarDetalles={false}
                                    tieneCuestionarios={programa?.tiene_cuestionarios}
                                />

                                <div className="flex justify-center mt-8">
                                    <Link
                                        to="/miprograma"
                                        className="group relative inline-flex items-center justify-center px-8 py-3.5 overflow-hidden bg-gradient-to-r from-violet-500 to-purple-500 rounded-xl shadow-lg shadow-violet-500/20 hover:shadow-violet-500/30 transition-all duration-300 hover:scale-105"
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
                    </div>
                )}

                {/* Acciones rápidas - Solo visible en escritorio */}
                <div className="hidden md:block mt-6">
                    <h2 className="text-xl font-bold text-white mb-6 flex items-center pl-2">
                        <Star className="h-5 w-5 text-amber-400 mr-2" />
                        Acciones rápidas
                    </h2>

                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2">
                        <Link
                            to="/explorar"
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 blur-xl rounded-2xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-blue-300/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-blue-500/20 mr-4 group-hover:bg-blue-500/30 transition-colors">
                                        <Search className="h-6 w-6 text-blue-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-blue-300 transition-colors">Explorar Programas</h3>
                                        <p className="text-sm text-indigo-200">Descubre nuevos caminos de mindfulness</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-indigo-300 ml-auto group-hover:text-blue-300 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/perfil"
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl rounded-2xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-emerald-300/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20 mr-4 group-hover:bg-emerald-500/30 transition-colors">
                                        <User className="h-6 w-6 text-emerald-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-emerald-300 transition-colors">Mi Perfil</h3>
                                        <p className="text-sm text-indigo-200">Gestiona tu información personal</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-indigo-300 ml-auto group-hover:text-emerald-300 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <Link
                            to="/completados"
                            className="group relative"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-yellow-500/20 blur-xl rounded-2xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-amber-300/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20 mr-4 group-hover:bg-amber-500/30 transition-colors">
                                        <Star className="h-6 w-6 text-amber-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-amber-300 transition-colors">Programas Completados</h3>
                                        <p className="text-sm text-indigo-200">Revisa tus logros de mindfulness</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-indigo-300 ml-auto group-hover:text-amber-300 group-hover:translate-x-1 transition-all" />
                                </div>
                            </div>
                        </Link>

                        <button
                            onClick={logout}
                            className="group relative text-left w-full"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-xl rounded-2xl"></div>
                            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-5 border border-white/10 hover:border-rose-300/30 transition-all duration-300 transform hover:-translate-y-1 shadow-lg">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20 mr-4 group-hover:bg-rose-500/30 transition-colors">
                                        <LogOut className="h-6 w-6 text-rose-300" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white group-hover:text-rose-300 transition-colors">Cerrar Sesión</h3>
                                        <p className="text-sm text-indigo-200">Hasta pronto</p>
                                    </div>
                                    <ChevronRight className="h-5 w-5 text-indigo-300 ml-auto group-hover:text-rose-300 group-hover:translate-x-1 transition-all" />
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