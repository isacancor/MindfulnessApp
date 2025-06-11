import { useEffect } from 'react';
import { CheckCircle, ArrowRight, Leaf, BrainCircuit, Database, GitFork, Users, Settings2, Heart, BookOpen, LineChart, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import Footer from '../components/layout/Footer';

export default function Landing() {
    useEffect(() => {
        document.title = "Mindfluence Research | Plataforma de Investigación en Mindfulness";
    }, []);

    const features = [
        {
            title: "Programas Personalizados",
            text: "Diseña programas de mindfulness adaptados a tu investigación",
            icon: <Settings2 className="text-indigo-600" size={24} />,
            description: "Configura sesiones, duración y contenido según tus objetivos"
        },
        {
            title: "Evaluación Integral",
            text: "Seguimiento detallado del progreso",
            icon: <BrainCircuit className="text-emerald-500" size={24} />,
            description: "Cuestionarios pre/post y evaluaciones durante el programa"
        },
        {
            title: "Análisis de Datos",
            text: "Datos estructurados listos para analizar",
            icon: <Database className="text-blue-500" size={24} />,
            description: "Exportación compatible con herramientas estadísticas"
        },
        {
            title: "Múltiples Metodologías",
            text: "Flexibilidad en enfoques de mindfulness",
            icon: <Leaf className="text-amber-500" size={24} />,
            description: "Implementa MBSR, MBCT, MSC y otros protocolos"
        },
        {
            title: "Diseño Multiplataforma y Adaptado",
            text: "Accesible desde cualquier dispositivo",
            icon: <LineChart className="text-purple-500" size={24} />,
            description: "Experiencia optimizada para móvil y escritorio"
        },
        {
            title: "Código Abierto",
            text: "Proyecto transparente y colaborativo",
            icon: <GitFork className="text-slate-700" size={24} />,
            description: "Contribuye y mejora la plataforma en GitHub"
        }
    ];

    const beneficios = [
        {
            title: "Investigadores",
            icon: <BookOpen className="h-8 w-8 text-indigo-600" />,
            items: [
                "Diseño flexible de programas de investigación",
                "Recopilación automática de datos",
                "Seguimiento en tiempo real de participantes",
                "Herramientas de análisis integradas",
                "Exportación de datos para publicaciones"
            ]
        },
        {
            title: "Participantes",
            icon: <Heart className="h-8 w-8 text-emerald-500" />,
            items: [
                "Acceso sencillo desde cualquier dispositivo",
                "Programas estructurados y guiados",
                "Seguimiento de tu progreso personal",
                "Contenido de mindfulness de calidad",
                "Participación en investigación científica"
            ]
        }
    ];

    return (
        <div className="bg-slate-50 text-slate-800 font-sans antialiased">
            {/* Hero Section */}
            <section className="min-h-screen flex flex-col justify-center items-center px-6 text-center bg-gradient-to-br from-indigo-600 to-indigo-800 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="mb-4 flex justify-center">
                        <span className="bg-indigo-500/30 text-emerald-300 px-4 py-1.5 rounded-full text-sm font-medium">
                            Investigación en Mindfulness
                        </span>
                    </div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                        Mindfluence <span className="text-emerald-300">Research</span>
                    </h1>
                    <p className="text-lg md:text-xl text-indigo-100 max-w-3xl mx-auto mb-8">
                        Plataforma diseñada para facilitar la investigación científica en mindfulness,
                        conectando investigadores y participantes en un entorno digital eficiente.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/login"
                            className="flex items-center justify-center gap-2 bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:shadow-lg"
                        >
                            Comenzar ahora <ArrowRight size={18} />
                        </Link>
                        <Link
                            to="/about"
                            className="flex items-center justify-center gap-2 bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-medium hover:bg-white/10 transition-all"
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
                        <span className="text-indigo-600 font-semibold mb-2 block">Características</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                            Herramientas para <span className="text-indigo-600">Investigación</span>
                        </h2>
                        <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                            Una plataforma diseñada para facilitar la investigación en mindfulness
                            con herramientas específicas para cada necesidad.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="flex flex-col p-6 bg-slate-50 rounded-xl border border-slate-200 hover:border-indigo-300 transition-all hover:shadow-md group"
                            >
                                <div className="mb-4 p-3 bg-white rounded-lg w-fit shadow-sm group-hover:shadow-md transition-all">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold mb-2 text-slate-800">{feature.title}</h3>
                                <p className="text-slate-700 mb-2">{feature.text}</p>
                                <p className="text-sm text-slate-600">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20 px-6 bg-slate-100">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <span className="text-emerald-600 font-semibold mb-2 block">Beneficios</span>
                        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-800">
                            Para cada tipo de <span className="text-emerald-600">usuario</span>
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-2 gap-12">
                        {beneficios.map((beneficio, index) => (
                            <div key={index} className="bg-white p-8 rounded-xl shadow-sm">
                                <div className="flex items-center mb-6">
                                    <div className="p-3 bg-slate-100 rounded-lg mr-4">
                                        {beneficio.icon}
                                    </div>
                                    <h3 className="text-2xl font-bold text-slate-800">{beneficio.title}</h3>
                                </div>
                                <ul className="space-y-4">
                                    {beneficio.items.map((item, i) => (
                                        <li key={i} className="flex items-start">
                                            <CheckCircle className="h-5 w-5 text-emerald-500 mr-3 mt-0.5" />
                                            <span className="text-slate-700">{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="max-w-4xl mx-auto text-center relative z-10">
                    <h3 className="text-3xl md:text-4xl font-bold mb-6">
                        Forma parte de la investigación
                    </h3>
                    <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
                        Contribuye al avance del conocimiento científico en mindfulness
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            to="/register/investigador"
                            className="bg-white text-indigo-600 px-8 py-4 rounded-lg font-semibold hover:bg-indigo-50 transition-all hover:shadow-lg"
                        >
                            Registrarse como Investigador
                        </Link>
                        <Link
                            to="/register/participante"
                            className="bg-transparent border-2 border-white text-white px-8 py-4 rounded-lg font-semibold hover:bg-white/10 transition-all"
                        >
                            Unirse como Participante
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <Footer />
        </div>
    );
}