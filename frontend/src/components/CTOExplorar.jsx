import { Search, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const CTOExplorar = ({
    titulo = "No hay programas activos",
    descripcion = "Explora nuestra colección de programas de mindfulness y comienza tu viaje hacia el bienestar.",
    buttonText = "Explorar Programas",
    className = ""
}) => {
    return (
        <div className={`max-w-2xl mx-auto ${className}`}>
            <div className="bg-white rounded-2xl shadow-xl border border-indigo-100 p-6 md:p-8">
                <div className="flex flex-col items-center text-center">
                    {/* Ícono decorativo */}
                    <div className="w-16 h-16 md:w-20 md:h-20 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <Search className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
                    </div>

                    {/* Contenido */}
                    <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">
                        {titulo}
                    </h2>
                    <p className="text-gray-600 mb-8 max-w-md">
                        {descripcion}
                    </p>

                    {/* Botón CTA */}
                    <Link
                        to="/explorar"
                        className="group inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                    >
                        <span className="flex items-center">
                            {buttonText}
                            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                    </Link>
                </div>
            </div>
        </div>
    );
};


export default CTOExplorar; 