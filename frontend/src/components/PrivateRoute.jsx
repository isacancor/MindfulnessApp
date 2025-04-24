import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { ROLES } from '@/context/AuthContext';
import LoadingSpinner from '@/components/LoadingSpinner';

const PrivateRoute = ({ roles = [] }) => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // Si se especificaron roles y el usuario no tiene ninguno de ellos
    if (roles.length > 0 && !roles.some(role => hasRole(role))) {
        return <Navigate to="/unauthorized" replace />;
    }

    return <Outlet />;
};

export default PrivateRoute;
