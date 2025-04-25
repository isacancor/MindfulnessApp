import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../config/axios';
import { ROLES, PERMISSIONS, ROLE_PERMISSIONS } from '../config/auth';
import { mapUserData } from '../utils/userMapper';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const resetError = () => setError(null);

    // Verificar si el usuario tiene un permiso específico
    const hasPermission = (permission) => {
        if (!user) return false;
        return ROLE_PERMISSIONS[user.role]?.includes(permission) || false;
    };

    // Verificar si el usuario tiene un rol específico
    const hasRole = (role) => {
        if (!user) return false;
        return user.role === role;
    };

    useEffect(() => {
        setError(null); // Limpia el error cada vez que cambia la ruta
    }, [location.pathname]);

    // Cargar el estado de autenticación al iniciar
    useEffect(() => {
        const loadUser = async () => {
            try {
                setLoading(true);
                const token = localStorage.getItem('token');
                if (!token) {
                    setLoading(false);
                    return;
                }

                const response = await api.get('/auth/me');
                setUser(mapUserData(response.data));
            } catch (err) {
                localStorage.removeItem('token');
                setError(err.response?.data?.message || 'Error al cargar el usuario');
            } finally {
                setLoading(false);
            }
        };

        loadUser();
    }, []);

    // Función de login
    const login = async (credentials) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/auth/login', credentials);

            // TODO: Add token
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(mapUserData(user));
            setError(null);

            // Redirigir
            if (user.role === ROLES.INVESTIGADOR) {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.error("Error en el login: ", err);
            setError(err.response?.data?.message || 'Error al iniciar sesión');
        } finally {
            setLoading(false);
        }
    };

    // Función de registro
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.post('/auth/register', userData);
            const { token, user } = response.data;

            localStorage.setItem('token', token);
            setUser(mapUserData(user));
            setError(null);

            // Redirigir
            if (user.role === ROLES.INVESTIGADOR) {
                navigate('/dashboard');
            } else {
                navigate('/home');
            }
        } catch (err) {
            console.error('Error en el registro:', error);
            setError(err.response?.data?.message || 'Error al registrarse');
        } finally {
            setLoading(false);
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setUser(null);
        navigate('/');
    };

    // Función para actualizar el perfil del usuario
    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await api.put('/auth/profile', profileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(mapUserData(response.data));
        } catch (err) {
            setError(err.response?.data?.message || 'Error al actualizar perfil');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función para cambiar la contraseña
    const changePassword = async (passwordData) => {
        try {
            setLoading(true);
            setError(null);
            await api.put('/auth/password', passwordData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
        } catch (err) {
            setError(err.response?.data?.message || 'Error al cambiar contraseña');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        changePassword,
        hasPermission,
        hasRole,
        resetError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
