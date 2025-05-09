import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Clock, CheckCircle2, ExternalLink } from 'lucide-react';
import api from '../../config/axios';

const HacerSesion = () => {
    const navigate = useNavigate();
    const { sesionId } = useParams();
    const [sesion, setSesion] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tiempoRestante, setTiempoRestante] = useState(null);
    const [completada, setCompletada] = useState(false);
    const [temporizadorActivo, setTemporizadorActivo] = useState(false);

    useEffect(() => {
        const fetchSesion = async () => {
            try {
                const response = await api.get(`/sesiones/${sesionId}/`);
                setSesion(response.data);
                if (response.data.tipo_contenido === 'temporizador') {
                    setTiempoRestante(response.data.contenido_temporizador * 60); // Convertir a segundos
                }
            } catch (err) {
                console.error('Error al cargar la sesión:', err);
                setError('Error al cargar la sesión. Por favor, intenta nuevamente.');
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

    const handleCompletar = async () => {
        try {
            await api.post('/diario/', {
                sesion: sesionId,
                completada: true
            });
            navigate('/mi-programa');
        } catch (err) {
            console.error('Error al marcar la sesión como completada:', err);
            setError('Error al guardar el progreso. Por favor, intenta nuevamente.');
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
                    <p className="text-red-700 font-medium">{error}</p>
                </div>
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
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-8 left-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Semana {sesion.semana}: {sesion.titulo}
                    </h1>
                    <p className="text-gray-600 mb-6">{sesion.descripcion}</p>

                    <div className="space-y-6">
                        {sesion.tipo_contenido === 'temporizador' && (
                            <div className="text-center">
                                <div className="text-6xl font-bold text-blue-600 mb-4">
                                    {formatTime(tiempoRestante)}
                                </div>

                                {!temporizadorActivo && !completada && (
                                    <button
                                        onClick={() => setTemporizadorActivo(true)}
                                        className="mt-4 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-md shadow-sm"
                                    >
                                        Comenzar
                                    </button>
                                )}

                                {completada && (
                                    <div className="text-green-600 font-medium">
                                        ¡Tiempo completado!
                                    </div>
                                )}
                            </div>
                        )}

                        {sesion.tipo_contenido === 'enlace' && (
                            <div className="text-center">
                                <a
                                    href={sesion.contenido_url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                >
                                    <ExternalLink className="h-5 w-5 mr-2" />
                                    Abrir enlace
                                </a>
                            </div>
                        )}

                        {sesion.tipo_contenido === 'audio' && (
                            <div className="w-full">
                                <audio
                                    controls
                                    className="w-full"
                                    src={getMediaUrl(sesion.contenido_audio)}
                                >
                                    Tu navegador no soporta el elemento de audio.
                                </audio>
                            </div>
                        )}

                        {sesion.tipo_contenido === 'video' && (
                            <div className="aspect-video">
                                {sesion.contenido_video?.toLowerCase().endsWith('.mp4') ? (
                                    <video
                                        controls
                                        className="w-full h-full rounded-lg"
                                        src={getMediaUrl(sesion.contenido_video)}
                                    >
                                        Tu navegador no soporta el elemento de video.
                                    </video>
                                ) : (
                                    <div className="w-full h-full rounded-lg bg-red-50 border border-red-200 flex items-center justify-center p-6">
                                        <div className="text-center">
                                            <p className="text-red-700 font-medium mb-2">Formato de video no compatible</p>
                                            <p className="text-red-600 text-sm">
                                                El video debe estar en formato MP4 para poder reproducirlo en el navegador.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="flex justify-center mt-8">
                            <button
                                onClick={handleCompletar}
                                disabled={sesion.tipo_contenido === 'temporizador' && !completada}
                                className={`inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white ${sesion.tipo_contenido === 'temporizador' && !completada
                                    ? 'bg-gray-400 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                                    }`}
                            >
                                <CheckCircle2 className="h-5 w-5 mr-2" />
                                Marcar como completada
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HacerSesion; 