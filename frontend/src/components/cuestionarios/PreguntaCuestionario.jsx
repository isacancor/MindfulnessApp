import { Star, Check, Circle, CircleDot, AlertCircle, Heart, ThumbsUp } from 'lucide-react';

const PreguntaCuestionario = ({ pregunta, numero, valor, onChange }) => {
    const renderPregunta = () => {
        const { tipo } = pregunta;

        switch (tipo) {
            case 'texto':
                return (
                    <textarea
                        value={valor || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        rows="3"
                        placeholder="Escribe tu respuesta aquí..."
                    />
                );

            case 'texto_corto':
                return (
                    <input
                        type="text"
                        value={valor || ''}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Escribe tu respuesta aquí..."
                    />
                );

            case 'select':
                return (
                    <div className="space-y-2">
                        {pregunta.opciones.map((opcion) => (
                            <label
                                key={opcion.valor}
                                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-indigo-50"
                            >
                                <div className="flex items-center justify-center w-5 h-5">
                                    <input
                                        type="radio"
                                        checked={valor === opcion.valor}
                                        onChange={() => onChange(opcion.valor)}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded-full"
                                    />
                                </div>
                                <span className="text-gray-700">{opcion.texto}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'checkbox':
                return (
                    <div className="space-y-2">
                        {pregunta.opciones.map((opcion) => (
                            <label
                                key={opcion.valor}
                                className="flex items-center space-x-3 cursor-pointer p-2 rounded-md hover:bg-indigo-50"
                            >
                                <div className="flex items-center justify-center w-5 h-5">
                                    <input
                                        type="checkbox"
                                        checked={valor?.includes(opcion.valor) || false}
                                        onChange={() => {
                                            const newValor = valor ? [...valor] : [];
                                            if (newValor.includes(opcion.valor)) {
                                                const index = newValor.indexOf(opcion.valor);
                                                if (index > -1) newValor.splice(index, 1);
                                            } else {
                                                newValor.push(opcion.valor);
                                            }
                                            onChange(newValor);
                                        }}
                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                    />
                                </div>
                                <span className="text-gray-700">{opcion.texto}</span>
                            </label>
                        ))}
                    </div>
                );

            case 'likert': {
                const { escala } = pregunta;
                return (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    {Array.from({ length: escala.fin - escala.inicio + 1 }, (_, i) => (
                                        <th key={i} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                            {escala.inicio + i}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                <tr>
                                    {Array.from({ length: escala.fin - escala.inicio + 1 }, (_, i) => (
                                        <td key={i} className="px-4 py-2 text-center">
                                            <label className="flex flex-col items-center">
                                                <input
                                                    type="radio"
                                                    name={`likert-${pregunta.id}`}
                                                    value={(escala.inicio + i).toString()}
                                                    checked={valor === (escala.inicio + i).toString()}
                                                    onChange={() => onChange((escala.inicio + i).toString())}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                                {i === 0 && (
                                                    <span className="text-sm text-gray-500 mt-1">{escala.etiquetas.inicio}</span>
                                                )}
                                                {i === escala.fin - escala.inicio && (
                                                    <span className="text-sm text-gray-500 mt-1">{escala.etiquetas.fin}</span>
                                                )}
                                            </label>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                );
            }

            case 'likert-5-puntos': {
                const { likert5Puntos } = pregunta;
                const opciones = ['Totalmente en desacuerdo', 'En desacuerdo', 'Neutral', 'De acuerdo', 'Totalmente de acuerdo'];

                if (likert5Puntos.tipo === 'simple') {
                    return (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        {opciones.map((opcion, index) => (
                                            <th key={index} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                                {opcion}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    <tr>
                                        {opciones.map((_, index) => (
                                            <td key={index} className="px-4 py-2 text-center">
                                                <input
                                                    type="radio"
                                                    name={`likert-5-${pregunta.id}`}
                                                    value={(index + 1).toString()}
                                                    checked={valor === (index + 1).toString()}
                                                    onChange={() => onChange((index + 1).toString())}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                />
                                            </td>
                                        ))}
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    );
                } else {
                    // Tipo matriz
                    return (
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                    <tr>
                                        <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">
                                            Pregunta
                                        </th>
                                        {opciones.map((opcion, index) => (
                                            <th key={index} className="px-4 py-2 text-center text-sm font-medium text-gray-500">
                                                {opcion}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="bg-white divide-y divide-gray-200">
                                    {likert5Puntos.filas.map((fila, filaIndex) => (
                                        <tr key={filaIndex}>
                                            <td className="px-4 py-2">
                                                <span className="text-gray-700">{fila.texto}</span>
                                            </td>
                                            {Array.from({ length: 5 }, (_, i) => (
                                                <td key={i} className="px-4 py-2 text-center">
                                                    <input
                                                        type="radio"
                                                        name={`likert-5-${pregunta.id}-${fila.id}`}
                                                        value={(i + 1).toString()}
                                                        checked={valor && valor[fila.id] === (i + 1).toString()}
                                                        onChange={() => {
                                                            const newValor = valor ? { ...valor } : {};
                                                            newValor[fila.id] = (i + 1).toString();
                                                            onChange(newValor);
                                                        }}
                                                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                    />
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    );
                }
            }

            case 'calificacion': {
                const { estrellas } = pregunta;
                const maxEstrellas = estrellas.cantidad || 5;
                const valorActual = parseInt(valor) || 0;
                const icono = estrellas.icono || 'star';

                return (
                    <div className="flex items-center space-x-4">
                        {Array.from({ length: maxEstrellas }, (_, i) => (
                            <button
                                key={i}
                                type="button"
                                onClick={() => onChange((i + 1).toString())}
                                className="text-3xl transition-all duration-200 hover:scale-110"
                            >
                                {icono === 'star' && (
                                    <Star className={`h-10 w-10 ${i < valorActual ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`} />
                                )}
                                {icono === 'heart' && (
                                    <Heart className={`h-10 w-10 ${i < valorActual ? 'text-red-500 fill-red-500' : 'text-gray-300'}`} />
                                )}
                                {icono === 'thumbsup' && (
                                    <ThumbsUp className={`h-10 w-10 ${i < valorActual ? 'text-blue-500 fill-blue-500' : 'text-gray-300'}`} />
                                )}
                            </button>
                        ))}
                    </div>
                );
            }

            default:
                return (
                    <div className="mt-4 text-red-500 flex items-center">
                        <AlertCircle className="mr-2" />
                        Tipo de pregunta no soportado: {tipo}
                    </div>
                );
        }
    };

    return (
        <div className="mb-4">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
                {numero}. {pregunta.texto}
            </h3>
            {pregunta.descripcion && (
                <p className="text-gray-600 mb-4">
                    {pregunta.descripcion}
                </p>
            )}
            <div className="mt-4">
                {renderPregunta()}
            </div>
        </div>
    );
};

export default PreguntaCuestionario; 