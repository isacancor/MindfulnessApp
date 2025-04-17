import { Routes, Route } from 'react-router-dom';

import './main.css';
import { AuthProvider } from '@/context/AuthContext';
import Landing from './pages/Landing';
import AdminDashboard from './pages/AdminDashboard';
import PrivateRoute from './components/PrivateRoute';
import Login from '@/pages/Login';
import Register from '@/pages/Register';

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route element={<PrivateRoute />}>
          <Route path="/dashboard" element={<AdminDashboard />} />
        </Route>
      </Routes>
    </AuthProvider>
  );
}

export default App;