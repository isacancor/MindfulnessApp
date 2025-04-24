import { Link } from 'react-router-dom';
import { BookOpen, Users } from 'lucide-react';

const Register = () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Crear una nueva cuenta
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        O{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            inicia sesión si ya tienes una cuenta
                        </Link>
                    </p>
                </div>

                <div className="mt-8 space-y-4">
                    <Link
                        to="/register/investigador"
                        className="relative block w-full rounded-lg border-2 border-gray-300 p-6 hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <BookOpen className="h-8 w-8 text-blue-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Soy Investigador/a
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Quiero crear y gestionar programas de mindfulness para investigación
                                </p>
                            </div>
                        </div>
                    </Link>

                    <Link
                        to="/register/participante"
                        className="relative block w-full rounded-lg border-2 border-gray-300 p-6 hover:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-8 w-8 text-green-600" />
                            </div>
                            <div className="ml-4">
                                <h3 className="text-lg font-medium text-gray-900">
                                    Soy Participante
                                </h3>
                                <p className="mt-1 text-sm text-gray-500">
                                    Quiero participar en programas de mindfulness y meditación
                                </p>
                            </div>
                        </div>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register; 