import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, Clock } from 'lucide-react';
import api from '../../../config/axios';
import { prepareSessionFormData } from '../../../utils/formData';
import ErrorAlert from '../../../components/ErrorAlert';
import { EtiquetaPractica, TipoContenido, Escala, getEnumArray } from '../../../constants/enums';
import VideoFondoSelector from '../../../components/sesiones/VideoFondoSelector';

const EditarSesion = () => {
    const navigate = useNavigate();
    const { id, sesionId } = useParams();
    const { error: authError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [programa, setPrograma] = useState(null);
    const [originalData, setOriginalData] = useState(null);
    const [formData, setFormData] = useState({
        programa: id,
        titulo: '',
        descripcion: '',
        semana: '',
        duracion_estimada: '',
        tipo_practica: EtiquetaPractica.BREATH.value,
        tipo_contenido: TipoContenido.TEMPORIZADOR.value,
        tipo_escala: Escala.EMOCIONAL.value,
        contenido_temporizador: 0,
        contenido_url: '',
        contenido_audio: null,
        contenido_video: null,
        video_fondo: ''
    });

    const tiposPractica = getEnumArray(EtiquetaPractica);
    const tiposContenido = getEnumArray(TipoContenido);
    const tiposEscala = getEnumArray(Escala);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [programaResponse, sesionResponse] = await Promise.all([
                    api.get(`/programas/${id}/`),
                    api.get(`/sesiones/${sesionId}/`)
                ]);
                setPrograma(programaResponse.data);
                const sesionData = sesionResponse.data;
                setOriginalData(sesionData);
                setFormData({
                    ...sesionData,
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

        try {
            const formDataToSend = prepareSessionFormData(formData, originalData);
            if (!programa.tiene_diarios) {
                delete formDataToSend.tipo_escala;
            }
            await api.put(`/sesiones/${sesionId}/`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate(`/programas/${id}`);
        } catch (error) {
            console.error('Error al actualizar la sesión:', error);

            if (error.response.data.non_field_errors) {
                setError(`Elige una semana válida. La semana ${formData.semana} ya existe`);
            } else if (error.response?.data?.error) {
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

                    <ErrorAlert
                        message={error || authError}
                        onClose={() => setError(null)}
                    />

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
                                    placeholder="Ej. 10"
                                    value={formData.duracion_estimada}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                                    <option value="">Selecciona un tipo de práctica</option>
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
                                    <option value="">Selecciona un tipo de contenido</option>
                                    {tiposContenido.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {programa.tiene_diarios && (
                            <div>
                                <label htmlFor="tipo_escala" className="block text-sm font-medium text-gray-700 mb-1">
                                    Escala de Evaluación *
                                </label>
                                <select
                                    id="tipo_escala"
                                    name="tipo_escala"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.tipo_escala}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona una escala de evaluación</option>
                                    {tiposEscala.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                                <p className="mt-1 text-sm text-gray-500">
                                    Esta escala se utilizará para evaluar la experiencia de los participantes después de la sesión
                                </p>
                            </div>
                        )}

                        {formData.tipo_contenido === 'temporizador' && (
                            <>
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
                                <div className="mt-4">
                                    <VideoFondoSelector
                                        value={formData.video_fondo}
                                        onChange={(e) => handleChange({ target: { name: 'video_fondo', value: e.target.value } })}
                                    />
                                </div>
                            </>
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
                                {formData.contenido_audio && typeof formData.contenido_audio === 'string' && (
                                    <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Archivo actual: {formData.contenido_audio.split('/').pop()}</p>
                                    </div>
                                )}
                                <input
                                    id="contenido_audio"
                                    name="contenido_audio"
                                    type="file"
                                    accept="audio/*"
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
                                {formData.contenido_video && typeof formData.contenido_video === 'string' && (
                                    <div className="mb-2 p-2 bg-gray-50 rounded-lg">
                                        <p className="text-sm text-gray-600">Archivo actual: {formData.contenido_video.split('/').pop()}</p>
                                    </div>
                                )}
                                <input
                                    id="contenido_video"
                                    name="contenido_video"
                                    type="file"
                                    accept="video/mp4"
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