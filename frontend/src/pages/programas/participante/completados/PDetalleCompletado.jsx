import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Clock, FileText, BookOpen, CheckCircle2, Star } from 'lucide-react';
import api from '../../../../config/axios';
import SesionCard from '../../../../components/SesionCard';
import ErrorAlert from '../../../../components/ErrorAlert';
import ProgramaFinalizado from '../ProgramaFinalizado';

const ProgramaCompletado = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progreso, setProgreso] = useState({
        sesionesCompletadas: 0,
        totalSesiones: 0,
        minutosCompletados: 0
    });

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const response = await api.get(`/programas/${id}/`);
                setPrograma(response.data);

                // Verificar el estado de cada sesión
                const sesionesConEstado = await Promise.all(
                    response.data.sesiones?.map(async (sesion) => {
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
                    ...response.data,
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
            } catch (err) {
                console.error('Error al cargar el programa:', err);
                setError('Error al cargar el programa. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchPrograma();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando programa...</p>
            </div>
        );
    }

    if (!programa) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center max-w-2xl">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">Programa no encontrado</h3>
                    <p className="mt-2 text-gray-500">
                        El programa que buscas no existe o no tienes acceso a él.
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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                <Star className="h-4 w-4 mr-1" />
                                Programa Completado
                            </span>
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600">{programa.descripcion}</p>

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
                                cuestionarioPreRespondido={true}
                                permitirAccesoCompletada={true}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramaCompletado; 