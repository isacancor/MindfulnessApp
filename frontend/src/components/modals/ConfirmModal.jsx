import React from 'react';
import { X } from 'lucide-react';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText, cancelText, confirmButtonClass, customWidth, blue = false }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className={`${blue ? 'bg-gradient-to-br from-blue-900 to-sky-900 border-blue-700/50' : 'bg-white'} rounded-xl shadow-xl p-6 border ${customWidth || 'max-w-md'} w-full mx-4`}>
                <div className="flex justify-between items-start mb-4">
                    <h3 className={`text-xl font-semibold ${blue ? 'text-white' : 'text-gray-900'}`}>{title}</h3>
                    <button
                        onClick={onClose}
                        className={`${blue ? 'text-blue-200 hover:text-white' : 'text-gray-400 hover:text-gray-500'} transition-colors`}
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                <div className={`${blue ? 'text-sky-200' : 'text-gray-600'} mb-6`}>
                    {message}
                </div>

                <div className="flex justify-end space-x-4">
                    <button
                        onClick={onClose}
                        className={`px-4 py-2 rounded-lg transition-colors ${blue
                            ? 'text-sky-200 bg-blue-800/50 hover:bg-blue-800'
                            : 'text-gray-700 bg-gray-100 hover:bg-gray-200'
                            }`}
                    >
                        {cancelText || 'Cancelar'}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`px-4 py-2 text-white rounded-lg transition-colors ${confirmButtonClass || 'bg-red-600 hover:bg-red-700'}`}
                    >
                        {confirmText || 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal; 