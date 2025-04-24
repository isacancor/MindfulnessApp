import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const AuthContext = createContext();

// Usuarios de prueba
const MOCK_USERS = [
    {
        id: 1,
        email: 'investigador@test.com',
        password: 'password123',
        nombre: 'Dr. Juan Pérez',
        role: 'investigador',
        institucion: 'Universidad de Ejemplo',
        departamento: 'Psicología',
        especialidad: 'Mindfulness y Reducción de Estrés'
    },
    {
        id: 2,
        email: 'participante@test.com',
        password: 'password123',
        nombre: 'María García',
        role: 'participante',
        fechaNacimiento: '1990-01-01',
        ocupacion: 'Profesional',
        nivelEducativo: 'universidad'
    }
];

// Roles disponibles en la aplicación
export const ROLES = {
    ADMIN: 'admin',
    INVESTIGADOR: 'investigador',
    PARTICIPANTE: 'participante'
};

// Permisos disponibles
export const PERMISSIONS = {
    // Permisos de programas
    VER_PROGRAMAS: 'ver_programas',
    CREAR_PROGRAMA: 'crear_programa',
    EDITAR_PROGRAMA: 'editar_programa',
    ELIMINAR_PROGRAMA: 'eliminar_programa',
    EXPORTAR_PROGRAMA: 'exportar_programa',
    ANALIZAR_PROGRAMA: 'analizar_programa',

    // Permisos de sesiones
    GESTIONAR_SESIONES: 'gestionar_sesiones',
    CREAR_SESION: 'crear_sesion',
    EDITAR_SESION: 'editar_sesion',
    ELIMINAR_SESION: 'eliminar_sesion',
    VER_DETALLE_SESION: 'ver_detalle_sesion',
    REALIZAR_SESION: 'realizar_sesion',

    // Permisos de cuestionarios
    GESTIONAR_CUESTIONARIOS: 'gestionar_cuestionarios',
    CREAR_CUESTIONARIO: 'crear_cuestionario',
    EDITAR_CUESTIONARIO: 'editar_cuestionario',
    ELIMINAR_CUESTIONARIO: 'eliminar_cuestionario',
    VER_DETALLE_CUESTIONARIO: 'ver_detalle_cuestionario',
    REALIZAR_CUESTIONARIO: 'realizar_cuestionario',

    // Permisos de participantes
    GESTIONAR_PARTICIPANTES: 'gestionar_participantes',

    // Permisos de perfil
    EDITAR_PERFIL: 'editar_perfil',
    ELIMINAR_PERFIL: 'eliminar_perfil',

    // Permisos específicos de participante
    VER_PROGRAMAS_ACTIVOS: 'ver_programas_activos',
    VER_PROGRESO: 'ver_progreso',
    VER_NOTIFICACIONES: 'ver_notificaciones',
    INSCRIBIRSE_PROGRAMA: 'inscribirse_programa',
    DESAPUNTARSE_PROGRAMA: 'desapuntarse_programa'
};

// Mapeo de roles a permisos
const ROLE_PERMISSIONS = {
    [ROLES.INVESTIGADOR]: [
        PERMISSIONS.VER_PROGRAMAS,
        PERMISSIONS.CREAR_PROGRAMA,
        PERMISSIONS.EDITAR_PROGRAMA,
        PERMISSIONS.ELIMINAR_PROGRAMA,
        PERMISSIONS.EXPORTAR_PROGRAMA,
        PERMISSIONS.ANALIZAR_PROGRAMA,
        PERMISSIONS.GESTIONAR_SESIONES,
        PERMISSIONS.CREAR_SESION,
        PERMISSIONS.EDITAR_SESION,
        PERMISSIONS.ELIMINAR_SESION,
        PERMISSIONS.VER_DETALLE_SESION,
        PERMISSIONS.GESTIONAR_CUESTIONARIOS,
        PERMISSIONS.CREAR_CUESTIONARIO,
        PERMISSIONS.EDITAR_CUESTIONARIO,
        PERMISSIONS.ELIMINAR_CUESTIONARIO,
        PERMISSIONS.VER_DETALLE_CUESTIONARIO,
        PERMISSIONS.GESTIONAR_PARTICIPANTES,
        PERMISSIONS.EDITAR_PERFIL,
        PERMISSIONS.ELIMINAR_PERFIL
    ],
    [ROLES.PARTICIPANTE]: [
        PERMISSIONS.VER_PROGRAMAS_ACTIVOS,
        PERMISSIONS.VER_PROGRESO,
        PERMISSIONS.VER_NOTIFICACIONES,
        PERMISSIONS.INSCRIBIRSE_PROGRAMA,
        PERMISSIONS.DESAPUNTARSE_PROGRAMA,
        PERMISSIONS.REALIZAR_SESION,
        PERMISSIONS.REALIZAR_CUESTIONARIO,
        PERMISSIONS.EDITAR_PERFIL,
        PERMISSIONS.ELIMINAR_PERFIL
    ],
    [ROLES.ADMIN]: Object.values(PERMISSIONS) // El admin tiene todos los permisos
};

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

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

    // Cargar el estado de autenticación al iniciar
    useEffect(() => {
        const loadUser = () => {
            try {
                const savedUser = localStorage.getItem('user');
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (err) {
                console.error('Error al cargar el usuario:', err);
                localStorage.removeItem('user');
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

            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));

            const user = MOCK_USERS.find(u =>
                u.email === credentials.email && u.password === credentials.password
            );

            if (!user) {
                throw new Error('Credenciales inválidas');
            }

            // Eliminar la contraseña antes de guardar el usuario
            const { password, ...userWithoutPassword } = user;

            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);

            // Redirigir según el rol
            if (user.role === ROLES.INVESTIGADOR) {
                navigate('/dashboard');
            } else if (user.role === ROLES.PARTICIPANTE) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función de registro
    const register = async (userData) => {
        try {
            setLoading(true);
            setError(null);

            // Simular delay de red
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Verificar si el email ya existe
            if (MOCK_USERS.some(u => u.email === userData.email)) {
                throw new Error('El email ya está registrado');
            }

            // Crear nuevo usuario
            const newUser = {
                id: MOCK_USERS.length + 1,
                ...userData,
                // Asegurarse de que el rol sea válido
                role: userData.role || ROLES.PARTICIPANTE
            };

            // En un caso real, aquí se enviaría al backend
            // Para la demo, solo simulamos el registro exitoso
            const { password, ...userWithoutPassword } = newUser;

            localStorage.setItem('user', JSON.stringify(userWithoutPassword));
            setUser(userWithoutPassword);

            // Redirigir según el rol
            if (newUser.role === ROLES.INVESTIGADOR) {
                navigate('/dashboard');
            } else if (newUser.role === ROLES.PARTICIPANTE) {
                navigate('/dashboard');
            }
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Función de logout
    const logout = () => {
        localStorage.removeItem('user');
        setUser(null);
        navigate('/');
    };

    // Función para actualizar el perfil del usuario
    const updateProfile = async (profileData) => {
        try {
            setLoading(true);
            setError(null);
            const response = await axios.put('/api/auth/profile', profileData, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setUser(response.data);
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
            await axios.put('/api/auth/password', passwordData, {
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
        hasRole
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
