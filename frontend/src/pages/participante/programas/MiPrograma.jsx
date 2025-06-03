import React, { useState, useEffect } from 'react';
import api from '../../../config/axios';
import ProgramaFinalizado from './ProgramaFinalizado';
import ProgramaDetalle from '../../../components/ProgramaDetalleParticipante';
import MobileNavBar from '../../../components/MobileNavBar';
import CTOExplorar from '../../../components/CTOExplorar';
import PageHeader from '../../../components/PageHeader';

const MiPrograma = () => {
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-indigo-50 to-white pb-16 md:pb-0">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600"></div>
                    <p className="mt-4 text-lg text-indigo-600 font-medium">Cargando tu programa...</p>
                </div>
                <MobileNavBar />
            </div>
        );
    }

    if (!programa?.sesiones?.length) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
                <div className="max-w-7xl mx-auto">
                    <PageHeader
                        title="Mi Programa"
                        subtitle="Gestiona y sigue tu progreso en el programa actual"
                    />

                    <CTOExplorar
                        titulo="No tienes un programa activo"
                        descripcion="Explora los programas disponibles y únete a uno para comenzar tu viaje de mindfulness."
                        buttonText="Explorar Programas"
                    />
                </div>
                <MobileNavBar />
            </div>
        );
    }

    // Si el programa está finalizado, mostrar la vista de programa finalizado
    if (programa.estado_publicacion === 'finalizado') {
        return <ProgramaFinalizado programa={programa} />;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Mi Programa"
                    subtitle="Gestiona y sigue tu progreso en el programa actual"
                />

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
            </div>
            <MobileNavBar />
        </div>
    );
};

export default MiPrograma; 