import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, Heart, ThumbsUp } from 'lucide-react';
import api from '../../config/axios';
import { useAuth } from '../../context/AuthContext';

const VistaPreviaCuestionario = () => {
    const { id, cuestionarioId } = useParams();
    const navigate = useNavigate();
    const [cuestionario, setCuestionario] = useState(null);
    const [respuestas, setRespuestas] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [enviando, setEnviando] = useState(false);
    const { isParticipante } = useAuth();

    useEffect(() => {
        const fetchCuestionario = async () => {
            try {
                const response = await api.get(`/cuestionarios/${cuestionarioId}/`);
                setCuestionario(response.data);
                const respuestasIniciales = {};
                response.data.preguntas.forEach(pregunta => {
                    if (pregunta.tipo === 'checkbox') {
                        respuestasIniciales[pregunta.id] = [];
                    } else {
                        respuestasIniciales[pregunta.id] = '';
                    }
                });
                setRespuestas(respuestasIniciales);
            } catch (err) {
                setError('Error al cargar el cuestionario');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchCuestionario();
    }, [cuestionarioId]);

    const handleRespuestaChange = (preguntaId, valor, tipo) => {
        if (tipo === 'checkbox') {
            setRespuestas(prev => ({
                ...prev,
                [preguntaId]: prev[preguntaId].includes(valor)
                    ? prev[preguntaId].filter(v => v !== valor)
                    : [...prev[preguntaId], valor]
            }));
        } else {
            setRespuestas(prev => ({
                ...prev,
                [preguntaId]: valor
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEnviando(true);
        setError('');

        try {
            await api.post(`/cuestionarios/${cuestionarioId}/respuestas/`, {
                respuestas
            });
            navigate(`/programas/${id}`);
        } catch (err) {
            console.error('Error al enviar las respuestas:', err);
            setError(err.response?.data?.error || 'Error al enviar las respuestas');
        } finally {
            setEnviando(false);
        }
    };

    const renderPregunta = (pregunta) => {
        switch (pregunta.tipo) {
            case 'texto':
                return (
                    <textarea
                        value={respuestas[pregunta.id]}
                        onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Escribe tu respuesta aquí..."
                    />
                );

            case 'select':
                return (
                    <select
                        value={respuestas[pregunta.id]}
                        onChange={(e) => handleRespuestaChange(pregunta.id, e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                    >
                        <option value="">Selecciona una opción</option>
                        {pregunta.opciones.map((opcion, index) => (
                            <option key={index} value={opcion}>
                                {opcion}
                            </option>
                        ))}
                    </select>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {pregunta.opciones.map((opcion, index) => (
                            <label key={index} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={respuestas[pregunta.id].includes(opcion)}
                                    onChange={() => handleRespuestaChange(pregunta.id, opcion, 'checkbox')}
                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <span className="text-gray-700">{opcion}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'calificacion':
                return (
                    <div className="flex items-center space-x-4">
                        {Array.from({ length: pregunta.estrellas.cantidad }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => handleRespuestaChange(pregunta.id, i + 1)}
                                className="text-3xl transition-all duration-200 hover:scale-110"
                            >
                                {pregunta.estrellas.icono === 'star' && (
                                    <Star className={`h-10 w-10 ${respuestas[pregunta.id] >= i + 1 ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300 fill-gray-300'}`} />
                                )}
                                {pregunta.estrellas.icono === 'heart' && (
                                    <Heart
                                        className={`h-10 w-10 ${respuestas[pregunta.id] >= i + 1 ? 'text-red-500 fill-red-500' : 'text-gray-300 fill-gray-300'}`}
                                    />
                                )}
                                {pregunta.estrellas.icono === 'thumbsup' && (
                                    <ThumbsUp className={`h-10 w-10 ${respuestas[pregunta.id] >= i + 1 ? 'text-blue-500 fill-blue-500' : 'text-gray-300 fill-gray-300'}`} />
                                )}
                            </button>
                        ))}
                    </div>
                );

            case 'likert':
                return (
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
                                        <td key={index} className="px-4 py-2 text-center">
                                            <label className="flex flex-col items-center">
                                                <input
                                                    type="radio"
                                                    name={`likert-${pregunta.id}`}
                                                    value={pregunta.escala.inicio + index}
                                                    checked={respuestas[pregunta.id] === pregunta.escala.inicio + index}
                                                    onChange={(e) => handleRespuestaChange(pregunta.id, parseInt(e.target.value))}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                <span className="text-sm text-gray-500 mt-1">{etiqueta}</span>
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );

            case 'likert-5-puntos':
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                        Pregunta
                                    </th>
                                    {(
                                        pregunta.likert5Puntos.tipo === 'acuerdo'
                                            ? [
                                                "Totalmente en desacuerdo",
                                                "En desacuerdo",
                                                "Ni de acuerdo ni en desacuerdo",
                                                "De acuerdo",
                                                "Totalmente de acuerdo"
                                            ]
                                            : [
                                                "Nunca",
                                                "Rara vez",
                                                "A veces",
                                                "Frecuentemente",
                                                "Siempre"
                                            ]
                                    ).map((opcion, index) => (
                                        <th key={index} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                            {opcion}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {pregunta.likert5Puntos.filas.map((fila, index) => (
                                    <tr key={index}>
                                        <td className="px-4 py-2">
                                            <span className="text-gray-700">{fila}</span>
                                        </td>
                                        {Array.from({ length: 5 }, (_, i) => (
                                            <td key={i} className="px-4 py-2 text-center">
                                                <input
                                                    type="radio"
                                                    name={`likert-5-${pregunta.id}-${index}`}
                                                    value={i + 1}
                                                    checked={respuestas[pregunta.id]?.[index] === i + 1}
                                                    onChange={(e) => {
                                                        const nuevasRespuestas = { ...respuestas };
                                                        if (!nuevasRespuestas[pregunta.id]) {
                                                            nuevasRespuestas[pregunta.id] = {};
                                                        }
                                                        nuevasRespuestas[pregunta.id][index] = parseInt(e.target.value);
                                                        setRespuestas(nuevasRespuestas);
                                                    }}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return null;
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
                            onClick={() => navigate(`/programas/${id}`)}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver
                        </button>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        {/* Información del cuestionario */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 mb-4">{cuestionario?.titulo}</h1>
                            <p className="text-gray-600 whitespace-pre-line">{cuestionario?.descripcion}</p>
                        </div>

                        {/* Preguntas */}
                        <div className="space-y-8">
                            {cuestionario?.preguntas.map((pregunta, index) => (
                                <div key={pregunta.id} className="border-2 border-indigo-100 rounded-lg p-6 bg-gradient-to-br from-white to-indigo-50">
                                    <div className="mb-4">
                                        <h3 className="text-lg font-medium text-gray-900">
                                            {index + 1}. {pregunta.texto}
                                        </h3>
                                    </div>
                                    <div className="mt-4">
                                        {renderPregunta(pregunta)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Botón de envío */}
                        {isParticipante() && (
                            <div className="mt-8 flex justify-end">
                                <button
                                    type="submit"
                                    disabled={enviando}
                                    className={`flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg transition-colors ${enviando ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
                                >
                                    {enviando ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                            Enviando...
                                        </>
                                    ) : (
                                        'Enviar Respuestas'
                                    )}
                                </button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
};

export default VistaPreviaCuestionario; 