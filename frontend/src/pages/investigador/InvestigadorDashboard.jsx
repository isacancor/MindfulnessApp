import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, Eye, Users, Clock, CalendarCheck, Award, FileText, ArrowRight, MenuSquare, BarChart, Sparkles } from 'lucide-react';
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
                    // Ordenar por participantes si el backend no proporciona destacados
                    const destacados = [...programasData]
                        .sort((a, b) => b.participantes - a.participantes)
                        .slice(0, 3);
                    setProgramasDestacados(destacados);
                }
            } catch (err) {
                setError('Error al cargar la información del dashboard');
                console.error('Error:', err);

                // Si falla el endpoint de estadísticas, intentar con el endpoint tradicional
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
                <p className="mt-4 text-gray-600 font-medium">Cargando dashboard...</p>
            </div>
        );
    }

    return (
        <InvestigadorLayout>
            {/* Encabezado con gradiente */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 mb-8 shadow-lg">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="text-white">
                        <h1 className="text-3xl font-bold">¡Bienvenido/a, {user.nombre}!</h1>
                        <p className="mt-2 opacity-90 text-blue-100">
                            Gestiona tus programas de mindfulness y monitorea su progreso
                        </p>
                    </div>

                    <Link
                        to="/programas/crear"
                        className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <PlusCircle size={20} />
                        <span className="font-medium">Nuevo Programa</span>
                    </Link>
                </div>
            </div>

            <ErrorAlert
                message={error}
                onClose={() => setError(null)}
            />

            {/* Estadísticas principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {/* Total Programas */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Total Programas</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.totalProgramas}</p>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-lg">
                            <MenuSquare className="h-6 w-6 text-blue-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">
                            {estadisticas.totalProgramas > 0 ? 'Programas disponibles' : 'Crea tu primer programa'}
                        </span>
                    </div>
                </div>

                {/* Participantes Activos */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Participantes</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.participantesActivos}</p>
                        </div>
                        <div className="bg-green-100 p-3 rounded-lg">
                            <Users className="h-6 w-6 text-green-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">
                            {estadisticas.participantesActivos > 0 ? 'Participantes en total' : 'Aún no hay participantes'}
                        </span>
                    </div>
                </div>

                {/* Sesiones Completadas */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-purple-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Sesiones Completadas</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.sesionesCompletadas}</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-lg">
                            <CalendarCheck className="h-6 w-6 text-purple-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">
                            {estadisticas.sesionesCompletadas > 0 ? 'Diarios completados' : 'Aún no hay registros'}
                        </span>
                    </div>
                </div>

                {/* Cuestionarios Respondidos */}
                <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-amber-500 hover:shadow-lg transition-all duration-200 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-gray-500 text-sm font-medium">Cuestionarios Respondidos</p>
                            <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.cuestionariosRespondidos}</p>
                        </div>
                        <div className="bg-amber-100 p-3 rounded-lg">
                            <FileText className="h-6 w-6 text-amber-600" />
                        </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-500">
                        <span className="font-medium">
                            {estadisticas.cuestionariosRespondidos > 0 ? 'Respuestas recibidas' : 'Sin respuestas aún'}
                        </span>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Programas destacados */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                    <Award className="h-5 w-5 text-blue-600" />
                                    Mis programas destacados
                                </h2>
                                <Link
                                    to="/programas"
                                    className="text-blue-600 hover:text-blue-700 text-sm font-medium flex items-center"
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
                                            className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-blue-50 transition-all hover:shadow-md"
                                        >
                                            <div>
                                                <h3 className="font-semibold text-gray-800">{programa.nombre}</h3>
                                                <div className="mt-1 text-sm text-gray-600 flex items-center gap-4">
                                                    <span className="flex items-center">
                                                        <Users className="h-4 w-4 mr-1 text-blue-500" />
                                                        {programa.participantes} participantes
                                                    </span>
                                                    <span className="flex items-center">
                                                        <FileText className="h-4 w-4 mr-1 text-amber-500" />
                                                        {programa.total_cuestionarios || 0} respuestas recibidas
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${programa.estado === 'publicado'
                                                    ? 'bg-green-100 text-green-800'
                                                    : programa.estado === 'borrador'
                                                        ? 'bg-yellow-100 text-yellow-800' :
                                                        'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {programa.estado === 'publicado' ? 'Publicado' :
                                                        programa.estado === 'borrador' ? 'Borrador' :
                                                            programa.estado}
                                                </span>
                                                <Link
                                                    to={`/programas/${programa.id}`}
                                                    className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                                >
                                                    <Eye size={18} />
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <div className="mx-auto bg-blue-50 rounded-full p-3 w-12 h-12 flex items-center justify-center mb-4">
                                        <Sparkles className="h-6 w-6 text-blue-500" />
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">No hay programas aún</h3>
                                    <p className="text-gray-500 max-w-md mx-auto mb-4">
                                        Comienza creando tu primer programa de mindfulness para gestionar participantes y sesiones.
                                    </p>
                                    <Link
                                        to="/programas/crear"
                                        className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        <PlusCircle size={16} />
                                        <span>Crear programa</span>
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Análisis resumido */}
                <div>
                    <div className="bg-white rounded-xl shadow-md overflow-hidden h-full">
                        <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-6 border-b">
                            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                                <BarChart className="h-5 w-5 text-blue-600" />
                                Resumen de actividad
                            </h2>
                        </div>
                        <div className="p-6">
                            {programas.length > 0 ? (
                                <div className="space-y-6">
                                    {/* Visualización de datos simplificada */}
                                    <div className="space-y-4">
                                        {/* Progreso de programas */}
                                        <div>
                                            <div className="flex justify-between mb-1">
                                                <span className="text-sm font-medium text-gray-700">Programas publicados</span>
                                                <span className="text-sm font-medium text-blue-600">
                                                    {programas.filter(p => p.estado === 'publicado').length}/{programas.length}
                                                </span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div
                                                    className="bg-blue-600 h-2 rounded-full"
                                                    style={{
                                                        width: `${(programas.filter(p => p.estado === 'publicado').length / Math.max(programas.length, 1)) * 100}%`
                                                    }}
                                                ></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Próximas acciones */}
                                    <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                                        <h3 className="font-medium text-gray-800 mb-3">Acciones recomendadas</h3>
                                        <ul className="space-y-2">
                                            {programas.filter(p => p.estado === 'borrador').length > 0 && (
                                                <li className="text-sm text-gray-600 flex items-start gap-2">
                                                    <div className="bg-amber-100 p-1 rounded mt-0.5">
                                                        <MenuSquare className="h-3 w-3 text-amber-600" />
                                                    </div>
                                                    <span>Tienes programas en borrador pendientes de publicar</span>
                                                </li>
                                            )}
                                            {estadisticas.cuestionariosRespondidos > 0 && (
                                                <li className="text-sm text-gray-600 flex items-start gap-2">
                                                    <div className="bg-purple-100 p-1 rounded mt-0.5">
                                                        <FileText className="h-3 w-3 text-purple-600" />
                                                    </div>
                                                    <span>Revisa las nuevas respuestas de cuestionarios</span>
                                                </li>
                                            )}
                                            <li className="text-sm text-gray-600 flex items-start gap-2">
                                                <div className="bg-blue-100 p-1 rounded mt-0.5">
                                                    <Users className="h-3 w-3 text-blue-600" />
                                                </div>
                                                <span>Invita a nuevos participantes a tus programas</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500">
                                        No hay suficientes datos para mostrar estadísticas.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </InvestigadorLayout>
    );
};

export default InvestigadorDashboard; 