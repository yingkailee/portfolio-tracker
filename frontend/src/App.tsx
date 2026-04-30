import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './styles.css';
import Layout from './components/Layout';

const Portfolio = lazy(() => import('./pages/Portfolio'));
const Portfolios = lazy(() => import('./pages/Portfolios'));
const Calculator = lazy(() => import('./pages/Calculator'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));

function Loading() {
  return <div style={{ padding: 20 }}>Loading...</div>;
}

function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <Layout>
      {children}
    </Layout>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<Loading />}>
        <Routes>
          <Route path="/" element={<Navigate to="/portfolio" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/portfolio" element={<MainLayout><Portfolio /></MainLayout>} />
          <Route path="/portfolios" element={<MainLayout><Portfolios /></MainLayout>} />
          <Route path="/calculator" element={<MainLayout><Calculator /></MainLayout>} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}