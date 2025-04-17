import { useEffect } from 'react';
import { LogOut, PlusCircle, UserCircle, FileText, BarChart2 } from 'lucide-react';

export default function AdminDashboard() {
    useEffect(() => {
        document.title = "Dashboard Admin - Mindfulness Research";
    }, []);

    return (
        <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-gray-800 shadow-md hidden md:flex flex-col p-6">
                <h2 className="text-2xl font-bold mb-10">Mindfulness Admin</h2>
                <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-300">
                    <a href="#" className="hover:text-indigo-600 flex items-center gap-2">
                        <BarChart2 size={18} /> Dashboard
                    </a>
                    <a href="#" className="hover:text-indigo-600 flex items-center gap-2">
                        <FileText size={18} /> Programas
                    </a>
                    <a href="#" className="hover:text-indigo-600 flex items-center gap-2">
                        <UserCircle size={18} /> Participantes
                    </a>
                    <a href="#" className="hover:text-indigo-600 flex items-center gap-2">
                        <PlusCircle size={18} /> Crear nuevo programa
                    </a>
                </nav>

                <div className="mt-auto pt-10 border-t border-gray-200 dark:border-gray-700">
                    <button className="flex items-center gap-2 text-sm hover:text-red-500">
                        <LogOut size={16} /> Cerrar sesión
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-6">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <div>
                        <h1 className="text-2xl font-semibold">Bienvenido/a, Investigador</h1>
                        <p className="text-gray-500 dark:text-gray-400 text-sm">Aquí puedes gestionar tus estudios.</p>
                    </div>
                    <UserCircle size={36} className="text-gray-600 dark:text-gray-300" />
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
                    {[
                        { label: 'Programas Activos', value: 5 },
                        { label: 'Participantes Registrados', value: 42 },
                        { label: 'Evaluaciones Completadas', value: 128 },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md">
                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{stat.label}</p>
                            <h3 className="text-3xl font-bold">{stat.value}</h3>
                        </div>
                    ))}
                </div>

                {/* Programas */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Tus Programas</h2>
                    <div className="space-y-4">
                        {['Mindfulness en educación secundaria', 'Reducción de estrés en oficina', 'Programa piloto MBCT'].map((program, i) => (
                            <div key={i} className="bg-gray-100 dark:bg-gray-800 p-4 rounded-xl flex justify-between items-center shadow-sm">
                                <div>
                                    <h3 className="text-lg font-medium">{program}</h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">12 participantes | 8 semanas</p>
                                </div>
                                <a
                                    href="#"
                                    className="text-indigo-600 hover:underline text-sm font-medium"
                                >
                                    Ver detalles →
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
