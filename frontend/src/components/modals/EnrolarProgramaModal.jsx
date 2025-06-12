import React, { useState } from 'react';
import { BookOpen, Calendar, Users, Clock, Link as LinkIcon, Target, Award, CheckCircle2, AlertCircle, User } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const EnrolarProgramaModal = ({ isOpen, onClose, onConfirm, programa }) => {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    if (!programa) return null;

    const message = (
        <div className="space-y-6">
            <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-xl border border-indigo-100">
                <div className="flex items-start justify-between mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">{programa.nombre}</h3>
                        <div className="flex items-center text-sm text-gray-600">
                            <User className="h-4 w-4 mr-2" />
                            <span>Por {programa.creado_por.nombre_completo_investigador}</span>
                        </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-800">
                        {programa.tipo_contexto_display}
                    </span>
                </div>
                <p className="text-sm text-gray-600">{programa.descripcion}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Duración</p>
                            <p className="text-sm text-gray-600">{programa.duracion_semanas} semanas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-start">
                        <Target className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Enfoque</p>
                            <p className="text-sm text-gray-600 capitalize">{programa.enfoque_metodologico_display}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-start">
                        <Users className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Población Objetivo</p>
                            <p className="text-sm text-gray-600">{programa.poblacion_objetivo}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-gray-100 shadow-sm">
                    <div className="flex items-start">
                        <Award className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-gray-900">Evaluación</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {programa.tiene_cuestionarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Cuestionarios
                                    </span>
                                )}
                                {programa.tiene_diarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Diarios
                                    </span>
                                )}
                                {!programa.tiene_cuestionarios && !programa.tiene_diarios && (
                                    <span className="text-gray-500 text-xs">Sin evaluación</span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 space-y-4">
                <div className="flex items-start space-x-3">
                    <input
                        type="checkbox"
                        id="terminos"
                        checked={aceptaTerminos}
                        onChange={(e) => setAceptaTerminos(e.target.checked)}
                        className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />
                    <div>
                        <label htmlFor="terminos" className="text-sm font-medium text-gray-900">
                            Acepto los términos y condiciones del programa
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                            Confirmo que he leído, entendido y aceptado los términos y condiciones del programa.
                        </p>
                        <a
                            href="/terminos-programa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-indigo-600 hover:text-indigo-500 mt-2"
                        >
                            <LinkIcon className="h-4 w-4 mr-1" />
                            Ver términos y condiciones completos
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={() => {
                if (aceptaTerminos) {
                    onConfirm();
                }
            }}
            title="Unirse al Programa"
            message={message}
            confirmText="Unirme al Programa"
            cancelText="Cancelar"
            confirmButtonClass={`bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 ${!aceptaTerminos ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!aceptaTerminos}
            customWidth="min-w-[700px] max-w-3xl"
        />
    );
};

export default EnrolarProgramaModal; 