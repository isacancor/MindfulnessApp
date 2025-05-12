import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PlusCircle, Eye, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../config/axios';
import InvestigadorLayout from '../components/InvestigadorLayout';
import ErrorAlert from '../components/ErrorAlert';

const InvestigadorDashboard = () => {
    const { user } = useAuth();
    const [programas, setProgramas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await api.get('/programas');
                setProgramas(response.data);
            } catch (err) {
                setError('Error al cargar los programas');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgramas();
    }, []);

    const estadisticas = {
        totalProgramas: programas.length,
        participantesActivos: programas.reduce((acc, p) => acc + (p.participantes?.length || 0), 0),
        sesionesCompletadas: 128,
        cuestionariosRespondidos: 256
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-gray-800">Bienvenido, {user.nombre}</h1>

                    <Link
                        to="/programas/crear"
                        className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        <PlusCircle size={20} />
                        <span>Nuevo Programa</span>
                    </Link>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {/* Estadísticas */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Total Programas</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.totalProgramas}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Participantes</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.participantesActivos}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Sesiones Completadas</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.sesionesCompletadas}</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Cuestionarios Respondidos</h3>
                        <p className="text-3xl font-bold text-gray-800 mt-2">{estadisticas.cuestionariosRespondidos}</p>
                    </div>
                </div>

                {/* Programas */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-xl font-semibold text-gray-800">Mis Programas</h2>
                        <Link
                            to="/programas"
                            className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                        >
                            Ver todos
                        </Link>
                    </div>
                    <div className="space-y-4">
                        {programas.slice(0, 3).map((programa) => (
                            <div
                                key={programa.id}
                                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                            >
                                <div>
                                    <h3 className="font-medium text-gray-800">{programa.nombre}</h3>
                                    <p className="text-sm text-gray-500">
                                        {programa.participantes?.length || 0} participantes · {programa.duracion_semanas} semanas
                                    </p>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Link
                                        to={`/programas/${programa.id}`}
                                        className="p-2 text-gray-400 hover:text-blue-600"
                                    >
                                        <Eye size={18} />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </InvestigadorLayout>
    );
};

export default InvestigadorDashboard; 