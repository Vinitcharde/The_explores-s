
import React, { useState } from 'react';
import { clinicStore } from '../store';

interface RegisterPageProps {
  onGoToLogin: () => void;
}

const RegisterPage: React.FC<RegisterPageProps> = ({ onGoToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    password: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    clinicStore.registerUser(formData);
    onGoToLogin();
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600 mb-2">Join Q-Triage</h1>
          <p className="text-slate-500">Quick registration for faster care</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input 
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email ID</label>
            <input 
              type="email"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input 
              type="password"
              required
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors mt-4"
          >
            Register Now
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-sm">
          <p className="text-slate-500">Already have an account?</p>
          <button 
            onClick={onGoToLogin}
            className="text-blue-600 font-semibold hover:underline mt-1"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
