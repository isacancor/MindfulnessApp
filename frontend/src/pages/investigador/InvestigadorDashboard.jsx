import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Eye, Users, Clock, CalendarCheck, Award, FileText, ArrowRight, MenuSquare, BarChart, Sparkles, Loader2, TrendingUp, Activity, Target, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../config/axios';
import InvestigadorLayout from '../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../components/ErrorAlert';

const InvestigadorDashboard = () => {
    const { user } = useAuth();
    const [programas, setProgramas] = useState([]);
    const [estadisticas, setEstadisticas] = useState({
        totalProgramas: 0,
        participantesActivos: 0,
        sesionesCompletadas: 0,
        cuestionariosRespondidos: 0
    });
    const [programasDestacados, setProgramasDestacados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const estadisticasResponse = await api.get('/programas/estadisticas/');

                setEstadisticas({
                    totalProgramas: estadisticasResponse.data.total_programas,
                    participantesActivos: estadisticasResponse.data.participantes_activos,
                    sesionesCompletadas: estadisticasResponse.data.sesiones_completadas,
                    cuestionariosRespondidos: estadisticasResponse.data.cuestionarios_respondidos
                });

                const programasData = estadisticasResponse.data.programas_stats || [];
                setProgramas(programasData);

                if (estadisticasResponse.data.programas_destacados) {
                    setProgramasDestacados(estadisticasResponse.data.programas_destacados);
                } else {
                    const destacados = [...programasData]
                        .sort((a, b) => b.participantes - a.participantes)
                        .slice(0, 3);
                    setProgramasDestacados(destacados);
                }
            } catch (err) {
                setError('Error al cargar la información del dashboard');
                console.error('Error:', err);

                try {
                    const programasResponse = await api.get('/programas');
                    setProgramas(programasResponse.data);

                    const totalProgramas = programasResponse.data.length;
                    const participantesActivos = programasResponse.data.reduce(
                        (acc, p) => acc + (p.participantes?.length || 0), 0
                    );

                    setEstadisticas({
                        totalProgramas,
                        participantesActivos,
                        sesionesCompletadas: 0,
                        cuestionariosRespondidos: 0
                    });

                    const destacados = [...programasResponse.data]
                        .sort((a, b) => (b.participantes?.length || 0) - (a.participantes?.length || 0))
                        .slice(0, 3);

                    setProgramasDestacados(destacados);
                } catch (backupErr) {
                    console.error('Error en fallback:', backupErr);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center">
                <div className="text-center">
                    <Loader2 className="h-16 w-16 text-purple-300 animate-spin mx-auto mb-6" />
                    <p className="text-lg text-purple-100 font-medium animate-pulse">Preparando tu panel de investigación...</p>
                </div>
            </div>
        );
    }

    return (
        <InvestigadorLayout>
            {/* Encabezado principal */}
            <div className="mb-8">
                <div className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 p-[2px] rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                    <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative overflow-hidden border border-white/10">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                        <div className="relative z-10">
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                <div className="text-white">
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        ¡Bienvenido/a, {user.nombre}!
                                    </h1>
                                    <p className="mt-3 text-lg text-purple-200 max-w-2xl">
                                        Gestiona tus programas de mindfulness y monitorea su progreso
                                    </p>
                                </div>

                                <Link
                                    to="/programas/crear"
                                    className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                                >
                                    <span className="absolute left-0 w-8 h-32 -mt-12 transition-all duration-1000 transform -translate-x-12 bg-white opacity-10 rotate-12 group-hover:translate-x-96 ease"></span>
                                    <span className="relative flex items-center justify-center text-white font-semibold">
                                        <PlusCircle className="h-5 w-5 mr-2" />
                                        Nuevo Programa
                                    </span>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <ErrorAlert
                message={error}
                onClose={() => setError(null)}
            />

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Programas */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-violet-500/20 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-200 text-sm font-medium mb-2">Total Programas</p>
                                <p className="text-3xl font-bold text-white">{estadisticas.totalProgramas}</p>
                                <p className="text-sm text-purple-200 mt-2">
                                    {estadisticas.totalProgramas > 0 ? 'Programas creados' : 'Crea tu primer programa'}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-purple-500/20">
                                <MenuSquare className="h-6 w-6 text-purple-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Participantes Activos */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-teal-500/20 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-200 text-sm font-medium mb-2">Participantes</p>
                                <p className="text-3xl font-bold text-white">{estadisticas.participantesActivos}</p>
                                <p className="text-sm text-purple-200 mt-2">
                                    {estadisticas.participantesActivos > 0 ? 'Participantes en total' : 'Aún no hay participantes'}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/20">
                                <Users className="h-6 w-6 text-emerald-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sesiones Completadas */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-500/20 to-orange-500/20 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-200 text-sm font-medium mb-2">Sesiones</p>
                                <p className="text-3xl font-bold text-white">{estadisticas.sesionesCompletadas}</p>
                                <p className="text-sm text-purple-200 mt-2">
                                    {estadisticas.sesionesCompletadas > 0 ? 'Diarios completados' : 'Aún no hay registros'}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-amber-500/20">
                                <Activity className="h-6 w-6 text-amber-300" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Cuestionarios Respondidos */}
                <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-purple-200 text-sm font-medium mb-2">Cuestionarios</p>
                                <p className="text-3xl font-bold text-white">{estadisticas.cuestionariosRespondidos}</p>
                                <p className="text-sm text-purple-200 mt-2">
                                    {estadisticas.cuestionariosRespondidos > 0 ? 'Respuestas recibidas' : 'Sin respuestas aún'}
                                </p>
                            </div>
                            <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-rose-500/20">
                                <FileText className="h-6 w-6 text-rose-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Programas destacados */}
                <div className="lg:col-span-3">
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/20 via-purple-500/20 to-fuchsia-500/20 blur-2xl rounded-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg overflow-hidden">
                            <div className="p-6 border-b border-white/10">
                                <div className="flex justify-between items-center">
                                    <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-500/20">
                                            <TrendingUp className="h-5 w-5 text-violet-300" />
                                        </div>
                                        Mis programas destacados
                                    </h2>
                                    <Link
                                        to="/programas"
                                        className="text-purple-300 hover:text-white text-sm font-medium flex items-center transition-colors"
                                    >
                                        Ver todos
                                        <ArrowRight className="h-4 w-4 ml-1" />
                                    </Link>
                                </div>
                            </div>
                            <div className="p-6">
                                {programasDestacados.length > 0 ? (
                                    <div className="space-y-4">
                                        {programasDestacados.map((programa) => (
                                            <div
                                                key={programa.id}
                                                className="group relative"
                                            >
                                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                                <div className="relative flex items-center justify-between p-4 bg-white/5 backdrop-blur-xl rounded-2xl hover:bg-white/10 transition-all border border-white/10 group-hover:border-purple-300/30">
                                                    <div className="flex-1">
                                                        <h3 className="font-semibold text-white group-hover:text-purple-200 transition-colors">{programa.nombre}</h3>
                                                        <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-purple-200">
                                                            <span className="flex items-center">
                                                                <Users className="h-4 w-4 mr-2 text-emerald-400" />
                                                                {programa.participantes} participantes
                                                            </span>
                                                            <span className="flex items-center">
                                                                <FileText className="h-4 w-4 mr-2 text-amber-400" />
                                                                {programa.total_cuestionarios || 0} respuestas
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-3">
                                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${programa.estado === 'publicado'
                                                            ? 'bg-emerald-500/20 text-emerald-300'
                                                            : programa.estado === 'borrador'
                                                                ? 'bg-amber-500/20 text-amber-300'
                                                                : 'bg-gray-500/20 text-gray-300'
                                                            }`}>
                                                            {programa.estado === 'publicado' ? 'Publicado' :
                                                                programa.estado === 'borrador' ? 'Borrador' :
                                                                    programa.estado}
                                                        </span>
                                                        <Link
                                                            to={`/programas/${programa.id}`}
                                                            className="p-2 text-purple-300 hover:text-white hover:bg-white/10 rounded-full transition-all"
                                                        >
                                                            <Eye size={18} />
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <div className="mx-auto bg-purple-500/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6">
                                            <Sparkles className="h-8 w-8 text-purple-300" />
                                        </div>
                                        <h3 className="text-xl font-semibold text-white mb-3">No hay programas aún</h3>
                                        <p className="text-purple-200 max-w-md mx-auto mb-6">
                                            Comienza creando tu primer programa de mindfulness para gestionar participantes y sesiones.
                                        </p>
                                        <Link
                                            to="/programas/crear"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                                        >
                                            <PlusCircle size={16} />
                                            <span>Crear programa</span>
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Panel de análisis */}
                <div className='lg:col-span-2'>
                    <div className="relative h-full">
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 blur-2xl rounded-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg h-full flex flex-col">
                            <div className="p-6 border-b border-white/10">
                                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-500/20">
                                        <BarChart className="h-5 w-5 text-emerald-300" />
                                    </div>
                                    Resumen de actividad
                                </h2>
                            </div>
                            <div className="p-6 flex-1">
                                {programas.length > 0 ? (
                                    <div className="space-y-6 h-full flex flex-col">
                                        {/* Progreso de programas */}
                                        <div>
                                            <div className="flex justify-between mb-3">
                                                <span className="text-sm font-medium text-purple-200">Programas publicados</span>
                                                <span className="text-sm font-medium text-white">
                                                    {programas.filter(p => p.estado === 'publicado').length}/{programas.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-white/10 rounded-full h-3 backdrop-blur-sm">
                                                <div
                                                    className="bg-gradient-to-r from-emerald-400 to-teal-400 h-3 rounded-full transition-all duration-500"
                                                    style={{
                                                        width: `${(programas.filter(p => p.estado === 'publicado').length / Math.max(programas.length, 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>

                                        {/* Acciones recomendadas */}
                                        <div className="flex-1">
                                            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 h-full">
                                                <h3 className="font-semibold text-white mb-4 flex items-center">
                                                    <Target className="h-4 w-4 mr-2 text-purple-300" />
                                                    Acciones recomendadas
                                                </h3>
                                                <div className="space-y-3">
                                                    {programas.filter(p => p.estado === 'borrador').length > 0 && (
                                                        <div className="flex items-start gap-3 p-3 bg-amber-500/10 rounded-xl border border-amber-500/20">
                                                            <div className="bg-amber-500/20 p-1.5 rounded-lg mt-0.5">
                                                                <MenuSquare className="h-3 w-3 text-amber-300" />
                                                            </div>
                                                            <span className="text-sm text-amber-200">Tienes programas en borrador pendientes de publicar</span>
                                                        </div>
                                                    )}
                                                    {estadisticas.cuestionariosRespondidos > 0 && (
                                                        <div className="flex items-start gap-3 p-3 bg-purple-500/10 rounded-xl border border-purple-500/20">
                                                            <div className="bg-purple-500/20 p-1.5 rounded-lg mt-0.5">
                                                                <FileText className="h-3 w-3 text-purple-300" />
                                                            </div>
                                                            <span className="text-sm text-purple-200">Revisa las nuevas respuestas de cuestionarios</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-start gap-3 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                                                        <div className="bg-emerald-500/20 p-1.5 rounded-lg mt-0.5">
                                                            <Users className="h-3 w-3 text-emerald-300" />
                                                        </div>
                                                        <span className="text-sm text-emerald-200">Invita a nuevos participantes a tus programas</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 h-full flex flex-col justify-center">
                                        <div className="mx-auto bg-purple-500/10 rounded-full p-4 w-16 h-16 flex items-center justify-center mb-4">
                                            <BarChart className="h-6 w-6 text-purple-300" />
                                        </div>
                                        <p className="text-purple-200 text-sm">
                                            No hay suficientes datos para mostrar estadísticas.
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>


        </InvestigadorLayout>
    );
};

export default InvestigadorDashboard; 