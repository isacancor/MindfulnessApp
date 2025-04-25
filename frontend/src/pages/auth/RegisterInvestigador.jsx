import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterInvestigador = () => {
    const { register, loading, error } = useAuth();
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
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Registro de Investigador
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        O{' '}
                        <Link to="/register" className="font-medium text-blue-600 hover:text-blue-500">
                            volver a la selección de registro
                        </Link>
                    </p>
                </div>
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                        <span className="block sm:inline">{error}</span>
                    </div>
                )}
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="rounded-md shadow-sm -space-y-px">
                        <div>
                            <input
                                name="nombre"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nombre"
                                value={formData.nombre}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="apellidos"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="username"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Nombre de usuario"
                                value={formData.username}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Correo electrónico"
                                value={formData.email}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="password"
                                type="password"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Contraseña"
                                value={formData.password}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="fechaNacimiento"
                                type="date"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                value={formData.fechaNacimiento}
                                onChange={handleChange}
                                disabled={loading}
                            />
                            {errorEdad && (
                                <p className="mt-1 text-sm text-red-600">{errorEdad}</p>
                            )}
                        </div>
                        <div>
                            <select
                                name="genero"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
                            <input
                                name="telefono"
                                type="tel"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Teléfono (opcional)"
                                value={formData.telefono}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="ocupacion"
                                type="text"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Ocupación (opcional)"
                                value={formData.ocupacion}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <select
                                name="nivelEducativo"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                value={formData.nivelEducativo}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Nivel educativo (opcional)</option>
                                {nivelesEducativos.map((nivel) => (
                                    <option key={nivel} value={nivel.toLowerCase()}>{nivel}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <div className="p-3 border border-gray-300 rounded-md">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Áreas de interés (opcional)
                                </label>
                                <div className="grid grid-cols-2 gap-2">
                                    {areasInteresOptions.map((area) => (
                                        <label key={area} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                name="areasInteres"
                                                value={area}
                                                checked={formData.areasInteres.includes(area)}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                                disabled={loading}
                                            />
                                            <span className="text-sm text-gray-700">{area}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div>
                            <select
                                name="experienciaInvestigacion"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                value={formData.experienciaInvestigacion}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">¿Tienes experiencia previa en investigación? (opcional)</option>
                                <option value="Sí">Sí</option>
                                <option value="No">No</option>
                                <option value="En parte">En parte</option>
                            </select>
                        </div>
                        <div>
                            <input
                                name="ubicacion"
                                type="text"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                                placeholder="Ubicación (país o ciudad, opcional)"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                        >
                            {loading ? 'Registrando...' : 'Registrarse como Investigador'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterInvestigador; 