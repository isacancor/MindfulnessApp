import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import { ArrowLeft, BookOpen, HelpCircle, AlertTriangle, FileText, BookMarked } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import { TipoContexto, EnfoqueMetodologico, EstadoPublicacion, getEnumArray } from '../../../constants/enums';

const CrearPrograma = () => {
    const navigate = useNavigate();
    const { user, loading: authLoading, error: authError } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        tipo_contexto: '',
        enfoque_metodologico: '',
        duracion_semanas: '',
        poblacion_objetivo: '',
        tiene_cuestionarios: true,
        tiene_diarios: true,
        creado_por: user.id,
        estado_publicacion: EstadoPublicacion.BORRADOR.value
    });

    // TODO: Eliminar este método + boton debajo
    const fillTestData = () => {
        setFormData({
            nombre: 'Programa de Prueba',
            descripcion: 'Este es un programa de prueba para mindfulness enfocado en reducir el estrés y mejorar el bienestar general.',
            tipo_contexto: 'otro',
            enfoque_metodologico: 'MBSR',
            duracion_semanas: '1',
            poblacion_objetivo: 'Estudiantes universitarios',
            tiene_cuestionarios: true,
            tiene_diarios: true,
            creado_por: user.id,
            estado_publicacion: EstadoPublicacion.BORRADOR.value
        });
    };

    const tiposContexto = getEnumArray(TipoContexto);
    const enfoquesMetodologicos = getEnumArray(EnfoqueMetodologico);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (type === 'checkbox') {
            // Si se está desmarcando un checkbox, verificar que al menos uno quede marcado
            if (!checked && name === 'tiene_cuestionarios' && !formData.tiene_diarios) {
                setError('Debes seleccionar al menos un método de evaluación');
                return;
            }
            if (!checked && name === 'tiene_diarios' && !formData.tiene_cuestionarios) {
                setError('Debes seleccionar al menos un método de evaluación');
                return;
            }
            setError(null);
        }

        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validar que al menos un método de evaluación esté seleccionado
        if (!formData.tiene_cuestionarios && !formData.tiene_diarios) {
            setError('Debes seleccionar al menos un método de evaluación');
            setLoading(false);
            return;
        }

        const dataToSend = {
            ...formData,
        };

        try {
            await api.post('programas', dataToSend);
            navigate('/programas');
        } catch (error) {
            console.error('Error al crear el programa:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Ha ocurrido un error al crear el programa');
            }
        } finally {
            setLoading(false);
        }
    };

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

                    <button
                        type="button"
                        onClick={fillTestData}
                        className="absolute top-6 right-6 px-3 py-2 text-sm rounded-lg transition-all duration-200 text-gray-500 hover:text-indigo-600 border border-gray-300/30 hover:border-indigo-300 bg-white/90 hover:bg-indigo-100 focus:outline-none shadow-sm"
                    >
                        Rellenar datos de prueba
                    </button>

                    <div className="text-center mt-2">
                        <div className="flex justify-center mb-3">
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Crear Nuevo Programa
                        </h2>
                        <p className="text-gray-500">
                            Completa los detalles del programa de mindfulness
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
                                <div className="relative">
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
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                        <div className="group relative">
                                            <HelpCircle className="h-5 w-5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors duration-200" />
                                            <div className="absolute bottom-full right-0 mb-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                                <div className="font-medium mb-1">Duración del Programa</div>
                                                <p className="text-gray-200">Este número determinará la cantidad de sesiones que deberás crear para el programa. Cada semana corresponde a una sesión.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 border-t border-gray-200 pt-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <span className="bg-indigo-100 p-2 rounded-lg mr-2">
                                    <FileText className="h-5 w-5 text-indigo-600" />
                                </span>
                                Métodos de Evaluación
                            </h3>
                            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-medium text-amber-800">Importante</h3>
                                        <div className="mt-2 text-sm text-amber-700">
                                            <p>Los métodos de evaluación seleccionados no podrán ser modificados después de crear el programa. Esta decisión afectará a la estructura y evaluación del programa.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="tiene_cuestionarios"
                                            name="tiene_cuestionarios"
                                            checked={formData.tiene_cuestionarios}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-200"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="tiene_cuestionarios" className="text-base font-medium text-gray-900">
                                            Cuestionarios Pre/Post
                                        </label>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Los participantes completarán cuestionarios al inicio y al final del programa para evaluar su progreso
                                        </p>
                                    </div>
                                    <div className="group relative">
                                        <HelpCircle className="h-5 w-5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors duration-200" />
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                            <div className="font-medium mb-1">Cuestionarios Pre/Post</div>
                                            <p className="text-gray-200">Evaluación completa al inicio y final del programa para medir el progreso y los cambios en los participantes.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4">
                                    <div className="flex items-center h-5">
                                        <input
                                            type="checkbox"
                                            id="tiene_diarios"
                                            name="tiene_diarios"
                                            checked={formData.tiene_diarios}
                                            onChange={handleChange}
                                            className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded transition duration-200"
                                            disabled={loading}
                                        />
                                    </div>
                                    <div className="flex-1">
                                        <label htmlFor="tiene_diarios" className="text-base font-medium text-gray-900">
                                            Diarios Post-Sesión
                                        </label>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Los participantes completarán un breve diario después de cada sesión para registrar su experiencia
                                        </p>
                                    </div>
                                    <div className="group relative">
                                        <HelpCircle className="h-5 w-5 text-gray-400 cursor-help hover:text-indigo-500 transition-colors duration-200" />
                                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-72 p-3 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none shadow-lg">
                                            <div className="font-medium mb-1">Diarios Post-Sesión</div>
                                            <p className="text-gray-200">Registro inmediato después de cada sesión para capturar la experiencia y el impacto en el momento.</p>
                                        </div>
                                    </div>
                                </div>
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
                                        Creando...
                                    </span>
                                ) : 'Crear borrador de Programa'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CrearPrograma;