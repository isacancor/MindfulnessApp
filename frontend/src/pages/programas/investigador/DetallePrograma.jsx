import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, BookOpen, Calendar, Users, Clock, Link, Edit, Trash2, Plus, Timer, Music, Video, FileQuestion, CheckCircle, UserCheck } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import { EstadoPublicacion } from '../../../constants/enums';

const DetallePrograma = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isInvestigador } = useAuth();
    const [programa, setPrograma] = useState(null);
    const [sesiones, setSesiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograma = async () => {
        try {
            const response = await api.get(`/programas/${id}/`);
            setPrograma(response.data);
            setSesiones(response.data.sesiones)
        } catch (err) {
            setError('Error al cargar los datos');
            console.error('Error:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
        try {
            await api.delete(`/programas/${id}/`);
            navigate('/programas');
        } catch (error) {
            console.error('Error al eliminar el programa:', error);
        }
    };

    const handleNuevaSesion = () => {
        navigate(`/programas/${id}/sesiones/nueva`);
    };

    const handleNuevoCuestionarioPre = () => {
        navigate(`/programas/${id}/cuestionario-pre/nuevo`);
    };

    const handleNuevoCuestionarioPost = () => {
        navigate(`/programas/${id}/cuestionario-post/nuevo`);
    };

    const handleEliminarSesion = async (sesionId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar esta sesión?')) {
            try {
                await api.delete(`/sesiones/${sesionId}/`);
                // Actualizar la lista de sesiones
                setSesiones(sesiones.filter(s => s.id !== sesionId));
            } catch (error) {
                console.error('Error al eliminar la sesión:', error);
                if (error.response?.data?.error) {
                    setError(error.response.data.error);
                }
            }
        }
    };

    const handleEliminarCuestionario = async (cuestionarioId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este cuestionario?')) {
            try {
                await api.delete(`/cuestionario/${cuestionarioId}/`);
                // Actualizar el estado del programa con los datos más recientes
                const response = await api.get(`/programas/${id}/`);
                setPrograma(response.data);
            } catch (err) {
                console.error('Error al eliminar el cuestionario:', err);
            }
        }
    };

    const handleEditarCuestionario = (cuestionarioId) => {
        navigate(`/programas/${id}/cuestionarios/${cuestionarioId}/editar`);
    };

    const handleFinalizar = async () => {
        try {
            await api.post(`/programas/${id}/finalizar/`);
            fetchPrograma();
        } catch (error) {
            setError(error.response?.data?.error || 'Error al finalizar el programa');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
                            onClick={() => navigate('/programas')}
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

                            {programa.estado_publicacion !== 'borrador' &&
                                <button
                                    onClick={() => navigate(`/programas/${id}/participantes`)}
                                    className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-200 transition-colors"
                                >
                                    <UserCheck className="h-5 w-5 mr-2" />
                                    Ver Participantes ({programa.participantes?.length || 0})
                                </button>
                            }

                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
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
                            {isInvestigador() && programa?.estado_publicacion === 'publicado' && (
                                <div className="flex space-x-4">
                                    <button
                                        onClick={handleFinalizar}
                                        className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                    >
                                        <CheckCircle className="h-5 w-5 mr-2" />
                                        Finalizar Programa
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
                    />

                    {/* Información del Programa */}
                    <div className="space-y-8">
                        {/* Título y Estado */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">{programa.nombre}</h1>
                            <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                ? 'bg-green-100 text-green-800'
                                : programa.estado_publicacion === EstadoPublicacion.FINALIZADO.value
                                    ? 'bg-red-100 text-red-800'
                                    : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                {programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                    ? 'Publicado'
                                    : programa.estado_publicacion === EstadoPublicacion.FINALIZADO.value
                                        ? 'Finalizado'
                                        : 'Borrador'}
                            </span>
                        </div>

                        {/* Descripción y Objetivos */}
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">Descripción y Objetivos</h2>
                            <p className="text-gray-600 whitespace-pre-line">{programa.descripcion}</p>
                        </div>

                        {/* Detalles del Programa */}
                        <div className="space-y-6">
                            {/* Información General */}
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Información General</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    </div>
                                    <div className="space-y-4">
                                        <div className="flex items-start">
                                            <BookOpen className="h-5 w-5 text-indigo-600 mt-1 mr-3" />
                                            <div>
                                                <p className="text-sm text-gray-500">Enfoque Metodológico</p>
                                                <p className="text-gray-900">{programa.enfoque_metodologico}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Evaluación */}
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Evaluación</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {/* Cuestionario Pre */}
                                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-800 flex items-center">
                                                <FileQuestion className="h-5 w-5 text-indigo-600 mr-2" />
                                                Cuestionario Pre
                                            </h4>
                                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && !programa.cuestionario_pre && (
                                                <button
                                                    onClick={handleNuevoCuestionarioPre}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Plus className="h-5 w-5 mr-1" />
                                                    Crear
                                                </button>
                                            )}
                                        </div>

                                        {programa.cuestionario_pre ? (
                                            <div className="flex justify-between items-center">
                                                <a
                                                    href={`/programas/${id}/cuestionarios/${programa.cuestionario_pre.id}`}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    Ver vista previa del cuestionario
                                                </a>
                                                {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditarCuestionario(programa.cuestionario_pre.id)}
                                                            className="text-gray-500 hover:text-indigo-600 focus:outline-none"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarCuestionario(programa.cuestionario_pre.id)}
                                                            className="text-gray-500 hover:text-red-600 focus:outline-none"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No se ha creado cuestionario pre</p>
                                        )}
                                    </div>

                                    {/* Cuestionario Post */}
                                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-medium text-gray-800 flex items-center">
                                                <FileQuestion className="h-5 w-5 text-indigo-600 mr-2" />
                                                Cuestionario Post
                                            </h4>
                                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && !programa.cuestionario_post && (
                                                <button
                                                    onClick={handleNuevoCuestionarioPost}
                                                    className="inline-flex items-center px-3 py-1 border border-transparent text-xs font-medium rounded shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                                >
                                                    <Plus className="h-5 w-5 mr-1" />
                                                    Crear
                                                </button>
                                            )}
                                        </div>

                                        {programa.cuestionario_post ? (
                                            <div className="flex justify-between items-center">
                                                <a
                                                    href={`/programas/${id}/cuestionarios/${programa.cuestionario_post.id}`}
                                                    className="text-indigo-600 hover:text-indigo-800 text-sm font-medium"
                                                >
                                                    Ver vista previa del cuestionario
                                                </a>
                                                {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                    <div className="flex space-x-2">
                                                        <button
                                                            onClick={() => handleEditarCuestionario(programa.cuestionario_post.id)}
                                                            className="text-gray-500 hover:text-indigo-600 focus:outline-none"
                                                            title="Editar"
                                                        >
                                                            <Edit className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            onClick={() => handleEliminarCuestionario(programa.cuestionario_post.id)}
                                                            className="text-gray-500 hover:text-red-600 focus:outline-none"
                                                            title="Eliminar"
                                                        >
                                                            <Trash2 className="h-5 w-5" />
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <p className="text-gray-500 text-sm">No se ha creado cuestionario post</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/**************************************************************** */}
                        {/* Sesiones */}
                        <div>
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-xl font-semibold text-gray-900">Sesiones del Programa</h2>
                                {isInvestigador() && programa?.estado_publicacion === 'borrador' && sesiones.length < programa.duracion_semanas && (
                                    <button
                                        onClick={handleNuevaSesion}
                                        className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        <Plus className="h-5 w-5 mr-2" />
                                        Nueva Sesión
                                    </button>
                                )}
                            </div>
                            <div className="space-y-4">
                                {sesiones.length == 0 ? (
                                    <p className="text-gray-500">No hay sesiones creadas todavía.</p>
                                ) : (sesiones.map((sesion) => (
                                    <div key={sesion.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className="flex items-center space-x-4">
                                            <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full font-semibold">
                                                {sesion.semana}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-medium text-gray-900">{sesion.titulo}</h3>
                                                <p className="text-gray-600 mt-1">{sesion.descripcion}</p>
                                                <div className="flex items-center mt-2 text-sm text-gray-500">
                                                    <Clock className="h-4 w-4 mr-1" />
                                                    <span>{sesion.duracion_estimada} minutos</span>
                                                    <span className="mx-2">•</span>
                                                    {sesion.tipo_contenido === 'temporizador' && (
                                                        <div className="flex items-center">
                                                            <Timer className="h-4 w-4 mr-1 text-blue-500" />
                                                            <span>Temporizador</span>
                                                        </div>
                                                    )}
                                                    {sesion.tipo_contenido === 'enlace' && (
                                                        <div className="flex items-center">
                                                            <Link className="h-4 w-4 mr-1 text-green-500" />
                                                            <span>Enlace</span>
                                                        </div>
                                                    )}
                                                    {sesion.tipo_contenido === 'audio' && (
                                                        <div className="flex items-center">
                                                            <Music className="h-4 w-4 mr-1 text-purple-500" />
                                                            <span>Audio</span>
                                                        </div>
                                                    )}
                                                    {sesion.tipo_contenido === 'video' && (
                                                        <div className="flex items-center">
                                                            <Video className="h-4 w-4 mr-1 text-red-500" />
                                                            <span>Video</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${(sesion.tipo_practica === 'breath' || sesion.tipo_practica === 'sounds' || sesion.tipo_practica === 'visual_object' || sesion.tipo_practica === 'senses' || sesion.tipo_practica === 'open_awareness') ? 'bg-blue-100 text-blue-800' :
                                                sesion.tipo_practica === 'open_monitoring' ? 'bg-green-100 text-green-800' :
                                                    sesion.tipo_practica === 'loving_kindness' ? 'bg-purple-100 text-purple-800' :
                                                        sesion.tipo_practica === 'body_scan' ? 'bg-yellow-100 text-yellow-800' :
                                                            sesion.tipo_practica === 'mindful_movement' ? 'bg-red-100 text-red-800' :
                                                                sesion.tipo_practica === 'self_compassion' ? 'bg-pink-100 text-pink-800' :
                                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                {sesion.tipo_practica_display}
                                            </span>
                                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                <div className="flex space-x-2">
                                                    <button
                                                        onClick={() => navigate(`/programas/${id}/sesiones/${sesion.id}/editar`)}
                                                        className="p-2 text-gray-600 hover:text-indigo-600 transition-colors"
                                                        title="Editar sesión"
                                                    >
                                                        <Edit className="h-5 w-5" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEliminarSesion(sesion.id)}
                                                        className="p-2 text-gray-600 hover:text-red-600 transition-colors"
                                                        title="Eliminar sesión"
                                                    >
                                                        <Trash2 className="h-5 w-5" />
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallePrograma;