import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const RegisterParticipante = () => {
    const { register, loading, error } = useAuth();
    const [formData, setFormData] = useState({
        nombre: '',
        apellidos: '',
        email: '',
        password: '',
        fechaNacimiento: '',
        genero: '',
        ocupacion: '',
        nivelEducativo: '',
        experienciaMindfulness: '',
        condicionesSalud: '',
        role: 'participante'
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
        'Ninguna',
        'Menos de 6 meses',
        '6 meses - 1 año',
        '1 - 2 años',
        'Más de 2 años'
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
        try {
            await register(formData);
        } catch (error) {
            console.error('Error en el registro:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Registro de Participante
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        O{' '}
                        <Link to="/register" className="font-medium text-green-600 hover:text-green-500">
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Apellidos"
                                value={formData.apellidos}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <input
                                name="email"
                                type="email"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
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
                                name="ocupacion"
                                type="text"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Ocupación"
                                value={formData.ocupacion}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                        <div>
                            <select
                                name="nivelEducativo"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                value={formData.nivelEducativo}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">Selecciona tu nivel educativo</option>
                                {nivelesEducativos.map((nivel) => (
                                    <option key={nivel} value={nivel.toLowerCase()}>{nivel}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <select
                                name="experienciaMindfulness"
                                required
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                value={formData.experienciaMindfulness}
                                onChange={handleChange}
                                disabled={loading}
                            >
                                <option value="">¿Tienes experiencia previa con mindfulness?</option>
                                {experienciaMindfulnessOptions.map((opcion) => (
                                    <option key={opcion} value={opcion.toLowerCase()}>{opcion}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <textarea
                                name="condicionesSalud"
                                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-green-500 focus:border-green-500 focus:z-10 sm:text-sm"
                                placeholder="Condiciones de salud relevantes (opcional)"
                                value={formData.condicionesSalud}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white ${loading ? 'bg-green-400' : 'bg-green-600 hover:bg-green-700'
                                } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500`}
                        >
                            {loading ? 'Registrando...' : 'Registrarse como Participante'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RegisterParticipante; 