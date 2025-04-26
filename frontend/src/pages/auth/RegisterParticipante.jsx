import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ArrowLeft, Users } from 'lucide-react';

const RegisterParticipante = () => {
    const { register, loading, error } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        username: '',
        password: '',
        fechaNacimiento: '',
        genero: '',
        ocupacion: '',
        nivelEducativo: '',
        experienciaMindfulness: '',
        condicionesSalud: '',
        telefono: '',
        ubicacion: '',
        role: 'PARTICIPANTE'
    });

    const [errorEdad, setErrorEdad] = useState('');

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

    const experienciaMindfulnessOptions = [
        { value: 'ninguna', label: 'Ninguna' },
        { value: 'menos_de_6_meses', label: 'Menos de 6 meses' },
        { value: '6_meses_1_ano', label: '6 meses - 1 año' },
        { value: '1_2_anos', label: '1 - 2 años' },
        { value: 'mas_de_2_anos', label: 'Más de 2 años' }
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
        const { name, value } = e.target;

        if (name === 'fechaNacimiento') {
            if (!validarEdad(value)) {
                setErrorEdad('Debes ser mayor de 18 años para registrarte');
            } else {
                setErrorEdad('');
            }
        }

        setFormData({
            ...formData,
            [name]: value,
        });
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
                        className="absolute top-6 left-6 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm"
                        aria-label="Volver atrás"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>

                    <div className="text-center mt-2">
                        <div className="flex justify-center mb-3">
                            <div className="bg-emerald-50 p-3 rounded-lg">
                                <Users className="h-6 w-6 text-emerald-600" />
                            </div>
                        </div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Registro de Participante
                        </h2>
                        <p className="text-gray-500">
                            Completa tus datos para crear una cuenta de participante
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
                                    placeholder="País o ciudad"
                                    value={formData.ubicacion}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>

                            <div>
                                <label htmlFor="experienciaMindfulness" className="block text-sm font-medium text-gray-700 mb-1">
                                    Experiencia con mindfulness *
                                </label>
                                <select
                                    id="experienciaMindfulness"
                                    name="experienciaMindfulness"
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
                                    value={formData.experienciaMindfulness}
                                    onChange={handleChange}
                                    disabled={loading}
                                >
                                    <option value="">Selecciona una opción</option>
                                    {experienciaMindfulnessOptions.map((opcion) => (
                                        <option key={opcion.value} value={opcion.value}>{opcion.label}</option>
                                    ))}
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
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                    required
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
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
                                <label htmlFor="condicionesSalud" className="block text-sm font-medium text-gray-700 mb-1">
                                    Condiciones de salud relevantes
                                </label>
                                <textarea
                                    id="condicionesSalud"
                                    name="condicionesSalud"
                                    rows="3"
                                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-none transition duration-200"
                                    placeholder="Describe cualquier condición de salud relevante (opcional)"
                                    value={formData.condicionesSalud}
                                    onChange={handleChange}
                                    disabled={loading}
                                />
                            </div>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full py-3 px-4 rounded-lg font-medium text-white shadow-md transition duration-200 ${loading ? 'bg-emerald-400 cursor-not-allowed' : 'bg-emerald-600 hover:bg-emerald-700'}`}
                            >
                                {loading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Registrando...
                                    </span>
                                ) : 'Registrarme como Participante'}
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
                                className="font-medium text-emerald-600 hover:text-emerald-500 transition duration-200"
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

export default RegisterParticipante;