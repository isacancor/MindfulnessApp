import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, Clock, FileText, AlertCircle } from 'lucide-react';

const ProgramaFinalizado = ({ programa }) => {
    const navigate = useNavigate();

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
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                <AlertCircle className="h-4 w-4 mr-1" />
                                Programa Finalizado
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
                            <span>Duración: {programa.duracion_semanas * 7} días</span>
                        </div>
                        <div className="flex items-center text-gray-600">
                            <Users className="mr-2 text-gray-400" size={16} />
                            <span className="capitalize">{programa.tipo_contexto}</span>
                        </div>
                    </div>

                    <div className="mt-6 p-4 bg-red-50 rounded-lg border border-red-100">
                        <div className="flex items-start">
                            <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3" />
                            <div>
                                <h3 className="text-sm font-medium text-red-900">Programa Finalizado</h3>
                                <p className="mt-1 text-sm text-red-700">
                                    Este programa ha sido finalizado por el investigador y ya no está disponible.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProgramaFinalizado; 