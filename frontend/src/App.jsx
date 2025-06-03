import { Routes, Route, Navigate } from 'react-router-dom';
import { ROLES } from '@/config/auth';
import './main.css';
import { AuthProvider } from '@/context/AuthContext';
import Landing from './pages/Landing';
import InvestigadorDashboard from './pages/investigador/InvestigadorDashboard';
import ParticipanteDashboard from './pages/participante/ParticipanteDashboard';
import PrivateRoute from './components/PrivateRoute';
import { SesionProtectedRoute, CuestionarioPostProtectedRoute } from './components/ProtectedRoutes';
import Login from '@/pages/auth/Login';
import Register from '@/pages/auth/Register';
import RegisterInvestigador from '@/pages/auth/RegisterInvestigador';
import RegisterParticipante from '@/pages/auth/RegisterParticipante';
import Unauthorized from './pages/Unauthorized';
import Perfil from './pages/Perfil';
import CrearPrograma from './pages/investigador/programas/CrearPrograma';
import EditarPrograma from './pages/investigador/programas/EditarPrograma';
import ListaProgramas from './pages/investigador/programas/ListaProgramas';
import DetallePrograma from './pages/investigador/programas/DetallePrograma';
import ExplorarProgramas from './pages/participante/programas/ExplorarProgramas';
import MiPrograma from './pages/participante/programas/MiPrograma';
import CrearSesion from './pages/investigador/sesiones/CrearSesion';
import EditarSesion from './pages/investigador/sesiones/EditarSesion';
import HacerSesion from './pages/participante/HacerSesion';
import CrearCuestionario from './pages/investigador/cuestionarios/CrearCuestionario';
import EditarCuestionario from './pages/investigador/cuestionarios/EditarCuestionario';
import VistaPreviaCuestionario from './pages/investigador/cuestionarios/VistaPreviaCuestionario';
import ResponderCuestionario from './pages/participante/ResponderCuestionario';
import ProgramasCompletados from './pages/participante/programas/completados/PCompletados';
import ProgramaCompletado from './pages/participante/programas/completados/PDetalleCompletado';
import ListadoParticipantes from './pages/investigador/ListadoParticipantes';

import Analisis from './pages/investigador/Analisis';
import ExportarDatos from './pages/investigador/ExportarDatos';
import TerminosPrograma from './pages/TerminosPrograma';

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
        <Route path="/terminos-programa" element={<TerminosPrograma />} />

        <Route path="/perfil" element={<Perfil />} />

        {/* Rutas protegidas para investigadores */}
        <Route element={<PrivateRoute roles={[ROLES.INVESTIGADOR]} />}>
          <Route path="/dashboard" element={<InvestigadorDashboard />} />

          {/* Programas */}
          <Route path="/programas" element={<ListaProgramas />} />
          <Route path="/programas/crear" element={<CrearPrograma />} />
          <Route path="/programas/:id" element={<DetallePrograma />} />
          <Route path="/programas/:id/participantes" element={<ListadoParticipantes />} />
          <Route path="/programas/:id/editar" element={<EditarPrograma />} />

          {/* Análisis y Exportación */}
          <Route path="/analisis" element={<Analisis />} />
          <Route path="/exportar" element={<ExportarDatos />} />

          {/* Sesiones */}
          <Route path="/programas/:id/sesiones/nueva" element={<CrearSesion />} />
          <Route path="/programas/:id/sesiones/:sesionId/editar" element={<EditarSesion />} />

          {/* Cuestionarios */}
          <Route path="/programas/:id/cuestionario-pre/nuevo" element={<CrearCuestionario tipo="pre" />} />
          <Route path="/programas/:id/cuestionario-post/nuevo" element={<CrearCuestionario tipo="post" />} />
          <Route path="/programas/:id/cuestionarios/:cuestionarioId/editar" element={<EditarCuestionario />} />
          <Route path="/programas/:id/cuestionarios/:cuestionarioId" element={<VistaPreviaCuestionario />} />
        </Route>

        {/****************************************************************************/}
        {/* Rutas protegidas para participantes */}
        <Route element={<PrivateRoute roles={[ROLES.PARTICIPANTE]} />}>
          <Route path="/home" element={<ParticipanteDashboard />} />
          <Route path="/explorar" element={<ExplorarProgramas />} />
          <Route path="/miprograma" element={<MiPrograma />} />

          {/* Proteger ruta de sesiones */}
          <Route path="/miprograma/sesion/:sesionId" element={
            <SesionProtectedRoute>
              <HacerSesion completado={false} />
            </SesionProtectedRoute>
          } />

          <Route path="/miprograma/cuestionario-pre" element={<ResponderCuestionario tipo="pre" />} />

          {/* Proteger ruta de cuestionario post */}
          <Route path="/miprograma/cuestionario-post" element={
            <CuestionarioPostProtectedRoute>
              <ResponderCuestionario tipo="post" />
            </CuestionarioPostProtectedRoute>
          } />

          <Route path="/completados" element={<ProgramasCompletados />} />
          <Route path="/completados/:id" element={<ProgramaCompletado />} />
          <Route path="/completados/:programaId/sesion/:sesionId" element={<HacerSesion completado={true} />} />
        </Route>

        {/* Rutas protegidas para admin */}
        {/** 
        <Route element={<PrivateRoute roles={[ROLES.ADMIN]} />}>
          <Route path="/dashboard" element={<div>Panel Admin</div>} />
          <Route path="/admin/usuarios" element={<div>Gestión de Usuarios</div>} />
          <Route path="/admin/programas" element={<div>Gestión de Programas</div>} />
        </Route>
        */}

        {/* Ruta comodín para manejar rutas no existentes */}
        <Route path="*" element={<Navigate to="/unauthorized" replace />} />

      </Routes>
    </AuthProvider>
  );
}

export default App;