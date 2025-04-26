import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, BookOpen } from 'lucide-react';

const RegisterInvestigador = () => {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        username: '',
        email: '',
        password: '',
        fechaNacimiento: '',
        genero: '',
        telefono: '',
        ocupacion: '',
        nivelEducativo: '',
        areasInteres: [],
        experienciaInvestigacion: '',
        ubicacion: '',
        role: 'INVESTIGADOR'
    });

    const [errorEdad, setErrorEdad] = useState('');

    const areasInteresOptions = [
        'Mindfulness',
        'Neurociencia',
        'Psicología',
        'Educación',
        'Tecnología',
        'Meditación',
        'Bienestar'
    ];

    const nivelesEducativos = [
        'Sin Estudios',
        'Primaria',
        'Secundaria',
        'Bachillerato',
        'Formación Profesional',
        'Universidad',
        'Master',
        'Doctorado',
        'Otros'
    ];

    const validarEdad = (fechaNacimiento) => {
        const hoy = new Date();
        const fechaNac = new Date(fechaNacimiento);
        let edad = hoy.getFullYear() - fechaNac.getFullYear();
        const mes = hoy.getMonth() - fechaNac.getMonth();

        if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
            edad--;
        }

        return edad >= 18;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === 'fechaNacimiento') {
            if (!validarEdad(value)) {
                setErrorEdad('Debes ser mayor de 18 años para registrarte');
            } else {
                setErrorEdad('');
            }
        }

        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                areasInteres: checked
                    ? [...prev.areasInteres, value]
                    : prev.areasInteres.filter(area => area !== value)
            }));
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (errorEdad) {
            return;
        }
        await register(formData);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-2xl">
                <div className="bg-white p-8 rounded-2xl shadow-xl relative">
                    <button
                        onClick={() => navigate(-1)}
                        className="absolute top-6 left-6 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-indigo-600 border border-gray-300/30 hover:border-indigo-300 bg-white/90 hover:bg-indigo-100 focus:outline-none shadow-sm"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center mt-2">
                        <div className="flex justify-center mb-3">
                            <div className="bg-indigo-50 p-3 rounded-lg">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Registro de Investigador
                        </h2>
                        <p className="text-gray-500">
                            Completa tus datos para crear una cuenta de investigador
                        </p>
                    </div>

                    {error && (
                        <div className="mt-6 bg-red-50 border-l-4 border-red-500 p-4 rounded" role="alert">
                            <p className="text-red-700">{error}</p>
                        </div>
                    )}

                    <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre *
                                </label>
                                <input
                                    id="nombre"
                                    name="nombre"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu nombre"
                                    value={formData.nombre}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="apellidos" className="block text-sm font-medium text-gray-700 mb-1">
                                    Apellidos *
                                </label>
                                <input
                                    id="apellidos"
                                    name="apellidos"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tus apellidos"
                                    value={formData.apellidos}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nombre de usuario *
                                </label>
                                <input
                                    id="username"
                                    name="username"
                                    type="text"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu nombre de usuario"
                                    value={formData.username}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                                    Contraseña *
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu contraseña"
                                    value={formData.password}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Correo electrónico *
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu correo electrónico"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="telefono" className="block text-sm font-medium text-gray-700 mb-1">
                                    Teléfono *
                                </label>
                                <input
                                    id="telefono"
                                    name="telefono"
                                    type="tel"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu teléfono"
                                    value={formData.telefono}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="genero" className="block text-sm font-medium text-gray-700 mb-1">
                                    Género *
                                </label>
                                <select
                                    id="genero"
                                    name="genero"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.genero}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona tu género</option>
                                    <option value="masculino">Masculino</option>
                                    <option value="femenino">Femenino</option>
                                    <option value="otro">Otro</option>
                                    <option value="prefiero_no_decir">Prefiero no decir</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="fechaNacimiento" className="block text-sm font-medium text-gray-700 mb-1">
                                    Fecha de nacimiento *
                                </label>
                                <input
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    type="date"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.fechaNacimiento}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                                {errorEdad && (
                                    <p className="mt-1 text-sm text-red-600">{errorEdad}</p>
                                )}
                            </div>

                            <div>
                                <label htmlFor="ubicacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ubicación *
                                </label>
                                <input
                                    id="ubicacion"
                                    name="ubicacion"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="País o ciudad"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="experienciaInvestigacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Experiencia en investigación *
                                </label>
                                <select
                                    id="experienciaInvestigacion"
                                    name="experienciaInvestigacion"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.experienciaInvestigacion}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona una opción</option>
                                    <option value="Sí">Sí</option>
                                    <option value="No">No</option>
                                    <option value="En parte">En parte</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="ocupacion" className="block text-sm font-medium text-gray-700 mb-1">
                                    Ocupación *
                                </label>
                                <input
                                    id="ocupacion"
                                    name="ocupacion"
                                    type="text"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    placeholder="Tu ocupación"
                                    value={formData.ocupacion}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="nivelEducativo" className="block text-sm font-medium text-gray-700 mb-1">
                                    Nivel educativo *
                                </label>
                                <select
                                    id="nivelEducativo"
                                    name="nivelEducativo"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition duration-200"
                                    value={formData.nivelEducativo}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona tu nivel educativo</option>
                                    {nivelesEducativos.map((nivel) => (
                                        <option key={nivel} value={nivel.toLowerCase().replace(/\s+/g, '_')}>{nivel}</option>
                                    ))}
                                </select>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Áreas de interés
                                </label>
                                <div className="p-4 border border-gray-300 rounded-lg">
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {areasInteresOptions.map((area) => (
                                            <label key={area} className="flex items-center space-x-2">
                                                <input
                                                    type="checkbox"
                                                    name="areasInteres"
                                                    value={area}
                                                    checked={formData.areasInteres.includes(area)}
                                                    onChange={handleChange}
                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                                    disabled={loading}
                                                />
                                                <span className="text-sm text-gray-700">{area}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition duration-200 ${loading ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </span>
                                ) : 'Registrarme como Investigador'}
                            </button>
                        </div>
                    </form>

                    <div className="mt-6">
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">
                                    ¿Ya tienes una cuenta?
                                </span>
                            </div>
                        </div>

                        <div className="mt-4 text-center">
                            <Link
                                to="/login"
                                className="font-medium text-indigo-600 hover:text-indigo-500 transition duration-200"
                            >
                                Inicia sesión aquí
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterInvestigador;