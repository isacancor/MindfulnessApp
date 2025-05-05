import { User, Mail, Calendar, BookOpen, Briefcase, MapPin, Phone, ClipboardList, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const PerfilInvestigador = () => {
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

    // Función para formatear el género
    const formatGenero = (genero) => {
        const generos = {
            'masculino': 'Masculino',
            'femenino': 'Femenino',
            'otro': 'Otro',
            'prefiero_no_decir': 'Prefiero no decir'
        };
        return generos[genero] || 'No especificado';
    };

    // Función para formatear el nivel educativo
    const formatNivelEducativo = (nivel) => {
        const niveles = {
            'sin_estudios': 'Sin Estudios',
            'primaria': 'Primaria',
            'secundaria': 'Secundaria',
            'bachillerato': 'Bachillerato',
            'formacion_profesional': 'Formación Profesional',
            'universidad': 'Universidad',
            'master': 'Master',
            'doctorado': 'Doctorado',
            'otros': 'Otros'
        };
        return niveles[nivel] || 'No especificado';
    };

    // Función para formatear la experiencia en investigación
    const formatExperienciaInvestigacion = (experiencia) => {
        const experiencias = {
            'Sí': 'Sí',
            'No': 'No',
            'En parte': 'En parte'
        };
        return experiencias[experiencia] || 'No especificada';
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden max-w-4xl mx-auto my-8 shadow-xl">
            {/* Header del perfil*/}
            <div className="bg-gradient-to-br from-blue-600 to-indigo-500 px-6 py-8 relative">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute top-6 left-6 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 text-white backdrop-blur-sm"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
                <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 ml-0 md:ml-10">
                    <div className="h-28 w-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-lg">
                        <User className="h-16 w-16 text-white" />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-3xl font-bold text-white">{getDisplayName()}</h1>
                        <p className="text-white/90 font-medium">Investigador</p>
                        <div className="mt-2 flex justify-center md:justify-start">
                            <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                Miembro desde {formatDate(user.date_joined)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Contenido principal */}
            <div className="px-6 py-6">
                {/* Sección de información básica */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Mail className="h-5 w-5 text-blue-600 mr-2" />
                            Información de Contacto
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Correo electrónico</p>
                                <p className="text-gray-800 font-medium">{user.email || 'No disponible'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Teléfono</p>
                                <p className="text-gray-800 font-medium">{user.telefono || 'No disponible'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ubicación</p>
                                <p className="text-gray-800 font-medium">{user.ubicacion || 'No disponible'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="h-5 w-5 text-blue-600 mr-2" />
                            Información Académica
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-500">Nivel Educativo</p>
                                <p className="text-gray-800 font-medium">{formatNivelEducativo(user.nivelEducativo)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Ocupación</p>
                                <p className="text-gray-800 font-medium">{user.ocupacion || 'No especificada'}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Experiencia en Investigación</p>
                                <p className="text-gray-800 font-medium">{formatExperienciaInvestigacion(user.perfil_investigador?.experienciaInvestigacion)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información personal */}
                <div className="bg-gray-50 p-6 rounded-xl shadow-sm mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="h-5 w-5 text-blue-600 mr-2" />
                        Detalles Personales
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-500">Género</p>
                            <p className="text-gray-800 font-medium">{formatGenero(user.genero)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Fecha de Nacimiento</p>
                            <p className="text-gray-800 font-medium">
                                {user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Áreas de interés */}
                <div className="mb-8">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <ClipboardList className="h-5 w-5 text-blue-600 mr-2" />
                        Áreas de Interés
                    </h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        {user.perfil_investigador?.areasInteres?.length > 0 ? (
                            <div className="flex flex-wrap gap-2">
                                {user.perfil_investigador.areasInteres.map((area) => (
                                    <span
                                        key={area}
                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                    >
                                        {area}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No hay áreas de interés especificadas.</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Estudios activos */}
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <Briefcase className="h-5 w-5 text-blue-600 mr-2" />
                        Estudios Activos
                    </h3>
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                        {user.perfil_investigador?.estudiosActivos?.length > 0 ? (
                            <div className="divide-y divide-gray-100">
                                {user.perfil_investigador.estudiosActivos.map((estudio) => (
                                    <div key={estudio.id} className="py-4 first:pt-0 last:pb-0">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h4 className="font-medium text-gray-800">{estudio.nombre}</h4>
                                                <p className="text-sm text-gray-500 mt-1">
                                                    {estudio.participantesActivos} participantes activos
                                                </p>
                                            </div>
                                            <span className="inline-flex items-center bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                                                {estudio.estado}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No hay estudios activos en este momento.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilInvestigador; 