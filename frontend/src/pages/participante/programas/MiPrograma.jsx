import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ArrowLeft } from 'lucide-react';
import api from '../../../config/axios';
import ProgramaFinalizado from './ProgramaFinalizado';
import ProgramaDetalle from '../../../components/ProgramaDetalleParticipante';
import MobileNavBar from '../../../components/MobileNavBar';
import CTOExplorar from '../../../components/CTOExplorar';

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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-16 md:pb-0">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                <p className="mt-4 text-gray-600">Cargando tu programa...</p>
                <MobileNavBar />
            </div>
        );
    }

    if (!programa?.sesiones?.length) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
                <div className="max-w-7xl mx-auto">
                    <button
                        onClick={() => navigate(-1)}
                        className="mb-6 md:mb-0 md:absolute md:top-8 md:left-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center mb-10">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                            Mi Programa
                        </h1>
                        <p className="mt-3 text-xl text-gray-500 max-w-2xl mx-auto">
                            Gestiona y sigue tu progreso en el programa actual
                        </p>
                    </div>

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
            <MobileNavBar />
        </div>
    );
};

export default MiPrograma; 