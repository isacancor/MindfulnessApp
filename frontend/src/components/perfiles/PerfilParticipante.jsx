import { User, Mail, Calendar, Heart, Activity, Phone, MapPin, BookOpen, Clock, ArrowLeft, Lock, LogOut, Trash2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import ErrorAlert from '../ErrorAlert';
import { Genero, NivelEducativo, ExperienciaMindfulness } from '../../constants/enums';
import { useState } from 'react';
import ChangePasswordModal from '../auth/ChangePasswordModal';
import MobileNavBar from '../layout/MobileNavBar';

const PerfilParticipante = () => {
    const { user, error, resetError, logout, deleteAccount } = useAuth();
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

    // Función para formatear la experiencia en mindfulness
    const formatExperienciaMindfulness = (experiencia) => {
        return ExperienciaMindfulness[experiencia?.toUpperCase()]?.label || 'No especificada';
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
        <div className="bg-white rounded-2xl overflow-hidden max-w-4xl mx-auto my-4 md:my-8 shadow-xl pb-20 md:pb-8">
            {/* Header del perfil con botón de retroceso */}
            <div className="bg-gradient-to-br from-emerald-600 to-teal-500 px-4 md:px-6 py-6 md:py-8 relative">
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
                        <h1 className="text-2xl md:text-3xl font-bold text-white">{getDisplayName()}</h1>
                        <p className="text-white/90 font-medium">Participante</p>
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
                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center space-x-2"
                            >
                                <Trash2 className="h-5 w-5" />
                                <span>Eliminar Cuenta</span>
                            </button>
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
                    <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <Mail className="h-5 w-5 text-teal-600 mr-2" />
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

                    <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                        <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                            <BookOpen className="h-5 w-5 text-teal-600 mr-2" />
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
                                <p className="text-sm text-gray-500">Experiencia en Mindfulness</p>
                                <p className="text-gray-800 font-medium">{formatExperienciaMindfulness(user.perfil_participante?.experienciaMindfulness)}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Información personal */}
                <div className="bg-gray-50 p-4 md:p-6 rounded-xl shadow-sm">
                    <h3 className="text-base md:text-lg font-semibold text-gray-800 mb-4 flex items-center">
                        <User className="h-5 w-5 text-teal-600 mr-2" />
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
                        <div className="md:col-span-2">
                            <p className="text-sm text-gray-500">Condiciones de Salud</p>
                            <p className="text-gray-800 font-medium">{user.perfil_participante?.condicionesSalud || 'No especificadas'}</p>
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
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Eliminar Cuenta</h3>
                        <p className="text-gray-600 mb-6">
                            ¿Estás seguro de que deseas eliminar tu cuenta? Esta acción no se puede deshacer.
                            Se eliminarán todos tus datos, incluyendo inscripciones a programas y diarios de sesión.
                        </p>
                        {deleteError && (
                            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                                {deleteError}
                            </div>
                        )}
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Botón de cerrar sesión móvil */}
            <div className="fixed bottom-20 left-4 right-4 md:hidden">
                <button
                    onClick={() => logout()}
                    className="w-full bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-3 px-4 rounded-xl shadow-md border border-red-100 transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                </button>
            </div>

            <MobileNavBar />
        </div>
    );
};

export default PerfilParticipante;