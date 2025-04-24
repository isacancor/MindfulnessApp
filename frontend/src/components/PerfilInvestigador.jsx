import { User, Mail, Briefcase, BookOpen, Settings } from 'lucide-react';

const PerfilInvestigador = () => {
    return (
        <div className="bg-white shadow rounded-lg overflow-hidden">
            {/* Header del perfil */}
            <div className="bg-blue-600 px-6 py-8">
                <div className="flex items-center space-x-4">
                    <div className="h-24 w-24 rounded-full bg-white flex items-center justify-center">
                        <User className="h-16 w-16 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white">Dr. Juan Pérez</h1>
                        <p className="text-blue-100">Investigador Principal</p>
                    </div>
                </div>
            </div>

            {/* Información del perfil */}
            <div className="px-6 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <Mail className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">juan.perez@universidad.edu</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Briefcase className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">Departamento de Psicología</span>
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3">
                            <BookOpen className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">3 estudios activos</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Settings className="h-5 w-5 text-gray-500" />
                            <span className="text-gray-700">Configuración de cuenta</span>
                        </div>
                    </div>
                </div>

                {/* Estudios activos */}
                <div className="mt-8">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">Estudios Activos</h2>
                    <div className="space-y-4">
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-800">Estudio de Mindfulness</h3>
                            <p className="text-sm text-gray-600">20 participantes activos</p>
                        </div>
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-medium text-gray-800">Meditación y Estrés</h3>
                            <p className="text-sm text-gray-600">15 participantes activos</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PerfilInvestigador; 