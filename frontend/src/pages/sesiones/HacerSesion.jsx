import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../../config/axios';
import DiarioForm from '../../components/DiarioForm';
import ErrorAlert from '../../components/ErrorAlert';

const HacerSesion = () => {
    const navigate = useNavigate();
    const { sesionId } = useParams();
    const [sesion, setSesion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiempoRestante, setTiempoRestante] = useState(null);
    const [completada, setCompletada] = useState(false);
    const [temporizadorActivo, setTemporizadorActivo] = useState(false);
    const [mostrarDiario, setMostrarDiario] = useState(false);
    const [diarioCompletado, setDiarioCompletado] = useState(false);

    useEffect(() => {
        const fetchSesion = async () => {
            try {
                const response = await api.get(`/sesiones/${sesionId}/`);
                setSesion(response.data);
                if (response.data.tipo_contenido === 'temporizador') {
                    setTiempoRestante(response.data.contenido_temporizador * 60);
                }

                // Verificar si ya existe un diario para esta sesión
                const diarioResponse = await api.get(`/sesiones/${sesionId}/diario_info/`);
                if (diarioResponse.data) {
                    setDiarioCompletado(true);
                    setCompletada(true);
                }
            } catch (err) {
                if (err.response?.status === 404) {
                    // No hay diario, continuar normalmente
                } else {
                    console.error('Error al cargar la sesión:', err);
                    setError('Error al cargar la sesión. Por favor, intenta nuevamente.');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchSesion();
    }, [sesionId]);

    useEffect(() => {
        let timer;
        if (sesion?.tipo_contenido === 'temporizador' && !completada && temporizadorActivo) {
            timer = setInterval(() => {
                setTiempoRestante(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setCompletada(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [sesion?.tipo_contenido, temporizadorActivo, completada]);

    const handleCompletar = () => {
        if (diarioCompletado) {
            navigate('/miprograma');
        } else {
            setMostrarDiario(true);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!sesion) {
        return null;
    }

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getMediaUrl = (path) => {
        if (!path) return '';
        if (path.startsWith('http://') || path.startsWith('https://')) {
            return path;
        }
        return `${import.meta.env.VITE_MEDIA_URL}${path}`;
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="p-6">
                        <div className="flex items-center justify-between mb-6">
                            <button
                                onClick={() => navigate(-1)}
                                className="inline-flex items-center text-gray-600 hover:text-gray-900"
                            >
                                <ArrowLeft className="h-5 w-5 mr-2" />
                                Volver
                            </button>
                            {sesion.tipo_contenido === 'temporizador' && (
                                <div className="flex items-center text-gray-600">
                                    <Clock className="h-5 w-5 mr-2" />
                                    <span className="font-medium">{formatTime(tiempoRestante)}</span>
                                </div>
                            )}
                        </div>

                        <ErrorAlert
                            message={error}
                            onClose={() => setError(null)}
                        />

                        <h1 className="text-2xl font-bold text-gray-900 mb-4">{sesion.titulo}</h1>
                        <p className="text-gray-600 mb-6">{sesion.descripcion}</p>

                        <div className="space-y-6">
                            {sesion.tipo_contenido === 'temporizador' && (
                                <div className="text-center">
                                    <div className="text-4xl font-bold text-blue-600 mb-4">
                                        {formatTime(tiempoRestante)}
                                    </div>
                                    <button
                                        onClick={() => setTemporizadorActivo(!temporizadorActivo)}
                                        disabled={completada}
                                        className={`px-4 py-2 rounded-md text-white font-medium ${temporizadorActivo
                                            ? 'bg-red-600 hover:bg-red-700'
                                            : completada
                                                ? 'bg-gray-400 cursor-not-allowed'
                                                : 'bg-blue-600 hover:bg-blue-700'
                                            }`}
                                    >
                                        {temporizadorActivo ? 'Pausar' : completada ? 'Completado' : 'Iniciar'}
                                    </button>
                                </div>
                            )}

                            {sesion.tipo_contenido === 'enlace' && (
                                <div className="text-center">
                                    <a
                                        href={sesion.contenido_url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                                    >
                                        Abrir enlace
                                        <ExternalLink className="ml-2 h-5 w-5" />
                                    </a>
                                </div>
                            )}

                            {sesion.tipo_contenido === 'video' && (
                                <div className="aspect-w-16 aspect-h-9">
                                    <video
                                        src={getMediaUrl(sesion.contenido_video)}
                                        controls
                                        className="w-full h-full rounded-lg"
                                    />
                                </div>
                            )}

                            {sesion.tipo_contenido === 'audio' && (
                                <div className="text-center">
                                    <audio
                                        src={getMediaUrl(sesion.contenido_audio)}
                                        controls
                                        className="w-full"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleCompletar}
                                disabled={sesion.tipo_contenido === 'temporizador' && !completada}
                                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${sesion.tipo_contenido === 'temporizador' && !completada
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : diarioCompletado
                                        ? 'bg-green-600 hover:bg-green-700'
                                        : 'bg-blue-600 hover:bg-blue-700'
                                    }`}
                            >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                {diarioCompletado ? 'Volver al programa' : 'Marcar como completada'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {mostrarDiario && !diarioCompletado && (
                <DiarioForm
                    sesion={sesion}
                    onClose={() => setMostrarDiario(false)}
                    onSuccess={() => {
                        setDiarioCompletado(true);
                        setMostrarDiario(false);
                    }}
                />
            )}
        </div>
    );
};

export default HacerSesion; 