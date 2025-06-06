import React from 'react';

const TablaCuestionario = ({ titulo, cuestionario }) => {
    if (!cuestionario) return null;

    // Convertir el objeto de respuestas en un array para poder mapearlo
    const respuestasArray = Object.entries(cuestionario.respuestas).map(([id, respuestas]) => ({
        participante_id: id,
        respuestas: Array.isArray(respuestas) ? respuestas : Object.values(respuestas)
    }));

    return (
        <div className="bg-white rounded-xl shadow-md p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">{titulo}</h3>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                ID Participante
                            </th>
                            {cuestionario.preguntas.map((pregunta, index) => (
                                <th key={index} scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    {String(pregunta)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {respuestasArray.map((respuesta, index) => (
                            <tr key={index}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {String(respuesta.participante_id)}
                                </td>
                                {respuesta.respuestas.map((valor, pIndex) => (
                                    <td key={pIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {String(valor)}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TablaCuestionario; 