
import React, { useState } from 'react';
import { User, UserRole } from '../types';
import { clinicStore } from '../store';
import { STAFF_CREDENTIALS, DOCTOR_CREDENTIALS } from '../constants';

interface LoginPageProps {
  onLogin: (user: User) => void;
  onGoToRegister: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onGoToRegister }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Check Staff/Doctor Special Hardcoded Logins
    if (email === STAFF_CREDENTIALS.email && password === STAFF_CREDENTIALS.password) {
      const staffUser: User = { id: 'staff-1', username: 'staff', name: 'Clinical Staff', email, role: UserRole.STAFF };
      onLogin(staffUser);
      return;
    }
    if (email === DOCTOR_CREDENTIALS.email && password === DOCTOR_CREDENTIALS.password) {
      const doctorUser: User = { id: 'doc-admin-1', username: 'doctor', name: 'Head Doctor', email, role: UserRole.DOCTOR };
      onLogin(doctorUser);
      return;
    }

    const user = clinicStore.login(email, password);
    if (user) {
      onLogin(user);
    } else {
      setError('Invalid credentials or user not registered.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Q-Triage</h1>
          <p className="text-slate-500">Intelligent Patient Flow Optimizer</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          {error && <div className="p-3 bg-red-50 text-red-500 rounded-lg text-sm">{error}</div>}
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
            <input 
              type="email" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password" 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors shadow-lg shadow-blue-200"
          >
            Sign In
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-slate-500 text-sm">New patient?</p>
          <button 
            onClick={onGoToRegister}
            className="text-blue-600 font-semibold hover:underline mt-1"
          >
            Register your account
          </button>
        </div>

        <div className="mt-4 flex gap-2 justify-center">
            <button onClick={() => {setEmail(STAFF_CREDENTIALS.email); setPassword(STAFF_CREDENTIALS.password)}} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Staff Demo</button>
            <button onClick={() => {setEmail(DOCTOR_CREDENTIALS.email); setPassword(DOCTOR_CREDENTIALS.password)}} className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">Doctor Demo</button>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
