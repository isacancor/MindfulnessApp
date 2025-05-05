import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Calendar, Users, Clock, FileText, BookOpen, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../../config/axios';

const MiPrograma = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progreso, setProgreso] = useState({
        sesionesCompletadas: 0,
        totalSesiones: 0,
        minutosCompletados: 0
    });

    useEffect(() => {
        const fetchMiPrograma = async () => {
            try {
                const response = await api.get('/programas/mi-programa/');
                setPrograma(response.data);
                // Calcular progreso basado en las sesiones completadas
                const sesionesCompletadas = response.data.sesiones?.filter(s => s.completada).length || 0;
                const totalSesiones = response.data.sesiones?.length || 0;
                const minutosCompletados = response.data.sesiones?.reduce((acc, s) => acc + (s.completada ? s.duracion : 0), 0) || 0;
                setProgreso({
                    sesionesCompletadas,
                    totalSesiones,
                    minutosCompletados
                });
            } catch (err) {
                console.error('Error al cargar el programa:', err);
                setError('Error al cargar tu programa. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchMiPrograma();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando tu programa...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
            </div>
        );
    }

    if (!programa) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center max-w-2xl">
                    <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-lg font-medium text-gray-900">No tienes un programa activo</h3>
                    <p className="mt-2 text-gray-500">
                        Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness.
                    </p>
                    <button
                        onClick={() => navigate('/explorar')}
                        className="mt-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Explorar Programas
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                {/* Encabezado del Programa */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-start justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">{programa.nombre}</h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Por {programa.creado_por.nombre} {programa.creado_por.apellidos}
                            </p>
                        </div>
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {programa.tipo_contexto}
                        </span>
                    </div>

                    <p className="mt-4 text-gray-600">{programa.descripcion}</p>

                    <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
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
                        <div className="flex items-center text-gray-600">
                            <Clock className="mr-2 text-gray-400" size={16} />
                            <span>{progreso.minutosCompletados} min completados</span>
                        </div>
                    </div>
                </div>

                {/* Progreso */}
                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Tu progreso</h2>
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Sesiones completadas</span>
                                <span className="font-medium text-gray-900">
                                    {progreso.sesionesCompletadas} de {progreso.totalSesiones}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${(progreso.sesionesCompletadas / progreso.totalSesiones) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sesiones */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Sesiones del programa</h2>
                    <div className="space-y-4">
                        {programa.sesiones?.map((sesion, index) => (
                            <div
                                key={sesion.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div className="flex items-center">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-4 ${sesion.completada ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                                        }`}>
                                        {sesion.completada ? (
                                            <CheckCircle2 size={16} />
                                        ) : (
                                            <span className="text-sm font-medium">{index + 1}</span>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-medium text-gray-900">{sesion.titulo}</h3>
                                        <p className="text-sm text-gray-500">
                                            {sesion.duracion} minutos · {sesion.fecha}
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate(`/miprogramas/${sesion.id}`)}
                                    disabled={sesion.completada}
                                    className={`px-4 py-2 rounded-md text-sm font-medium ${sesion.completada
                                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                        : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                >
                                    {sesion.completada ? 'Completada' : 'Comenzar'}
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MiPrograma; 