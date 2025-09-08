import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Auth/Login';
import Dashboard from './pages/Admin/Dashboard';
import Payments from './pages/Admin/Payments';
import Apps from './pages/Admin/Apps';
import PaymentPage from './pages/Payment/PaymentPage';
import { useAppSelector } from './store/hooks';
import { JSX } from 'react';

function PrivateRoute({ children }: { children: JSX.Element }) {
  const { isAuthenticated } = useAppSelector(state => state.auth);
  return isAuthenticated ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/payment/:paymentId" element={<PaymentPage />} />
        <Route path="/admin" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/admin/payments" element={<PrivateRoute><Payments /></PrivateRoute>} />
        <Route path="/admin/apps" element={<PrivateRoute><Apps /></PrivateRoute>} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;