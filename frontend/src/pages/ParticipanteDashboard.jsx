import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
    Play,
    ClipboardList,
    Calendar,
    LogOut,
    BookOpen,
    User,
    ChevronRight,
    CheckCircle2
} from 'lucide-react';

const ParticipanteDashboard = () => {
    const { user, logout } = useAuth();
    const [proximaSesion] = useState({
        titulo: "Meditación Mindfulness",
        fecha: "Hoy",
        hora: "18:00",
        duracion: "20 minutos"
    });

    // Ejemplo de progreso - En producción vendría de la API
    const [progreso] = useState({
        sesionesCompletadas: 4,
        totalSesiones: 8,
        minutosCompletados: 80
    });

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            {/* Saludo y bienvenida */}
            <div className="max-w-3xl mx-auto mb-8">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                    ¡Hola, {user?.nombre || 'Participante'}! 👋
                </h1>
                <p className="text-gray-600">
                    Bienvenido/a a tu espacio de mindfulness
                </p>
            </div>

            {/* Próxima sesión - Card grande y llamativa */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-blue-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Tu próxima sesión</h2>
                        <Calendar className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                        <div>
                            <p className="text-lg font-medium text-gray-900 mb-1">{proximaSesion.titulo}</p>
                            <p className="text-gray-600">
                                {proximaSesion.fecha} a las {proximaSesion.hora} · {proximaSesion.duracion}
                            </p>
                        </div>
                        <Link
                            to={`/programas/1/sesion/1`}
                            className="mt-4 sm:mt-0 inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            <Play className="h-5 w-5 mr-2" />
                            Comenzar Sesión
                        </Link>
                    </div>
                </div>
            </div>

            {/* Progreso - Visual y motivador */}
            <div className="max-w-3xl mx-auto mb-8">
                <div className="bg-white rounded-xl shadow-sm p-6 border border-green-100">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-semibold text-gray-900">Tu progreso</h2>
                        <CheckCircle2 className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="space-y-4">
                        <div>
                            <div className="flex justify-between mb-2">
                                <span className="text-gray-600">Sesiones completadas</span>
                                <span className="font-medium text-gray-900">
                                    {progreso.sesionesCompletadas} de {progreso.totalSesiones}
                                </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div
                                    className="bg-green-600 h-2.5 rounded-full"
                                    style={{ width: `${(progreso.sesionesCompletadas / progreso.totalSesiones) * 100}%` }}
                                ></div>
                            </div>
                        </div>
                        <p className="text-green-600 font-medium">
                            ¡Has meditado {progreso.minutosCompletados} minutos en total! 🎉
                        </p>
                    </div>
                </div>
            </div>

            {/* Acciones principales - Botones grandes y claros */}
            <div className="max-w-3xl mx-auto grid gap-4 sm:grid-cols-2">
                <Link
                    to="/programas"
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <BookOpen className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Mis Programas</h3>
                            <p className="text-sm text-gray-500">Ver todos mis programas activos</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <Link
                    to="/perfil"
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <User className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Mi Perfil</h3>
                            <p className="text-sm text-gray-500">Ver y editar mi información</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <Link
                    to={`/programas/1/cuestionario/1`}
                    className="flex items-center justify-between p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
                >
                    <div className="flex items-center">
                        <ClipboardList className="h-6 w-6 text-blue-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Cuestionarios</h3>
                            <p className="text-sm text-gray-500">Completar cuestionarios pendientes</p>
                        </div>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                </Link>

                <button
                    onClick={logout}
                    className="flex items-center justify-between w-full text-left p-4 bg-white rounded-xl shadow-sm border border-gray-200 hover:border-red-300 transition-colors"
                >
                    <div className="flex items-center">
                        <LogOut className="h-6 w-6 text-red-600 mr-3" />
                        <div>
                            <h3 className="font-medium text-gray-900">Cerrar Sesión</h3>
                        </div>
                    </div>
                </button>

            </div>
        </div>
    );
};

export default ParticipanteDashboard; 