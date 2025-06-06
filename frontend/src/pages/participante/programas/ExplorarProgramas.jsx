import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, FileText, ArrowRight, Loader2, ArrowLeft, CheckCircle, Star, ChevronRight, CheckCircle2 } from 'lucide-react';
import api from '../../../config/axios';
import ErrorAlert from '../../../components/ErrorAlert';
import EnrolarProgramaModal from '../../../components/modals/EnrolarProgramaModal';
import MobileNavBar from '../../../components/layout/MobileNavBar';
import PageHeader from '../../../components/layout/PageHeader';

const ExplorarProgramas = () => {
    const navigate = useNavigate();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [enrolando, setEnrolando] = useState(false);
    const [miProgramaId, setMiProgramaId] = useState(null);
    const [yaEnrolado, setYaEnrolado] = useState(false);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [showEnrolarModal, setShowEnrolarModal] = useState(false);

    const fetchProgramas = async () => {
        try {
            const response = await api.get('/programas');

            // Filtrar los programas que no están completados
            const programasDisponibles = response.data.filter(programa => programa.inscripcion_info == null);
            setProgramas(programasDisponibles);
        } catch (err) {
            console.error('Error al cargar programas:', err);
            setError('Error al cargar los programas. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    const verificarEnrolamiento = async () => {
        try {
            const response = await api.get('/programas/mi-programa/');
            if (response.data && response.data.id) {
                setMiProgramaId(response.data.id);
                setYaEnrolado(true);
            }
        } catch (err) {
            // Si hay un error 404, significa que no está enrolado en ningún programa
            if (err.response && err.response.status === 404) {
                setYaEnrolado(false);
            } else {
                console.error('Error al verificar enrolamiento:', err);
            }
        }
    };

    useEffect(() => {
        const inicializarDatos = async () => {
            setLoading(true);
            await verificarEnrolamiento();
            await fetchProgramas();
        };

        inicializarDatos();
    }, []);

    const handleEnrolar = async (programaId) => {
        setProgramaSeleccionado(programas.find(p => p.id === programaId));
        setShowEnrolarModal(true);
    };

    const confirmarEnrolamiento = async () => {
        setEnrolando(true);
        try {
            await api.post(`/programas/${programaSeleccionado.id}/enrolar/`);
            navigate('/miprograma');
        } catch (error) {
            console.error('Error al enrolarse:', error);
            if (error.response?.data?.error) {
                setError(error.response.data.error);
            } else {
                setError('Error al enrolarse en el programa');
            }
        } finally {
            setEnrolando(false);
            setShowEnrolarModal(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-16 md:pb-0">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <p className="mt-4 text-gray-600">Cargando programas...</p>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Explora nuestros programas"
                    subtitle="Descubre programas de mindfulness diseñados para tu bienestar"
                    backUrl="/home"
                />

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {yaEnrolado && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-xl shadow-sm">
                            <p className="text-blue-700 font-medium text-lg">Ya estás enrolado en un programa. Solo puedes estar en un programa a la vez.</p>
                        </div>
                    </div>
                )}

                {programas.length === 0 ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-12 text-center border border-indigo-100">
                            <div className="bg-indigo-50 p-8 rounded-xl inline-block mb-6">
                                <Search className="mx-auto h-16 w-16 text-indigo-400" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">No hay programas disponibles</h3>
                            <p className="text-lg text-gray-500">
                                Actualmente no hay programas disponibles. Vuelve a revisar más tarde.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
                        {programas.map((programa) => (
                            <div
                                key={programa.id}
                                className="bg-white rounded-xl md:rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100"
                            >
                                <div className="p-4 md:p-6 lg:p-8 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-3 md:mb-6">
                                        <div>
                                            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-1 md:mb-2">{programa.nombre}</h3>
                                            <p className="text-xs md:text-sm text-gray-500">
                                                Por {programa.creado_por.nombre_completo_investigador}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-2 py-1 md:px-3 md:py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            {programa.tipo_contexto}
                                        </span>
                                    </div>

                                    <p className="text-sm md:text-base text-gray-600 line-clamp-2 md:line-clamp-3 mb-4 md:mb-6">{programa.descripcion}</p>

                                    <div className="grid grid-cols-2 gap-2 md:space-y-4 md:grid-cols-1 mb-4 md:mb-8">
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-2 md:p-3 rounded-lg text-sm md:text-base">
                                            <Calendar className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                                            <span>{programa.duracion_semanas} semanas</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-2 md:p-3 rounded-lg text-sm md:text-base">
                                            <Users className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                                            <span>{programa.participantes?.length || 0} participantes</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-2 md:p-3 rounded-lg text-sm md:text-base">
                                            <FileText className="mr-2 md:mr-3 h-4 w-4 md:h-5 md:w-5 text-indigo-600" />
                                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {programa.id === miProgramaId ? (
                                            <button
                                                onClick={() => navigate('/miprograma')}
                                                className="w-full flex items-center justify-center px-4 py-2 md:px-6 md:py-4 text-base md:text-lg font-medium rounded-lg md:rounded-xl text-white bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <CheckCircle className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                                Programa actual
                                            </button>
                                        ) : programa.inscripcion_info?.es_completado ? (
                                            <button
                                                onClick={() => navigate(`/completados/${programa.id}`)}
                                                className="w-full flex items-center justify-center px-4 py-2 md:px-6 md:py-4 text-base md:text-lg font-medium rounded-lg md:rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <Star className="mr-2 h-4 w-4 md:h-5 md:w-5" />
                                                Ver programa completado
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnrolar(programa.id)}
                                                disabled={enrolando || yaEnrolado}
                                                className={`w-full flex items-center justify-center px-4 py-2 md:px-6 md:py-4 text-base md:text-lg font-medium rounded-lg md:rounded-xl text-white transition-all duration-300 ${yaEnrolado
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                                                    }`}
                                            >
                                                {enrolando ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2 h-4 w-4 md:h-5 md:w-5" />
                                                        Procesando...
                                                    </>
                                                ) : yaEnrolado ? (
                                                    'Ya estás en otro programa'
                                                ) : (
                                                    <>
                                                        Unirme ahora
                                                        <ArrowRight className="ml-2 h-4 w-4 md:h-5 md:w-5" />
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <EnrolarProgramaModal
                isOpen={showEnrolarModal}
                onClose={() => setShowEnrolarModal(false)}
                onConfirm={confirmarEnrolamiento}
                programa={programaSeleccionado}
            />
            <MobileNavBar />
        </div>
    );
};

export default ExplorarProgramas;