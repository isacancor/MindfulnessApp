import React from 'react';
import { BookOpen, Calendar, Users, Clock } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const PublicarProgramaModal = ({ isOpen, onClose, onConfirm, programa }) => {
    if (!programa) return null;

    const message = (
        <div className="space-y-4">
            <p>¿Estás seguro de que deseas publicar el siguiente programa?</p>

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
                        <p className="text-gray-900">{programa.tipo_contexto}</p>
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

            <p className="text-sm text-gray-500">
                Una vez publicado, no podrás modificar el programa. Asegúrate de que todos los datos son correctos.
            </p>
        </div>
    );

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Publicar Programa"
            message={message}
            confirmText="Publicar Programa"
            cancelText="Cancelar"
            confirmButtonClass="bg-green-600 hover:bg-green-700"
        />
    );
};

export default PublicarProgramaModal; 