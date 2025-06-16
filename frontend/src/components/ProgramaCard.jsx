import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, FileText, Edit, Trash2, Send, BookOpen, Clock, UserCheck } from 'lucide-react';
import api from '../config/axios';
import PublicarProgramaModal from './modals/PublicarProgramaModal';
import EliminarProgramaModal from './modals/EliminarProgramaModal';

const ProgramaCard = ({ programa, onDelete, onUpdate }) => {
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
            <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className="flex justify-between items-start mb-4">
                        <div className="flex-1">
                            <h3 className="text-xl font-semibold text-white group-hover:text-purple-200 transition-colors">{programa.nombre}</h3>
                            <p className="text-sm text-purple-200 mt-1">
                                Creado el {formatDate(programa.fecha_creacion)}
                            </p>
                        </div>
                    </div>

                    <div className="mb-4">
                        <div className="flex items-center space-x-2">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${programa.estado_publicacion === 'publicado'
                                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                }`}>
                                {programa.estado_publicacion === 'publicado' ? 'Publicado' : 'Borrador'}
                            </span>
                        </div>
                    </div>

                    <p className="text-purple-100 mb-4 line-clamp-2 text-sm leading-relaxed">{programa.descripcion}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm mb-6">
                        <div className="flex items-center text-purple-200">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-purple-500/20 mr-2">
                                <Calendar size={14} className="text-purple-300" />
                            </div>
                            <span>{programa.duracion_semanas} semanas</span>
                        </div>
                        <div className="flex items-center text-purple-200">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-emerald-500/20 mr-2">
                                <Users size={14} className="text-emerald-300" />
                            </div>
                            <span>{programa.participantes?.length || 0} participantes</span>
                        </div>
                        <div className="flex items-center text-purple-200">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-amber-500/20 mr-2">
                                <FileText size={14} className="text-amber-300" />
                            </div>
                            <span className="capitalize">{programa.tipo_contexto}</span>
                        </div>
                        <div className="flex items-center text-purple-200">
                            <div className="flex items-center justify-center w-6 h-6 rounded-lg bg-rose-500/20 mr-2">
                                <BookOpen size={14} className="text-rose-300" />
                            </div>
                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex justify-center">
                        <Link
                            to={`/programas/${programa.id}`}
                            className="group/link inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 font-medium"
                        >
                            <span className="mr-2">Ver detalles</span>
                            <svg className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                        </Link>
                    </div>
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