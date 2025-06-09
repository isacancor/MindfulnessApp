import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Users, ArrowLeft } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useEffect } from 'react';
import BackgroundVideo from '../../components/layout/BackgroundVideo';

const Register = () => {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        if (isAuthenticated()) {
            if (user.role === 'INVESTIGADOR') {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        }
    }, [isAuthenticated, user, navigate]);

    return (
        <BackgroundVideo videoSrc="/videos/barco.mp4">
            <div className="min-h-screen flex items-center justify-center bg-transparent px-4 sm:px-6 lg:px-8">
                <div className="w-full max-w-lg">
                    <div className="bg-white p-8 rounded-2xl shadow-xl relative">
                        <button
                            onClick={() => navigate('/')}
                            className="absolute top-6 left-6 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-indigo-600 border border-gray-300/30 hover:border-indigo-300 bg-white/90 hover:bg-indigo-100 focus:outline-none shadow-sm"
                            aria-label="Volver atrás"
                        >
                            <ArrowLeft className="h-5 w-5" />
                        </button>

                        <div className="text-center mt-2">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Crear una nueva cuenta
                            </h2>
                            <p className="text-gray-500">
                                Selecciona tu tipo de cuenta para continuar
                            </p>
                        </div>

                        <div className="mt-8 space-y-6">
                            <Link
                                to="/register/investigador"
                                className="group relative block w-full bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-indigo-50 p-3 rounded-lg group-hover:bg-indigo-100 transition-colors duration-200">
                                        <BookOpen className="h-6 w-6 text-indigo-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-indigo-700">
                                            Soy Investigador/a
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Quiero crear y gestionar programas de mindfulness para investigación
                                        </p>
                                    </div>
                                </div>
                            </Link>

                            <Link
                                to="/register/participante"
                                className="group relative block w-full bg-white rounded-xl shadow-sm p-6 hover:shadow-md transition-all duration-300 border border-gray-200 hover:border-emerald-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                            >
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 bg-emerald-50 p-3 rounded-lg group-hover:bg-emerald-100 transition-colors duration-200">
                                        <Users className="h-6 w-6 text-emerald-600" />
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-lg font-semibold text-gray-800 group-hover:text-emerald-700">
                                            Soy Participante
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-600">
                                            Quiero participar en programas de mindfulness y meditación
                                        </p>
                                    </div>
                                </div>
                            </Link>
                        </div>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">
                                        ¿Ya tienes una cuenta?
                                    </span>
                                </div>
                            </div>

                            <div className="mt-4 text-center">
                                <Link
                                    to="/login"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                                >
                                    Inicia sesión aquí
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </BackgroundVideo>
    );
};

export default Register;