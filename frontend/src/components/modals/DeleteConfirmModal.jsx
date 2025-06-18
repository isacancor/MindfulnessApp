import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

const ITEM_TYPES = {
    programa: {
        article: 'el',
        consequences: [
            'Información del programa',
            'Sesiones y contenido',
            'Datos de evaluación',
            'Historial de participantes'
        ]
    },
    sesion: {
        article: 'la',
        consequences: [
            'Contenido de la sesión',
            'Configuración de la sesión',
            'Datos de progreso de los participantes',
            'Registros de completado'
        ]
    },
    cuestionario: {
        article: 'el',
        consequences: [
            'Preguntas del cuestionario',
            'Respuestas de los participantes',
            'Datos de evaluación',
            'Configuración del cuestionario'
        ]
    }
};

const DeleteConfirmModal = ({ 
    isOpen, 
    onClose, 
    onConfirm, 
    itemType = 'elemento',
    itemName,
    customConsequences // Opcional: permite sobreescribir las consecuencias predeterminadas
}) => {
    if (!isOpen) return null;

    const itemConfig = ITEM_TYPES[itemType] || { article: 'el', consequences: [] };
    const consequences = customConsequences || itemConfig.consequences;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 max-w-md w-full mx-4">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-xl font-semibold text-gray-900">Confirmar Eliminación</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500 transition-colors"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center text-yellow-600">
                        <AlertTriangle className="h-5 w-5 mr-2" />
                        <p className="font-medium">¡Atención!</p>
                    </div>

                    <p className="text-gray-600">
                        ¿Estás seguro de que deseas eliminar {itemConfig.article} {itemType}
                        {itemName && <span className="font-medium"> "{itemName}"</span>}?
                    </p>

                    {consequences.length > 0 && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                            <p className="text-red-700">
                                Esta acción no se puede deshacer. Se perderán:
                            </p>
                            <ul className="list-disc list-inside mt-2 text-red-700">
                                {consequences.map((consequence, index) => (
                                    <li key={index}>{consequence}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-4 py-2 text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                    >
                        Eliminar {itemType}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal; 