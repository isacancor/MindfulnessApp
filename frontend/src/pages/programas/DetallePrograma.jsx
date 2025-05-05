import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, BookOpen, Calendar, Users, Clock, FileText, Link, Edit, Trash2 } from 'lucide-react';
import api from '../../config/axios';

const DetallePrograma = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Datos de prueba para las sesiones
    const sesionesPrueba = [
        {
            id: 1,
            titulo: "Introducción al Mindfulness",
            descripcion: "Primera sesión introductoria al programa de mindfulness",
            duracion: 60,
            fecha: "2024-05-10",
            completada: true
        },
        {
            id: 2,
            titulo: "Atención Plena en la Respiración",
            descripcion: "Práctica de atención plena enfocada en la respiración",
            duracion: 45,
            fecha: "2024-05-17",
            completada: false
        },
        {
            id: 3,
            titulo: "Escaneo Corporal",
            descripcion: "Práctica de escaneo corporal para desarrollar la conciencia corporal",
            duracion: 50,
            fecha: "2024-05-24",
            completada: false
        }
    ];

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const response = await api.get(`/programas/${id}/`);
                setPrograma(response.data);
            } catch (err) {
                setError('Error al cargar el programa');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograma();
    }, [id]);

    const handlePublicar = async () => {
        try {
            await api.post(`/programas/${id}/publicar/`);
            navigate('/programas');
        } catch (error) {
            console.error('Error al publicar el programa:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            }
        }
    };

    const handleEliminar = async () => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este programa?')) {
            try {
                await api.delete(`/programas/${id}/`);
                navigate('/programas');
            } catch (error) {
                console.error('Error al eliminar el programa:', error);
                if (error.response?.data?.error) {
                    setError(error.response.data.error);
                }
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                    <p className="text-red-700">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(-1)}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-100 text-blue-800 text-lg font-semibold">
                                <Clock className="h-5 w-5 mr-2" />
                                {programa.duracion_semanas} semanas
                            </span>
                            {user?.is_investigador && programa?.estado_publicacion === 'borrador' && (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={() => navigate(`/programas/${id}/editar`)}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Edit className="h-5 w-5 mr-2" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={handlePublicar}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                    >
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        Publicar
                                    </button>
                                    <button
                                        onClick={handleEliminar}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <Trash2 className="h-5 w-5 mr-2" />
                                        Eliminar
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Información del Programa */}
                    <div className="space-y-8">
                        {/* Título y Estado */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{programa.nombre}</h1>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${programa.estado_publicacion === 'publicado'
                                ? 'bg-green-100 text-green-800'
                                : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {programa.estado_publicacion === 'publicado' ? 'Publicado' : 'Borrador'}
                            </span>
                        </div>

                        {/* Descripción y Objetivos */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción y Objetivos</h2>
                            <p className="text-gray-600 whitespace-pre-line">{programa.descripcion}</p>
                        </div>

                        {/* Detalles del Programa */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                                <div className="space-y-4">
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
                                        <BookOpen className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Enfoque Metodológico</p>
                                            <p className="text-gray-900">{programa.enfoque_metodologico}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluación</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <FileText className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Escala de Evaluación</p>
                                            <p className="text-gray-900">{programa.escala}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Link className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Cuestionario Pre</p>
                                            {programa.cuestionario_pre ? (
                                                <a
                                                    href={programa.cuestionario_pre}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Ver cuestionario
                                                </a>
                                            ) : (
                                                <p className="text-gray-500">No disponible</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <Link className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                        <div>
                                            <p className="text-sm text-gray-500">Cuestionario Post</p>
                                            {programa.cuestionario_post ? (
                                                <a
                                                    href={programa.cuestionario_post}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-indigo-600 hover:text-indigo-800"
                                                >
                                                    Ver cuestionario
                                                </a>
                                            ) : (
                                                <p className="text-gray-500">No disponible</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sesiones */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones del Programa</h2>
                            <div className="space-y-4">
                                {sesionesPrueba.map((sesion) => (
                                    <div key={sesion.id} className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{sesion.titulo}</h3>
                                                <p className="text-gray-600 mt-1">{sesion.descripcion}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{sesion.duracion} minutos</span>
                                                    <span className="mx-2">•</span>
                                                    <Calendar className="h-4 w-4 mr-1" />
                                                    <span>{new Date(sesion.fecha).toLocaleDateString()}</span>
                                                </div>
                                            </div>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${sesion.completada
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-yellow-100 text-yellow-800'
                                                }`}>
                                                {sesion.completada ? 'Completada' : 'Pendiente'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallePrograma;