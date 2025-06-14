import React, { useState } from 'react';
import { BookOpen, Calendar, Users, Clock, Link as LinkIcon, Target, Award, CheckCircle2, AlertCircle, User } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const EnrolarProgramaModal = ({ isOpen, onClose, onConfirm, programa }) => {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    if (!programa) return null;

    const message = (
        <div className="space-y-6 max-h-[70vh] overflow-y-auto px-1">
            <div className="bg-gradient-to-br from-blue-800 to-sky-800 p-4 sm:p-6 rounded-xl border border-blue-600/50">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div>
                        <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">{programa.nombre}</h3>
                        <div className="flex items-center text-sm text-sky-200">
                            <User className="h-4 w-4 mr-2" />
                            <span>Por {programa.creado_por.nombre_completo_investigador}</span>
                        </div>
                    </div>
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600/50 text-sky-200 self-start">
                        {programa.tipo_contexto_display}
                    </span>
                </div>
                <p className="text-sm text-sky-200">{programa.descripcion}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-blue-800 to-sky-800 p-4 rounded-lg border border-blue-600/50">
                    <div className="flex items-start">
                        <Calendar className="h-5 w-5 text-sky-300 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-white">Duración</p>
                            <p className="text-sm text-sky-200">{programa.duracion_semanas} semanas</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-800 to-sky-800 p-4 rounded-lg border border-blue-600/50">
                    <div className="flex items-start">
                        <Target className="h-5 w-5 text-sky-300 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-white">Enfoque</p>
                            <p className="text-sm text-sky-200 capitalize">{programa.enfoque_metodologico_display}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-800 to-sky-800 p-4 rounded-lg border border-blue-600/50">
                    <div className="flex items-start">
                        <Users className="h-5 w-5 text-sky-300 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-white">Población Objetivo</p>
                            <p className="text-sm text-sky-200">{programa.poblacion_objetivo}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-blue-800 to-sky-800 p-4 rounded-lg border border-blue-600/50">
                    <div className="flex items-start">
                        <Award className="h-5 w-5 text-sky-300 mt-1 mr-3" />
                        <div>
                            <p className="text-sm font-medium text-white">Evaluación</p>
                            <div className="flex flex-wrap gap-2 mt-1">
                                {programa.tiene_cuestionarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-600/50 text-sky-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Cuestionarios
                                    </span>
                                )}
                                {programa.tiene_diarios && (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-sky-600/50 text-sky-200">
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Diarios
                                    </span>
                                )}
                                {!programa.tiene_cuestionarios && !programa.tiene_diarios && (
                                    <span className="text-sky-200/70 text-xs">Sin evaluación</span>
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
                        className="mt-1 h-4 w-4 text-sky-500 focus:ring-sky-500 border-blue-600/50 rounded"
                    />
                    <div>
                        <label htmlFor="terminos" className="text-sm font-medium text-white">
                            Acepto los términos y condiciones del programa
                        </label>
                        <p className="text-sm text-sky-200 mt-1">
                            Confirmo que he leído, entendido y aceptado los términos y condiciones del programa.
                        </p>
                        <a
                            href="/terminos-programa"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center text-sm text-sky-300 hover:text-sky-200 mt-2"
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
            confirmButtonClass={`bg-gradient-to-r from-blue-600 to-sky-500 hover:from-blue-700 hover:to-sky-600 ${!aceptaTerminos ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!aceptaTerminos}
            customWidth="min-w-[320px] sm:min-w-[600px] max-w-3xl"
            blue={true}
        />
    );
};

export default EnrolarProgramaModal; 