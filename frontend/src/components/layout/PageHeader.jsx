import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PageHeader = ({
    title,
    subtitle,
    showBackButton = true,
    backUrl,
    className = '',
    titleClassName = '',
    subtitleClassName = '',
    isInvestigador = false
}) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (backUrl) {
            navigate(backUrl);
        } else {
            navigate(-1);
        }
    };

    return (
        <div className={`relative ${className}`}>
            {showBackButton && (
                <button
                    onClick={handleBack}
                    className="absolute left-4 top-4 md:left-8 md:top-8 p-2 rounded-full transition-all duration-200 text-gray-500 hover:text-emerald-600 border border-gray-300/30 hover:border-emerald-300 bg-white/90 hover:bg-emerald-100 focus:outline-none shadow-sm z-10"
                    aria-label="Volver atrás"
                >
                    <ArrowLeft className="h-5 w-5" />
                </button>
            )}

            <div className={`text-center pt-16 px-4 md:pt-10 ${!isInvestigador ? 'pb-8 md:pb-10' : ''}`}>
                <h1 className={`text-2xl md:text-3xl lg:text-4xl font-extrabold bg-clip-text text-transparent mb-2 ${isInvestigador ? 'bg-gradient-to-r from-blue-600 to-teal-500' : 'bg-gradient-to-r from-indigo-600 to-purple-500'} ${titleClassName}`}>
                    {title}
                </h1>
                {subtitle && (
                    <div className={`text-base md:text-xl text-gray-500 max-w-2xl mx-auto ${subtitleClassName}`}>
                        {subtitle}
                    </div>
                )}
            </div>
        </div>
    );
};

export default PageHeader; 