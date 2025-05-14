import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../../config/axios';
import ProgramaDetalle from '../../../../components/ProgramaDetalleParticipante';

const ProgramaCompletado = () => {
    const { id } = useParams();
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
            } finally {
                setLoading(false);
            }
        };

        fetchPrograma();
    }, [id]);

    return (
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
    );
};

export default ProgramaCompletado; 