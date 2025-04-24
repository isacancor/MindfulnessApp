import { User, Mail, Calendar, Heart, Activity, Phone, MapPin, BookOpen, Clock, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PerfilParticipante = () => {
    const { user } = useAuth();
    const navigate = useNavigate();

    // Función para formatear la fecha de registro
    const formatDate = (dateString) => {
        if (!dateString) return 'No disponible';
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
    };

    // Función para mostrar el nombre completo o username si no hay nombre
    const getDisplayName = () => {
        if (user.nombre && user.apellidos) {
            return `${user.nombre} ${user.apellidos}`;
        }
        return user.username || 'Usuario';
    };

    return (
        <div className="bg-white shadow-lg rounded-xl overflow-hidden max-w-4xl mx-auto my-8">
            {/* Header del perfil con botón de retroceso */}
            <div className="bg-gradient-to-r from-green-600 to-teal-500 px-6 py-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-4 left-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all duration-200 text-white"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex items-center space-x-4 ml-10">
                    <div className="h-24 w-24 rounded-full bg-white/20 border-2 border-white/30 flex items-center justify-center shadow-md">
                        <User className="h-16 w-16 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">{getDisplayName()}</h1>
                        <p className="text-white/90">Participante</p>
                    </div>
                </div>
            </div>

            {/* Información del perfil */}
            <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-5">
                        <div className="flex items-start space-x-3">
                            <Mail className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">{user.email || 'No disponible'}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Phone className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">{user.perfil_participante?.telefono || 'No disponible'}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <MapPin className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">{user.perfil_participante?.ubicacion || 'No disponible'}</span>
                        </div>
                    </div>
                    <div className="space-y-5">
                        <div className="flex items-start space-x-3">
                            <Calendar className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">Miembro desde: {formatDate(user.date_joined)}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <BookOpen className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">Nivel Educativo: {user.perfil_participante?.nivelEducativo || 'No especificado'}</span>
                        </div>
                        <div className="flex items-start space-x-3">
                            <Clock className="h-5 w-5 text-teal-600 mt-0.5" />
                            <span className="text-gray-700">Experiencia en Mindfulness: {user.perfil_participante?.experienciaMindfulness || 'No especificada'}</span>
                        </div>
                    </div>
                </div>

                {/* Información adicional */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">Información Personal</h2>
                    <div className="bg-gray-50 p-5 rounded-lg space-y-4 border border-gray-100">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <span className="font-medium text-gray-800">Género: </span>
                                <span className="text-gray-600">{user.genero || 'No especificado'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-800">Fecha de Nacimiento: </span>
                                <span className="text-gray-600">{user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-800">Ocupación: </span>
                                <span className="text-gray-600">{user.perfil_participante?.ocupacion || 'No especificada'}</span>
                            </div>
                            <div>
                                <span className="font-medium text-gray-800">Condiciones de Salud: </span>
                                <span className="text-gray-600">{user.perfil_participante?.condicionesSalud || 'No especificadas'}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Progreso actual */}
                <div className="mt-10">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">Progreso Actual</h2>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        {user.perfil_participante?.estudiosActivos?.length > 0 ? (
                            user.perfil_participante.estudiosActivos.map((estudio) => (
                                <div key={estudio.id} className="mb-5 last:mb-0">
                                    <h3 className="font-medium text-gray-800 mb-3">{estudio.nombre}</h3>
                                    <div className="mt-2">
                                        <div className="w-full bg-gray-200 rounded-full h-3">
                                            <div
                                                className="bg-gradient-to-r from-green-500 to-teal-400 h-3 rounded-full shadow-sm"
                                                style={{ width: `${estudio.progreso}%` }}
                                            ></div>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2 flex justify-between">
                                            <span>Progreso</span>
                                            <span className="font-medium">{estudio.progreso}% completado</span>
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-600 text-center py-4">No hay estudios activos en este momento.</p>
                        )}
                    </div>
                </div>

                {/* Historial de estudios */}
                <div className="mt-10 mb-6">
                    <h2 className="text-xl font-semibold text-gray-800 mb-5 pb-2 border-b border-gray-200">Historial de Estudios</h2>
                    <div className="bg-gray-50 p-5 rounded-lg border border-gray-100">
                        {user.perfil_participante?.estudiosCompletados?.length > 0 ? (
                            <div className="space-y-4">
                                {user.perfil_participante.estudiosCompletados.map((estudio) => (
                                    <div key={estudio.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                                        <div className="flex justify-between items-start">
                                            <h3 className="font-medium text-gray-800">{estudio.nombre}</h3>
                                            <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                                                {estudio.puntuacion}/10
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">
                                            Completado el {new Date(estudio.fechaCompletado).toLocaleDateString('es-ES')}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-600 text-center py-4">No hay estudios completados.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilParticipante;