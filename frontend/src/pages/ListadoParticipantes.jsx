import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Calendar, CheckCircle, Clock } from 'lucide-react';
import api from '../config/axios';
import ErrorAlert from '../components/ErrorAlert';

const ListadoParticipantes = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [programa, setPrograma] = useState(null);
    const [participantes, setParticipantes] = useState([]);
    const [inscripciones, setInscripciones] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPrograma = async () => {
        try {
            const response = await api.get(`/programas/${id}/`);
            setPrograma(response.data);
            setParticipantes(response.data.participantes || []);

            // Obtener inscripciones
            const inscrip = await api.get(`/programas/${id}/inscripciones/`);

            // Crear un objeto con las inscripciones indexadas por id de participante
            const inscripcionesMap = {};
            inscrip.data.forEach(inscripcion => {
                inscripcionesMap[inscripcion.participante] = inscripcion;
            });

            setInscripciones(inscripcionesMap);
        } catch (error) {
            setError(error.response?.data?.error || 'Error al cargar los datos del programa');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograma();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-2xl shadow-xl p-8">
                    {/* Encabezado */}
                    <div className="flex items-center justify-between mb-8">
                        <button
                            onClick={() => navigate(`/programas/${id}`)}
                            className="flex items-center text-gray-600 hover:text-indigo-600 transition-colors"
                        >
                            <ArrowLeft className="h-5 w-5 mr-2" />
                            Volver al programa
                        </button>
                    </div>

                    <ErrorAlert
                        message={error}
                        onClose={() => setError(null)}
                    />

                    {/* Título y Estado */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{programa.nombre}</h1>
                        <p className="text-gray-600">Listado de participantes</p>
                    </div>

                    {/* Lista de Participantes */}
                    <div className="space-y-4">
                        {participantes.length === 0 ? (
                            <div className="text-center py-8">
                                <p className="text-gray-500">No hay participantes inscritos en este programa.</p>
                            </div>
                        ) : (
                            participantes.map((participante) => (
                                <div
                                    key={participante.id}
                                    className="bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-colors"
                                >
                                    <div className="flex items-start space-x-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                                                <User className="h-6 w-6 text-indigo-600" />
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-medium text-gray-900">
                                                    {participante.nombre} {participante.apellidos}
                                                </h3>
                                                {inscripciones[participante.id] && (
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${inscripciones[participante.id].estado_programa === 'completado'
                                                        ? 'bg-green-100 text-green-800'
                                                        : 'bg-blue-100 text-blue-800'
                                                        }`}>
                                                        {inscripciones[participante.id].estado_programa === 'completado' ? (
                                                            <>
                                                                <CheckCircle className="h-3 w-3 mr-1" />
                                                                Completado
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Clock className="h-3 w-3 mr-1" />
                                                                En progreso
                                                            </>
                                                        )}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="mt-2 space-y-1">
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Mail className="h-4 w-4 mr-2" />
                                                    {participante.email}
                                                </div>
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Calendar className="h-4 w-4 mr-2" />
                                                    Fecha de inscripción: {inscripciones[participante.id] ?
                                                        new Date(inscripciones[participante.id].fecha_inicio).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        }) :
                                                        new Date(participante.date_joined).toLocaleDateString('es-ES', {
                                                            year: 'numeric',
                                                            month: 'long',
                                                            day: 'numeric'
                                                        })}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ListadoParticipantes; 