import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Calendar, Users, FileText, Edit, Trash2, Send, BookOpen, Clock, UserCheck } from 'lucide-react';
import api from '../config/axios';
import PublicarProgramaModal from './modals/PublicarProgramaModal';
import EliminarProgramaModal from './modals/EliminarProgramaModal';

const ProgramaCard = ({ programa, onDelete, onUpdate }) => {
    const navigate = useNavigate();
    const [showPublicarModal, setShowPublicarModal] = useState(false);
    const [showEliminarModal, setShowEliminarModal] = useState(false);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString('es-ES', options);
    };

    const handlePublicar = async () => {
        try {
            await api.post(`/programas/${programa.id}/publicar/`);
            onUpdate();
        } catch (error) {
            console.error('Error al publicar el programa:', error);
        }
    };

    const handleEliminar = async () => {
        try {
            await api.delete(`/programas/${programa.id}/`);
            onDelete(programa.id);
        } catch (error) {
            console.error('Error al eliminar el programa:', error);
        }
    };

    return (
        <>
            <div className="bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-semibold text-gray-800">{programa.nombre}</h3>
                        <p className="text-sm text-gray-500 mt-1">
                            Creado el {formatDate(programa.fecha_creacion)}
                        </p>
                    </div>
                    {/** 
                    <div className="flex space-x-2">
                        {programa.estado_publicacion === 'borrador' && (
                            <>
                                <button
                                    onClick={() => setShowPublicarModal(true)}
                                    className="p-2 text-gray-400 hover:text-green-600 transition-colors"
                                    title="Publicar"
                                >
                                    <Send size={18} />
                                </button>

                                <button
                                    onClick={() => navigate(`/programas/${programa.id}/editar`)}
                                    className="p-2 text-gray-400 hover:text-indigo-600 transition-colors"
                                    title="Editar"
                                >
                                    <Edit size={18} />
                                </button>

                                <button
                                    onClick={() => setShowEliminarModal(true)}
                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                    title="Eliminar"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </>
                        )}
                    </div>*/}
                </div>

                <div className="mb-4">
                    <div className="flex items-center space-x-2">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${programa.estado_publicacion === 'publicado'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {programa.estado_publicacion === 'publicado'
                                ? 'Publicado'
                                : 'Borrador'}
                        </span>
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
                        <BookOpen className="mr-2" size={16} />
                        <span className="capitalize">{programa.enfoque_metodologico}</span>
                    </div>
                </div>

                <div className="mt-4 pt-4 border-t flex justify-between items-center">
                    <Link
                        to={`/programas/${programa.id}`}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Ver detalles →
                    </Link>
                    {/** 
                    {programa.participantes?.length > 0 && (
                        <Link
                            to={`/programas/${programa.id}/participantes`}
                            className="flex items-center text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                        >
                            <UserCheck className="h-4 w-4 mr-1" />
                            Ver participantes ({programa.participantes.length})
                        </Link>
                    )}
                        */}
                </div>
            </div>

            <PublicarProgramaModal
                isOpen={showPublicarModal}
                onClose={() => setShowPublicarModal(false)}
                onConfirm={() => {
                    handlePublicar();
                    setShowPublicarModal(false);
                }}
                programa={programa}
            />

            <EliminarProgramaModal
                isOpen={showEliminarModal}
                onClose={() => setShowEliminarModal(false)}
                onConfirm={() => {
                    handleEliminar();
                    setShowEliminarModal(false);
                }}
                programa={programa}
            />
        </>
    );
};

export default ProgramaCard; 