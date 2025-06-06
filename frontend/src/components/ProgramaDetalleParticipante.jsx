import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, CheckCircle, CheckCircle2, Star, Lock, AlertTriangle, Clock, FileQuestion } from 'lucide-react';
import SesionCard from './SesionCard';
import ErrorAlert from './ErrorAlert';
import ProgresoPrograma from './ProgresoPrograma';
import CTOExplorar from './CTOExplorar';
import MobileNavBar from './layout/MobileNavBar';
import api from '../config/axios';

const ProgramaDetalle = ({
    programa,
    loading,
    error,
    setError,
    progreso,
    cuestionarioPreRespondido,
    cuestionarioPostRespondido,
    esCompletado = false,
    permitirNavegacionCuestionarios = true
}) => {
    const navigate = useNavigate();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handleAbandonar = async () => {
        try {
            await api.post(`/programas/${programa.id}/abandonar/`);
            navigate('/home');
        } catch (error) {
            setError(error.response?.data?.error || 'Error al abandonar el programa');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando programa...</p>
            </div>
        );
    }

    if (!programa?.sesiones?.length) {
        return (
            <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            {esCompletado ? "Programa no encontrado" : "Mi Programa"}
                        </h1>
                        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
                            {esCompletado
                                ? "No se ha encontrado el programa que buscas"
                                : "Gestiona y sigue tu progreso en el programa actual"}
                        </p>
                    </div>

                    <CTOExplorar
                        titulo={esCompletado ? "Programa no encontrado" : "No tienes ningún programa activo"}
                        descripcion={esCompletado
                            ? "El programa que buscas no existe o no tienes acceso a él."
                            : "Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness."}
                        buttonText="Explorar Programas"
                    />
                </div>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
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
                                Por {programa.creado_por.nombre_completo_investigador}
                            </p>
                        </div>
                        <div className="flex flex-col items-end space-y-2">
                            {esCompletado ? (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-emerald-500 to-green-500 text-white shadow-sm">
                                    <Star className="h-4 w-4 mr-2" />
                                    Programa Completado
                                </span>
                            ) : (
                                <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-gradient-to-r from-amber-200 to-amber-300 text-amber-800 shadow-sm">
                                    <Clock className="h-4 w-4 mr-2" />
                                    En progreso
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="mt-4 text-gray-600">{programa.descripcion}</p>

                    {/* Información de inscripción - Solo para programa activo */}
                    {programa.inscripcion_info && !esCompletado && (
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

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-2 gap-4">
                        <div className="flex items-center text-gray-600">
                            <Calendar className="mr-2 text-gray-400" size={16} />
                            <span>{programa.duracion_semanas} semanas</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FileText className="mr-2 text-gray-400" size={16} />
                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="mr-2 text-gray-400" size={16} />
                            <span className="capitalize">{programa.tipo_contexto}</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <FileQuestion className="mr-2 text-gray-400" size={16} />
                            <div className="flex flex-wrap gap-2">
                                {programa.tiene_cuestionarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-s font-medium bg-indigo-100 text-indigo-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Cuestionarios
                                    </span>
                                )}
                                {programa.tiene_diarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-s font-medium bg-emerald-100 text-emerald-800">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Diarios
                                    </span>
                                )}
                                {!programa.tiene_cuestionarios && !programa.tiene_diarios && (
                                    <span className="text-gray-500">Sin evaluación</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progreso */}
                <ProgresoPrograma
                    progreso={progreso}
                    cuestionarioPreRespondido={cuestionarioPreRespondido}
                    cuestionarioPostRespondido={cuestionarioPostRespondido}
                    mostrarDetalles={!esCompletado}
                    tieneCuestionarios={programa?.tiene_cuestionarios}
                />

                {/* Cuestionarios - Solo para programa activo */}
                {!esCompletado && permitirNavegacionCuestionarios && (programa.tiene_cuestionarios) && (
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
                )}

                {/* Sesiones */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones del programa</h2>
                    <div className="space-y-4">
                        {programa.sesiones?.map((sesion, index) => (
                            <SesionCard
                                key={sesion.id}
                                sesion={{
                                    ...sesion,
                                    fechaInicio: programa.inscripcion_info && !esCompletado ?
                                        new Date(new Date(programa.inscripcion_info.fecha_inicio).getTime() + (sesion.semana - 1) * 7 * 24 * 60 * 60 * 1000).toISOString() :
                                        null,
                                    fechaFin: programa.inscripcion_info && !esCompletado ?
                                        new Date(new Date(programa.inscripcion_info.fecha_inicio).getTime() + sesion.semana * 7 * 24 * 60 * 60 * 1000 - 24 * 60 * 60 * 1000).toISOString() :
                                        null
                                }}
                                index={index}
                                sesiones={programa.sesiones}
                                cuestionarioPreRespondido={cuestionarioPreRespondido || esCompletado}
                                permitirAccesoCompletada={true}
                                programaCompletado={esCompletado}
                                tieneCuestionarios={programa?.tiene_cuestionarios}
                            />
                        ))}
                    </div>
                </div>

                {/* Botón de Abandonar Programa - Solo para programa activo */}
                {!esCompletado && (
                    <div className="mt-8 flex justify-center">
                        <button
                            onClick={() => setShowConfirmDialog(true)}
                            className="group relative inline-flex items-center justify-center px-10 py-4 text-lg font-semibold text-white transition-all duration-200 ease-in-out bg-gradient-to-r from-red-500 to-rose-500 rounded-xl shadow-lg hover:shadow-xl hover:from-red-700 hover:to-rose-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <AlertTriangle className="h-6 w-6 mr-3 text-white group-hover:text-red-100" />
                            <span className="group-hover:text-red-100">Abandonar Programa</span>
                        </button>
                    </div>
                )}

                {/* Modal de confirmación */}
                {showConfirmDialog && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md w-full mx-4 border border-gray-100">
                            <div className="flex items-center mb-6">
                                <div className="flex-shrink-0 flex items-center justify-center w-12 h-12 rounded-full bg-red-100 mr-4">
                                    <AlertTriangle className="h-6 w-6 text-red-600" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900">¿Estás seguro?</h3>
                            </div>
                            <p className="text-gray-600 mb-8">
                                Si abandonas el programa, perderás todo tu progreso y no podrás volver a retomarlo.
                                Esta acción no se puede deshacer.
                            </p>
                            <div className="flex justify-end space-x-4">
                                <button
                                    onClick={() => setShowConfirmDialog(false)}
                                    className="px-6 py-2.5 text-gray-600 hover:text-gray-800 font-medium transition-colors duration-200"
                                >
                                    Cancelar
                                </button>
                                <button
                                    onClick={handleAbandonar}
                                    className="px-6 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full font-medium shadow-sm hover:shadow-md hover:from-red-600 hover:to-rose-600 transform hover:-translate-y-0.5 transition-all duration-200"
                                >
                                    Sí, abandonar
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgramaDetalle; 