import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X } from 'lucide-react';

const ChangePasswordModal = ({ isOpen, onClose }) => {
    const { changePassword } = useAuth();
    const [formData, setFormData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);

        if (formData.new_password !== formData.confirm_password) {
            setError('Las contraseñas nuevas no coinciden');
            return;
        }

        try {
            const response = await changePassword(formData.old_password, formData.new_password);
            setSuccess(true);
            setFormData({
                old_password: '',
                new_password: '',
                confirm_password: ''
            });

            // Actualizar tokens
            if (response.access && response.refresh) {
                localStorage.setItem('access_token', response.access);
                localStorage.setItem('refresh_token', response.refresh);
            }

            setTimeout(() => {
                onClose();
                setSuccess(false);
            }, 2000);
        } catch (err) {
            setError(err.message || 'Error al cambiar la contraseña');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gradient-to-br from-emerald-800 via-teal-800 to-emerald-900 rounded-2xl p-6 w-full max-w-md relative border border-white/10 shadow-2xl">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-emerald-200 hover:text-white transition-colors duration-200"
                >
                    <X className="h-5 w-5" />
                </button>

                <h2 className="text-xl font-semibold mb-4 text-white">Cambiar Contraseña</h2>

                {error && (
                    <div className="mb-4 p-3 bg-red-500/10 border border-red-400/50 text-red-200 rounded-lg backdrop-blur-sm">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="mb-4 p-3 bg-emerald-500/10 border border-emerald-400/50 text-emerald-200 rounded-lg backdrop-blur-sm">
                        Contraseña actualizada exitosamente
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-emerald-200 mb-1">
                                Contraseña Actual
                            </label>
                            <input
                                type="password"
                                name="old_password"
                                value={formData.old_password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-200 mb-1">
                                Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="new_password"
                                value={formData.new_password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition duration-200"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-emerald-200 mb-1">
                                Confirmar Nueva Contraseña
                            </label>
                            <input
                                type="password"
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-white/10 bg-white/5 text-white placeholder-emerald-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500/50 transition duration-200"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white py-2 px-4 rounded-lg hover:-translate-y-0.5 transition-all duration-200 shadow-lg hover:shadow-emerald-500/25"
                        >
                            Cambiar Contraseña
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ChangePasswordModal; 