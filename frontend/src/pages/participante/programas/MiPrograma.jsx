import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import ProgramaFinalizado from './ProgramaFinalizado';
import ProgramaDetalle from '../../../components/ProgramaDetalleParticipante';

const MiPrograma = () => {
    const navigate = useNavigate();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progreso, setProgreso] = useState({
        sesionesCompletadas: 0,
        totalSesiones: 0,
        minutosCompletados: 0
    });
    const [cuestionarioPreRespondido, setCuestionarioPreRespondido] = useState(false);
    const [cuestionarioPostRespondido, setCuestionarioPostRespondido] = useState(false);

    useEffect(() => {
        const fetchMiPrograma = async () => {
            try {
                const response = await api.get('/programas/mi-programa/');
                const programaData = response.data;

                // Verificar el estado de cada sesión
                const sesionesConEstado = await Promise.all(
                    programaData.sesiones?.map(async (sesion) => {
                        try {
                            const diarioResponse = await api.get(`/sesiones/${sesion.id}/diario_info/`);
                            return {
                                ...sesion,
                                completada: !!diarioResponse.data
                            };
                        } catch (error) {
                            console.error(`Error al verificar diario de sesión ${sesion.id}:`, error);
                            return {
                                ...sesion,
                                completada: false
                            };
                        }
                    }) || []
                );

                const programaActualizado = {
                    ...programaData,
                    sesiones: sesionesConEstado
                };

                setPrograma(programaActualizado);

                // Calcular progreso basado en las sesiones completadas
                const sesionesCompletadas = sesionesConEstado.filter(s => s.completada).length;
                const totalSesiones = sesionesConEstado.length;
                const minutosCompletados = sesionesConEstado.reduce((acc, s) => acc + (s.completada ? s.duracion_estimada : 0), 0);

                setProgreso({
                    sesionesCompletadas,
                    totalSesiones,
                    minutosCompletados
                });

                // Obtener el estado de los cuestionarios del backend
                setCuestionarioPreRespondido(programaData.cuestionario_pre_respondido || false);
                setCuestionarioPostRespondido(programaData.cuestionario_post_respondido || false);
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

    if (!programa?.sesiones?.length) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
                <div className="bg-white rounded-xl shadow-md overflow-hidden p-8 text-center max-w-2xl">
                    <Search className="mx-auto h-12 w-12 text-gray-400" />
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

    // Si el programa está finalizado, mostrar la vista de programa finalizado
    if (programa.estado_publicacion === 'finalizado') {
        return <ProgramaFinalizado programa={programa} />;
    }

    return (
        <ProgramaDetalle
            programa={programa}
            loading={loading}
            error={error}
            setError={setError}
            progreso={progreso}
            cuestionarioPreRespondido={cuestionarioPreRespondido}
            cuestionarioPostRespondido={cuestionarioPostRespondido}
            esCompletado={false}
            permitirNavegacionCuestionarios={true}
        />
    );
};

export default MiPrograma; 