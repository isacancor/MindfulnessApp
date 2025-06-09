import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TerminosServicio = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="mb-8 inline-flex items-center text-gray-600 hover:text-gray-900"
                >
                    <ArrowLeft className="h-5 w-5 mr-2" />
                    Volver
                </button>

                <div className="bg-white shadow-sm rounded-lg p-8">
                    <h1 className="text-3xl font-bold text-gray-900 mb-8">
                        Términos y Condiciones del Servicio
                    </h1>

                    <div className="space-y-8 text-gray-600">
                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Consentimiento Informado</h2>
                            <div className="space-y-4">
                                <p>
                                    Al registrarte en nuestra plataforma, das tu consentimiento informado para:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Participar en programas de mindfulness y meditación</li>
                                    <li>Proporcionar información personal y de salud relevante</li>
                                    <li>Permitir el uso anónimo de tus datos para fines de investigación</li>
                                    <li>Recibir comunicaciones relacionadas con los programas en los que participes</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Privacidad y Protección de Datos</h2>
                            <div className="space-y-4">
                                <p>
                                    Nos comprometemos a proteger tu privacidad y datos personales. Tu información será:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Almacenada de forma segura y encriptada</li>
                                    <li>Utilizada solo para los fines específicos del servicio</li>
                                    <li>Nunca compartida con terceros sin tu consentimiento explícito</li>
                                    <li>Tratada según las normativas de protección de datos vigentes</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Responsabilidades del Usuario</h2>
                            <div className="space-y-4">
                                <h3 className="text-xl font-medium text-gray-900 mb-2">3.1 Para Participantes</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Proporcionar información veraz y actualizada</li>
                                    <li>Seguir las recomendaciones y pautas de los programas</li>
                                    <li>Mantener la confidencialidad de tu cuenta</li>
                                    <li>Informar sobre cualquier cambio relevante en tu estado de salud</li>
                                </ul>

                                <h3 className="text-xl font-medium text-gray-900 mb-2 mt-6">3.2 Para Investigadores</h3>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Mantener la confidencialidad de los datos de los participantes</li>
                                    <li>Diseñar programas seguros y basados en evidencia científica</li>
                                    <li>Proporcionar información clara y precisa sobre los programas</li>
                                    <li>Seguir los protocolos éticos de investigación</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. Seguridad y Salud</h2>
                            <div className="space-y-4">
                                <p>
                                    Para garantizar tu seguridad y bienestar:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Consulta con un profesional de la salud antes de comenzar cualquier programa</li>
                                    <li>Informa sobre condiciones médicas relevantes</li>
                                    <li>Sigue las instrucciones y recomendaciones proporcionadas</li>
                                    <li>No sustituyas tratamientos médicos por los programas de la plataforma</li>
                                </ul>
                                <p className="text-sm bg-yellow-50 p-4 rounded-lg">
                                    Advertencia: Si experimentas malestar durante cualquier práctica, detente inmediatamente y busca ayuda profesional si es necesario.
                                </p>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. Propiedad Intelectual</h2>
                            <div className="space-y-4">
                                <p>
                                    Todo el contenido de la plataforma está protegido por derechos de autor:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>No está permitida la reproducción sin autorización</li>
                                    <li>El contenido es para uso personal y no comercial</li>
                                    <li>Los investigadores mantienen los derechos de sus programas</li>
                                </ul>
                            </div>
                        </section>

                        <section>
                            <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Modificaciones y Terminación</h2>
                            <div className="space-y-4">
                                <p>
                                    Nos reservamos el derecho a:
                                </p>
                                <ul className="list-disc pl-5 space-y-2">
                                    <li>Modificar estos términos y condiciones</li>
                                    <li>Actualizar o discontinuar servicios</li>
                                    <li>Suspender cuentas que violen estos términos</li>
                                </ul>
                                <p className="text-sm">
                                    Los usuarios serán notificados de cambios significativos en los términos.
                                </p>
                            </div>
                        </section>

                        <section className="border-t pt-8">
                            <p className="text-sm text-gray-500">
                                Al registrarte o usar nuestra plataforma, confirmas que has leído, entendido y aceptado estos términos y condiciones.
                                Para cualquier duda o aclaración, contacta con nuestro equipo de soporte.
                            </p>
                            <p className="text-sm text-gray-500 mt-4">
                                Última actualización: {new Date().toLocaleDateString()}
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TerminosServicio; 