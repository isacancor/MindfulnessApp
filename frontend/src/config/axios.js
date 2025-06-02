import axios from 'axios'
import { useNavigate } from 'react-router-dom';

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


// Manejo de renovación de token automática
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

api.interceptors.response.use(
    response => response,
    async (error) => {
        const originalRequest = error.config;
        const navigate = useNavigate();

        if (error.response?.status === 401 && !originalRequest._retry && originalRequest.headers.Authorization) {
            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refresh');
            if (!refreshToken) {
                localStorage.clear();
                //window.location.replace('/login');
                navigate('/login', { replace: true });
                return Promise.reject(error);
            }

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                }).then((newToken) => {
                    originalRequest.headers.Authorization = 'Bearer ' + newToken;
                    return api(originalRequest);
                }).catch((err) => Promise.reject(err));
            }

            isRefreshing = true;

            try {
                const res = await axios.post(
                    `${import.meta.env.VITE_API_URL}/auth/token/refresh/`,
                    { refresh: refreshToken },
                    { headers: { 'Content-Type': 'application/json' } }
                );

                const newAccess = res.data.access;
                localStorage.setItem('token', newAccess);
                api.defaults.headers.common.Authorization = `Bearer ${newAccess}`;
                processQueue(null, newAccess);

                originalRequest.headers.Authorization = `Bearer ${newAccess}`;
                return api(originalRequest);

            } catch (err) {
                processQueue(err, null);
                localStorage.clear();
                //window.location.replace('/login');
                navigate('/login', { replace: true });
                return Promise.reject(err);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default api;