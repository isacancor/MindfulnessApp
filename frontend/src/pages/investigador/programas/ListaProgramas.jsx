import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, SortAsc, Loader2, Sparkles } from 'lucide-react';
import api from '../../../config/axios';
import ProgramaCard from '../../../components/ProgramaCard';
import InvestigadorLayout from '../../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../../components/ErrorAlert';

const ListaProgramas = () => {
    const navigate = useNavigate();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [busqueda, setBusqueda] = useState('');

    const fetchProgramas = async () => {
        try {
            const response = await api.get('/programas');
            setProgramas(response.data);
        } catch (err) {
            console.error('Error al cargar programas:', err);
            setError('Error al cargar los programas. Por favor, intenta nuevamente.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProgramas();
    }, []);

    const handleDelete = (programaId) => {
        setProgramas(programas.filter(p => p.id !== programaId));
    };

    const programasFiltrados = programas.filter(programa =>
        programa.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
        programa.descripcion?.toLowerCase().includes(busqueda.toLowerCase())
    );

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-16 w-16 text-purple-300 animate-spin mx-auto mb-6" />
                        <p className="text-lg text-purple-100 font-medium animate-pulse">Cargando tus programas...</p>
                    </div>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="space-y-8">
                {/* Header principal */}
                <div className="mb-5">
                    <div className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 p-[2px] rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                            <div className="relative z-10">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                                    <div className="text-white">
                                        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                            Mis Programas
                                        </h1>
                                        <p className="mt-3 text-lg text-purple-200 max-w-2xl">
                                            Gestiona tus programas de mindfulness y ayuda a tus participantes a alcanzar bienestar y calma
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => navigate('/programas/crear')}
                                        className="group relative inline-flex items-center justify-center px-6 py-3 overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="absolute left-0 w-8 h-32 -mt-12 transition-all duration-1000 transform -translate-x-12 bg-white opacity-10 rotate-12 group-hover:translate-x-96 ease"></span>
                                        <span className="relative flex items-center justify-center text-white font-semibold">
                                            <PlusCircle className="h-5 w-5 mr-2" />
                                            Nuevo Programa
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {/* Barra de búsqueda */}
                <div className="relative mb-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-xl rounded-2xl"></div>
                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/10 shadow-lg">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-purple-300" />
                            <input
                                type="text"
                                value={busqueda}
                                onChange={(e) => setBusqueda(e.target.value)}
                                placeholder="Buscar programas..."
                                className="w-full pl-12 pr-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl text-white placeholder:text-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>
                </div>

                {programasFiltrados.length === 0 ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 blur-2xl rounded-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg p-12 text-center">
                            {busqueda ? (
                                <>
                                    <div className="mx-auto bg-purple-500/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6">
                                        <Search className="h-8 w-8 text-purple-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">No se encontraron resultados</h3>
                                    <p className="text-purple-200 mb-6 max-w-md mx-auto">
                                        No hay programas que coincidan con tu búsqueda "{busqueda}".
                                    </p>
                                    <button
                                        onClick={() => setBusqueda('')}
                                        className="px-6 py-3 bg-gradient-to-r from-purple-500 to-violet-500 text-white rounded-xl hover:from-purple-600 hover:to-violet-600 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1 font-medium"
                                    >
                                        Borrar búsqueda
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="mx-auto bg-purple-500/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6">
                                        <Sparkles className="h-8 w-8 text-purple-300" />
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-4">No tienes ningún programa creado</h3>
                                    <p className="text-purple-200 mb-8 max-w-md mx-auto">
                                        Crea tu primer programa de mindfulness para compartirlo con tus participantes y comenzar a impactar vidas.
                                    </p>
                                    <button
                                        onClick={() => navigate('/programas/crear')}
                                        className="group relative inline-flex items-center justify-center px-8 py-4 overflow-hidden bg-gradient-to-r from-purple-500 to-violet-500 rounded-xl shadow-lg shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:scale-105"
                                    >
                                        <span className="absolute left-0 w-8 h-32 -mt-12 transition-all duration-1000 transform -translate-x-12 bg-white opacity-10 rotate-12 group-hover:translate-x-96 ease"></span>
                                        <span className="relative flex items-center justify-center text-white font-semibold text-lg">
                                            <PlusCircle className="h-6 w-6 mr-3" />
                                            Crear mi primer programa
                                        </span>
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                ) : (
                    <>
                        {/* Contador de resultados */}
                        <div className="flex items-center justify-between mb-2">
                            <p className="text-purple-200 text-sm">
                                {programasFiltrados.length === programas.length
                                    ? `${programas.length} programa${programas.length !== 1 ? 's' : ''} en total`
                                    : `${programasFiltrados.length} de ${programas.length} programa${programas.length !== 1 ? 's' : ''}`
                                }
                            </p>
                        </div>

                        {/* Grid de programas */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                            {programasFiltrados.map((programa) => (
                                <div
                                    key={programa.id}
                                    className="group relative transform transition-all duration-300 hover:-translate-y-2"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-violet-500/10 blur-xl rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                    <div className="relative">
                                        <ProgramaCard
                                            programa={programa}
                                            onDelete={handleDelete}
                                            onUpdate={fetchProgramas}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </InvestigadorLayout>
    );
};

export default ListaProgramas; 