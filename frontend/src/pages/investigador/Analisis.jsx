import React, { useState, useEffect } from 'react';
import { PieChart, BarChart, BarChartHorizontal, LineChart, BookOpen, Table, List, Users, Loader2, TrendingUp } from 'lucide-react';
import api from '../../config/axios';
import InvestigadorLayout from '../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../components/ErrorAlert';
import TablaCuestionario from '../../components/TablaCuestionario';
import { renderDiariosPorSesion, renderTodosLosDiarios, renderDiariosPorParticipante } from '../../utils/diariosUtils';

const Analisis = () => {
    const [programas, setProgramas] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [estadisticasProgreso, setEstadisticasProgreso] = useState(null);
    const [pre, setPre] = useState(null);
    const [post, setPost] = useState(null);
    const [diarios, setDiarios] = useState(null);
    const [vistaDiarios, setVistaDiarios] = useState('todos'); // 'por_sesion', 'todos', o 'por_participante'
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await api.get('/programas');
                setProgramas(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar programas:', err);
                setError('Error al cargar los programas. Por favor, intenta nuevamente.');
                setLoading(false);
            }
        };

        fetchProgramas();
    }, []);

    const handleSeleccionarPrograma = async (programaId) => {
        setLoading(true);
        const programa = programas.find(p => p.id === programaId);
        setProgramaSeleccionado(programa);
        setError(null);

        try {
            const responseGenerales = await api.get(`/programas/${programaId}/estadisticas`);
            setEstadisticasGenerales(responseGenerales.data);

            const responseProgreso = await api.get(`/programas/${programaId}/estadisticas-progreso`);
            setEstadisticasProgreso(responseProgreso.data);

            // Solo si el programa tiene cuestionarios
            if (programa.tiene_cuestionarios) {
                const responseCuestionarios = await api.get(`/programas/${programaId}/cuestionarios-y-respuestas`);
                setPre(responseCuestionarios.data.pre);
                setPost(responseCuestionarios.data.post);
            }

            // Solo si el programa tiene diarios
            if (programa.tiene_diarios) {
                const responseDiarios = await api.get(`/programas/${programaId}/diarios-sesion`);
                setDiarios(responseDiarios.data);
            }

        } catch (err) {
            console.error('Error al cargar estadísticas del programa:', err);
            setError('Error al cargar las estadísticas del programa. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const TarjetaMetrica = ({ titulo, valor, icono, color, descripcion }) => (
        <div className="relative group">
            <div className={`absolute inset-0 bg-gradient-to-r ${color} blur-xl rounded-2xl opacity-50`}></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <div className="flex items-start justify-between">
                    <div>
                        <p className="text-sm text-purple-200 mb-1">{titulo}</p>
                        <h3 className="text-2xl font-bold text-white">{valor}</h3>
                        {descripcion && <p className="mt-1 text-xs text-purple-300">{descripcion}</p>}
                    </div>
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/10">
                        {icono}
                    </div>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-16 w-16 text-purple-300 animate-spin mx-auto mb-6" />
                        <p className="text-lg text-purple-100 font-medium animate-pulse">Cargando datos de análisis...</p>
                    </div>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="space-y-8">
                {/* Header principal */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 p-[2px] rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                            <div className="relative z-10">
                                <div className="text-white text-center">
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                        Análisis de Programas
                                    </h1>
                                    <p className="mt-3 text-lg text-purple-200 max-w-2xl mx-auto">
                                        Visualiza estadísticas y resultados de tus programas de mindfulness
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 blur-2xl rounded-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg p-12 text-center">
                            <div className="mx-auto bg-purple-500/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6">
                                <BookOpen className="h-8 w-8 text-purple-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">No hay programas</h3>
                            <p className="text-purple-200 max-w-md mx-auto">
                                Para acceder a los análisis, necesitas tener programas que hayan sido completados.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-xl rounded-2xl"></div>
                                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <TrendingUp className="h-5 w-5 text-purple-300 mr-2" />
                                        Selecciona un programa
                                    </h2>
                                    <div className="space-y-2">
                                        {programas.map((programa) => (
                                            <button
                                                key={programa.id}
                                                onClick={() => handleSeleccionarPrograma(programa.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${programaSeleccionado?.id === programa.id
                                                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                                                    : 'text-purple-200 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm border border-transparent'
                                                    }`}
                                            >
                                                <h3 className="font-medium">
                                                    {programa.nombre}
                                                </h3>
                                                <p className="text-xs opacity-75 mt-1">
                                                    {programa.participantes?.length || 0} participantes
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            {!programaSeleccionado ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-xl rounded-2xl"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center border border-white/10 shadow-lg">
                                        <h3 className="text-xl font-medium text-white mb-2">
                                            Selecciona un programa
                                        </h3>
                                        <p className="text-purple-200">
                                            Elige un programa de la lista para ver sus análisis detallados.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <TarjetaMetrica
                                            titulo="Total participantes"
                                            valor={estadisticasGenerales?.total_participantes || 0}
                                            icono={<BarChart className="h-6 w-6 text-emerald-300" />}
                                            color="from-emerald-500/20 to-teal-500/20"
                                            descripcion="Número total de personas que participaron"
                                        />
                                        <TarjetaMetrica
                                            titulo="Sesiones completadas"
                                            valor={estadisticasGenerales?.sesiones_completadas || 0}
                                            icono={<PieChart className="h-6 w-6 text-purple-300" />}
                                            color="from-purple-500/20 to-violet-500/20"
                                            descripcion="Número total de sesiones completadas por todos los participantes"
                                        />
                                        <TarjetaMetrica
                                            titulo="Minutos de práctica"
                                            valor={estadisticasGenerales?.minutos_totales_practica || 0}
                                            icono={<BarChartHorizontal className="h-6 w-6 text-amber-300" />}
                                            color="from-amber-500/20 to-orange-500/20"
                                            descripcion="Minutos totales dedicados a mindfulness"
                                        />
                                    </div>

                                    {/* Lista de Participantes */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-violet-500/10 to-purple-500/10 blur-xl rounded-2xl"></div>
                                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg overflow-hidden">
                                            <div className="p-6 border-b border-white/10">
                                                <h3 className="text-lg font-semibold text-white">Participantes</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-white/10">
                                                    <thead className="bg-white/5">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                ID
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Género
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Edad
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Ocupación
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Nivel Educativo
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Ubicación
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Exp. Mindfulness
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Condiciones de Salud
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white/5 divide-y divide-white/10">
                                                        {programaSeleccionado?.participantes?.map((participante) => {
                                                            const edad = new Date().getFullYear() - new Date(participante.fecha_nacimiento).getFullYear();
                                                            return (
                                                                <tr key={participante.id_anonimo} className="hover:bg-white/10 transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                                        {participante.id_anonimo}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.genero_display}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {edad} años
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.ocupacion}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.nivel_educativo_display}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.ubicacion}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.experiencia_mindfulness_display}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {participante.condiciones_salud}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Progreso de Participantes */}
                                    <div className="relative">
                                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 to-blue-500/10 blur-xl rounded-2xl"></div>
                                        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg overflow-hidden">
                                            <div className="p-6 border-b border-white/10">
                                                <h3 className="text-lg font-semibold text-white">Progreso de Participantes</h3>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-white/10">
                                                    <thead className="bg-white/5">
                                                        <tr>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                ID
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Estado del Programa
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Sesiones Completadas
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Cuestionarios Completados
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Minutos de Práctica
                                                            </th>
                                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                                                Última Actividad
                                                            </th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white/5 divide-y divide-white/10">
                                                        {programaSeleccionado?.participantes?.map((participante) => {
                                                            const progreso = estadisticasProgreso?.progreso_participantes?.[participante.id_anonimo] || {
                                                                estado: 'En progreso',
                                                                sesiones_completadas: 0,
                                                                cuestionarios_completados: 0,
                                                                minutos_practica: 0,
                                                                ultima_actividad: 'N/A'
                                                            };

                                                            return (
                                                                <tr key={participante.id_anonimo} className="hover:bg-white/10 transition-colors">
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                                                        {participante.id_anonimo}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${progreso.estado === 'completado'
                                                                            ? 'bg-emerald-500/20 text-emerald-300'
                                                                            : progreso.estado === 'en_progreso'
                                                                                ? 'bg-amber-500/20 text-amber-300'
                                                                                : 'bg-rose-500/20 text-rose-300'
                                                                            }`}>
                                                                            {progreso.estado_inscripcion_display}
                                                                        </span>
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {progreso.sesiones_completadas} / {estadisticasProgreso?.total_sesiones || 0}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {progreso.cuestionarios_completados} / {estadisticasProgreso?.total_cuestionarios || 0}
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {progreso.minutos_practica} min
                                                                    </td>
                                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                                        {progreso.ultima_actividad}
                                                                    </td>
                                                                </tr>
                                                            );
                                                        })}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Después de la tabla de progreso de participantes */}
            {programaSeleccionado?.tiene_cuestionarios && (
                <>
                    {pre && (
                        <TablaCuestionario
                            titulo={`Cuestionario Pre: ${pre.nombre}`}
                            cuestionario={pre}
                        />
                    )}
                    {post && (
                        <TablaCuestionario
                            titulo={`Cuestionario Post: ${post.nombre}`}
                            cuestionario={post}
                        />
                    )}
                </>
            )}

            {/* Tabla de Diarios de Sesión */}
            {programaSeleccionado?.tiene_diarios && diarios && (
                <div className="mt-8">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-xl font-bold text-white">Diarios de Sesión</h2>
                        <div className="flex space-x-2">
                            <button
                                onClick={() => setVistaDiarios('todos')}
                                className={`p-2 rounded-lg flex items-center space-x-2 transition-all ${vistaDiarios === 'todos'
                                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                                    : 'bg-white/10 text-purple-200 hover:bg-white/15 hover:text-white'
                                    }`}
                            >
                                <Table className="h-5 w-5" />
                                <span>Todos</span>
                            </button>
                            <button
                                onClick={() => setVistaDiarios('por_sesion')}
                                className={`p-2 rounded-lg flex items-center space-x-2 transition-all ${vistaDiarios === 'por_sesion'
                                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                                    : 'bg-white/10 text-purple-200 hover:bg-white/15 hover:text-white'
                                    }`}
                            >
                                <List className="h-5 w-5" />
                                <span>Por Semana</span>
                            </button>
                            <button
                                onClick={() => setVistaDiarios('por_participante')}
                                className={`p-2 rounded-lg flex items-center space-x-2 transition-all ${vistaDiarios === 'por_participante'
                                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                                    : 'bg-white/10 text-purple-200 hover:bg-white/15 hover:text-white'
                                    }`}
                            >
                                <Users className="h-5 w-5" />
                                <span>Por Participante</span>
                            </button>
                        </div>
                    </div>
                    {vistaDiarios === 'por_sesion'
                        ? renderDiariosPorSesion(diarios)
                        : vistaDiarios === 'todos'
                            ? renderTodosLosDiarios(diarios)
                            : renderDiariosPorParticipante(diarios)
                    }
                </div>
            )}
        </InvestigadorLayout>
    );
};

export default Analisis; 