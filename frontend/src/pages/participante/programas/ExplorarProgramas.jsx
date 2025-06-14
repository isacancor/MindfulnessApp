import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Calendar, Users, ArrowRight, Loader2, Lock, CheckCircle, Star, ChevronRight, CheckCircle2, FileQuestion, Clock, Target, Award } from 'lucide-react';
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
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-bl from-indigo-950 via-sky-800 to-blue-900 pb-16 md:pb-0">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <p className="mt-4 text-indigo-200">Cargando programas...</p>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-bl from-indigo-950 via-sky-800 to-blue-900 py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Explora nuestros programas"
                    subtitle="Descubre programas de mindfulness diseñados para tu bienestar"
                    backUrl="/home"
                    titleClassName="bg-gradient-to-r from-white via-indigo-200 to-indigo-400"
                    subtitleClassName="text-indigo-200"
                />

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {yaEnrolado && (
                    <div className="max-w-3xl mx-auto mb-8">
                        <div className="bg-white/10 backdrop-blur-xl border border-white/10 p-6 rounded-xl shadow-lg">
                            <div className="flex items-center">
                                <CheckCircle2 className="h-6 w-6 text-blue-300 mr-3" />
                                <p className="text-white font-medium text-lg">Ya estás enrolado en un programa. Solo puedes estar en un programa a la vez.</p>
                            </div>
                        </div>
                    </div>
                )}

                {programas.length === 0 ? (
                    <div className="max-w-3xl mx-auto">
                        <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-lg p-12 text-center border border-white/10">
                            <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 p-8 rounded-xl inline-block mb-6">
                                <Search className="mx-auto h-16 w-16 text-indigo-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">No hay programas disponibles</h3>
                            <p className="text-lg text-indigo-200">
                                Actualmente no hay programas disponibles. Vuelve a revisar más tarde.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                        {programas.map((programa) => (
                            <div
                                key={programa.id}
                                className="bg-white/10 backdrop-blur-xl rounded-xl md:rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-white/10 overflow-hidden"
                            >
                                <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                                <div className="p-6 lg:p-8 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-xl font-bold text-white mb-2">{programa.nombre}</h3>
                                            <div className="flex items-center text-sm text-indigo-200">
                                                <Users className="h-4 w-4 mr-1" />
                                                <span>Por {programa.creado_por.nombre_completo_investigador}</span>
                                            </div>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-200">
                                            {programa.tipo_contexto_display}
                                        </span>
                                    </div>

                                    <p className="text-sm text-indigo-200 line-clamp-3 mb-4">{programa.descripcion}</p>

                                    <div className="space-y-2 mb-4">
                                        <div className="flex items-center text-indigo-200 bg-indigo-500/10 p-3 rounded-lg">
                                            <Calendar className="mr-3 h-5 w-5 text-indigo-300" />
                                            <div>
                                                <span className="text-sm font-medium">Duración</span>
                                                <p className="text-sm">{programa.duracion_semanas} semanas</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center text-indigo-200 bg-indigo-500/10 p-3 rounded-lg">
                                            <Target className="mr-3 h-5 w-5 text-indigo-300" />
                                            <div>
                                                <span className="text-sm font-medium">Enfoque</span>
                                                <p className="text-sm capitalize">{programa.enfoque_metodologico_display}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        {programa.id === miProgramaId ? (
                                            <button
                                                onClick={() => navigate('/miprograma')}
                                                className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-green-600 to-emerald-500 hover:from-green-700 hover:to-emerald-600 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <CheckCircle className="mr-2 h-5 w-5" />
                                                Programa actual
                                            </button>
                                        ) : programa.inscripcion_info?.es_completado ? (
                                            <button
                                                onClick={() => navigate(`/completados/${programa.id}`)}
                                                className="w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-indigo-500 hover:from-purple-700 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300"
                                            >
                                                <Star className="mr-2 h-5 w-5" />
                                                Ver programa completado
                                            </button>
                                        ) : (
                                            <button
                                                onClick={() => handleEnrolar(programa.id)}
                                                disabled={enrolando || yaEnrolado}
                                                className={`w-full flex items-center justify-center px-6 py-3 text-base font-medium rounded-xl text-white transition-all duration-300 ${yaEnrolado
                                                    ? 'bg-gray-400 cursor-not-allowed'
                                                    : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 shadow-md hover:shadow-lg'
                                                    }`}
                                            >
                                                {enrolando ? (
                                                    <>
                                                        <Loader2 className="animate-spin mr-2 h-5 w-5" />
                                                        Procesando...
                                                    </>
                                                ) : yaEnrolado ? (
                                                    <>
                                                        <Lock className="mr-2 h-5 w-5" />
                                                        Ya estás en otro programa
                                                    </>
                                                ) : (
                                                    <>
                                                        Unirme ahora
                                                        <ArrowRight className="ml-2 h-5 w-5" />
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