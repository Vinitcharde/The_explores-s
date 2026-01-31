
import React, { useState } from 'react';
import { User, Appointment, TriageLevel } from '../types';
import { clinicStore } from '../store';
import { analyzeTriage } from '../services/geminiService';

interface StaffDashboardProps {
  user: User;
  onLogout: () => void;
}

const StaffDashboard: React.FC<StaffDashboardProps> = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(clinicStore.getAppointments());
  const [isAddingOffline, setIsAddingOffline] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '', age: 30, gender: 'Male', phone: '', symptoms: '', urgency: 5, timeSlot: 'ASAP'
  });

  const handleAddOffline = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const triage = await analyzeTriage(formData.symptoms, formData.urgency);
    clinicStore.addAppointment({
      patientId: 'offline-' + Math.random(),
      patientName: formData.name,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      symptoms: formData.symptoms,
      urgencyScale: formData.urgency,
      triageLevel: triage.level,
      triageScore: triage.score,
      timeSlot: formData.timeSlot,
      doctorId: 'doc1',
      isOffline: true
    });
    setAppointments(clinicStore.getAppointments());
    setLoading(false);
    setIsAddingOffline(false);
    setFormData({ name: '', age: 30, gender: 'Male', phone: '', symptoms: '', urgency: 5, timeSlot: 'ASAP' });
  };

  const sortedApps = clinicStore.getSortedAppointments();

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10 shadow-sm">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
            <span className="bg-blue-600 text-white p-1 rounded">Q</span> Staff Console
        </h1>
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsAddingOffline(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 shadow-md transition-all"
          >
            + Register Offline Patient
          </button>
          <button onClick={onLogout} className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded">Logout</button>
        </div>
      </nav>

      <main className="p-8 max-w-7xl mx-auto space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Total Managed</p>
            <p className="text-4xl font-black text-slate-800">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Wait List (Critical)</p>
            <p className="text-4xl font-black text-red-600">{appointments.filter(a => a.triageLevel === TriageLevel.CRITICAL).length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Wait List (Normal)</p>
            <p className="text-4xl font-black text-green-600">{appointments.filter(a => a.triageLevel === TriageLevel.NORMAL).length}</p>
          </div>
          <div className="bg-white p-6 rounded-xl border shadow-sm border-l-4 border-l-blue-600">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-2">Queue Efficiency</p>
            <p className="text-4xl font-black text-blue-600">94%</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
          <div className="p-6 border-b flex justify-between items-center bg-slate-50">
            <h2 className="font-bold text-slate-800 text-lg">Active Queue (Sorted by Triage Priority)</h2>
            <div className="text-sm text-slate-500">Live Updating • Last refresh 2s ago</div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white text-slate-500 text-xs font-bold uppercase">
                <tr>
                  <th className="px-6 py-4">Priority</th>
                  <th className="px-6 py-4">Patient</th>
                  <th className="px-6 py-4">Triage Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Symptoms</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {sortedApps.map((app, idx) => (
                  <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                    <td className="px-6 py-4 font-bold text-slate-400">#{idx + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{app.patientName}</div>
                      <div className="text-xs text-slate-500">{app.age}Y, {app.gender} • {app.isOffline ? 'Offline' : 'Online'}</div>
                    </td>
                    <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            <div className="h-2 w-16 bg-slate-100 rounded-full overflow-hidden">
                                <div className={`h-full ${app.triageScore > 80 ? 'bg-red-500' : app.triageScore > 50 ? 'bg-orange-500' : 'bg-green-500'}`} style={{width: `${app.triageScore}%`}}></div>
                            </div>
                            <span className="text-xs font-black">{app.triageScore}</span>
                        </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border ${
                        app.triageLevel === TriageLevel.CRITICAL ? 'bg-red-50 text-red-600 border-red-100' : 
                        app.triageLevel === TriageLevel.INTERMEDIATE ? 'bg-orange-50 text-orange-600 border-orange-100' : 
                        'bg-green-50 text-green-600 border-green-100'
                      }`}>
                        {app.triageLevel}
                      </span>
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate text-sm text-slate-600">
                      {app.symptoms}
                    </td>
                    <td className="px-6 py-4">
                        <button className="text-blue-600 font-bold text-xs hover:underline">Check In</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      {/* Modal for Offline Add */}
      {isAddingOffline && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold mb-6">Rapid Intake (Offline Patient)</h2>
            <form onSubmit={handleAddOffline} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <input required placeholder="Full Name" className="border p-2 rounded w-full" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                    <input type="number" placeholder="Age" className="border p-2 rounded w-full" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <select className="border p-2 rounded w-full" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                        <option>Male</option>
                        <option>Female</option>
                    </select>
                    <input placeholder="Phone" className="border p-2 rounded w-full" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
                </div>
                <textarea required placeholder="Brief symptoms..." className="border p-2 rounded w-full h-20" value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})} />
                <div>
                    <label className="text-xs font-bold text-slate-400">URGENCY (1-10)</label>
                    <input type="range" min="1" max="10" className="w-full" value={formData.urgency} onChange={e => setFormData({...formData, urgency: +e.target.value})} />
                </div>
                <div className="flex gap-4 pt-4">
                    <button type="button" onClick={() => setIsAddingOffline(false)} className="flex-1 text-slate-500 font-bold py-3">Cancel</button>
                    <button disabled={loading} type="submit" className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl">
                        {loading ? 'Analyzing...' : 'Add to Queue'}
                    </button>
                </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffDashboard;
