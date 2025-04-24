import { useAuth } from '@/context/AuthContext';
import PerfilInvestigador from '../components/PerfilInvestigador';
import PerfilParticipante from '../components/PerfilParticipante';
import LoadingSpinner from '../components/LoadingSpinner';

const Perfil = () => {
    const { user, loading, hasRole } = useAuth();

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {hasRole('INVESTIGADOR') ? (
                    <PerfilInvestigador />
                ) : (
                    <PerfilParticipante />
                )}
            </div>
        </div>
    );
};

export default Perfil; 