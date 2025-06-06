import React, { useState, useEffect } from 'react';
import { PieChart, BarChart, BarChartHorizontal, LineChart, BookOpen } from 'lucide-react';
import api from '../../config/axios';
import InvestigadorLayout from '../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../components/ErrorAlert';
import TablaCuestionario from '../../components/TablaCuestionario';

const Analisis = () => {
    const [programas, setProgramas] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [estadisticasGenerales, setEstadisticasGenerales] = useState(null);
    const [estadisticasProgreso, setEstadisticasProgreso] = useState(null);
    //const [cuestionariosDetalle, setCuestionariosDetalle] = useState(null);
    const [pre, setPre] = useState(null);
    const [post, setPost] = useState(null);
    const [diarios, setDiarios] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    //const [tipoGrafico, setTipoGrafico] = useState('barras');

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

        try {
            const responseGenerales = await api.get(`/programas/${programaId}/estadisticas`);
            setEstadisticasGenerales(responseGenerales.data);

            const responseProgreso = await api.get(`/programas/${programaId}/estadisticas-progreso`);
            setEstadisticasProgreso(responseProgreso.data);

            // Solo si el programa tiene cuestionarios
            if (programa.tiene_cuestionarios) {
                const responseCuestionarios = await api.get(`/programas/${programaId}/cuestionarios-y-respuestas`);
                console.log(responseCuestionarios.data);
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
        <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-start justify-between">
                <div>
                    <p className="text-sm text-gray-500 mb-1">{titulo}</p>
                    <h3 className="text-2xl font-bold text-gray-800">{valor}</h3>
                    {descripcion && <p className="mt-1 text-xs text-gray-500">{descripcion}</p>}
                </div>
                <div className={`p-3 rounded-full bg-${color}-100`}>
                    {icono}
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Cargando datos de análisis...</p>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="mx-auto space-y-8 pb-10">
                <div className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 rounded-xl p-8 shadow-xl text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold">Análisis de Programas</h1>
                            <p className="text-indigo-100 max-w-xl">
                                Visualiza estadísticas y resultados de tus programas de mindfulness
                            </p>
                        </div>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-10 w-10 text-purple-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay programas</h3>
                        <p className="text-gray-600 mb-6">
                            Para acceder a los análisis, necesitas tener programas que hayan sido completados.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Programas</h2>
                                <div className="space-y-2">
                                    {programas.map((programa) => (
                                        <button
                                            key={programa.id}
                                            onClick={() => handleSeleccionarPrograma(programa.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${programaSeleccionado?.id === programa.id
                                                ? 'bg-indigo-50 border border-indigo-200'
                                                : 'hover:bg-gray-50 border border-gray-100'
                                                }`}
                                        >
                                            <h3 className={`font-medium ${programaSeleccionado?.id === programa.id ? 'text-indigo-700' : 'text-gray-800'
                                                }`}>
                                                {programa.nombre}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {programa.participantes?.length || 0} participantes
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-3">
                            {!programaSeleccionado ? (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center h-full flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                                        Selecciona un programa
                                    </h3>
                                    <p className="text-gray-600">
                                        Elige un programa de la lista para ver sus análisis detallados.
                                    </p>
                                </div>
                            ) : (
                                <div className="space-y-6">
                                    {/*
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
                                            <div>
                                                <h2 className="text-xl font-bold text-gray-800">
                                                    {programaSeleccionado.titulo}
                                                </h2>
                                                <p className="text-gray-600">
                                                    Análisis y estadísticas detalladas
                                                </p>
                                            </div>
                                            <div className="mt-3 md:mt-0 flex space-x-2">
                                                <button
                                                    onClick={() => setTipoGrafico('barras')}
                                                    className={`p-2 rounded ${tipoGrafico === 'barras'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <BarChart className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setTipoGrafico('pie')}
                                                    className={`p-2 rounded ${tipoGrafico === 'pie'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <PieChart className="h-5 w-5" />
                                                </button>
                                                <button
                                                    onClick={() => setTipoGrafico('linea')}
                                                    className={`p-2 rounded ${tipoGrafico === 'linea'
                                                        ? 'bg-indigo-100 text-indigo-700'
                                                        : 'bg-gray-100 text-gray-700'
                                                        }`}
                                                >
                                                    <LineChart className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>

                                        
                                        <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center">
                                            {tipoGrafico === 'barras' && (
                                                <div className="text-center text-gray-500">
                                                    <BarChart className="h-12 w-12 mx-auto mb-2 text-indigo-300" />
                                                    <p>Gráfico de barras (simulado)</p>
                                                    <p className="text-sm text-gray-400 mt-2">
                                                        Los datos reales se mostrarían aquí cuando la API proporcione las estadísticas
                                                    </p>
                                                </div>
                                            )}
                                            {tipoGrafico === 'pie' && (
                                                <div className="text-center text-gray-500">
                                                    <PieChart className="h-12 w-12 mx-auto mb-2 text-indigo-300" />
                                                    <p>Gráfico circular (simulado)</p>
                                                    <p className="text-sm text-gray-400 mt-2">
                                                        Los datos reales se mostrarían aquí cuando la API proporcione las estadísticas
                                                    </p>
                                                </div>
                                            )}
                                            {tipoGrafico === 'linea' && (
                                                <div className="text-center text-gray-500">
                                                    <LineChart className="h-12 w-12 mx-auto mb-2 text-indigo-300" />
                                                    <p>Gráfico de línea (simulado)</p>
                                                    <p className="text-sm text-gray-400 mt-2">
                                                        Los datos reales se mostrarían aquí cuando la API proporcione las estadísticas
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                     */}

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        <TarjetaMetrica
                                            titulo="Total participantes"
                                            valor={estadisticasGenerales?.total_participantes || 0}
                                            icono={<BarChart className="h-6 w-6 text-blue-600" />}
                                            color="blue"
                                            descripcion="Número total de personas que participaron"
                                        />
                                        <TarjetaMetrica
                                            titulo="Sesiones completadas"
                                            valor={estadisticasGenerales?.sesiones_completadas || 0}
                                            icono={<PieChart className="h-6 w-6 text-purple-600" />}
                                            color="purple"
                                            descripcion="Número total de sesiones completadas por todos los participantes"
                                        />
                                        <TarjetaMetrica
                                            titulo="Minutos de práctica"
                                            valor={estadisticasGenerales?.minutos_totales_practica || 0}
                                            icono={<BarChartHorizontal className="h-6 w-6 text-green-600" />}
                                            color="green"
                                            descripcion="Minutos totales dedicados a mindfulness"
                                        />
                                    </div>

                                    {/* Lista de Participantes */}
                                    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Participantes</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Género
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Edad
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Ocupación
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Nivel Educativo
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Ubicación
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Exp. Mindfulness
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Condiciones de Salud
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {programaSeleccionado?.participantes?.map((participante) => {
                                                        const edad = new Date().getFullYear() - new Date(participante.fecha_nacimiento).getFullYear();
                                                        return (
                                                            <tr key={participante.id_anonimo}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {participante.id_anonimo}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.genero}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {edad} años
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.ocupacion}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.nivel_educativo}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.ubicacion}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.experiencia_mindfulness}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {participante.condiciones_salud}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/* Progreso de Participantes */}
                                    <div className="bg-white rounded-xl shadow-md p-6 mt-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Progreso de Participantes</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            ID
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Estado del Programa
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Sesiones Completadas
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Cuestionarios Completados
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Minutos de Práctica
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Última Actividad
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    {programaSeleccionado?.participantes?.map((participante) => {
                                                        const progreso = estadisticasProgreso?.progreso_participantes?.[participante.id_anonimo] || {
                                                            estado: 'En progreso',
                                                            sesiones_completadas: 0,
                                                            cuestionarios_completados: 0,
                                                            minutos_practica: 0,
                                                            ultima_actividad: 'N/A'
                                                        };

                                                        return (
                                                            <tr key={participante.id_anonimo}>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                                    {participante.id_anonimo}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${progreso.estado === 'Completado'
                                                                        ? 'bg-green-100 text-green-800'
                                                                        : progreso.estado === 'En progreso'
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : 'bg-yellow-100 text-yellow-800'
                                                                        }`}>
                                                                        {progreso.estado}
                                                                    </span>
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {progreso.sesiones_completadas} / {estadisticasProgreso?.total_sesiones || 0}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {progreso.cuestionarios_completados} / {estadisticasProgreso?.total_cuestionarios || 0}
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {progreso.minutos_practica} min
                                                                </td>
                                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                                    {progreso.ultima_actividad}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>

                                    {/** 
                                    <div className="bg-white rounded-xl shadow-md p-6">
                                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Datos del cuestionario</h3>
                                        <div className="overflow-x-auto">
                                            <table className="min-w-full divide-y divide-gray-200">
                                                <thead className="bg-gray-50">
                                                    <tr>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Ítem
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Pre (promedio)
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Post (promedio)
                                                        </th>
                                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                            Diferencia
                                                        </th>
                                                    </tr>
                                                </thead>
                                                <tbody className="bg-white divide-y divide-gray-200">
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            Nivel de estrés
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            7.2
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            4.5
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className="text-green-600 font-medium">-2.7</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            Satisfacción con la vida
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            5.8
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            7.4
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className="text-green-600 font-medium">+1.6</span>
                                                        </td>
                                                    </tr>
                                                    <tr>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            Atención plena
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            4.3
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            6.9
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                            <span className="text-green-600 font-medium">+2.6</span>
                                                        </td>
                                                    </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <p className="text-xs text-gray-500 mt-4">
                                            Nota: Los datos mostrados son ejemplos y pueden no reflejar los resultados reales del programa.
                                        </p>
                                    </div>
                                    */}
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
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Diarios de Sesión</h2>
                    {diarios.map((sesion) => (
                        <div key={sesion.id} className="bg-white rounded-xl shadow-md p-6 mb-6">
                            <div className="mb-4">
                                <h3 className="text-lg font-semibold text-gray-800">
                                    Semana {sesion.semana}: {sesion.titulo}
                                </h3>
                                <p className="text-sm text-gray-600">
                                    Tipo de práctica: {sesion.tipo_practica} • Duración estimada: {sesion.duracion_estimada} minutos
                                </p>
                            </div>
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Participante
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Valoración
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Comentario
                                            </th>
                                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Fecha
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {Object.entries(sesion.diarios).map(([participanteId, diariosParticipante]) => (
                                            diariosParticipante.map((diario, index) => (
                                                <tr key={`${participanteId}-${index}`}>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                        {participanteId}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {diario.valoracion}
                                                    </td>
                                                    <td className="px-6 py-4 text-sm text-gray-500">
                                                        {diario.comentario || 'Sin comentario'}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {new Date(diario.fecha).toLocaleDateString()}
                                                    </td>
                                                </tr>
                                            ))
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </InvestigadorLayout>
    );
};

export default Analisis; 