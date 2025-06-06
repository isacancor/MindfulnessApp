import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Search, SortAsc, Loader2 } from 'lucide-react';
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
                    <Loader2 className="h-14 w-14 text-indigo-600 animate-spin mb-4" />
                    <p className="text-indigo-600 font-medium text-lg animate-pulse">Cargando tus programas...</p>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="mx-auto space-y-8">
                {/* Header con fondo de gradiente */}
                <div className="bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-500 rounded-xl p-8 shadow-xl text-white mb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold">Mis Programas</h1>
                            <p className="text-indigo-100 max-w-xl">
                                Gestiona tus programas de mindfulness y ayuda a tus participantes a alcanzar bienestar y calma
                            </p>
                        </div>
                        <button
                            onClick={() => navigate('/programas/crear')}
                            className="flex items-center space-x-2 px-6 py-3 bg-white text-indigo-700 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                        >
                            <PlusCircle size={20} />
                            <span>Nuevo Programa</span>
                        </button>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {/* Barra de búsqueda */}
                <div className="relative bg-white p-4 rounded-xl shadow-md">
                    <div className="flex items-center">
                        <Search className="h-5 w-5 text-gray-400 absolute left-8" />
                        <input
                            type="text"
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            placeholder="Buscar programas..."
                            className="pl-10 pr-4 py-3 w-full border-0 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                        />
                    </div>
                </div>

                {programasFiltrados.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        {busqueda ? (
                            <>
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-gray-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No se encontraron resultados</h3>
                                <p className="text-gray-600 mb-4">No hay programas que coincidan con tu búsqueda.</p>
                                <button
                                    onClick={() => setBusqueda('')}
                                    className="text-indigo-600 hover:text-indigo-700 font-medium"
                                >
                                    Borrar búsqueda
                                </button>
                            </>
                        ) : (
                            <>
                                <div className="w-20 h-20 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <PlusCircle className="h-10 w-10 text-indigo-600" />
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">No tienes ningún programa creado</h3>
                                <p className="text-gray-600 mb-6">Crea tu primer programa de mindfulness para compartirlo con tus participantes</p>
                                <button
                                    onClick={() => navigate('/programas/crear')}
                                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full shadow-md transition-colors"
                                >
                                    Crear mi primer programa
                                </button>
                            </>
                        )}
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {programasFiltrados.map((programa) => (
                                <div key={programa.id} className="transform transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                                    <ProgramaCard
                                        programa={programa}
                                        onDelete={handleDelete}
                                        onUpdate={fetchProgramas}
                                    />
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