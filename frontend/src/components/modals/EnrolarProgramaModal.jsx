import React, { useState } from 'react';
import { BookOpen, Calendar, Users, Clock, Link as LinkIcon } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const EnrolarProgramaModal = ({ isOpen, onClose, onConfirm, programa }) => {
    const [aceptaTerminos, setAceptaTerminos] = useState(false);

    if (!programa) return null;

    const message = (
        <div className="space-y-4">
            <p>Estás a punto de unirte al siguiente programa:</p>

            <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                <div className="flex items-start">
                    <BookOpen className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Nombre del Programa</p>
                        <p className="text-gray-900 font-medium">{programa.nombre}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <Users className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Población Objetivo</p>
                        <p className="text-gray-900">{programa.poblacion_objetivo}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <Calendar className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Tipo de Contexto</p>
                        <p className="text-gray-900">{programa.tipo_contexto_display}</p>
                    </div>
                </div>

                <div className="flex items-start">
                    <Clock className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                    <div>
                        <p className="text-sm text-gray-500">Duración</p>
                        <p className="text-gray-900">{programa.duracion_semanas} semanas</p>
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
                        <label htmlFor="terminos" className="text-sm text-gray-900 font-medium">
                            Acepto los términos y condiciones del programa
                        </label>
                        <p className="text-sm text-gray-500 mt-1">
                            Al unirme a este programa, me comprometo a participar activamente y seguir las recomendaciones proporcionadas.
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
            confirmButtonClass={`bg-blue-600 hover:bg-blue-700 ${!aceptaTerminos ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!aceptaTerminos}
        />
    );
};

export default EnrolarProgramaModal; 