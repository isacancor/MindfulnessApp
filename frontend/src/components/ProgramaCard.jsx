import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Edit, Trash2 } from 'lucide-react';

const ProgramaCard = ({ programa, onDelete }) => {
    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-xl font-semibold text-gray-800">{programa.nombre}</h3>
                    <p className="text-sm text-gray-500 mt-1">
                        Creado el {formatDate(programa.fecha_creacion)}
                    </p>
                </div>
                <div className="flex space-x-2">
                    <Link
                        to={`/programas/editar/${programa.id}`}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                    >
                        <Edit size={18} />
                    </Link>
                    <button
                        onClick={() => onDelete(programa.id)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                    >
                        <Trash2 size={18} />
                    </button>
                </div>
            </div>

            <p className="text-gray-600 mb-4 line-clamp-2">{programa.descripcion}</p>

            <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center text-gray-600">
                    <Calendar className="mr-2" size={16} />
                    <span>{programa.duracion_semanas} semanas</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <Users className="mr-2" size={16} />
                    <span>{programa.participantes?.length || 0} participantes</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <FileText className="mr-2" size={16} />
                    <span className="capitalize">{programa.tipo_contexto}</span>
                </div>
                <div className="flex items-center text-gray-600">
                    <span className="capitalize">{programa.enfoque_metodologico}</span>
                </div>
            </div>

            <div className="mt-4 pt-4 border-t">
                <Link
                    to={`/programas/${programa.id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    Ver detalles →
                </Link>
            </div>
        </div>
    );
};

export default ProgramaCard; 