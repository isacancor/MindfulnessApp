import React from 'react';

// Función para renderizar la tabla de diarios por sesión
export const renderDiariosPorSesion = (diarios) => (
    diarios.map((sesion) => (
        <div key={sesion.id} className="relative mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                <div className="mb-4">
                    <h3 className="text-lg font-semibold text-white">
                        Semana {sesion.semana}: {sesion.titulo}
                    </h3>
                    <p className="text-sm text-purple-200">
                        Tipo de práctica: {sesion.tipo_practica} • Duración estimada: {sesion.duracion_estimada} minutos
                    </p>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    ID Participante
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Valoración
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Comentario
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/10">
                            {Object.entries(sesion.diarios).map(([participanteId, diariosParticipante]) => (
                                diariosParticipante.map((diario, index) => (
                                    <tr key={`${participanteId}-${index}`} className="hover:bg-white/10 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                            {participanteId}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                            {diario.valoracion}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-purple-200">
                                            {diario.comentario || 'Sin comentario'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                            {new Date(diario.fecha).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    ))
);

// Función para renderizar todos los diarios en una sola tabla
export const renderTodosLosDiarios = (diarios) => {
    // Crear un array plano con todos los diarios
    const todosLosDiarios = diarios.flatMap(sesion =>
        Object.entries(sesion.diarios).flatMap(([participanteId, diariosParticipante]) =>
            diariosParticipante.map(diario => ({
                ...diario,
                participanteId,
                semana: sesion.semana,
                tituloSesion: sesion.titulo,
                tipoPractica: sesion.tipo_practica
            }))
        )
    );

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Semana
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Sesión
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Tipo de Práctica
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    ID Participante
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Valoración
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Comentario
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Fecha
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/10">
                            {todosLosDiarios.map((diario, index) => (
                                <tr key={index} className="hover:bg-white/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {diario.semana}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-white">
                                        {diario.tituloSesion}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {diario.tipoPractica}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {diario.participanteId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {diario.valoracion}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-purple-200">
                                        {diario.comentario || 'Sin comentario'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {new Date(diario.fecha).toLocaleDateString()}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

// Función para renderizar el resumen por participante
export const renderDiariosPorParticipante = (diarios) => {
    // Crear un mapa para agrupar los diarios por participante
    const diariosPorParticipante = new Map();

    // Primero, obtener todas las prácticas únicas
    const practicasUnicas = new Set();
    diarios.forEach(sesion => {
        practicasUnicas.add(sesion.tipo_practica);
    });

    diarios.forEach(sesion => {
        Object.entries(sesion.diarios).forEach(([participanteId, diariosParticipante]) => {
            if (!diariosPorParticipante.has(participanteId)) {
                const participante = {
                    participanteId,
                    valoracionPromedio: 0,
                    totalValoraciones: 0,
                    sumaValoraciones: 0
                };
                // Inicializar campos para cada práctica
                practicasUnicas.forEach(practica => {
                    participante[`val_${practica}`] = null;
                    participante[`com_${practica}`] = null;
                });
                diariosPorParticipante.set(participanteId, participante);
            }

            const participante = diariosPorParticipante.get(participanteId);

            // Actualizar valoración promedio
            diariosParticipante.forEach(diario => {
                participante.totalValoraciones++;
                participante.sumaValoraciones += diario.valoracion;
                participante.valoracionPromedio = (participante.sumaValoraciones / participante.totalValoraciones).toFixed(1);
            });

            // Guardar la última valoración y comentario para cada práctica
            const ultimoDiario = diariosParticipante[diariosParticipante.length - 1];
            participante[`val_${sesion.tipo_practica}`] = ultimoDiario.valoracion;
            participante[`com_${sesion.tipo_practica}`] = ultimoDiario.comentario;
        });
    });

    return (
        <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-2xl"></div>
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-white/10">
                        <thead className="bg-white/5">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    ID Participante
                                </th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                    Valoración Promedio
                                </th>
                                {Array.from(practicasUnicas).map(practica => (
                                    <React.Fragment key={practica}>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                            Val. {practica}
                                        </th>
                                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-purple-200 uppercase tracking-wider">
                                            Com. {practica}
                                        </th>
                                    </React.Fragment>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="bg-white/5 divide-y divide-white/10">
                            {Array.from(diariosPorParticipante.values()).map((participante) => (
                                <tr key={participante.participanteId} className="hover:bg-white/10 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">
                                        {participante.participanteId}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                        {participante.valoracionPromedio}
                                    </td>
                                    {Array.from(practicasUnicas).map(practica => (
                                        <React.Fragment key={practica}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-purple-200">
                                                {participante[`val_${practica}`] || '-'}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-purple-200">
                                                {participante[`com_${practica}`] || 'Sin comentario'}
                                            </td>
                                        </React.Fragment>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}; 