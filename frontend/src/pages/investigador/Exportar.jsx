import React, { useState, useEffect } from 'react';
import { DownloadCloud, Check, BookOpen, Database } from 'lucide-react';
import api from '../../config/axios';
import InvestigadorLayout from '../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../components/ErrorAlert';

const Exportar = () => {
    const [programas, setProgramas] = useState([]);
    const [programaSeleccionado, setProgramaSeleccionado] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [tipoExportacion, setTipoExportacion] = useState('todos');
    const [formato, setFormato] = useState('csv');
    const [exportando, setExportando] = useState(false);
    const [exito, setExito] = useState(false);

    useEffect(() => {
        const fetchProgramas = async () => {
            try {
                const response = await api.get('/programas');
                setProgramas(response.data);
                setLoading(false);
            } catch (err) {
                console.error('Error al cargar programas:', err);
                setError('Error al cargar los programas. Por favor, intenta nuevamente.');
                setLoading(false);
            }
        };

        fetchProgramas();
    }, []);

    // Simular exportación
    const handleExportar = async () => {
        if (!programaSeleccionado) return;

        setExportando(true);
        setExito(false);

        try {
            // Llamada a la API para exportar datos
            const response = await api.get(`/programas/${programaSeleccionado.id}/exportar/`, {
                params: { tipo: tipoExportacion, formato },
                responseType: 'blob' // Importante para manejar archivos binarios
            });

            // Crear un objeto URL para el archivo descargado
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;

            // Determinar extensión de archivo según formato
            const extension = formato === 'excel' ? 'xlsx' : formato;

            // Establecer nombre del archivo para descarga
            link.setAttribute('download', `${programaSeleccionado.titulo}_${tipoExportacion}.${extension}`);

            // Simular clic para iniciar descarga
            document.body.appendChild(link);
            link.click();

            // Limpieza
            window.URL.revokeObjectURL(url);
            link.remove();

            setExito(true);
        } catch (err) {
            console.error('Error al exportar datos:', err);
            setError('Error al exportar los datos. Por favor, intenta nuevamente.');
        } finally {
            setExportando(false);
        }
    };

    const handleSeleccionarPrograma = (programaId) => {
        const programa = programas.find(p => p.id === programaId);
        setProgramaSeleccionado(programa);
        setExito(false);
    };

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
                    <p className="text-gray-600">Cargando programas...</p>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="max-w-7xl mx-auto space-y-8 pb-10">
                <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-xl p-8 shadow-xl text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div className="space-y-2">
                            <h1 className="text-3xl font-extrabold">Exportar Datos</h1>
                            <p className="text-emerald-100 max-w-xl">
                                Descarga los datos de tus programas para análisis externos
                            </p>
                        </div>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                        <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <BookOpen className="h-10 w-10 text-emerald-600" />
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No hay programas</h3>
                        <p className="text-gray-600 mb-6">
                            Para exportar datos, necesitas tener programas que hayan sido completados por los participantes.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="bg-white rounded-xl shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Selecciona un programa</h2>
                                <div className="space-y-2">
                                    {programas.map((programa) => (
                                        <button
                                            key={programa.id}
                                            onClick={() => handleSeleccionarPrograma(programa.id)}
                                            className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${programaSeleccionado?.id === programa.id
                                                ? 'bg-emerald-50 border border-emerald-200'
                                                : 'hover:bg-gray-50 border border-gray-100'
                                                }`}
                                        >
                                            <h3 className={`font-medium ${programaSeleccionado?.id === programa.id ? 'text-emerald-700' : 'text-gray-800'
                                                }`}>
                                                {programa.nombre}
                                            </h3>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {programa.participantes?.length || 0} participantes
                                            </p>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {!programaSeleccionado ? (
                                <div className="bg-white rounded-xl shadow-md p-12 text-center h-full flex flex-col items-center justify-center">
                                    <h3 className="text-xl font-medium text-gray-800 mb-2">
                                        Selecciona un programa
                                    </h3>
                                    <p className="text-gray-600">
                                        Elige un programa de la lista para exportar sus datos.
                                    </p>
                                </div>
                            ) : (
                                <div className="bg-white rounded-xl shadow-md p-6">
                                    <div className="mb-6 pb-4 border-b">
                                        <h2 className="text-xl font-bold text-gray-800 mb-1">
                                            Exportar datos de: {programaSeleccionado.titulo}
                                        </h2>
                                        <p className="text-gray-600">
                                            Configura las opciones de exportación
                                        </p>
                                    </div>

                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Selecciona los datos a exportar
                                            </h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                                                    ${tipoExportacion === 'todos' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="tipoExportacion"
                                                        value="todos"
                                                        checked={tipoExportacion === 'todos'}
                                                        onChange={() => setTipoExportacion('todos')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Todos los datos</p>
                                                        <p className="text-xs text-gray-500">Cuestionarios pre/post, diarios, participantes</p>
                                                    </div>
                                                </label>
                                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                                                    ${tipoExportacion === 'cuestionarios' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="tipoExportacion"
                                                        value="cuestionarios"
                                                        checked={tipoExportacion === 'cuestionarios'}
                                                        onChange={() => setTipoExportacion('cuestionarios')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Solo cuestionarios</p>
                                                        <p className="text-xs text-gray-500">Respuestas pre y post programa</p>
                                                    </div>
                                                </label>
                                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                                                    ${tipoExportacion === 'diarios' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="tipoExportacion"
                                                        value="diarios"
                                                        checked={tipoExportacion === 'diarios'}
                                                        onChange={() => setTipoExportacion('diarios')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Solo diarios</p>
                                                        <p className="text-xs text-gray-500">Reflexiones de las sesiones</p>
                                                    </div>
                                                </label>
                                                <label className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors
                                                    ${tipoExportacion === 'participantes' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="tipoExportacion"
                                                        value="participantes"
                                                        checked={tipoExportacion === 'participantes'}
                                                        onChange={() => setTipoExportacion('participantes')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-3"
                                                    />
                                                    <div>
                                                        <p className="font-medium text-gray-800">Solo participantes</p>
                                                        <p className="text-xs text-gray-500">Datos demográficos y participación</p>
                                                    </div>
                                                </label>
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-sm font-medium text-gray-700 mb-2">
                                                Formato del archivo
                                            </h3>
                                            <div className="flex flex-wrap gap-3">
                                                <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors
                                                    ${formato === 'csv' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="formato"
                                                        value="csv"
                                                        checked={formato === 'csv'}
                                                        onChange={() => setFormato('csv')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-2"
                                                    />
                                                    <span className="font-medium text-gray-800">CSV</span>
                                                </label>
                                                <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors
                                                    ${formato === 'excel' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="formato"
                                                        value="excel"
                                                        checked={formato === 'excel'}
                                                        onChange={() => setFormato('excel')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-2"
                                                    />
                                                    <span className="font-medium text-gray-800">Excel</span>
                                                </label>
                                                <label className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-colors
                                                    ${formato === 'json' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                                                    <input
                                                        type="radio"
                                                        name="formato"
                                                        value="json"
                                                        checked={formato === 'json'}
                                                        onChange={() => setFormato('json')}
                                                        className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 mr-2"
                                                    />
                                                    <span className="font-medium text-gray-800">JSON</span>
                                                </label>
                                            </div>
                                        </div>

                                        <div className="border-t pt-6 flex justify-between items-center">
                                            <div className="flex items-center text-gray-500 text-sm">
                                                <Database className="h-4 w-4 mr-1" />
                                                <span>Los datos son anónimos por defecto</span>
                                            </div>
                                            <button
                                                onClick={handleExportar}
                                                disabled={exportando}
                                                className={`flex items-center space-x-2 px-6 py-3 rounded-lg text-white font-medium shadow-md 
                                                    ${exportando
                                                        ? 'bg-gray-400 cursor-not-allowed'
                                                        : 'bg-emerald-600 hover:bg-emerald-700 transition-colors'}`}
                                            >
                                                {exportando ? (
                                                    <>
                                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                        <span>Exportando...</span>
                                                    </>
                                                ) : (
                                                    <>
                                                        <DownloadCloud size={20} />
                                                        <span>Exportar datos</span>
                                                    </>
                                                )}
                                            </button>
                                        </div>

                                        {exito && (
                                            <div className="mt-4 bg-green-50 border border-green-200 rounded-lg p-4 flex items-start">
                                                <Check className="h-5 w-5 text-green-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="font-medium text-green-800">Exportación exitosa</p>
                                                    <p className="text-sm text-green-700">
                                                        Los datos han sido exportados correctamente.
                                                        <a href="#" className="underline ml-1">Descargar archivo</a>
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </InvestigadorLayout>
    );
};

export default Exportar; 