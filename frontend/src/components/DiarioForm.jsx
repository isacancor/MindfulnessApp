import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';

const DiarioForm = ({ sesion, onClose }) => {
    const navigate = useNavigate();
    const [valoracion, setValoracion] = useState('');
    const [comentario, setComentario] = useState('');
    const [error, setError] = useState('');

    const getEscalaInfo = () => {
        switch (sesion.tipo_escala) {
            case 'emocional':
                return { min: 1, max: 5, label: 'Estado emocional' };
            case 'utilidad':
                return { min: 1, max: 5, label: 'Utilidad de la sesión' };
            case 'estres':
                return { min: 0, max: 4, label: 'PSS (estrés)' };
            case 'compromiso':
                return { min: 1, max: 5, label: 'UWES-3 (compromiso)' };
            case 'bienestar':
                return { min: 0, max: 10, label: 'VAS (bienestar general)' };
            default:
                return { min: 1, max: 5, label: 'Valoración' };
        }
    };

    const escalaInfo = getEscalaInfo();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!valoracion) {
            setError('Por favor, selecciona una valoración');
            return;
        }

        try {
            await api.post('/sesiones/diario/', {
                sesion_id: sesion.id,
                valoracion: parseInt(valoracion),
                comentario
            });
            navigate('/miprograma');
        } catch (err) {
            console.error('Error al guardar el diario:', err);
            setError('Error al guardar el diario. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl shadow-lg max-w-md w-full p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Cuaderno de diario</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-400 hover:text-gray-500"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            {escalaInfo.label} [{escalaInfo.min}-{escalaInfo.max}]
                        </label>
                        <div className="flex gap-2">
                            {Array.from({ length: escalaInfo.max - escalaInfo.min + 1 }, (_, i) => i + escalaInfo.min).map((valor) => (
                                <button
                                    key={valor}
                                    type="button"
                                    onClick={() => setValoracion(valor.toString())}
                                    className={`flex-1 py-2 px-3 rounded-md text-sm font-medium ${valoracion === valor.toString()
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    {valor}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Comentario (opcional)
                        </label>
                        <textarea
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
                            rows="3"
                            placeholder="¿Cómo te has sentido durante la sesión?"
                        />
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm">{error}</div>
                    )}

                    <div className="flex justify-end gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                        >
                            Guardar y completar sesión
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DiarioForm; 