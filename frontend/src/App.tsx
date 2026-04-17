import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Portfolio from './pages/Portfolio';
import Calculator from './pages/Calculator';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/portfolio" replace />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/calculator" element={<Calculator />} />
      </Routes>
    </BrowserRouter>
  );
}
