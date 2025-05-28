import React from 'react';
import { CheckCircle2, AlertCircle, Timer, Music, Video, Clock, Link, Repeat, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EtiquetaPractica, TipoContenido } from '../constants/enums';

const SesionCard = ({ sesion, index, sesiones, cuestionarioPreRespondido, programaCompletado = false }) => {
    const navigate = useNavigate();
    const isAvailable = cuestionarioPreRespondido && (index === 0 || sesiones[index - 1]?.completada);
    const isCompleted = sesion.completada;

    const getTipoPracticaColor = (tipo) => {
        switch (tipo) {
            case EtiquetaPractica.BREATH.value:
                return 'bg-blue-100 text-blue-800';
            case EtiquetaPractica.OPEN_AWARENESS.value:
                return 'bg-green-100 text-green-800';
            case EtiquetaPractica.LOVING_KINDNESS.value:
                return 'bg-purple-100 text-purple-800';
            case EtiquetaPractica.BODY_SCAN.value:
                return 'bg-yellow-100 text-yellow-800';
            case EtiquetaPractica.MINDFUL_MOVEMENT.value:
                return 'bg-red-100 text-red-800';
            case EtiquetaPractica.SELF_COMPASSION.value:
                return 'bg-pink-100 text-pink-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTipoContenidoIcon = (tipo) => {
        switch (tipo) {
            case TipoContenido.TEMPORIZADOR.value:
                return <Timer className="h-4 w-4 mr-1 text-blue-500" />;
            case TipoContenido.ENLACE.value:
                return <Link className="h-4 w-4 mr-1 text-green-500" />;
            case TipoContenido.AUDIO.value:
                return <Music className="h-4 w-4 mr-1 text-purple-500" />;
            case TipoContenido.VIDEO.value:
                return <Video className="h-4 w-4 mr-1 text-red-500" />;
            default:
                return null;
        }
    };

    // Calcular fechas de inicio y fin de la semana correspondiente a la sesión
    const calcularFechas = () => {
        // Si hay fecha de inscripción disponible (se puede añadir como prop)
        if (sesion.fechaInicio && sesion.fechaFin) {
            return {
                inicio: new Date(sesion.fechaInicio).toLocaleDateString('es-ES'),
                fin: new Date(sesion.fechaFin).toLocaleDateString('es-ES')
            };
        }

        // Cálculo aproximado basado en la semana (alternativa)
        const hoy = new Date();
        const inicioPrograma = new Date();
        inicioPrograma.setDate(hoy.getDate() - ((hoy.getDay() + 6) % 7)); // Inicio en lunes de la semana actual

        const inicioSemana = new Date(inicioPrograma);
        inicioSemana.setDate(inicioPrograma.getDate() + (sesion.semana - 1) * 7);

        const finSemana = new Date(inicioSemana);
        finSemana.setDate(inicioSemana.getDate() + 6);

        return {
            inicio: inicioSemana.toLocaleDateString('es-ES'),
            fin: finSemana.toLocaleDateString('es-ES')
        };
    };

    const fechas = calcularFechas();

    return (
        <div
            className={`flex items-center justify-between p-4 rounded-lg transition-colors ${isCompleted
                ? 'bg-green-50 hover:bg-green-100'
                : isAvailable
                    ? 'bg-blue-50 hover:bg-blue-100'
                    : 'bg-gray-50 hover:bg-gray-100'
                }`}
        >
            <div className="flex items-center space-x-4">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full font-semibold ${isCompleted
                    ? 'bg-green-100 text-green-600'
                    : isAvailable
                        ? 'bg-blue-100 text-blue-600'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                    {sesion.semana}
                </div>
                <div>
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-gray-900">{sesion.titulo}</h3>
                        {isCompleted ? (
                            <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : isAvailable ? (
                            <AlertCircle className="h-5 w-5 text-blue-600" />
                        ) : (
                            <AlertCircle className="h-5 w-5 text-gray-400" />
                        )}
                    </div>
                    <p className="text-gray-600 mt-1">{sesion.descripcion}</p>
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{sesion.duracion_estimada} minutos</span>
                        <span className="mx-2">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoPracticaColor(sesion.tipo_practica)}`}>
                            {sesion.tipo_practica_display}
                        </span>
                        <span className="mx-2">•</span>
                        <span className="flex items-center">
                            {getTipoContenidoIcon(sesion.tipo_contenido)}
                            {sesion.tipo_contenido_display}
                        </span>
                    </div>
                    {/* Fechas de inicio y fin */}
                    <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar className="h-4 w-4 mr-1 text-indigo-500" />
                        <span>Semana del {fechas.inicio} al {fechas.fin}</span>
                    </div>
                </div>
            </div>
            <div className="ml-4">

                {programaCompletado ? (
                    <button
                        onClick={() => navigate(`/completados/${sesion.programa}/sesion/${sesion.id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Repeat className="h-4 w-4 mr-2" />
                        Repetir
                    </button>
                ) : isCompleted ? (
                    <button
                        onClick={() => navigate(`/miprograma/sesion/${sesion.id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                        <Repeat className="h-4 w-4 mr-2" />
                        Repetir
                    </button>
                ) : isAvailable ? (
                    <button
                        onClick={() => navigate(`/miprograma/sesion/${sesion.id}`)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                        Comenzar
                    </button>
                ) : (
                    <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
                        {!cuestionarioPreRespondido ? 'Completa el cuestionario pre' :
                            (index > 0 && !sesiones[index - 1]?.completada) ? 'Completa la sesión anterior' : 'Bloqueada'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SesionCard; 