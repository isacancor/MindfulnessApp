import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { BookOpen, Calendar, Users, Clock, Link, Edit, Trash2, Plus, Timer, Music, Video, FileQuestion, CheckCircle, UserCheck, Copy, Info, ClipboardList } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import { EstadoPublicacion } from '../../../constants/enums';
import PageHeader from '../../../components/layout/PageHeader';
import { TipoContenido, getEnumLabelByValue } from '../../../constants/enums';

const DetallePrograma = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isInvestigador, user } = useAuth();
    const [programa, setPrograma] = useState(null);
    const [sesiones, setSesiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograma = async () => {
        try {
            const response = await api.get(`/programas/${id}/`);
            setPrograma(response.data);
            setSesiones(response.data.sesiones);

            // Verificar si el usuario es el creador del programa
            if (response.data.creado_por.id !== user.perfil_investigador.id) {
                navigate('/unauthorized');
                return;
            }
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
            // Validar que si tiene_cuestionarios es true, ambos cuestionarios deben estar creados
            if (programa.tiene_cuestionarios && (!programa.cuestionario_pre || !programa.cuestionario_post)) {
                setError('Para publicar el programa, debes crear tanto el cuestionario pre como el post');
                return;
            }

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

    const handleDuplicar = async () => {
        try {
            setLoading(true);
            await api.post(`/programas/${id}/duplicar/`);
            navigate('/programas');
            // navigate(`/programas/${response.data.id}`);
        } catch (error) {
            setError(error.response?.data?.error || 'Error al duplicar el programa');
        } finally {
            setLoading(false);
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
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                    {/* Encabezado con gradiente */}
                    <div className="bg-gradient-to-r from-indigo-200 via-blue-100 to-teal-200 p-8 text-white">
                        <PageHeader
                            isInvestigador={true}
                            title={programa.nombre}
                            className="text-gray-900"
                            titleClassName="text-4xl md:text-5xl font-bold text-gray-900"
                            backUrl="/programas"
                            subtitle={
                                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-4">
                                    <div className="flex items-center gap-4">
                                        <div className="flex items-center bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-indigo-50 rounded-lg">
                                                    <Clock className="h-5 w-5 text-indigo-600" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-indigo-600 text-sm font-medium">Duración</span>
                                                    <span className="text-indigo-800 font-semibold">{programa.duracion_semanas} semanas</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center bg-white rounded-lg px-4 py-2.5 shadow-sm border border-gray-100">
                                            <div className="flex items-center gap-3">
                                                <div className={`p-2 rounded-lg ${programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                                    ? 'bg-emerald-50'
                                                    : 'bg-amber-50'
                                                    }`}>
                                                    <div className={`h-5 w-5 ${programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                                        ? 'text-emerald-600'
                                                        : 'text-amber-600'
                                                        }`}>
                                                        {programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value && <BookOpen className="h-5 w-5" />}
                                                        {programa.estado_publicacion === EstadoPublicacion.BORRADOR.value && <Edit className="h-5 w-5" />}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className={`text-sm font-medium ${programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                                        ? 'text-emerald-600'
                                                        : 'text-amber-600'
                                                        }`}>Estado</span>
                                                    <span className={`font-semibold ${programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                                        ? 'text-emerald-700'
                                                        : 'text-amber-700'
                                                        }`}>
                                                        {programa.estado_publicacion === EstadoPublicacion.PUBLICADO.value
                                                            ? 'Publicado'
                                                            : 'Borrador'}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                        />

                        <div className="flex flex-wrap justify-center gap-4 mt-6">
                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                <>
                                    <button
                                        onClick={() => navigate(`/programas/${id}/editar`)}
                                        className="flex items-center px-6 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                                    >
                                        <Edit className="h-5 w-5 mr-2" />
                                        Editar
                                    </button>
                                    <button
                                        onClick={handlePublicar}
                                        className="flex items-center px-6 py-3 bg-emerald-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-emerald-600"
                                    >
                                        <BookOpen className="h-5 w-5 mr-2" />
                                        Publicar
                                    </button>
                                    <button
                                        onClick={handleEliminar}
                                        className="flex items-center px-6 py-3 bg-white text-red-600 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-red-50"
                                    >
                                        <Trash2 className="h-5 w-5 mr-2" />
                                        Eliminar
                                    </button>
                                </>
                            )}

                            {isInvestigador() && programa?.estado_publicacion === 'publicado' && (
                                <>
                                    <button
                                        onClick={handleDuplicar}
                                        className="flex items-center px-6 py-3 bg-indigo-500 text-white rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:bg-indigo-600"
                                    >
                                        <Copy className="h-5 w-5 mr-2" />
                                        Duplicar Programa
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="px-8 py-6">
                        <ErrorAlert
                            message={error}
                            onClose={() => setError(null)}
                        />

                        {/* Contenido Principal */}
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Columna Principal */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Descripción y Objetivos */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <Info className="h-5 w-5 text-indigo-600 mr-2" />
                                            Descripción y Objetivos
                                        </h2>
                                    </div>
                                    <div className="p-4">
                                        <p className="text-gray-600 whitespace-pre-line text-base leading-relaxed">{programa.descripcion}</p>
                                    </div>
                                </div>

                                {/* Sesiones */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                                        <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <Calendar className="h-5 w-5 text-indigo-600 mr-2" />
                                            Sesiones del Programa ({sesiones.length}/{programa.duracion_semanas})
                                        </h2>
                                        {isInvestigador() && programa?.estado_publicacion === 'borrador' && sesiones.length < programa.duracion_semanas && (
                                            <button
                                                onClick={handleNuevaSesion}
                                                className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                            >
                                                <Plus className="h-4 w-4 mr-1" />
                                                Nueva Sesión
                                            </button>
                                        )}
                                    </div>
                                    <div className="divide-y divide-gray-100">
                                        {sesiones.length === 0 ? (
                                            <div className="p-4 text-center text-gray-500 text-sm">
                                                No hay sesiones creadas todavía.
                                            </div>
                                        ) : (
                                            sesiones.map((sesion) => (
                                                <div key={sesion.id} className="p-4 hover:bg-gray-50 transition-colors">
                                                    <div className="flex items-start justify-between">
                                                        <div className="flex items-start space-x-4">
                                                            <div className="flex-shrink-0 w-10 h-10 bg-indigo-100 text-indigo-600 rounded-lg flex items-center justify-center font-semibold">
                                                                {sesion.semana}
                                                            </div>
                                                            <div>
                                                                <h3 className="text-base font-medium text-gray-900">{sesion.titulo}</h3>
                                                                <p className="text-gray-600 text-base mt-1">{sesion.descripcion}</p>
                                                                <div className="flex items-center mt-2 space-x-4 text-sm text-gray-500">
                                                                    <div className="flex items-center">
                                                                        <Clock className="h-4 w-4 mr-1" />
                                                                        <span>{sesion.duracion_estimada} min</span>
                                                                    </div>
                                                                    <div className="flex items-center">
                                                                        {sesion.tipo_contenido === TipoContenido.TEMPORIZADOR.value &&
                                                                            <Timer className="h-4 w-4 mr-1 text-blue-500" />}
                                                                        {sesion.tipo_contenido === TipoContenido.ENLACE.value &&
                                                                            <Link className="h-4 w-4 mr-1 text-green-500" />}
                                                                        {sesion.tipo_contenido === TipoContenido.AUDIO.value &&
                                                                            <Music className="h-4 w-4 mr-1 text-purple-500" />}
                                                                        {sesion.tipo_contenido === TipoContenido.VIDEO.value &&
                                                                            <Video className="h-4 w-4 mr-1 text-red-500" />}
                                                                        <span>{getEnumLabelByValue(TipoContenido, sesion.tipo_contenido)}</span>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center space-x-2">
                                                            <div className="flex justify-center">
                                                                <span
                                                                    className={`px-2.5 py-1 rounded-full text-sm font-medium text-center
      ${['breath', 'sounds', 'visual_object', 'senses', 'open_awareness'].includes(sesion.tipo_practica)
                                                                            ? 'bg-blue-100 text-blue-800'
                                                                            : sesion.tipo_practica === 'open_monitoring'
                                                                                ? 'bg-green-100 text-green-800'
                                                                                : sesion.tipo_practica === 'loving_kindness'
                                                                                    ? 'bg-purple-100 text-purple-800'
                                                                                    : sesion.tipo_practica === 'body_scan'
                                                                                        ? 'bg-yellow-100 text-yellow-800'
                                                                                        : sesion.tipo_practica === 'mindful_movement'
                                                                                            ? 'bg-red-100 text-red-800'
                                                                                            : sesion.tipo_practica === 'self_compassion'
                                                                                                ? 'bg-pink-100 text-pink-800'
                                                                                                : 'bg-gray-100 text-gray-800'
                                                                        }`}
                                                                >
                                                                    {sesion.tipo_practica_display}
                                                                </span>
                                                            </div>

                                                            {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                                <div className="flex space-x-1">
                                                                    <button
                                                                        onClick={() => navigate(`/programas/${id}/sesiones/${sesion.id}/editar`)}
                                                                        className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                        title="Editar sesión"
                                                                    >
                                                                        <Edit className="h-4 w-4" />
                                                                    </button>
                                                                    <button
                                                                        onClick={() => handleEliminarSesion(sesion.id)}
                                                                        className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                        title="Eliminar sesión"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </div>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Columna Lateral */}
                            <div className="space-y-6">
                                {/* Información General */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                    <div className="p-4 border-b border-gray-100 bg-gray-50">
                                        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                            <ClipboardList className="h-5 w-5 text-indigo-600 mr-2" />
                                            Información General
                                        </h3>
                                    </div>
                                    <div className="p-4 space-y-4">
                                        <div className="flex items-start">
                                            <Users className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Población Objetivo</p>
                                                <p className="text-gray-900 text-base font-medium mt-0.5">{programa.poblacion_objetivo}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <Calendar className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Tipo de Contexto</p>
                                                <p className="text-gray-900 text-base font-medium mt-0.5">{programa.tipo_contexto_display}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <BookOpen className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Enfoque Metodológico</p>
                                                <p className="text-gray-900 text-base font-medium mt-0.5">{programa.enfoque_metodologico_display}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start">
                                            <FileQuestion className="h-5 w-5 text-indigo-600 mt-0.5 mr-3 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm text-gray-500">Métodos de Evaluación</p>
                                                <div className="flex flex-wrap gap-2 mt-1.5">
                                                    {programa.tiene_cuestionarios && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-base font-medium bg-indigo-100 text-indigo-800">
                                                            <CheckCircle className="h-4 w-4 mr-1.5" />
                                                            Cuestionarios
                                                        </span>
                                                    )}
                                                    {programa.tiene_diarios && (
                                                        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-base font-medium bg-emerald-100 text-emerald-800">
                                                            <CheckCircle className="h-4 w-4 mr-1.5" />
                                                            Diarios
                                                        </span>
                                                    )}
                                                    {!programa.tiene_cuestionarios && !programa.tiene_diarios && (
                                                        <span className="text-gray-500 text-base">No hay métodos de evaluación</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Evaluación */}
                                {programa.tiene_cuestionarios && (
                                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                        <div className="p-4 border-b border-gray-100 bg-gray-50">
                                            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                                                <FileQuestion className="h-5 w-5 text-indigo-600 mr-2" />
                                                Evaluación
                                            </h3>
                                        </div>
                                        <div className="p-4 space-y-4">
                                            {/* Cuestionario Pre */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-gray-900 flex items-center">
                                                        <FileQuestion className="h-5 w-5 text-indigo-600 mr-2" />
                                                        Cuestionario Pre
                                                    </h4>
                                                    {isInvestigador() && programa?.estado_publicacion === 'borrador' && !programa.cuestionario_pre && (
                                                        <button
                                                            onClick={handleNuevoCuestionarioPre}
                                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Crear
                                                        </button>
                                                    )}
                                                </div>
                                                {programa.cuestionario_pre ? (
                                                    <div className="flex justify-between items-center">
                                                        <a
                                                            href={`/programas/${id}/cuestionarios/${programa.cuestionario_pre.id}`}
                                                            className="text-indigo-600 hover:text-indigo-800 text-base font-medium"
                                                        >
                                                            Ver vista previa
                                                        </a>
                                                        {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                            <div className="flex space-x-1">
                                                                <button
                                                                    onClick={() => handleEditarCuestionario(programa.cuestionario_pre.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEliminarCuestionario(programa.cuestionario_pre.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-base">No se ha creado cuestionario pre</p>
                                                )}
                                            </div>

                                            {/* Cuestionario Post */}
                                            <div className="bg-gray-50 rounded-lg p-4">
                                                <div className="flex justify-between items-center mb-3">
                                                    <h4 className="font-medium text-gray-900 flex items-center">
                                                        <FileQuestion className="h-5 w-5 text-indigo-600 mr-2" />
                                                        Cuestionario Post
                                                    </h4>
                                                    {isInvestigador() && programa?.estado_publicacion === 'borrador' && !programa.cuestionario_post && (
                                                        <button
                                                            onClick={handleNuevoCuestionarioPost}
                                                            className="inline-flex items-center px-3 py-1.5 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 transition-colors"
                                                        >
                                                            <Plus className="h-4 w-4 mr-1" />
                                                            Crear
                                                        </button>
                                                    )}
                                                </div>
                                                {programa.cuestionario_post ? (
                                                    <div className="flex justify-between items-center">
                                                        <a
                                                            href={`/programas/${id}/cuestionarios/${programa.cuestionario_post.id}`}
                                                            className="text-indigo-600 hover:text-indigo-800 text-base font-medium"
                                                        >
                                                            Ver vista previa
                                                        </a>
                                                        {isInvestigador() && programa?.estado_publicacion === 'borrador' && (
                                                            <div className="flex space-x-1">
                                                                <button
                                                                    onClick={() => handleEditarCuestionario(programa.cuestionario_post.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                                                    title="Editar"
                                                                >
                                                                    <Edit className="h-4 w-4" />
                                                                </button>
                                                                <button
                                                                    onClick={() => handleEliminarCuestionario(programa.cuestionario_post.id)}
                                                                    className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                                    title="Eliminar"
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </button>
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    <p className="text-gray-500 text-base">No se ha creado cuestionario post</p>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetallePrograma;