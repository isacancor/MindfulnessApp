import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Clock, FileText, BookOpen, CheckCircle2, AlertCircle, Timer, Link, Music, Video, Scale, Lock } from 'lucide-react';
import api from '../../../config/axios';
import SesionCard from '../../../components/SesionCard';
import ErrorAlert from '../../../components/ErrorAlert';
import ProgramaFinalizado from './ProgramaFinalizado';

const MiPrograma = () => {
    const navigate = useNavigate();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progreso, setProgreso] = useState({
        sesionesCompletadas: 0,
        totalSesiones: 0,
        minutosCompletados: 0
    });
    const [cuestionarioPreRespondido, setCuestionarioPreRespondido] = useState(false);
    const [cuestionarioPostRespondido, setCuestionarioPostRespondido] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    useEffect(() => {
        const fetchMiPrograma = async () => {
            try {
                const response = await api.get('/programas/mi-programa/');
                const programaData = response.data;

                // Verificar el estado de cada sesión
                const sesionesConEstado = await Promise.all(
                    programaData.sesiones?.map(async (sesion) => {
                        try {
                            const diarioResponse = await api.get(`/sesiones/${sesion.id}/diario_info/`);
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

                const programaActualizado = {
                    ...programaData,
                    sesiones: sesionesConEstado
                };

                setPrograma(programaActualizado);

                // Calcular progreso basado en las sesiones completadas
                const sesionesCompletadas = sesionesConEstado.filter(s => s.completada).length;
                const totalSesiones = sesionesConEstado.length;
                const minutosCompletados = sesionesConEstado.reduce((acc, s) => acc + (s.completada ? s.duracion_estimada : 0), 0);

                setProgreso({
                    sesionesCompletadas,
                    totalSesiones,
                    minutosCompletados
                });

                // Obtener el estado de los cuestionarios del backend
                setCuestionarioPreRespondido(programaData.cuestionario_pre_respondido || false);
                setCuestionarioPostRespondido(programaData.cuestionario_post_respondido || false);
            } catch (err) {
                console.error('Error al cargar el programa:', err);
                setError('Error al cargar tu programa. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchMiPrograma();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando tu programa...</p>
            </div>
        );
    }

    if (!programa) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center max-w-2xl">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes un programa activo</h3>
                    <p className="mt-2 text-gray-500">
                        Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness.
                    </p>
                    <button
                        onClick={() => navigate('/explorar')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Explorar Programas
                    </button>
                </div>
            </div>
        );
    }

    // Si el programa está finalizado, mostrar la vista de programa finalizado
    if (programa.estado_publicacion === 'finalizado') {
        return <ProgramaFinalizado programa={programa} />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate('/home')}
                    className="absolute top-8 left-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {/* Encabezado del Programa */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{programa.nombre}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Por {programa.creado_por.nombre} {programa.creado_por.apellidos}
                            </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${programa.inscripciones?.[0]?.estado_programa === 'completado' || cuestionarioPostRespondido
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {programa.inscripciones?.[0]?.estado_programa === 'completado' || cuestionarioPostRespondido
                                    ? 'Completado'
                                    : 'En progreso'}
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600">{programa.descripcion}</p>

                    {/* Información de inscripción */}
                    {programa.inscripcion_info && (
                        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                            <div className="flex items-start">
                                <Lock className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                <div>
                                    <h3 className="text-sm font-medium text-blue-900">Período de dedicación exclusiva</h3>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Estás inscrito en este programa desde el {formatDate(programa.inscripcion_info.fecha_inicio)} hasta el {formatDate(programa.inscripcion_info.fecha_fin)}.
                                    </p>
                                    <p className="mt-1 text-sm text-blue-700">
                                        Durante este período, te recomendamos dedicarte exclusivamente a este programa para obtener los mejores resultados.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="mr-2 text-gray-400" size={16} />
                            <span>{programa.duracion_semanas} semanas</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FileText className="mr-2 text-gray-400" size={16} />
                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Clock className="mr-2 text-gray-400" size={16} />
                            <span>{progreso.minutosCompletados} min completados</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="mr-2 text-gray-400" size={16} />
                            <span className="capitalize">{programa.tipo_contexto}</span>
                        </div>
                    </div>
                </div>

                {/* Cuestionarios */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h2 className="text-xl font-bold text-gray-900 mb-4">Cuestionarios</h2>
                    <p className="text-gray-600 mb-4">
                        Completa estos cuestionarios para avanzar en el programa:
                    </p>
                    <div className="flex space-x-4">
                        <div className="w-1/2">
                            {cuestionarioPreRespondido ? (
                                <div className="flex items-center justify-center px-6 py-3 rounded-md text-lg font-medium bg-green-100 text-green-800">
                                    <CheckCircle2 className="mr-2 h-5 w-5" /> Cuestionario Pre Completado
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/miprograma/cuestionario-pre')}
                                    className="w-full px-6 py-3 rounded-md text-lg font-medium bg-blue-600 text-white border-2 border-blue-400 shadow-md ring-2 ring-blue-200 hover:bg-blue-700"
                                >
                                    Cuestionario Pre
                                </button>
                            )}
                        </div>
                        <div className="w-1/2">
                            {cuestionarioPostRespondido ? (
                                <div className="flex items-center justify-center px-6 py-3 rounded-md text-lg font-medium bg-green-100 text-green-800">
                                    <CheckCircle2 className="mr-2 h-5 w-5" /> Cuestionario Post Completado
                                </div>
                            ) : (
                                <button
                                    onClick={() => navigate('/miprograma/cuestionario-post')}
                                    disabled={progreso.sesionesCompletadas < progreso.totalSesiones}
                                    className={`w-full px-6 py-3 rounded-md text-lg font-medium ${progreso.sesionesCompletadas < progreso.totalSesiones ? 'bg-gray-200 text-gray-500 cursor-not-allowed' : 'bg-blue-600 text-white border-2 border-blue-400 shadow-md ring-2 ring-blue-200 hover:bg-blue-700'}`}
                                >
                                    Cuestionario Post
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Progreso */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
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
                    </div>
                </div>

                {/* Sesiones */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones del programa</h2>
                    <div className="space-y-4">
                        {programa.sesiones?.map((sesion, index) => (
                            <SesionCard
                                key={sesion.id}
                                sesion={sesion}
                                index={index}
                                sesiones={programa.sesiones}
                                cuestionarioPreRespondido={cuestionarioPreRespondido}
                                permitirAccesoCompletada={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPrograma; 