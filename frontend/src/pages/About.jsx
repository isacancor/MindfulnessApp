import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BookOpen, Heart, Shield, Users, GitFork, LineChart, BrainCircuit } from 'lucide-react';

const About = () => {
    return (
        <div className="bg-slate-50 min-h-screen">
            {/* Hero Section */}
            <section className="bg-gradient-to-br from-indigo-600 to-indigo-800 text-white py-20 px-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10"></div>
                <div className="max-w-6xl mx-auto relative z-10">
                    <Link
                        to="/"
                        className="inline-flex items-center text-indigo-100 hover:text-white mb-8"
                    >
                        <ArrowLeft className="h-5 w-5 mr-2" />
                        Volver al Inicio
                    </Link>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Acerca de Mindfluence Research
                    </h1>
                    <p className="text-xl text-indigo-100 max-w-3xl">
                        Una plataforma innovadora diseñada para facilitar la investigación científica
                        en mindfulness y meditación, conectando investigadores y participantes en un
                        entorno digital seguro y eficiente.
                    </p>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-20 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold text-slate-800 mb-6">
                                Objetivo del Proyecto
                            </h2>
                            <p className="text-lg text-slate-600 mb-6">
                                Facilitar la investigación científica en mindfulness proporcionando herramientas
                                digitales que permitan:
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <BrainCircuit className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                                    <span className="text-slate-700">
                                        Diseñar y ejecutar estudios científicos rigurosos
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <Users className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                                    <span className="text-slate-700">
                                        Conectar investigadores con participantes interesados
                                    </span>
                                </li>
                                <li className="flex items-start">
                                    <LineChart className="h-6 w-6 text-indigo-600 mr-3 mt-1" />
                                    <span className="text-slate-700">
                                        Recopilar y analizar datos de manera eficiente
                                    </span>
                                </li>
                            </ul>
                        </div>
                        <div className="bg-white p-8 rounded-xl shadow-sm">
                            <h3 className="text-xl font-semibold text-slate-800 mb-4">
                                Alcance del Proyecto
                            </h3>
                            <div className="grid grid-cols-2 gap-6">
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-3xl font-bold text-indigo-600">20+</p>
                                    <p className="text-sm text-slate-600">Investigadores</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-3xl font-bold text-emerald-600">500+</p>
                                    <p className="text-sm text-slate-600">Participantes</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-3xl font-bold text-blue-600">30+</p>
                                    <p className="text-sm text-slate-600">Programas</p>
                                </div>
                                <div className="text-center p-4 bg-slate-50 rounded-lg">
                                    <p className="text-3xl font-bold text-amber-600">10+</p>
                                    <p className="text-sm text-slate-600">Instituciones</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl font-bold text-slate-800 mb-12 text-center">
                        Principios del Proyecto
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <div className="p-3 bg-indigo-100 rounded-lg w-fit mb-4">
                                <BookOpen className="h-6 w-6 text-indigo-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                Rigor Científico
                            </h3>
                            <p className="text-slate-600">
                                Compromiso con la excelencia en la investigación y la metodología científica.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <div className="p-3 bg-emerald-100 rounded-lg w-fit mb-4">
                                <Heart className="h-6 w-6 text-emerald-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                Bienestar
                            </h3>
                            <p className="text-slate-600">
                                Promoción del bienestar psicológico y la salud mental a través de la práctica mindfulness.
                            </p>
                        </div>
                        <div className="p-6 bg-slate-50 rounded-xl">
                            <div className="p-3 bg-blue-100 rounded-lg w-fit mb-4">
                                <Shield className="h-6 w-6 text-blue-600" />
                            </div>
                            <h3 className="text-xl font-semibold text-slate-800 mb-3">
                                Privacidad y Seguridad
                            </h3>
                            <p className="text-slate-600">
                                Protección de datos y confidencialidad como prioridad en todas las operaciones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Open Source Section */}
            <section className="py-20 px-6 bg-gradient-to-r from-slate-800 to-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="flex justify-center mb-6">
                        <GitFork className="h-12 w-12" />
                    </div>
                    <h2 className="text-3xl font-bold mb-6">
                        Proyecto de Código Abierto
                    </h2>
                    <p className="text-lg text-slate-300 mb-8">
                        Este proyecto está comprometido con la transparencia y la colaboración.
                        El código es completamente abierto y disponible para la comunidad.
                    </p>
                    <a
                        href="https://github.com/isacancor/MindfulnessApp"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-slate-100 transition-all"
                    >
                        <GitFork className="h-5 w-5 mr-2" />
                        Ver en GitHub
                    </a>
                </div>
            </section>

            {/* Contact Section */}
            <section className="py-20 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-800 mb-6">
                        ¿Tienes alguna pregunta?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8">
                        Puedes escribir a:
                    </p>
                    <p className="text-xl font-medium text-indigo-600">
                        mindfluenceresearch@gmail.com
                    </p>
                </div>
            </section>
        </div>
    );
};

export default About;