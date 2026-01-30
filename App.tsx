import React from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Layout } from './components/Layout';
import { LoadingHatch } from './components/LoadingHatch';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Admin } from './pages/Admin';
import { Exam } from './pages/Exam';
import { IntelReport } from './pages/IntelReport';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { session, isLoading } = useAuth();
  if (isLoading) return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <LoadingHatch size="40" />
    </div>
  );
  if (!session) return <Navigate to="/login" />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { session } = useAuth();

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="login" element={!session ? <Login /> : <Navigate to="/admin" />} />
        <Route path="register" element={!session ? <Register /> : <Navigate to="/admin" />} />
        <Route path="exam" element={<Exam />} />

        {/* Protected Routes */}
        <Route path="admin" element={<ProtectedRoute><Admin /></ProtectedRoute>} />
        <Route path="intel-report" element={<ProtectedRoute><IntelReport /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Route>
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <HashRouter>
        <AppRoutes />
      </HashRouter>
    </AuthProvider>
  );
};

export default App;