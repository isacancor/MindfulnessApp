import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, Users, FileText, Star, Loader2, Search } from 'lucide-react';
import api from '../../../../config/axios';
import ErrorAlert from '../../../../components/ErrorAlert';
import MobileNavBar from '../../../../components/MobileNavBar';
import CTOExplorar from '../../../../components/CTOExplorar';
import PageHeader from '../../../../components/PageHeader';

const ProgramasCompletados = () => {
    const navigate = useNavigate();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramasCompletados = async () => {
            try {
                const response = await api.get('/programas/mis-completados/');
                setProgramas(response.data);
            } catch (err) {
                console.error('Error al cargar programas completados:', err);
                setError('Error al cargar los programas completados. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgramasCompletados();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 pb-16 md:pb-0">
                <Loader2 className="animate-spin h-12 w-12 text-blue-600" />
                <p className="mt-4 text-gray-600">Cargando programas completados...</p>
                <MobileNavBar />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-8 px-4 sm:px-6 lg:px-8 pb-20 md:pb-10">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title="Mis Programas Completados"
                    subtitle="Revisa tus programas completados y accede a su contenido"
                />

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <CTOExplorar
                        showBackButton={true}
                        paginaTitulo="Mis Programas Completados"
                        titulo="No tienes programas completados"
                        descripcion="Completa un programa de mindfulness para verlo aquí. ¡Explora nuestra colección y comienza tu viaje!"
                        buttonText="Explorar Programas"
                        className="px-4 sm:px-6 lg:px-8"
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {programas.map((programa) => (
                            <div
                                key={programa.id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-indigo-100"
                            >
                                <div className="p-6 md:p-8 flex flex-col h-full">
                                    <div className="flex items-start justify-between mb-6">
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">{programa.nombre}</h3>
                                            <p className="text-sm text-gray-500">
                                                Por {programa.creado_por.nombre_completo_investigador}
                                            </p>
                                        </div>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                            <Star className="h-4 w-4 mr-1" />
                                            Completado
                                        </span>
                                    </div>

                                    <p className="text-gray-600 line-clamp-3 mb-6">{programa.descripcion}</p>

                                    <div className="space-y-4 mb-8">
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <Calendar className="mr-3 text-indigo-600" size={20} />
                                            <span>{programa.duracion_semanas} semanas</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <Users className="mr-3 text-indigo-600" size={20} />
                                            <span>{programa.participantes?.length || 0} participantes</span>
                                        </div>
                                        <div className="flex items-center text-gray-600 bg-gray-50 p-3 rounded-lg">
                                            <FileText className="mr-3 text-indigo-600" size={20} />
                                            <span className="capitalize">{programa.enfoque_metodologico}</span>
                                        </div>
                                    </div>

                                    <div className="mt-auto">
                                        <button
                                            onClick={() => navigate(`/completados/${programa.id}`)}
                                            className="w-full flex items-center justify-center px-6 py-4 text-lg font-medium rounded-xl text-white bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
                                        >
                                            <Star className="mr-2 h-5 w-5" />
                                            Ver programa
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <MobileNavBar />
        </div>
    );
};

export default ProgramasCompletados; 