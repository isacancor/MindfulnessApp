import React from 'react';
import { CheckCircle2, AlertCircle, Timer, Music, Video, Clock, Link, Repeat, Calendar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { EtiquetaPractica, TipoContenido } from '../constants/enums';

const SesionCard = ({ sesion, index, sesiones, cuestionarioPreRespondido, programaCompletado = false, tieneCuestionarios = true }) => {
    const navigate = useNavigate();
    // Si no hay cuestionarios, la sesión está disponible si es la primera o la anterior está completada
    const isAvailable = tieneCuestionarios ?
        (cuestionarioPreRespondido && (index === 0 || sesiones[index - 1]?.completada)) :
        (index === 0 || sesiones[index - 1]?.completada);
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
            className={`flex flex-col md:flex-row md:items-center md:justify-between p-4 rounded-lg transition-colors ${isCompleted
                ? 'bg-emerald-500/20 hover:bg-emerald-500/30'
                : isAvailable
                    ? 'bg-indigo-500/20 hover:bg-indigo-500/30'
                    : 'bg-white/5 hover:bg-white/10'
                } backdrop-blur-xl border border-white/10`}
        >
            <div className="flex items-start space-x-4">
                <div className={`flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-full font-semibold ${isCompleted
                    ? 'bg-emerald-500/30 text-emerald-200'
                    : isAvailable
                        ? 'bg-indigo-500/30 text-indigo-200'
                        : 'bg-white/10 text-indigo-300'
                    }`}>
                    {sesion.semana}
                </div>
                <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                        <h3 className="text-lg font-medium text-white truncate">{sesion.titulo}</h3>
                        {isCompleted ? (
                            <CheckCircle2 className="flex-shrink-0 h-5 w-5 text-emerald-300" />
                        ) : isAvailable ? (
                            <AlertCircle className="flex-shrink-0 h-5 w-5 text-indigo-300" />
                        ) : (
                            <AlertCircle className="flex-shrink-0 h-5 w-5 text-indigo-300/50" />
                        )}
                    </div>
                    <p className="text-indigo-200 mt-1 text-sm md:text-base line-clamp-2 md:line-clamp-1">{sesion.descripcion}</p>
                    <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-indigo-200">
                        <div className="flex items-center">
                            <Clock className="h-4 w-4 mr-1 text-indigo-300" />
                            <span>{sesion.duracion_estimada} minutos</span>
                        </div>
                        <span className="hidden md:inline mx-2">•</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTipoPracticaColor(sesion.tipo_practica)}`}>
                            {sesion.tipo_practica_display}
                        </span>
                        <span className="hidden md:inline mx-2">•</span>
                        <span className="flex items-center">
                            {getTipoContenidoIcon(sesion.tipo_contenido)}
                            {sesion.tipo_contenido_display}
                        </span>
                    </div>
                    {/* Fechas de inicio y fin */}
                    <div className="flex items-center mt-2 text-sm text-indigo-200">
                        <Calendar className="h-4 w-4 mr-1 text-indigo-300" />
                        <span className="text-xs md:text-sm">Semana del {fechas.inicio} al {fechas.fin}</span>
                    </div>
                </div>
            </div>
            <div className="mt-4 md:mt-0 md:ml-4 flex justify-end">
                {programaCompletado ? (
                    <button
                        onClick={() => navigate(`/completados/${sesion.programa}/sesion/${sesion.id}`)}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <Repeat className="h-4 w-4 mr-2" />
                        Repetir
                    </button>
                ) : isCompleted ? (
                    <button
                        onClick={() => navigate(`/miprograma/sesion/${sesion.id}`)}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-emerald-600 to-green-500 hover:from-emerald-700 hover:to-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                    >
                        <Repeat className="h-4 w-4 mr-2" />
                        Repetir
                    </button>
                ) : isAvailable ? (
                    <button
                        onClick={() => navigate(`/miprograma/sesion/${sesion.id}`)}
                        className="w-full md:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Comenzar
                    </button>
                ) : (
                    <span className="w-full md:w-auto inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-medium bg-white/5 text-indigo-300 text-center">
                        {tieneCuestionarios && !cuestionarioPreRespondido ? 'Completa el cuestionario pre' :
                            (index > 0 && !sesiones[index - 1]?.completada) ? 'Completa la sesión anterior' : 'Bloqueada'}
                    </span>
                )}
            </div>
        </div>
    );
};

export default SesionCard; 