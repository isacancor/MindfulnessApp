import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, Calendar, Users, Clock, FileText, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import api from '../../config/axios';

const ExplorarProgramas = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolando, setEnrolando] = useState(false);

    const fetchProgramas = async () => {
        try {
            const response = await api.get('/programas');
            setProgramas(response.data);
        } catch (err) {
            console.error('Error al cargar programas:', err);
            setError('Error al cargar los programas. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramas();
    }, []);

    const handleEnrolar = async (programaId) => {
        setEnrolando(true);
        try {
            await api.post(`/programas/${programaId}/enrolar/`);
            navigate('/miprograma');
        } catch (error) {
            console.error('Error al enrolarse:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Error al enrolarse en el programa');
            }
        } finally {
            setEnrolando(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <p className="mt-4 text-gray-600">Cargando programas...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="text-center mb-10">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Explora nuestros programas
                    </h1>
                    <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
                        Descubre programas de mindfulness diseñados para tu bienestar
                    </p>
                </div>

                {error && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                            <p className="text-red-700 font-medium">{error}</p>
                        </div>
                    </div>
                )}

                {programas.length === 0 ? (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No hay programas disponibles</h3>
                            <p className="mt-2 text-gray-500">
                                Actualmente no hay programas disponibles. Vuelve a revisar más tarde.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programas.map((programa) => (
                            console.log(programa),
                            <div
                                key={programa.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col" // flex-col para organizar el contenido verticalmente
                            >
                                {/* Contenido de la tarjeta */}
                                <div className="p-6 flex-grow"> {/* flex-grow para que ocupe todo el espacio disponible */}
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{programa.nombre}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Por {programa.creado_por.nombre} {programa.creado_por.apellidos}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                            {programa.tipo_contexto}
                                        </span>
                                    </div>

                                    <p className="mt-4 text-gray-600 line-clamp-3">{programa.descripcion}</p>

                                    <div className="mt-6 space-y-3">
                                        <div className="flex items-center text-gray-600">
                                            <Calendar className="mr-2 text-gray-400" size={16} />
                                            <span>{programa.duracion_semanas} semanas</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <Users className="mr-2 text-gray-400" size={16} />
                                            <span>{programa.participantes?.length || 0} participantes</span>
                                        </div>
                                        <div className="flex items-center text-gray-600">
                                            <FileText className="mr-2 text-gray-400" size={16} />
                                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Botón posicionado al fondo de la tarjeta */}
                                <div className="p-6 pt-0 mt-auto"> {/* mt-auto para pegarlo al fondo */}
                                    <button
                                        onClick={() => handleEnrolar(programa.id)}
                                        disabled={enrolando}
                                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-70 disabled:cursor-not-allowed transition-colors duration-200"
                                    >
                                        {enrolando ? (
                                            <>
                                                <Loader2 className="animate-spin mr-2 h-4 w-4" />
                                                Procesando...
                                            </>
                                        ) : (
                                            <>
                                                Unirme ahora
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ExplorarProgramas;