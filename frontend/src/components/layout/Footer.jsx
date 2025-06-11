import { Link } from "react-router-dom";

export default function Footer() {

    return (
        <footer className="bg-slate-900 text-slate-400 py-12 px-6">
            <div className="max-w-6xl mx-auto">
                <div className="grid md:grid-cols-3 gap-8">
                    <div>
                        <h4 className="text-white font-semibold mb-4">Mindfluence Research</h4>
                        <p className="text-sm">
                            Plataforma de código abierto para la investigación científica en mindfulness.
                        </p>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Contacto</h4>
                        <ul className="space-y-2 text-sm">
                            <li>Email: mindfluenceresearch@gmail.com</li>
                            <li>Universidad de Sevilla</li>
                            <li>Sevilla, España</li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-semibold mb-4">Enlaces</h4>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a href="https://github.com/isacancor/MindfulnessApp" target="_blank" rel="noopener noreferrer"
                                    className="hover:text-white transition-colors">
                                    Repositorio en GitHub
                                </a>
                            </li>
                            <li>
                                <Link to="/about" className="hover:text-white transition-colors">
                                    Acerca de
                                </Link>
                            </li>
                            <li>
                                <Link to="/terminos-servicio" className="hover:text-white transition-colors">
                                    Términos y Condiciones
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>
                <div className="border-t border-slate-800 mt-8 pt-8 text-center text-sm">
                    <p>&copy; {new Date().getFullYear()} Mindfluence Research. Todos los derechos reservados.</p>
                </div>
            </div>
        </footer>
    )
}
