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
import Perfil from './pages/Perfil';
import CrearPrograma from './pages/programas/CrearPrograma';
import EditarPrograma from './pages/programas/EditarPrograma';
import ListaProgramas from './pages/programas/ListaProgramas';
import DetallePrograma from './pages/programas/DetallePrograma';
import ExplorarProgramas from './pages/programas/ExplorarProgramas';
import MiPrograma from './pages/programas/MiPrograma';
import CrearSesion from './pages/sesiones/CrearSesion';
import EditarSesion from './pages/sesiones/EditarSesion';
import HacerSesion from './pages/sesiones/HacerSesion';
import CrearCuestionario from './pages/cuestionarios/CrearCuestionario';
import EditarCuestionario from './pages/cuestionarios/EditarCuestionario';
import VistaPreviaCuestionario from './pages/cuestionarios/VistaPreviaCuestionario';

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

        <Route path="/perfil" element={<Perfil />} />

        {/* Rutas protegidas para investigadores */}
        <Route element={<PrivateRoute roles={[ROLES.INVESTIGADOR]} />}>
          <Route path="/dashboard" element={<InvestigadorDashboard />} />

          {/* Programas */}
          <Route path="/programas" element={<ListaProgramas />} />
          <Route path="/programas/crear" element={<CrearPrograma />} />
          <Route path="/programas/:id" element={<DetallePrograma />} />
          <Route path="/programas/:id/editar" element={<EditarPrograma />} />

          {/** 
          <Route path="/programas/:id/analisis" element={<div>Análisis Programa</div>} />
          <Route path="/programas/:id/exportar" element={<div>Exportar Programa</div>} />
          */}

          {/* Sesiones */}
          <Route path="/programas/:id/sesiones/nueva" element={<CrearSesion />} />
          <Route path="/programas/:id/sesiones/:sesionId/editar" element={<EditarSesion />} />

          {/* Cuestionarios */}
          <Route path="/programas/:id/cuestionario-pre/nuevo" element={<CrearCuestionario tipo="pre" />} />
          <Route path="/programas/:id/cuestionario-post/nuevo" element={<CrearCuestionario tipo="post" />} />
          <Route path="/programas/:id/cuestionarios/:cuestionarioId/editar" element={<EditarCuestionario />} />
          <Route path="/programas/:id/cuestionarios/:cuestionarioId" element={<VistaPreviaCuestionario />} />
        </Route>

        {/* Rutas protegidas para participantes */}
        <Route element={<PrivateRoute roles={[ROLES.PARTICIPANTE]} />}>
          <Route path="/home" element={<ParticipanteDashboard />} />
          <Route path="/explorar" element={<ExplorarProgramas />} />
          <Route path="/miprograma" element={<MiPrograma />} />
          <Route path="/miprograma/sesion/:sesionId" element={<HacerSesion />} />
          <Route path="/miprograma/cuestionario-pre" element={<div>Realizar Cuestionario Pre</div>} />
          <Route path="/miprograma/cuestionario-post" element={<div>Realizar Cuestionario Post</div>} />
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