import React from 'react';
import { CheckCircle2, AlertCircle } from 'lucide-react';

const ProgresoPrograma = ({
    progreso,
    cuestionarioPreRespondido = false,
    cuestionarioPostRespondido = false,
    mostrarDetalles = true,
    tieneCuestionarios = true
}) => {
    // Calcular el total de elementos y completados
    const totalElementos = (progreso?.totalSesiones || 0) + (tieneCuestionarios ? 2 : 0); // +2 por los cuestionarios pre y post si existen
    const elementosCompletados =
        (tieneCuestionarios ? (cuestionarioPreRespondido ? 1 : 0) : 0) +
        (progreso?.sesionesCompletadas || 0) +
        (tieneCuestionarios ? (cuestionarioPostRespondido ? 1 : 0) : 0);

    // Porcentaje de progreso
    const porcentajeProgreso = Math.round((elementosCompletados / totalElementos) * 100);

    return (
        <div className="bg-white rounded-xl shadow-sm p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Tu progreso</h2>
                <div className="flex items-center">
                    <span className="text-xl font-bold text-emerald-600 mr-2">{porcentajeProgreso}%</span>
                    <CheckCircle2 className="h-6 w-6 text-emerald-600" />
                </div>
            </div>

            <div className="space-y-4">
                {/* Información de progreso */}
                <div className="flex items-center justify-between">
                    <div>
                        <span className="text-gray-600 font-medium">Elementos completados</span>
                        <span className="ml-2 text-sm text-gray-500">
                            ({elementosCompletados} de {totalElementos})
                        </span>
                    </div>
                    <div className="bg-emerald-50 text-emerald-700 text-sm font-medium py-1 px-3 rounded-full">
                        {progreso?.minutosCompletados || 0} min. completados
                    </div>
                </div>

                {/* Barra de progreso simplificada */}
                <div className="flex h-10 rounded-lg overflow-hidden border border-gray-200">
                    {/* Cuestionario Pre */}
                    {tieneCuestionarios && (
                        <div
                            className={`flex items-center justify-center border-r border-gray-200 ${cuestionarioPreRespondido ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'
                                } text-xs font-medium`}
                            style={{ width: `${100 / totalElementos}%` }}
                        >
                            Pre
                        </div>
                    )}

                    {/* Sesiones */}
                    <div
                        className="flex h-full"
                        style={{ width: `${(progreso?.totalSesiones || 0) * 100 / totalElementos}%` }}
                    >
                        {Array.from({ length: progreso?.totalSesiones || 0 }).map((_, index) => (
                            <div
                                key={index}
                                className={`flex items-center justify-center ${index < (progreso?.totalSesiones || 0) - 1 ? 'border-r border-gray-200' : ''} ${index < (progreso?.sesionesCompletadas || 0)
                                    ? 'bg-emerald-500 text-white'
                                    : 'bg-gray-100 text-gray-600'
                                    } text-xs font-medium`}
                                style={{ width: `${100 / (progreso?.totalSesiones || 1)}%` }}
                            >
                                {index + 1}
                            </div>
                        ))}
                    </div>

                    {/* Cuestionario Post */}
                    {tieneCuestionarios && (
                        <div
                            className={`flex items-center justify-center border-l border-gray-200 ${cuestionarioPostRespondido ? 'bg-purple-500 text-white' : 'bg-gray-100 text-gray-600'
                                } text-xs font-medium`}
                            style={{ width: `${100 / totalElementos}%` }}
                        >
                            Post
                        </div>
                    )}
                </div>

                {/* Leyenda simple */}
                <div className="flex flex-wrap gap-3 justify-center mt-2">
                    {tieneCuestionarios && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${cuestionarioPreRespondido ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {cuestionarioPreRespondido ? '✓' : '○'} Cuestionario Pre
                        </div>
                    )}

                    <div className="bg-emerald-100 px-3 py-1 rounded-full text-sm font-medium text-emerald-800">
                        {progreso?.sesionesCompletadas || 0}/{progreso?.totalSesiones || 0} sesiones
                    </div>

                    {tieneCuestionarios && (
                        <div className={`px-3 py-1 rounded-full text-sm font-medium ${cuestionarioPostRespondido ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-500'
                            }`}>
                            {cuestionarioPostRespondido ? '✓' : '○'} Cuestionario Post
                        </div>
                    )}
                </div>

                {/* Detalles opcionales simplificados */}
                {mostrarDetalles && (
                    <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-gray-600 text-sm">
                            {elementosCompletados === totalElementos
                                ? '¡Has completado todo el programa! Felicidades.'
                                : `Te faltan ${totalElementos - elementosCompletados} elementos para completar el programa.`}
                        </p>
                        {tieneCuestionarios && (progreso?.sesionesCompletadas || 0) === (progreso?.totalSesiones || 0) && !cuestionarioPostRespondido && (
                            <p className="text-purple-600 text-sm mt-1 font-medium">
                                ¡Has completado todas las sesiones! Ya puedes responder el cuestionario final.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgresoPrograma; 