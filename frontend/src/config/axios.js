import axios from 'axios'

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor para agregar el token a las solicitudes
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        // Agregar '/' al final si falta (y si no hay parámetros como query strings)
        if (config.url && !config.url.includes('?') && !config.url.endsWith('/')) {
            config.url += '/';
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Interceptor para manejar la renovación automática del token
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Si el error es 401 y no es una solicitud de refresh token
        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.url !== '/auth/token/refresh/') {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refresh');
                if (!refreshToken) {
                    throw new Error('No hay token de actualización disponible');
                }

                // Intentar renovar el token
                const response = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
                    { refresh: refreshToken }
                );

                const { access } = response.data;
                localStorage.setItem('token', access);

                // Actualizar el token en la solicitud original
                originalRequest.headers.Authorization = `Bearer ${access}`;

                // Reintentar la solicitud original
                return api(originalRequest);
            } catch (refreshError) {
                // Si falla la renovación, limpiar el almacenamiento y redirigir al login
                localStorage.removeItem('token');
                localStorage.removeItem('refresh');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;