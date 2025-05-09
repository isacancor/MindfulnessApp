import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, BookOpen } from 'lucide-react';
import api from '../../config/axios';
import { ensureHttps } from '../../utils/url';

const EditarPrograma = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading: authLoading, error: authError } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_contexto: '',
        enfoque_metodologico: '',
        duracion_semanas: '',
        poblacion_objetivo: '',
        escala: '',
        cuestionario_pre: '',
        cuestionario_post: '',
        creado_por: user.id,
        estado_publicacion: 'borrador'
    });

    const tiposContexto = [
        { value: 'académico', label: 'Académico' },
        { value: 'laboral', label: 'Laboral' },
        { value: 'clínico/terapéutico', label: 'Clínico/Terapéutico' },
        { value: 'deportivo', label: 'Deportivo' },
        { value: 'personal/desarrollo individual', label: 'Personal/Desarrollo Individual' },
        { value: 'otro', label: 'Otro' }
    ];

    const escalas = [
        { value: 'emocional', label: 'Estado emocional [1–5]' },
        { value: 'utilidad', label: 'Utilidad de la sesión [1–5]' },
        { value: 'estres', label: 'PSS (estrés) [0–4]' },
        { value: 'compromiso', label: 'UWES-3 (compromiso) [1–5]' },
        { value: 'bienestar', label: 'VAS (bienestar general) [0–10]' }
    ];

    const enfoquesMetodologicos = [
        { value: 'MBSR', label: 'MBSR (Mindfulness-Based Stress Reduction)' },
        { value: 'MBCT', label: 'MBCT (Mindfulness-Based Cognitive Therapy)' },
        { value: 'ACT', label: 'ACT (Acceptance and Commitment Therapy)' },
        { value: 'DBT', label: 'DBT (Dialectical Behavior Therapy)' },
        { value: 'MSC', label: 'MSC (Mindful Self-Compassion)' },
        { value: 'MMT', label: 'MMT (Mindfulness Meditation Training)' },
        { value: 'propio', label: 'Enfoque propio' },
        { value: 'otro', label: 'Otro' }
    ];

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const response = await api.get(`/programas/${id}/`);
                console.log(response.data);
                if (response.data.estado_publicacion === 'publicado') {
                    navigate('/programas');
                    return;
                }
                setFormData(response.data);
            } catch (err) {
                setError('Error al cargar el programa');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPrograma();
    }, [id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Comprobar si el nuevo numero de semanas es menor que el numero de sesiones existentes
        if (formData.duracion_semanas < formData.sesiones.length) {
            setError('El número de semanas no puede ser menor que el número de sesiones existentes');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
            cuestionario_pre: ensureHttps(formData.cuestionario_pre),
            cuestionario_post: ensureHttps(formData.cuestionario_post),
        };

        try {
            await api.put(`/programas/${id}/`, dataToSend);
            navigate('/programas');
        } catch (error) {
            console.error('Error al actualizar el programa:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Ha ocurrido un error al actualizar el programa');
            }
        } finally {
            setLoading(false);
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl relative">
                    <button
                        onClick={() => navigate('/programas')}
                        className="absolute top-6 left-6 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-indigo-600 border border-gray-300/30 hover:border-indigo-300 bg-white/90 hover:bg-indigo-100 focus:outline-none shadow-sm"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center mt-2">
                        <div className="flex justify-center mb-3">
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Editar Programa
                        </h2>
                        <p className="text-gray-500">
                            Modifica los detalles del programa de mindfulness
                        </p>
                    </div>

                    {(error || authError) && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
                            <p className="text-red-700">{error || authError}</p>
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div>
                            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre del Programa *
                            </label>
                            <input
                                id="nombre"
                                name="nombre"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                placeholder="Nombre del programa"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
                                Descripción y Objetivos *
                            </label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                rows={4}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                placeholder="Descripción detallada y objetivos principales del programa"
                                value={formData.descripcion}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div>
                            <label htmlFor="poblacion_objetivo" className="block text-sm font-medium text-gray-700 mb-1">
                                Población Objetivo *
                            </label>
                            <input
                                id="poblacion_objetivo"
                                name="poblacion_objetivo"
                                type="text"
                                required
                                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                placeholder="Ej. Estudiantes, empleados, docentes, sanitarios etc."
                                value={formData.poblacion_objetivo}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="tipo_contexto" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Contexto *
                                </label>
                                <select
                                    id="tipo_contexto"
                                    name="tipo_contexto"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.tipo_contexto}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona un tipo de contexto</option>
                                    {tiposContexto.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="enfoque_metodologico" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enfoque Metodológico *
                                </label>
                                <select
                                    id="enfoque_metodologico"
                                    name="enfoque_metodologico"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.enfoque_metodologico}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona un enfoque metodológico</option>
                                    {enfoquesMetodologicos.map((enfoque) => (
                                        <option key={enfoque.value} value={enfoque.value}>{enfoque.label}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label htmlFor="duracion_semanas" className="block text-sm font-medium text-gray-700 mb-1">
                                    Duración en Semanas *
                                </label>
                                <input
                                    id="duracion_semanas"
                                    name="duracion_semanas"
                                    type="number"
                                    min="1"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Ej. 8"
                                    value={formData.duracion_semanas}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="escala" className="block text-sm font-medium text-gray-700 mb-1">
                                    Escala de autoevaluación post-sesión *
                                </label>
                                <select
                                    id="escala"
                                    name="escala"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.escala}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona una escala</option>
                                    {escalas.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>{tipo.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="cuestionario_pre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enlace al Cuestionario Pre
                                </label>
                                <input
                                    id="cuestionario_pre"
                                    name="cuestionario_pre"
                                    //type="url"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="https://forms.google.com/..."
                                    value={formData.cuestionario_pre}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="cuestionario_post" className="block text-sm font-medium text-gray-700 mb-1">
                                    Enlace al Cuestionario Post
                                </label>
                                <input
                                    id="cuestionario_post"
                                    name="cuestionario_post"
                                    //"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="https://forms.google.com/..."
                                    value={formData.cuestionario_post}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate('/programas')}
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
                                        Guardando...
                                    </span>
                                ) : 'Guardar Cambios'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditarPrograma; 