import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TerminosPrograma = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Volver
                </button>

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Términos y Condiciones del Programa
                    </h1>

                    <div className="space-y-6 text-gray-600">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">1. Compromiso de Participación</h2>
                            <p>
                                Al unirte a este programa, te comprometes a:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Participar activamente en las sesiones programadas</li>
                                <li>Completar las actividades y ejercicios asignados</li>
                                <li>Mantener una actitud respetuosa y constructiva</li>
                                <li>Seguir las recomendaciones proporcionadas por los instructores</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">2. Duración y Dedicación</h2>
                            <p>
                                El programa requiere una dedicación constante durante su duración. Deberás:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Asistir regularmente a las sesiones programadas</li>
                                <li>Dedicar tiempo a la práctica personal</li>
                                <li>Completar las evaluaciones y cuestionarios requeridos</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">3. Privacidad y Confidencialidad</h2>
                            <p>
                                Nos comprometemos a proteger tu privacidad y datos personales. La información recopilada será:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Utilizada únicamente con fines de investigación y mejora del programa</li>
                                <li>Tratada de manera confidencial y anónima</li>
                                <li>Almacenada de forma segura según las normativas vigentes</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">4. Beneficios y Limitaciones</h2>
                            <p>
                                El programa está diseñado para promover el bienestar, pero es importante entender que:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Los resultados pueden variar según el individuo</li>
                                <li>No sustituye ningún tratamiento médico o psicológico</li>
                                <li>Se recomienda consultar con profesionales de la salud en caso de dudas</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-900 mb-4">5. Cancelación y Modificaciones</h2>
                            <p>
                                La participación en el programa implica entender que:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-2">
                                <li>Puedes cancelar tu participación en cualquier momento</li>
                                <li>El programa puede sufrir modificaciones para mejorar su calidad</li>
                                <li>Se notificarán los cambios importantes con antelación</li>
                            </ul>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminosPrograma; 