import { User, Mail, Calendar, BookOpen, Briefcase, MapPin, Phone, ClipboardList, ArrowLeft, Lock, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import { Genero, NivelEducativo, ExperienciaInvestigacion } from '../../constants/enums';
import { useState } from 'react';
import ChangePasswordModal from '../modals/ChangePasswordModal';
import BackgroundVideo from '../layout/BackgroundVideo';

const PerfilInvestigador = () => {
    const { user, error, resetError, deleteAccount } = useAuth();
    const navigate = useNavigate();
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [deleteError, setDeleteError] = useState(null);

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
        return Genero[genero?.toUpperCase()]?.label || 'No especificado';
    };

    // Función para formatear el nivel educativo
    const formatNivelEducativo = (nivel) => {
        return NivelEducativo[nivel?.toUpperCase()]?.label || 'No especificado';
    };

    // Función para formatear la experiencia en investigación
    const formatExperienciaInvestigacion = (experiencia) => {
        return ExperienciaInvestigacion[experiencia?.toUpperCase()]?.label || 'No especificada';
    };

    const handleDeleteAccount = async () => {
        try {
            await deleteAccount();
            navigate('/login');
        } catch (error) {
            setDeleteError(error.message);
        }
    };

    return (
        <BackgroundVideo videoSrc="/videos/lluvia.mp4">
            <div className="h-screen overflow-y-auto">
                <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 py-4 md:py-8">
                    <div className="max-w-4xl mx-auto px-4 md:px-6">
                        <div className="bg-white/5 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl border border-white/10">
                            {/* Header del perfil */}
                            <div className="bg-gradient-to-r from-purple-500/20 via-violet-500/20 to-indigo-500/20 p-[2px] rounded-t-2xl">
                                <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 relative">
                                    <button
                                        onClick={() => navigate(-1)}
                                        className="absolute top-4 md:top-6 left-4 md:left-6 bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all duration-300 text-white backdrop-blur-sm"
                                    >
                                        <ArrowLeft className="h-5 w-5" />
                                    </button>
                                    <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-6 ml-0 md:ml-10 mt-8 md:mt-0">
                                        <div className="h-24 md:h-28 w-24 md:w-28 rounded-full bg-white/20 border-4 border-white/30 flex items-center justify-center shadow-lg">
                                            <User className="h-12 md:h-16 w-12 md:w-16 text-white" />
                                        </div>
                                        <div className="text-center md:text-left">
                                            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">{getDisplayName()}</h1>
                                            <p className="text-purple-200 font-medium">Investigador</p>
                                            <div className="mt-2 flex justify-center md:justify-start">
                                                <span className="bg-white/20 text-white px-3 py-1 rounded-full text-sm font-medium">
                                                    Miembro desde {formatDate(user.date_joined)}
                                                </span>
                                            </div>
                                            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-2">
                                                <button
                                                    onClick={() => setIsChangePasswordModalOpen(true)}
                                                    className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                                                >
                                                    <Lock className="h-5 w-5" />
                                                    <span>Cambiar Contraseña</span>
                                                </button>
                                                <button
                                                    onClick={() => setIsDeleteModalOpen(true)}
                                                    className="bg-red-500/80 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                    <span>Eliminar Cuenta</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Contenido principal */}
                            <div className="px-4 md:px-6 py-4 md:py-6">
                                <ErrorAlert
                                    message={error}
                                    onClose={() => resetError()}
                                />

                                {/* Sección de información básica */}
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
                                    <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-sm border border-white/10">
                                        <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
                                            <Mail className="h-5 w-5 text-purple-300 mr-2" />
                                            Información de Contacto
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-purple-200">Correo electrónico</p>
                                                <p className="text-white font-medium">{user.email || 'No disponible'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-200">Teléfono</p>
                                                <p className="text-white font-medium">{user.telefono || 'No disponible'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-200">Ubicación</p>
                                                <p className="text-white font-medium">{user.ubicacion || 'No disponible'}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-sm border border-white/10">
                                        <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
                                            <BookOpen className="h-5 w-5 text-purple-300 mr-2" />
                                            Información Académica
                                        </h3>
                                        <div className="space-y-4">
                                            <div>
                                                <p className="text-sm text-purple-200">Nivel Educativo</p>
                                                <p className="text-white font-medium">{formatNivelEducativo(user.nivelEducativo)}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-200">Ocupación</p>
                                                <p className="text-white font-medium">{user.ocupacion || 'No especificada'}</p>
                                            </div>
                                            <div>
                                                <p className="text-sm text-purple-200">Experiencia en Investigación</p>
                                                <p className="text-white font-medium">{formatExperienciaInvestigacion(user.perfil_investigador?.experienciaInvestigacion)}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Información personal */}
                                <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-sm border border-white/10">
                                    <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
                                        <User className="h-5 w-5 text-purple-300 mr-2" />
                                        Detalles Personales
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-purple-200">Género</p>
                                            <p className="text-white font-medium">{formatGenero(user.genero)}</p>
                                        </div>
                                        <div>
                                            <p className="text-sm text-purple-200">Fecha de Nacimiento</p>
                                            <p className="text-white font-medium">
                                                {user.fechaNacimiento ? new Date(user.fechaNacimiento).toLocaleDateString('es-ES') : 'No especificada'}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Áreas de interés */}
                                <div className="mt-6">
                                    <h3 className="text-base md:text-lg font-semibold text-white mb-4 flex items-center">
                                        <ClipboardList className="h-5 w-5 text-purple-300 mr-2" />
                                        Áreas de Interés
                                    </h3>
                                    <div className="bg-white/10 backdrop-blur-xl p-4 md:p-6 rounded-xl shadow-sm border border-white/10">
                                        {user.perfil_investigador?.areasInteres?.length > 0 ? (
                                            <div className="flex flex-wrap gap-2">
                                                {user.perfil_investigador.areasInteres.map((area) => (
                                                    <span
                                                        key={area}
                                                        className="bg-purple-500/20 text-purple-200 px-3 py-1 rounded-full text-sm font-medium"
                                                    >
                                                        {area}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : (
                                            <div className="text-center py-6">
                                                <p className="text-purple-200">No hay áreas de interés especificadas.</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <ChangePasswordModal
                        isOpen={isChangePasswordModalOpen}
                        onClose={() => setIsChangePasswordModalOpen(false)}
                    />

                    {/* Modal de confirmación de eliminación */}
                    {isDeleteModalOpen && (
                        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
                            <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-violet-900 rounded-xl p-6 max-w-md w-full mx-4 border border-white/10">
                                <h3 className="text-xl font-semibold text-white mb-4">Eliminar Cuenta</h3>
                                <p className="text-purple-200 mb-6">
                                    ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
                                    {user.perfil_investigador?.programa_set?.some(p => p.estado_publicacion === 'publicado') &&
                                        " No podrás eliminar tu cuenta mientras tengas programas publicados."}
                                </p>
                                {deleteError && (
                                    <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4">
                                        {deleteError}
                                    </div>
                                )}
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setIsDeleteModalOpen(false)}
                                        className="px-4 py-2 text-purple-200 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        onClick={handleDeleteAccount}
                                        className="px-4 py-2 bg-red-500/80 text-white rounded-lg hover:bg-red-600 transition-colors"
                                    >
                                        Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </BackgroundVideo>
    );
};

export default PerfilInvestigador; 