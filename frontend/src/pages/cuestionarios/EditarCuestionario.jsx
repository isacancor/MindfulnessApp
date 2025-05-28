import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Trash2, Save, Type, List, CheckSquare, ChevronDown, Star, BarChart2, Heart, ThumbsUp } from 'lucide-react';
import api from '../../config/axios';

const EditarCuestionario = () => {
    const { id, cuestionarioId } = useParams();
    const navigate = useNavigate();
    const [titulo, setTitulo] = useState('');
    const [descripcion, setDescripcion] = useState('');
    const [preguntas, setPreguntas] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [initialLoading, setInitialLoading] = useState(true);

    const tiposPregunta = [
        { id: 'texto', nombre: 'Texto Libre', icono: <Type className="h-5 w-5" /> },
        { id: 'select', nombre: 'Selección Única', icono: <List className="h-5 w-5" /> },
        { id: 'checkbox', nombre: 'Múltiple Opción', icono: <CheckSquare className="h-5 w-5" /> },
        { id: 'calificacion', nombre: 'Calificación', icono: <Star className="h-5 w-5" /> },
        { id: 'likert', nombre: 'Escala Likert Personalizada', icono: <BarChart2 className="h-5 w-5" /> },
        { id: 'likert-5-puntos', nombre: 'Escala Likert 5 Puntos', icono: <BarChart2 className="h-5 w-5" /> },
    ];

    const iconosCalificacion = [
        { id: 'star', nombre: 'Estrella', icono: <Star className="h-5 w-5" /> },
        { id: 'heart', nombre: 'Corazón', icono: <Heart className="h-5 w-5" /> },
        { id: 'thumbsup', nombre: 'Me gusta', icono: <ThumbsUp className="h-5 w-5" /> }
    ];

    const opcionesLikert5Puntos = {
        acuerdo: [
            "Totalmente en desacuerdo",
            "En desacuerdo",
            "Ni de acuerdo ni en desacuerdo",
            "De acuerdo",
            "Totalmente de acuerdo"
        ],
        frecuencia: [
            "Nunca",
            "Rara vez",
            "A veces",
            "Frecuentemente",
            "Siempre"
        ]
    };

    useEffect(() => {
        const fetchCuestionario = async () => {
            try {
                const response = await api.get(`/cuestionario/${cuestionarioId}/`);
                const cuestionario = response.data;
                setTitulo(cuestionario.titulo);
                setDescripcion(cuestionario.descripcion);
                setPreguntas(cuestionario.preguntas);
            } catch (err) {
                setError('Error al cargar el cuestionario');
                console.error('Error:', err);
            } finally {
                setInitialLoading(false);
            }
        };

        fetchCuestionario();
    }, [cuestionarioId]);

    const validarCuestionario = () => {
        if (!titulo.trim()) {
            setError('Por favor, ingrese un título');
            return false;
        }
        if (!descripcion.trim()) {
            setError('Por favor, ingrese una descripción');
            return false;
        }
        if (preguntas.length === 0) {
            setError('Debe añadir al menos una pregunta');
            return false;
        }

        for (const pregunta of preguntas) {
            if (!pregunta.texto.trim()) {
                setError('Todas las preguntas deben tener un texto');
                return false;
            }

            if ((pregunta.tipo === 'select' || pregunta.tipo === 'checkbox') &&
                (pregunta.opciones.length < 2 || pregunta.opciones.some(op => !op.trim()))) {
                setError('Las preguntas de opción múltiple deben tener al menos 2 opciones válidas');
                return false;
            }
        }

        setError('');
        return true;
    };

    const agregarPregunta = (tipo) => {
        const nuevaPregunta = {
            id: Date.now(),
            tipo,
            texto: '',
            opciones: tipo === 'select' || tipo === 'checkbox' ? [''] : [],
            estrellas: tipo === 'calificacion' ? {
                cantidad: 5,
                icono: 'star'
            } : null,
            escala: tipo === 'likert' ? {
                inicio: 1,
                fin: 5,
                etiquetas: Array(5).fill('').map((_, i) => `Opción ${i + 1}`)
            } : null,
            likert5Puntos: tipo === 'likert-5-puntos' ? {
                tipo: 'acuerdo',
                filas: ['']
            } : null
        };
        setPreguntas([...preguntas, nuevaPregunta]);
    };

    const eliminarPregunta = (id) => {
        setPreguntas(preguntas.filter(p => p.id !== id));
    };

    const actualizarPregunta = (id, campo, valor) => {
        setPreguntas(preguntas.map(p =>
            p.id === id ? { ...p, [campo]: valor } : p
        ));
    };

    const actualizarOpcion = (preguntaId, opcionIndex, valor) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevasOpciones = [...p.opciones];
                nuevasOpciones[opcionIndex] = valor;
                return { ...p, opciones: nuevasOpciones };
            }
            return p;
        }));
    };

    const agregarOpcion = (preguntaId) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                return { ...p, opciones: [...p.opciones, ''] };
            }
            return p;
        }));
    };

    const eliminarOpcion = (preguntaId, opcionIndex) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevasOpciones = p.opciones.filter((_, index) => index !== opcionIndex);
                return { ...p, opciones: nuevasOpciones };
            }
            return p;
        }));
    };

    const actualizarEscalaLikert = (preguntaId, campo, valor) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevaEscala = { ...p.escala };
                if (campo === 'inicio' || campo === 'fin') {
                    const inicio = campo === 'inicio' ? valor : p.escala.inicio;
                    const fin = campo === 'fin' ? valor : p.escala.fin;
                    const numOpciones = fin - inicio + 1;
                    nuevaEscala.etiquetas = Array(numOpciones).fill('').map((_, i) =>
                        p.escala.etiquetas[i] || `Opción ${i + 1}`
                    );
                }
                nuevaEscala[campo] = valor;
                return { ...p, escala: nuevaEscala };
            }
            return p;
        }));
    };

    const actualizarEtiquetaLikert = (preguntaId, index, valor) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevasEtiquetas = [...p.escala.etiquetas];
                nuevasEtiquetas[index] = valor;
                return {
                    ...p,
                    escala: { ...p.escala, etiquetas: nuevasEtiquetas }
                };
            }
            return p;
        }));
    };

    const actualizarLikert5Puntos = (preguntaId, campo, valor) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                return {
                    ...p,
                    likert5Puntos: {
                        ...p.likert5Puntos,
                        [campo]: valor
                    }
                };
            }
            return p;
        }));
    };

    const agregarFilaLikert5Puntos = (preguntaId) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                return {
                    ...p,
                    likert5Puntos: {
                        ...p.likert5Puntos,
                        filas: [...p.likert5Puntos.filas, '']
                    }
                };
            }
            return p;
        }));
    };

    const eliminarFilaLikert5Puntos = (preguntaId, index) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevasFilas = p.likert5Puntos.filas.filter((_, i) => i !== index);
                return {
                    ...p,
                    likert5Puntos: {
                        ...p.likert5Puntos,
                        filas: nuevasFilas
                    }
                };
            }
            return p;
        }));
    };

    const actualizarFilaLikert5Puntos = (preguntaId, index, valor) => {
        setPreguntas(preguntas.map(p => {
            if (p.id === preguntaId) {
                const nuevasFilas = [...p.likert5Puntos.filas];
                nuevasFilas[index] = valor;
                return {
                    ...p,
                    likert5Puntos: {
                        ...p.likert5Puntos,
                        filas: nuevasFilas
                    }
                };
            }
            return p;
        }));
    };

    const handleGuardar = async () => {
        if (!validarCuestionario()) {
            return;
        }

        setLoading(true);
        setError('');

        try {
            const cuestionario = {
                titulo,
                descripcion,
                preguntas
            };

            await api.put(`/cuestionario/${cuestionarioId}/`, cuestionario);
            navigate(`/programas/${id}`);
        } catch (err) {
            console.error('Error al guardar el cuestionario:', err);
            setError(err.response?.data?.error || 'Error al guardar el cuestionario');
        } finally {
            setLoading(false);
        }
    };

    const getIconoPregunta = (tipo) => {
        return tiposPregunta.find(t => t.id === tipo)?.icono;
    };

    if (initialLoading) {
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
                            onClick={() => navigate(`/programas/${id}`)}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver
                        </button>
                        <div className="flex items-center space-x-4">
                            <span className="text-lg font-semibold text-gray-700">
                                Editando Cuestionario
                            </span>
                            <button
                                onClick={handleGuardar}
                                disabled={loading}
                                className={`flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg transition-colors ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                            >
                                {loading ? (
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                ) : (
                                    <Save className="h-5 w-5 mr-2" />
                                )}
                                {loading ? 'Guardando...' : 'Guardar Cambios'}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    {/* Información básica */}
                    <div className="space-y-6 mb-8">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Título del Cuestionario <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={titulo}
                                onChange={(e) => setTitulo(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Ingrese el título del cuestionario"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Descripción <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                value={descripcion}
                                onChange={(e) => setDescripcion(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                rows="3"
                                placeholder="Ingrese una descripción del cuestionario"
                            />
                        </div>
                    </div>

                    {/* Botones de tipo de pregunta */}
                    <div className="mb-8">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Agregar Pregunta</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                            {tiposPregunta.map((tipo) => (
                                <button
                                    key={tipo.id}
                                    onClick={() => agregarPregunta(tipo.id)}
                                    className="flex flex-col items-center justify-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors"
                                >
                                    <div className="text-indigo-600 mb-2">{tipo.icono}</div>
                                    <span className="text-sm text-gray-700">{tipo.nombre}</span>
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Lista de preguntas */}
                    <div className="space-y-6">
                        {preguntas.map((pregunta, index) => (
                            <div key={pregunta.id} className="border-2 border-indigo-100 rounded-lg p-6 bg-gradient-to-br from-white to-indigo-50">
                                <div className="flex items-start mb-4">
                                    <div className="flex-shrink-0 mr-4 mt-2">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                                            {getIconoPregunta(pregunta.tipo)}
                                        </div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-indigo-600">
                                                Pregunta {index + 1} - {tiposPregunta.find(t => t.id === pregunta.tipo)?.nombre}
                                            </span>
                                            <button
                                                onClick={() => eliminarPregunta(pregunta.id)}
                                                className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                        <input
                                            type="text"
                                            value={pregunta.texto}
                                            onChange={(e) => actualizarPregunta(pregunta.id, 'texto', e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                            placeholder="Ingrese la pregunta"
                                        />
                                    </div>
                                </div>

                                {/* Opciones según el tipo de pregunta */}
                                {(pregunta.tipo === 'select' || pregunta.tipo === 'checkbox') && (
                                    <div className="ml-14 space-y-2">
                                        {pregunta.opciones.map((opcion, index) => (
                                            <div key={index} className="flex items-center space-x-2">
                                                <input
                                                    type="text"
                                                    value={opcion}
                                                    onChange={(e) => actualizarOpcion(pregunta.id, index, e.target.value)}
                                                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                    placeholder={`Opción ${index + 1}`}
                                                />
                                                <button
                                                    onClick={() => eliminarOpcion(pregunta.id, index)}
                                                    className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            onClick={() => agregarOpcion(pregunta.id)}
                                            className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Agregar opción
                                        </button>
                                    </div>
                                )}

                                {/* Configuración de calificación */}
                                {pregunta.tipo === 'calificacion' && (
                                    <div className="ml-14 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Número de iconos
                                            </label>
                                            <input
                                                type="number"
                                                value={pregunta.estrellas.cantidad}
                                                onChange={(e) => actualizarPregunta(pregunta.id, 'estrellas', {
                                                    ...pregunta.estrellas,
                                                    cantidad: parseInt(e.target.value)
                                                })}
                                                min="2"
                                                max="10"
                                                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de icono
                                            </label>
                                            <div className="grid grid-cols-3 gap-4">
                                                {iconosCalificacion.map((icono) => (
                                                    <button
                                                        key={icono.id}
                                                        onClick={() => actualizarPregunta(pregunta.id, 'estrellas', {
                                                            ...pregunta.estrellas,
                                                            icono: icono.id
                                                        })}
                                                        className={`flex flex-col items-center justify-center p-4 border-2 rounded-lg transition-colors ${pregunta.estrellas.icono === icono.id
                                                            ? 'border-indigo-500 bg-indigo-50'
                                                            : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                                                            }`}
                                                    >
                                                        <div className={`mb-2 ${pregunta.estrellas.icono === icono.id
                                                            ? 'text-indigo-600'
                                                            : 'text-gray-600'
                                                            }`}>
                                                            {icono.icono}
                                                        </div>
                                                        <span className="text-sm text-gray-700">{icono.nombre}</span>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Vista previa
                                            </label>
                                            <div className="flex items-center space-x-2">
                                                {Array.from({ length: pregunta.estrellas.cantidad }, (_, i) => (
                                                    <div key={i} className="text-2xl">
                                                        {pregunta.estrellas.icono === 'star' && <Star className="h-6 w-6 text-yellow-500" />}
                                                        {pregunta.estrellas.icono === 'heart' && <Heart className="h-6 w-6 text-red-500" />}
                                                        {pregunta.estrellas.icono === 'thumbsup' && <ThumbsUp className="h-6 w-6 text-blue-500" />}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Configuración de escala Likert */}
                                {pregunta.tipo === 'likert' && (
                                    <div className="ml-14 space-y-4">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Valor inicial
                                                </label>
                                                <input
                                                    type="number"
                                                    value={pregunta.escala.inicio}
                                                    onChange={(e) => actualizarEscalaLikert(pregunta.id, 'inicio', parseInt(e.target.value))}
                                                    min="1"
                                                    max={pregunta.escala.fin - 1}
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Valor final
                                                </label>
                                                <input
                                                    type="number"
                                                    value={pregunta.escala.fin}
                                                    onChange={(e) => actualizarEscalaLikert(pregunta.id, 'fin', parseInt(e.target.value))}
                                                    min={pregunta.escala.inicio + 1}
                                                    max="7"
                                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Etiquetas de la escala
                                            </label>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            {Array.from({ length: pregunta.escala.fin - pregunta.escala.inicio + 1 }, (_, i) => (
                                                                <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                                                    {pregunta.escala.inicio + i}
                                                                </th>
                                                            ))}
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        <tr>
                                                            {pregunta.escala.etiquetas.map((etiqueta, index) => (
                                                                <td key={index} className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={etiqueta}
                                                                        onChange={(e) => actualizarEtiquetaLikert(pregunta.id, index, e.target.value)}
                                                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                        placeholder={`Etiqueta ${index + 1}`}
                                                                    />
                                                                </td>
                                                            ))}
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Configuración de Likert 5 puntos */}
                                {pregunta.tipo === 'likert-5-puntos' && (
                                    <div className="ml-14 space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Tipo de escala
                                            </label>
                                            <div className="grid grid-cols-2 gap-4">
                                                <button
                                                    onClick={() => actualizarLikert5Puntos(pregunta.id, 'tipo', 'acuerdo')}
                                                    className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${pregunta.likert5Puntos.tipo === 'acuerdo'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                                                        }`}
                                                >
                                                    <span className="text-sm text-gray-700">Escala de Acuerdo</span>
                                                </button>
                                                <button
                                                    onClick={() => actualizarLikert5Puntos(pregunta.id, 'tipo', 'frecuencia')}
                                                    className={`flex items-center justify-center p-4 border-2 rounded-lg transition-colors ${pregunta.likert5Puntos.tipo === 'frecuencia'
                                                        ? 'border-indigo-500 bg-indigo-50'
                                                        : 'border-gray-300 hover:border-indigo-300 hover:bg-indigo-50'
                                                        }`}
                                                >
                                                    <span className="text-sm text-gray-700">Escala de Frecuencia</span>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="mt-4">
                                            <div className="flex justify-between items-center mb-2">
                                                <label className="block text-sm font-medium text-gray-700">
                                                    Filas de la escala
                                                </label>
                                                <button
                                                    onClick={() => agregarFilaLikert5Puntos(pregunta.id)}
                                                    className="flex items-center text-sm text-indigo-600 hover:text-indigo-800"
                                                >
                                                    <Plus className="h-4 w-4 mr-1" />
                                                    Agregar fila
                                                </button>
                                            </div>
                                            <div className="overflow-x-auto">
                                                <table className="min-w-full divide-y divide-gray-200">
                                                    <thead className="bg-gray-50">
                                                        <tr>
                                                            <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                                                Pregunta
                                                            </th>
                                                            {opcionesLikert5Puntos[pregunta.likert5Puntos.tipo].map((opcion, index) => (
                                                                <th key={index} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                                                    {opcion}
                                                                </th>
                                                            ))}
                                                            <th className="w-10"></th>
                                                        </tr>
                                                    </thead>
                                                    <tbody className="bg-white divide-y divide-gray-200">
                                                        {pregunta.likert5Puntos.filas.map((fila, index) => (
                                                            <tr key={index}>
                                                                <td className="px-4 py-2">
                                                                    <input
                                                                        type="text"
                                                                        value={fila}
                                                                        onChange={(e) => actualizarFilaLikert5Puntos(pregunta.id, index, e.target.value)}
                                                                        className="w-full px-3 py-1 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                                                        placeholder={`Fila ${index + 1}`}
                                                                    />
                                                                </td>
                                                                {Array.from({ length: 5 }, (_, i) => (
                                                                    <td key={i} className="px-4 py-2 text-center">
                                                                        <input
                                                                            type="radio"
                                                                            name={`likert-${pregunta.id}-${index}`}
                                                                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                                        />
                                                                    </td>
                                                                ))}
                                                                <td className="px-4 py-2 text-right">
                                                                    <button
                                                                        onClick={() => eliminarFilaLikert5Puntos(pregunta.id, index)}
                                                                        className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                                                                    >
                                                                        <Trash2 className="h-4 w-4" />
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                )}

                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditarCuestionario; 