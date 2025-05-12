import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText, BookOpen, Star, Loader2 } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';

const ProgramasCompletados = () => {
    const navigate = useNavigate();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramasCompletados = async () => {
            try {
                const response = await api.get('/programas/mis-completados/');
                setProgramas(response.data);
            } catch (err) {
                console.error('Error al cargar programas completados:', err);
                setError('Error al cargar los programas completados. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgramasCompletados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <p className="mt-4 text-gray-600">Cargando programas completados...</p>
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
                        Mis Programas Completados
                    </h1>
                    <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
                        Revisa tus programas completados y accede a su contenido
                    </p>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden p-8 text-center">
                        <div className="bg-gray-50 p-6 rounded-lg">
                            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes programas completados</h3>
                            <p className="mt-2 text-gray-500">
                                Completa un programa para verlo aquí.
                            </p>
                            <button
                                onClick={() => navigate('/explorar')}
                                className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Explorar Programas
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programas.map((programa) => (
                            <div
                                key={programa.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 flex flex-col"
                            >
                                <div className="p-6 flex-grow">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900">{programa.nombre}</h3>
                                            <p className="text-sm text-gray-500 mt-1">
                                                Por {programa.creado_por.nombre} {programa.creado_por.apellidos}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Star className="h-4 w-4 mr-1" />
                                            Completado
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

                                <div className="p-6 pt-0 mt-auto">
                                    <button
                                        onClick={() => navigate(`/completados/${programa.id}`)}
                                        className="w-full flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors duration-200"
                                    >
                                        <Star className="mr-2 h-4 w-4" />
                                        Ver programa
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

export default ProgramasCompletados; 