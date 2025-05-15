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
            <div className="bg-white rounded-lg p-6 max-w-md w-full">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-900">Diario de Sesión</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            {escalaInfo.label} [{escalaInfo.min}-{escalaInfo.max}]
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Array.from({ length: escalaInfo.max - escalaInfo.min + 1 }, (_, i) => i + escalaInfo.min).map((valor) => (
                                <button
                                    key={valor}
                                    type="button"
                                    onClick={() => setValoracion(valor.toString())}
                                    className={`flex-1 py-2 px-4 rounded-lg border transition-colors ${valoracion === valor.toString()
                                        ? 'bg-indigo-600 text-white border-indigo-600'
                                        : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                                        }`}
                                >
                                    {valor}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="comentario" className="block text-sm font-medium text-gray-700 mb-1">
                            Comentarios (opcional)
                        </label>
                        <textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                            rows="4"
                            placeholder="¿Cómo te ha ido la sesión?"
                        />
                    </div>

                    {error && (
                        <p className="text-red-600 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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