import React from 'react';
import { Calendar, Users, Clock, FileText, AlertCircle } from 'lucide-react';
import MobileNavBar from '../../../components/MobileNavBar';
import CTOExplorar from '../../../components/CTOExplorar';
import PageHeader from '../../../components/PageHeader';

const ProgramaFinalizado = ({ programa }) => {
    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Programa Finalizado"
                    subtitle="Este programa ya no está disponible"
                    backUrl="/home"
                />

                {/* Encabezado del Programa */}
                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-indigo-100">
                        <div className="flex items-start justify-between">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{programa.nombre}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    Por {programa.creado_por.nombre_completo_investigador}
                                </p>
                            </div>
                            <div className="flex flex-col items-end space-y-2">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
                                    <AlertCircle className="h-4 w-4 mr-1" />
                                    Programa Finalizado
                                </span>
                            </div>
                        </div>

                        <p className="mt-6 text-gray-600">{programa.descripcion}</p>

                        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Calendar className="mr-3 text-indigo-600" size={20} />
                                <span>{programa.duracion_semanas} semanas</span>
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <FileText className="mr-3 text-indigo-600" size={20} />
                                <span className="capitalize">{programa.enfoque_metodologico}</span>
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Clock className="mr-3 text-indigo-600" size={20} />
                                <span>Duración: {programa.duracion_semanas * 7} días</span>
                            </div>
                            <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                <Users className="mr-3 text-indigo-600" size={20} />
                                <span className="capitalize">{programa.tipo_contexto}</span>
                            </div>
                        </div>

                        <div className="mt-8 p-6 rounded-xl border border-red-100">
                            <div className="flex items-start">
                                <AlertCircle className="h-6 w-6 text-red-600 mt-0.5 mr-3" />
                                <CTOExplorar
                                    titulo="Programa Finalizado"
                                    descripcion="Este programa ha sido finalizado por el investigador y ya no está disponible. Te recomendamos explorar otros programas activos."
                                    buttonText="Explorar otros programas"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MobileNavBar />
        </div>
    );
};

export default ProgramaFinalizado; 