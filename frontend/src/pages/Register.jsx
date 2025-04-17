import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Lock, Calendar, Venus, Mars, BookOpen, AlertCircle, Transgender, GraduationCap } from 'lucide-react';

export default function Register() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        gender: '',
        age: '',
        occupation: '',
        academicLevel: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validación básica
        if (!Object.values(formData).every(field => field.trim() !== '')) {
            setError('Todos los campos son obligatorios');
            return;
        }

        // Simular registro (reemplazar con API de Django)
        try {
            // await authService.register(formData);
            navigate('/dashboard');
        } catch (err) {
            setError('Error al registrar. Intenta nuevamente.');
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-xl shadow-md p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-slate-800">Registro</h2>
                    <p className="text-slate-600 mt-2">
                        Crea tu cuenta para comenzar tu investigación
                    </p>
                </div>

                {error && (
                    <div className="flex items-center gap-2 bg-red-50 text-red-600 p-3 rounded-lg mb-4">
                        <AlertCircle size={18} />
                        <span>{error}</span>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Nombre */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nombre completo
                        </label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ej: María González"
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Correo electrónico
                        </label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="tu@email.com"
                            />
                        </div>
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Contraseña
                        </label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    {/* Género */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Género
                        </label>
                        <div className="relative">
                            <Transgender className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="female">
                                    <Venus className="inline mr-2" size={14} /> Mujer
                                </option>
                                <option value="male">
                                    <Mars className="inline mr-2" size={14} /> Hombre
                                </option>
                                <option value="non-binary">
                                    <span className="inline-flex items-center">
                                        <Venus className="mr-1" size={14} />
                                        <Mars className="mr-2" size={14} /> No binario
                                    </span>
                                </option>
                                <option value="other">Otro/Prefiero no decir</option>
                            </select>
                        </div>
                    </div>

                    {/* Edad */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Edad
                        </label>
                        <div className="relative">
                            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="number"
                                name="age"
                                min="18"
                                max="100"
                                value={formData.age}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ej: 32"
                            />
                        </div>
                    </div>

                    {/* Ocupación */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Ocupación
                        </label>
                        <div className="relative">
                            <BookOpen className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                name="occupation"
                                value={formData.occupation}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                placeholder="Ej: Psicólogo, Investigador, Estudiante..."
                            />
                        </div>
                    </div>

                    {/* Nivel académico */}
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            Nivel académico
                        </label>

                        <div className="relative">
                            <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" size={18} />
                            <select
                                name="academicLevel"
                                value={formData.academicLevel}
                                onChange={handleChange}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent appearance-none"
                            >
                                <option value="">Selecciona una opción</option>
                                <option value="undergraduate">Pregrado</option>
                                <option value="graduate">Posgrado</option>
                                <option value="phd">Doctorado</option>
                                <option value="professional">Profesional</option>
                                <option value="other">Otro</option>
                            </select>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition-colors flex items-center justify-center gap-2 mt-6"
                    >
                        <User size={18} />
                        Registrarme
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-600">
                    ¿Ya tienes cuenta?{' '}
                    <Link to="/login" className="text-indigo-600 hover:underline font-medium">
                        Inicia sesión aquí
                    </Link>
                </div>
            </div>
        </div>
    );
}