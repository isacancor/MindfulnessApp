import React, { useState, useEffect } from 'react';
import { DownloadCloud, Check, BookOpen, Database, Loader2, Download } from 'lucide-react';
import api from '../../config/axios';
import InvestigadorLayout from '../../components/layout/InvestigadorLayout';
import ErrorAlert from '../../components/ErrorAlert';
import { exportarCuestionarios, exportarDatosGenerales } from '../../utils/exportUtils';

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

    const handleExportar = async () => {
        if (!programaSeleccionado) return;

        setExportando(true);
        setExito(false);
        setError(null);

        // Validar si hay participantes
        if (!programaSeleccionado.participantes?.length) {
            setError('No hay participantes en este programa para exportar datos.');
            setExportando(false);
            return;
        }

        try {
            if (tipoExportacion === 'cuestionarios') {
                await exportarCuestionarios(programaSeleccionado.id, formato);
            } else {
                await exportarDatosGenerales(programaSeleccionado.id, tipoExportacion, formato);
            }
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
        setError(null);
    };

    if (loading) {
        return (
            <InvestigadorLayout>
                <div className="min-h-screen flex flex-col items-center justify-center">
                    <div className="text-center">
                        <Loader2 className="h-16 w-16 text-purple-300 animate-spin mx-auto mb-6" />
                        <p className="text-lg text-purple-100 font-medium animate-pulse">Cargando programas...</p>
                    </div>
                </div>
            </InvestigadorLayout>
        );
    }

    return (
        <InvestigadorLayout>
            <div className="space-y-8">
                {/* Header principal */}
                <div className="mb-8">
                    <div className="bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 p-[2px] rounded-2xl shadow-xl overflow-hidden backdrop-blur-xl">
                        <div className="bg-white/10 backdrop-blur-xl p-6 md:p-8 rounded-2xl relative overflow-hidden border border-white/10">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -mt-10 -mr-10 z-0 hidden md:block"></div>

                            <div className="relative z-10">
                                <div className="text-white text-center">
                                    <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-emerald-200 bg-clip-text text-transparent">
                                        Exportar Datos
                                    </h1>
                                    <p className="mt-3 text-lg text-emerald-200 max-w-2xl mx-auto">
                                        Descarga los datos de tus programas para análisis externos
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <ErrorAlert
                    message={error}
                    onClose={() => setError(null)}
                />

                {programas.length === 0 ? (
                    <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-cyan-500/20 blur-2xl rounded-3xl"></div>
                        <div className="relative bg-white/10 backdrop-blur-xl rounded-3xl border border-white/10 shadow-lg p-12 text-center">
                            <div className="mx-auto bg-emerald-500/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-6">
                                <BookOpen className="h-8 w-8 text-emerald-300" />
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-4">No hay programas</h3>
                            <p className="text-emerald-200 max-w-md mx-auto">
                                Para exportar datos, necesitas tener programas que hayan sido completados por los participantes.
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-1">
                            <div className="relative">
                                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 blur-xl rounded-2xl"></div>
                                <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                                    <h2 className="text-lg font-semibold text-white mb-4 flex items-center">
                                        <Download className="h-5 w-5 text-emerald-300 mr-2" />
                                        Selecciona un programa
                                    </h2>
                                    <div className="space-y-2">
                                        {programas.map((programa) => (
                                            <button
                                                key={programa.id}
                                                onClick={() => handleSeleccionarPrograma(programa.id)}
                                                className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${programaSeleccionado?.id === programa.id
                                                    ? 'bg-white/20 text-white shadow-lg backdrop-blur-sm border border-white/20'
                                                    : 'text-emerald-200 hover:text-white hover:bg-white/10 hover:backdrop-blur-sm border border-transparent'
                                                    }`}
                                            >
                                                <h3 className="font-medium">
                                                    {programa.nombre}
                                                </h3>
                                                <p className="text-xs opacity-75 mt-1">
                                                    {programa.participantes?.length || 0} participantes
                                                </p>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-2">
                            {!programaSeleccionado ? (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 to-emerald-500/10 blur-xl rounded-2xl"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-12 text-center h-full flex flex-col items-center justify-center border border-white/10 shadow-lg">
                                        <h3 className="text-xl font-medium text-white mb-2">
                                            Selecciona un programa
                                        </h3>
                                        <p className="text-emerald-200">
                                            Elige un programa de la lista para exportar sus datos.
                                        </p>
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-teal-500/10 blur-xl rounded-2xl"></div>
                                    <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-lg">
                                        <div className="mb-6 pb-4 border-b border-white/10">
                                            <h2 className="text-xl font-bold text-white mb-1">
                                                Exportar datos de: {programaSeleccionado.nombre}
                                            </h2>
                                            <p className="text-emerald-200">
                                                Configura las opciones de exportación
                                            </p>
                                        </div>

                                        <div className="space-y-6">
                                            <div>
                                                <h3 className="text-sm font-medium text-white mb-2">
                                                    Selecciona los datos a exportar
                                                </h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${tipoExportacion === 'todos'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="tipoExportacion"
                                                            value="todos"
                                                            checked={tipoExportacion === 'todos'}
                                                            onChange={() => setTipoExportacion('todos')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-3"
                                                        />
                                                        <div>
                                                            <p className="font-medium">Todos los datos</p>
                                                            <p className="text-xs opacity-75">Cuestionarios pre/post, diarios, participantes y progreso</p>
                                                        </div>
                                                    </label>
                                                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${tipoExportacion === 'cuestionarios'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="tipoExportacion"
                                                            value="cuestionarios"
                                                            checked={tipoExportacion === 'cuestionarios'}
                                                            onChange={() => setTipoExportacion('cuestionarios')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-3"
                                                        />
                                                        <div>
                                                            <p className="font-medium">Solo cuestionarios</p>
                                                            <p className="text-xs opacity-75">Respuestas pre y post programa</p>
                                                        </div>
                                                    </label>
                                                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${tipoExportacion === 'diarios'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="tipoExportacion"
                                                            value="diarios"
                                                            checked={tipoExportacion === 'diarios'}
                                                            onChange={() => setTipoExportacion('diarios')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-3"
                                                        />
                                                        <div>
                                                            <p className="font-medium">Solo diarios</p>
                                                            <p className="text-xs opacity-75">Reflexiones de las sesiones</p>
                                                        </div>
                                                    </label>
                                                    <label className={`flex items-center p-3 border rounded-xl cursor-pointer transition-all ${tipoExportacion === 'participantes'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="tipoExportacion"
                                                            value="participantes"
                                                            checked={tipoExportacion === 'participantes'}
                                                            onChange={() => setTipoExportacion('participantes')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-3"
                                                        />
                                                        <div>
                                                            <p className="font-medium">Solo participantes</p>
                                                            <p className="text-xs opacity-75">Datos demográficos, participación y progreso</p>
                                                        </div>
                                                    </label>
                                                </div>
                                            </div>

                                            <div>
                                                <h3 className="text-sm font-medium text-white mb-2">
                                                    Formato del archivo
                                                </h3>
                                                <div className="flex flex-wrap gap-3">
                                                    <label className={`flex items-center px-4 py-2 border rounded-xl cursor-pointer transition-all ${formato === 'csv'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="formato"
                                                            value="csv"
                                                            checked={formato === 'csv'}
                                                            onChange={() => setFormato('csv')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-2"
                                                        />
                                                        <span className="font-medium">CSV</span>
                                                    </label>
                                                    <label className={`flex items-center px-4 py-2 border rounded-xl cursor-pointer transition-all ${formato === 'excel'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="formato"
                                                            value="excel"
                                                            checked={formato === 'excel'}
                                                            onChange={() => setFormato('excel')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-2"
                                                        />
                                                        <span className="font-medium">Excel</span>
                                                    </label>
                                                    <label className={`flex items-center px-4 py-2 border rounded-xl cursor-pointer transition-all ${formato === 'json'
                                                        ? 'border-emerald-400/50 bg-emerald-500/20 text-white'
                                                        : 'border-white/20 hover:bg-white/10 text-emerald-100'
                                                        }`}>
                                                        <input
                                                            type="radio"
                                                            name="formato"
                                                            value="json"
                                                            checked={formato === 'json'}
                                                            onChange={() => setFormato('json')}
                                                            className="h-4 w-4 text-emerald-400 focus:ring-emerald-400 mr-2"
                                                        />
                                                        <span className="font-medium">JSON</span>
                                                    </label>
                                                </div>
                                            </div>

                                            <div className="border-t border-white/10 pt-6 flex justify-between items-center">
                                                <div className="flex items-center text-emerald-200 text-sm">
                                                    <Database className="h-4 w-4 mr-1" />
                                                    <span>Los datos son anónimos por defecto</span>
                                                </div>
                                                <button
                                                    onClick={handleExportar}
                                                    disabled={exportando}
                                                    className={`flex items-center space-x-2 px-6 py-3 rounded-xl text-white font-medium shadow-lg transition-all transform hover:-translate-y-0.5 ${exportando
                                                        ? 'bg-white/20 cursor-not-allowed'
                                                        : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 hover:shadow-xl'
                                                        }`}
                                                >
                                                    {exportando ? (
                                                        <>
                                                            <Loader2 className="h-5 w-5 animate-spin" />
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
                                                <div className="relative">
                                                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-green-500/20 blur-xl rounded-xl"></div>
                                                    <div className="relative bg-emerald-500/20 border border-emerald-400/30 rounded-xl p-4 flex items-start">
                                                        <Check className="h-5 w-5 text-emerald-300 mr-3 mt-0.5" />
                                                        <div>
                                                            <p className="font-medium text-white">Exportación exitosa</p>
                                                            <p className="text-sm text-emerald-200">
                                                                Los datos han sido exportados correctamente.
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
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