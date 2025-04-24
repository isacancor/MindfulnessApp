import { Routes, Route } from 'react-router-dom';
import { ROLES } from '@/config/auth';
import './main.css';
import { AuthProvider } from '@/context/AuthContext';
import Landing from './pages/Landing';
import InvestigadorDashboard from './pages/InvestigadorDashboard';
import ParticipanteDashboard from './pages/ParticipanteDashboard';
import PrivateRoute from './components/PrivateRoute';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RegisterInvestigador from '@/pages/auth/RegisterInvestigador';
import RegisterParticipante from '@/pages/auth/RegisterParticipante';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/register/investigador" element={<RegisterInvestigador />} />
        <Route path="/register/participante" element={<RegisterParticipante />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas para investigadores */}
        <Route element={<PrivateRoute roles={[ROLES.INVESTIGADOR]} />}>
          <Route path="/dashboard" element={<InvestigadorDashboard />} />

          {/* Gestión de programas */}
          <Route path="/programas" element={<div>Mis Programas</div>} />
          <Route path="/programas/crear" element={<div>Crear Programa</div>} />
          <Route path="/programas/:id" element={<div>Ver Detalle Programa</div>} />
          <Route path="/programas/:id/editar" element={<div>Editar Programa</div>} />

          {/** 
          <Route path="/programas/:id/analisis" element={<div>Análisis Programa</div>} />
          <Route path="/programas/:id/exportar" element={<div>Exportar Programa</div>} />
          */}

          {/* Gestión de sesiones */}
          <Route path="/programas/:id/sesiones/crear" element={<div>Crear Sesión</div>} />
          <Route path="/programas/:id/sesiones/:sesionId" element={<div>Detalle de Sesión</div>} />

          {/* Gestión de cuestionarios */}
          <Route path="/programas/:id/cuestionarios/crear" element={<div>Crear Cuestionario</div>} />
          <Route path="/programas/:id/cuestionarios/:cuestionarioId" element={<div>Detalle de Cuestionario</div>} />

          {/* Gestión de participantes */}
          <Route path="/programas/:id/participantes" element={<div>Gestión de Participantes</div>} />

          {/* Perfil de investigador */}
          <Route path="/perfil" element={<div>Mi Perfil</div>} />
        </Route>

        {/* Rutas protegidas para participantes */}
        <Route element={<PrivateRoute roles={[ROLES.PARTICIPANTE]} />}>
          <Route path="/home" element={<ParticipanteDashboard />} />
          <Route path="/programas" element={<div>Mis Programas</div>} />
          <Route path="/programas/activos" element={<div>Programas Activos</div>} />
          <Route path="/programas/:id" element={<div>Detalle Programa</div>} />
          <Route path="/programas/:id/:sesionId" element={<div>Realizar Sesión</div>} />
          <Route path="/programas/:id/:cuestionarioId" element={<div>Realizar Cuestionario</div>} />
          <Route path="/perfil" element={<div>Mi Perfil</div>} />
        </Route>

        {/* Rutas protegidas para admin */}
        {/** 
        <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/dashboard" element={<div>Panel Admin</div>} />
          <Route path="/admin/usuarios" element={<div>Gestión de Usuarios</div>} />
          <Route path="/admin/programas" element={<div>Gestión de Programas</div>} />
        </Route>
        */}
      </Routes>
    </AuthProvider>
  );
}

export default App;