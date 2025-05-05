import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle } from 'lucide-react';
import api from '../../config/axios';
import ProgramaCard from '../../components/ProgramaCard';
import InvestigadorLayout from '../../components/InvestigadorLayout';

const ListaProgramas = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await api.get('/programas');
                console.log('Datos recibidos:', response.data);
                setProgramas(response.data);
            } catch (err) {
                console.error('Error al cargar programas:', err);
                setError('Error al cargar los programas. Por favor, intenta nuevamente.');
            } finally {
                setLoading(false);
            }
        };

        fetchProgramas();
    }, []);

    const handleDelete = async (programaId) => {
        if (window.confirm('¿Estás seguro de que quieres eliminar este programa?')) {
            try {
                await api.delete(`/programas/${programaId}`);
                setProgramas(programas.filter(p => p.id !== programaId));
            } catch (err) {
                console.error('Error al eliminar programa:', err);
                setError('Error al eliminar el programa');
            }
        }
    };

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Mis Programas</h1>
                        <p className="text-gray-600 mt-1">
                            Gestiona tus programas de mindfulness
                        </p>
                    </div>
                    <button
                        onClick={() => navigate('/programas/crear')}
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <PlusCircle size={20} />
                        <span>Nuevo Programa</span>
                    </button>
                </div>

                {error && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded">
                        <p className="text-red-700">{error}</p>
                    </div>
                )}

                {programas.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-sm p-8 text-center">
                        <p className="text-gray-600">No tienes ningún programa creado.</p>
                        <button
                            onClick={() => navigate('/programas/crear')}
                            className="mt-4 text-blue-600 hover:text-blue-700 font-medium"
                        >
                            Crear mi primer programa
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programas.map((programa) => (
                            <ProgramaCard
                                key={programa.id}
                                programa={programa}
                                onDelete={handleDelete}
                            />
                        ))}
                    </div>
                )}
            </div>
        </InvestigadorLayout>
    );
};

export default ListaProgramas; 