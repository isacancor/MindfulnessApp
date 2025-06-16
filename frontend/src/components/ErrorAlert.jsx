import React from 'react';

const ErrorAlert = ({ message, onClose }) => {
    if (!message) return null;

    return (
        <div className="mt-6 mb-6 bg-red-500/10 border-l-4 border-red-400/50 p-4 rounded-lg backdrop-blur-sm" role="alert">
            <div className="flex justify-between items-center">
                <p className="text-red-200">{message}</p>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="text-red-200 hover:text-white focus:outline-none transition-colors duration-200"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

ErrorAlert.defaultProps = {
    message: '',
    onClose: null,
};

export default ErrorAlert; 