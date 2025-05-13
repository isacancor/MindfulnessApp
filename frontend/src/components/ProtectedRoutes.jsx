import React, { useState, useEffect } from 'react';
import { Navigate, useParams, useLocation } from 'react-router-dom';
import api from '../config/axios';
import { useAuth } from '../context/AuthContext';

// Componente para proteger la ruta de las sesiones
export const SesionProtectedRoute = ({ children }) => {
    const { sesionId } = useParams();
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const verificarAcceso = async () => {
            if (!isAuthenticated() || !sesionId) {
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                // Verificar que el usuario tenga acceso a esta sesión - una sola petición para obtener toda la info necesaria
                const programaResponse = await api.get('/programas/mi-programa/');

                // Verificar que haya completado el cuestionario pre
                if (!programaResponse.data.cuestionario_pre_respondido) {
                    setIsAuthorized(false);
                    setLoading(false);
                    return;
                }

                const sesiones = programaResponse.data.sesiones || [];

                // Encontrar la sesión solicitada
                const indexSesion = sesiones.findIndex(
                    sesion => sesion.id.toString() === sesionId.toString()
                );

                if (indexSesion === -1) {
                    setIsAuthorized(false);
                    setLoading(false);
                    return;
                }

                // Si es la primera sesión, autorizar directamente
                if (indexSesion === 0) {
                    setIsAuthorized(true);
                    setLoading(false);
                    return;
                }

                // Para sesiones posteriores, verificar solo la sesión inmediatamente anterior
                const sesionAnterior = sesiones[indexSesion - 1];

                try {
                    // Solo hacemos una petición adicional para verificar la sesión anterior
                    const diarioResponse = await api.get(`/sesiones/${sesionAnterior.id}/diario_info/`);
                    setIsAuthorized(!!diarioResponse.data);
                } catch {
                    setIsAuthorized(false);
                } finally {
                    setLoading(false);
                }
            } catch (error) {
                console.error('Error al verificar acceso a sesión:', error);
                setIsAuthorized(false);
                setLoading(false);
            }
        };

        verificarAcceso();
    }, [sesionId, isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Verificando acceso...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/miprograma" replace />;
    }

    return children;
};

// Componente para proteger la ruta del cuestionario post
export const CuestionarioPostProtectedRoute = ({ children }) => {
    const [isAuthorized, setIsAuthorized] = useState(false);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    useEffect(() => {
        const verificarAcceso = async () => {
            if (!isAuthenticated()) {
                setIsAuthorized(false);
                setLoading(false);
                return;
            }

            try {
                // Verificar que el usuario haya completado todas las sesiones
                const programaResponse = await api.get('/programas/mi-programa/');

                // Primero verificar que tenga el cuestionario pre respondido
                if (!programaResponse.data.cuestionario_pre_respondido) {
                    setIsAuthorized(false);
                    setLoading(false);
                    return;
                }

                // Si ya respondió el cuestionario post, no puede volver a responderlo
                if (programaResponse.data.cuestionario_post_respondido) {
                    setIsAuthorized(false);
                    setLoading(false);
                    return;
                }

                // Verificar que todas las sesiones estén completadas
                const sesiones = programaResponse.data.sesiones || [];

                // Optimización: si no hay sesiones, no hacer peticiones adicionales
                if (sesiones.length === 0) {
                    setIsAuthorized(false);
                    setLoading(false);
                    return;
                }

                // Verificamos todas las sesiones en paralelo para mayor velocidad
                const sesionesCompletadas = await Promise.all(
                    sesiones.map(async (sesion) => {
                        try {
                            const diarioResponse = await api.get(`/sesiones/${sesion.id}/diario_info/`);
                            return !!diarioResponse.data; // true si hay datos (completada)
                        } catch {
                            return false; // No completada
                        }
                    })
                );

                // Solo autorizar si todas las sesiones están completadas
                setIsAuthorized(sesionesCompletadas.every(completada => completada));
            } catch (error) {
                console.error('Error al verificar acceso al cuestionario post:', error);
                setIsAuthorized(false);
            } finally {
                setLoading(false);
            }
        };

        verificarAcceso();
    }, [isAuthenticated]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Verificando acceso...</p>
            </div>
        );
    }

    if (!isAuthorized) {
        return <Navigate to="/miprograma" replace />;
    }

    return children;
};

// Componente general para proteger cualquier ruta que requiera autenticación
export const AuthProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated()) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
}; 