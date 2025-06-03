import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../../../config/axios';
import ProgramaDetalle from '../../../../components/ProgramaDetalleParticipante';
import MobileNavBar from '../../../../components/layout/MobileNavBar';
import PageHeader from '../../../../components/layout/PageHeader';

const ProgramaCompletado = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [programa, setPrograma] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [progreso, setProgreso] = useState({
        sesionesCompletadas: 0,
        totalSesiones: 0,
        minutosCompletados: 0
    });

    useEffect(() => {
        const fetchPrograma = async () => {
            try {
                // Primero verificamos si el usuario tiene acceso a este programa completado
                const completadosResponse = await api.get('/programas/mis-completados/');
                const tieneAcceso = completadosResponse.data.some(prog => prog.id === parseInt(id));

                if (!tieneAcceso) {
                    navigate('/forbidden');
                    return;
                }

                const response = await api.get(`/programas/${id}/`);
                setPrograma(response.data);

                // Verificar el estado de cada sesión
                const sesionesConEstado = await Promise.all(
                    response.data.sesiones?.map(async (sesion) => {
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
                    ...response.data,
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
            } catch (err) {
                console.error('Error al cargar el programa:', err);
                setError('Error al cargar el programa. Por favor, intenta nuevamente.');
                navigate('/forbidden');
            } finally {
                setLoading(false);
            }
        };

        fetchPrograma();
    }, [id, navigate]);

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <div className="relative">
                    <PageHeader
                        title="Programa Completado"
                        subtitle="Revisa el contenido y tus logros en este programa"
                        backUrl="/completados"
                    />
                </div>

                <ProgramaDetalle
                    programa={programa}
                    loading={loading}
                    error={error}
                    setError={setError}
                    progreso={progreso}
                    cuestionarioPreRespondido={true}
                    cuestionarioPostRespondido={true}
                    esCompletado={true}
                    permitirNavegacionCuestionarios={false}
                />
            </div>
            <MobileNavBar />
        </div>
    );
};

export default ProgramaCompletado; 