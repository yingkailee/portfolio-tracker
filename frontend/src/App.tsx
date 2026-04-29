import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Portfolios = lazy(() => import('./pages/Portfolios'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function Loading() {
  return <div style={{ padding: 20 }}>Loading...</div>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/portfolios" element={<Portfolios />} />
          <Route path="/calculator" element={<Calculator />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}