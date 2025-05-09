import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Clock } from 'lucide-react';
import api from '../../config/axios';
import { ensureHttps } from '../../utils/url';

const EditarSesion = () => {
    const navigate = useNavigate();
    const { id, sesionId } = useParams();
    const { error: authError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [programa, setPrograma] = useState(null);
    const [formData, setFormData] = useState({
        programa: id,
        titulo: '',
        descripcion: '',
        semana: '',
        duracion_estimada: '',
        tipo_practica: 'focus_attention',
        tipo_contenido: 'temporizador',
        contenido_temporizador: 0,
        contenido_url: '',
        contenido_audio: null,
        contenido_video: null
    });

    const tiposPractica = [
        { value: 'focus_attention', label: 'Atención Focalizada' },
        { value: 'open_monitoring', label: 'Monitoreo Abierto' },
        { value: 'loving_kindness', label: 'Amorosa Bondad' },
        { value: 'body_scan', label: 'Escaneo Corporal' },
        { value: 'mindful_movement', label: 'Movimiento Consciente' },
        { value: 'self_compassion', label: 'Auto-compasión' },
        { value: 'otro', label: 'Otro' }
    ];

    const tiposContenido = [
        { value: 'temporizador', label: 'Temporizador' },
        { value: 'enlace', label: 'Enlace' },
        { value: 'audio', label: 'Audio' },
        { value: 'video', label: 'Video' }
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programaResponse, sesionResponse] = await Promise.all([
                    api.get(`/programas/${id}/`),
                    api.get(`/sesiones/${sesionId}/`)
                ]);
                setPrograma(programaResponse.data);
                setFormData({
                    ...sesionResponse.data,
                    programa: id
                });
            } catch (error) {
                console.error('Error al cargar los datos:', error);
                setError('Error al cargar los datos');
            }
        };
        fetchData();
    }, [id, sesionId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: files[0]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const dataToSend = {
            ...formData,
            contenido_url: ensureHttps(formData.contenido_url)
        };

        const formDataToSend = new FormData();
        Object.keys(dataToSend).forEach(key => {
            if (dataToSend[key] !== null) {
                formDataToSend.append(key, dataToSend[key]);
            }
        });

        try {
            await api.put(`/sesiones/${sesionId}/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/programas/${id}`);
        } catch (error) {
            console.error('Error al actualizar la sesión:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Ha ocurrido un error al actualizar la sesión');
            }
        } finally {
            setLoading(false);
        }
    };

    if (!programa) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl relative">
                    <button
                        onClick={() => navigate(`/programas/${id}`)}
                        className="absolute top-6 left-6 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-indigo-600 border border-gray-300/30 hover:border-indigo-300 bg-white/90 hover:bg-indigo-100 focus:outline-none shadow-sm"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center mt-2">
                        <div className="flex justify-center mb-3">
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <Clock className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Editar Sesión
                        </h2>
                        <p className="text-gray-500">
                            Programa: {programa.nombre}
                        </p>
                    </div>

                    {(error || authError) && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
                            <p className="text-red-700">{error || authError}</p>
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="titulo" className="block text-sm font-medium text-gray-700 mb-1">
                                Título de la Sesión *
                            </label>
                            <input
                                id="titulo"
                                name="titulo"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                placeholder="Título de la sesión"
                                value={formData.titulo}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción *
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows={4}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                placeholder="Descripción detallada de la sesión"
                                value={formData.descripcion}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="semana" className="block text-sm font-medium text-gray-700 mb-1">
                                    Semana *
                                </label>
                                <input
                                    id="semana"
                                    name="semana"
                                    type="number"
                                    min="1"
                                    max={programa.duracion_semanas}
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder={`1-${programa.duracion_semanas}`}
                                    value={formData.semana}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="duracion_estimada" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duración Estimada (minutos) *
                                </label>
                                <input
                                    id="duracion_estimada"
                                    name="duracion_estimada"
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Ej. 45"
                                    value={formData.duracion_estimada}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="tipo_practica" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Práctica *
                                </label>
                                <select
                                    id="tipo_practica"
                                    name="tipo_practica"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.tipo_practica}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    {tiposPractica.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="tipo_contenido" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Contenido *
                                </label>
                                <select
                                    id="tipo_contenido"
                                    name="tipo_contenido"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.tipo_contenido}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    {tiposContenido.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {formData.tipo_contenido === 'temporizador' && (
                            <div>
                                <label htmlFor="contenido_temporizador" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duración del Temporizador (minutos) *
                                </label>
                                <input
                                    id="contenido_temporizador"
                                    name="contenido_temporizador"
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Ej. 15"
                                    value={formData.contenido_temporizador}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {formData.tipo_contenido === 'enlace' && (
                            <div>
                                <label htmlFor="contenido_url" className="block text-sm font-medium text-gray-700 mb-1">
                                    URL del Contenido *
                                </label>
                                <input
                                    id="contenido_url"
                                    name="contenido_url"
                                    //type="url"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="https://..."
                                    value={formData.contenido_url}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {formData.tipo_contenido === 'audio' && (
                            <div>
                                <label htmlFor="contenido_audio" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo de Audio *
                                </label>
                                <input
                                    id="contenido_audio"
                                    name="contenido_audio"
                                    type="file"
                                    accept="audio/*"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        {formData.tipo_contenido === 'video' && (
                            <div>
                                <label htmlFor="contenido_video" className="block text-sm font-medium text-gray-700 mb-1">
                                    Archivo de Video *
                                </label>
                                <input
                                    id="contenido_video"
                                    name="contenido_video"
                                    type="file"
                                    accept="video/*"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    onChange={handleFileChange}
                                    disabled={loading}
                                />
                            </div>
                        )}

                        <div className="pt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(`/programas/${id}`)}
                                className="px-6 py-3 rounded-lg font-medium text-gray-700 border border-gray-300 hover:bg-gray-50 transition duration-200 shadow-sm"
                                disabled={loading}
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className={`px-6 py-3 rounded-lg font-medium text-white shadow-md transition duration-200 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Actualizando...
                                    </span>
                                ) : 'Actualizar Sesión'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarSesion; 