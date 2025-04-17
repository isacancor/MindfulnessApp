import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const PrivateRoute = () => {
    const { user } = useAuth();

    if (!user) {
        // Si el usuario no está autenticado, redirigimos al login
        return <Navigate to="/register" replace />;
    }

    return <Outlet />;  // Si está autenticado, renderizamos el contenido de la ruta
};

export default PrivateRoute;
