
import React, { useState, useEffect } from 'react';
import { UserRole, User } from './types';
import { clinicStore } from './store';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PatientDashboard from './pages/PatientDashboard';
import StaffDashboard from './pages/StaffDashboard';
import DoctorDashboard from './pages/DoctorDashboard';

const App: React.FC = () => {
  const [view, setView] = useState<'LOGIN' | 'REGISTER' | 'DASHBOARD'>('LOGIN');
  const [user, setUser] = useState<User | null>(clinicStore.getCurrentUser());

  useEffect(() => {
    const u = clinicStore.getCurrentUser();
    if (u) {
      setUser(u);
      setView('DASHBOARD');
    }
  }, []);

  const handleLogin = (u: User) => {
    setUser(u);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    clinicStore.logout();
    setUser(null);
    setView('LOGIN');
  };

  const renderDashboard = () => {
    if (!user) return <LoginPage onLogin={handleLogin} onGoToRegister={() => setView('REGISTER')} />;
    
    switch (user.role) {
      case UserRole.PATIENT:
        return <PatientDashboard user={user} onLogout={handleLogout} />;
      case UserRole.STAFF:
        return <StaffDashboard user={user} onLogout={handleLogout} />;
      case UserRole.DOCTOR:
        return <DoctorDashboard user={user} onLogout={handleLogout} />;
      default:
        return <div>Error</div>;
    }
  };

  return (
    <div className="min-h-screen">
      {view === 'LOGIN' && <LoginPage onLogin={handleLogin} onGoToRegister={() => setView('REGISTER')} />}
      {view === 'REGISTER' && <RegisterPage onGoToLogin={() => setView('LOGIN')} />}
      {view === 'DASHBOARD' && renderDashboard()}
    </div>
  );
};

export default App;
