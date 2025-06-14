import React, { useState } from 'react';
import { X } from 'lucide-react';
import api from '../config/axios';
import { useNavigate } from 'react-router-dom';
import { Escala } from '../constants/enums';

const DiarioForm = ({ programa, sesion, onClose, isLastSession }) => {
    const navigate = useNavigate();
    const [valoracion, setValoracion] = useState('');
    const [comentario, setComentario] = useState('');
    const [error, setError] = useState('');

    const getEscalaInfo = () => {
        switch (sesion.tipo_escala) {
            case Escala.ESTADO_EMOCIONAL.value:
                return { min: 1, max: 5, label: '¿Cómo te sientes emocionalmente en este momento?' };
            case Escala.ESTRES_ACTUAL.value:
                return { min: 0, max: 10, label: '¿Cuánto estrés sientes ahora mismo?' };
            case Escala.BIENESTAR_GENERAL.value:
                return { min: 0, max: 10, label: '¿Cómo valoras tu bienestar general ahora mismo?' };
            case Escala.UTILIDAD_SESION.value:
                return { min: 1, max: 5, label: '¿Cuánto te ha servido esta sesión de mindfulness?' };
            case Escala.CLARIDAD_MENTAL.value:
                return { min: 1, max: 5, label: '¿Qué tanta claridad mental sientes ahora mismo?' };
            case Escala.PRESENCIA.value:
                return { min: 1, max: 5, label: '¿Qué tan presente te sientes en este momento?' };
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

            // Si es la última sesión y no hay cuestionarios post, redirigir a completados
            if (isLastSession && !programa.tiene_cuestionarios) {
                navigate(`/completados/${sesion.programa}`);
            } else {
                navigate('/miprograma');
            }
        } catch (err) {
            console.error('Error al guardar el diario:', err);
            setError('Error al guardar el diario. Por favor, intenta nuevamente.');
        }
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white/10 backdrop-blur-xl rounded-lg p-6 max-w-md w-full border border-white/10">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-white">Diario de Sesión</h2>
                    <button
                        onClick={onClose}
                        className="text-indigo-200 hover:text-white"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-indigo-200 mb-1">
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
                                        : 'bg-white/5 text-indigo-200 border-white/10 hover:bg-white/10'
                                        }`}
                                >
                                    {valor}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="comentario" className="block text-sm font-medium text-indigo-200 mb-1">
                            Comentarios (opcional)
                        </label>
                        <textarea
                            id="comentario"
                            value={comentario}
                            onChange={(e) => setComentario(e.target.value)}
                            className="w-full px-4 py-2 rounded-lg bg-white/5 border border-white/10 text-white placeholder-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition duration-200"
                            rows="4"
                            placeholder="¿Cómo te ha ido la sesión?"
                        />
                    </div>

                    {error && (
                        <p className="text-red-300 text-sm">{error}</p>
                    )}

                    <div className="flex justify-end gap-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-indigo-200 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-indigo-600 to-blue-500 border border-transparent rounded-lg hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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