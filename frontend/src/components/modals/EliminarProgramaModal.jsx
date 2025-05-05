import React from 'react';
import { AlertTriangle } from 'lucide-react';
import ConfirmModal from './ConfirmModal';

const EliminarProgramaModal = ({ isOpen, onClose, onConfirm, programa }) => {
    if (!programa) return null;

    const message = (
        <div className="space-y-4">
            <div className="flex items-center text-yellow-600">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <p className="font-medium">¡Atención!</p>
            </div>

            <p>
                ¿Estás seguro de que deseas eliminar el programa <span className="font-medium">{programa.nombre}</span>?
            </p>

            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                <p className="text-red-700">
                    Esta acción no se puede deshacer. Se perderán todos los datos del programa, incluyendo:
                </p>
                <ul className="list-disc list-inside mt-2 text-red-700">
                    <li>Información del programa</li>
                    <li>Sesiones y contenido</li>
                    <li>Datos de evaluación</li>
                    <li>Historial de participantes</li>
                </ul>
            </div>
        </div>
    );

    return (
        <ConfirmModal
            isOpen={isOpen}
            onClose={onClose}
            onConfirm={onConfirm}
            title="Eliminar Programa"
            message={message}
            confirmText="Eliminar Programa"
            cancelText="Cancelar"
            confirmButtonClass="bg-red-600 hover:bg-red-700"
        />
    );
};

export default EliminarProgramaModal; 