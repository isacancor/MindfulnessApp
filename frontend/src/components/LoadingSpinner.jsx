import { Loader2 } from 'lucide-react';

const LoadingSpinner = () => {
    return (
        <div className="fixed inset-0 flex items-center justify-center bg-white bg-opacity-75 z-50">
            <div className="flex flex-col items-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                <p className="mt-2 text-sm text-gray-600">Cargando...</p>
            </div>
        </div>
    );
};

export default LoadingSpinner; 