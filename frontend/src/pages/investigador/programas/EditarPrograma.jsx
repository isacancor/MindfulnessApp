import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, BookOpen } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import { TipoContexto, EnfoqueMetodologico, EstadoPublicacion, TipoEvaluacion, getEnumArray } from '../../../constants/enums';

const EditarPrograma = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const { user, loading: authLoading, error: authError } = useAuth();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_contexto: TipoContexto.CRECIMIENTO_PERSONAL.value,
        enfoque_metodologico: EnfoqueMetodologico.MBSR.value,
        duracion_semanas: '',
        poblacion_objetivo: '',
        tipo_evaluacion: TipoEvaluacion.AMBOS.value,
        creado_por: user.id,
        estado_publicacion: EstadoPublicacion.BORRADOR.value
    });

    const tiposContexto = getEnumArray(TipoContexto);
    const enfoquesMetodologicos = getEnumArray(EnfoqueMetodologico);
    const tiposEvaluacion = getEnumArray(TipoEvaluacion);

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                const response = await api.get(`/programas/${id}/`);
                if (response.data.estado_publicacion === 'publicado') {
                    navigate('/programas');
                    return;
                }
                if (response.data.creado_por.id !== user.perfil_investigador.id) {
                    navigate('/unauthorized');
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
    }, [id, navigate, user.perfil_investigador.id]);

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
        };

        try {
            await api.put(`/programas/${id}/`, dataToSend);
            navigate(-1);
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
                        onClick={() => navigate(-1)}
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

                    <ErrorAlert
                        message={error || authError}
                        onClose={() => setError(null)}
                    />

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
                                <label htmlFor="tipo_evaluacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Tipo de Evaluación *
                                </label>
                                <select
                                    id="tipo_evaluacion"
                                    name="tipo_evaluacion"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.tipo_evaluacion}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    {tiposEvaluacion.map((tipo) => (
                                        <option key={tipo.value} value={tipo.value}>
                                            {tipo.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="pt-4 flex justify-end space-x-4">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
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