import { useEffect } from 'react';
import { CheckCircle, ArrowRight, Leaf, BrainCircuit, Database, GitFork, Users, Settings2 } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Landing() {
    useEffect(() => {
        document.title = "Mindfulness Research Tool | Plataforma de Investigación";
    }, []);

    // Array de features con iconos asociados
    const features = [
        {
            text: "Configura programas personalizados de mindfulness",
            icon: <Settings2 className="text-indigo-600" size={24} />
        },
        {
            text: "Evalúa participantes antes, durante y después",
            icon: <BrainCircuit className="text-emerald-500" size={24} />
        },
        {
            text: "Exporta datos para análisis científico",
            icon: <Database className="text-blue-500" size={24} />
        },
        {
            text: "Apoya múltiples modelos (MBSR, MBCT, ACT, etc)",
            icon: <Leaf className="text-amber-500" size={24} />
        },
        {
            text: "Compatible con app móvil para participantes",
            icon: <Users className="text-purple-500" size={24} />
        },
        {
            text: "Código abierto y colaborativo en GitHub",
            icon: <GitFork className="text-slate-700" size={24} />
        }
    ];

    return (
        <div className="bg-slate-50 text-slate-800 font-sans antialiased">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white">
                <div className="max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Investigación de Mindfulness <span className="text-emerald-300">Basada en Evidencia</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                        Plataforma integral para diseñar estudios científicos sobre mindfulness en entornos académicos y laborales.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/dashboard"
                            className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:shadow-lg"
                        >
                            Acceder al Dashboard <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/about"
                            className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-all"
                        >
                            Conoce más
                        </Link>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                            Herramientas para <span className="text-indigo-600">Investigación Rigurosa</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Diseñada por y para investigadores que necesitan datos confiables y metodologías flexibles.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md"
                            >
                                <div className="mb-4 p-3 bg-white rounded-lg w-fit shadow-sm">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.text}</h3>
                                <p className="text-slate-600">Personalizable para adaptarse a tus protocolos de investigación específicos.</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials/Use Cases */}
            <section className="py-16 px-6 bg-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-2xl md:text-3xl font-bold mb-8 text-slate-800">
                        Utilizado por investigadores en:
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            "Universidades",
                            "Hospitales",
                            "Empresas",
                            "Centros de investigación"
                        ].map((item, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow-sm">
                                <p className="font-medium text-indigo-600">{item}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">
                        ¿Listo para comenzar tu estudio?
                    </h3>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Regístrate ahora y obtén acceso completo a la plataforma.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register"
                            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:shadow-lg"
                        >
                            Crear cuenta gratuita
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}