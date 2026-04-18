import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Calculator from './pages/Calculator';
import Login from './pages/Login';

function PrivateRoute({ children }: { children: React.ReactNode }) {
  return localStorage.getItem('credentials') ? <>{children}</> : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/portfolio" element={<PrivateRoute><Portfolio /></PrivateRoute>} />
        <Route path="/calculator" element={<PrivateRoute><Calculator /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}
