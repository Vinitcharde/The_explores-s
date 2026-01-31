
import React, { useState, useMemo } from 'react';
import { User, Appointment, TriageLevel, MutationState } from '../types';
import { clinicStore } from '../store';
import { MOCK_DOCTORS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface DoctorDashboardProps {
  user: User;
  onLogout: () => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ user, onLogout }) => {
  const [mutation, setMutation] = useState<MutationState>(clinicStore.getMutation());
  const appointments = clinicStore.getAppointments();

  const handleMutationToggle = (key: keyof MutationState) => {
    const newVal = !mutation[key];
    const newMutation = { ...mutation, [key]: newVal };
    setMutation(newMutation);
    clinicStore.setMutation(newMutation);
  };

  // Analytics
  const stats = useMemo(() => {
    const total = appointments.length * (mutation.isVolumeDoubled ? 2 : 1);
    const critical = appointments.filter(a => a.triageLevel === TriageLevel.CRITICAL).length * (mutation.isVolumeDoubled ? 2 : 1);
    const intermediate = appointments.filter(a => a.triageLevel === TriageLevel.INTERMEDIATE).length * (mutation.isVolumeDoubled ? 2 : 1);
    const normal = total - critical - intermediate;
    
    // Capacity logic
    const baseStaff = 10;
    const activeStaff = mutation.isStaffShortage ? Math.floor(baseStaff * 0.6) : baseStaff;
    const capacityRatio = total / activeStaff;

    return { total, critical, intermediate, normal, activeStaff, capacityRatio };
  }, [appointments, mutation]);

  const pieData = [
    { name: 'Critical', value: stats.critical, color: '#ef4444' },
    { name: 'Intermediate', value: stats.intermediate, color: '#f97316' },
    { name: 'Normal', value: stats.normal, color: '#22c55e' },
  ];

  const barData = [
    { name: '09:00', load: 12 },
    { name: '10:00', load: 18 },
    { name: '11:00', load: 25 },
    { name: '12:00', load: 10 },
    { name: '13:00', load: 15 },
    { name: '14:00', load: 30 },
  ];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
             <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">Q</div>
             Command Center
          </h1>
          <p className="text-slate-400">Monitoring System Performance & Patient Triage</p>
        </div>
        <div className="flex gap-4">
           <div className="flex flex-col items-end mr-4 border-r pr-6 border-slate-700">
               <span className="text-xs text-slate-500 font-bold">CURRENT LOAD</span>
               <span className={`text-xl font-bold ${stats.capacityRatio > 5 ? 'text-red-500' : 'text-green-500'}`}>
                {stats.capacityRatio > 5 ? 'CRITICAL' : 'OPTIMAL'}
               </span>
           </div>
           <button onClick={onLogout} className="bg-slate-800 hover:bg-slate-700 px-6 py-2 rounded-xl font-bold transition-all border border-slate-700">Logout</button>
        </div>
      </div>

      {/* Mutation Controls (Mutation A & B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <button 
          onClick={() => handleMutationToggle('isVolumeDoubled')}
          className={`p-6 rounded-2xl border transition-all text-left flex justify-between items-center ${
            mutation.isVolumeDoubled ? 'bg-red-500/10 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.2)]' : 'bg-slate-800/50 border-slate-700'
          }`}
        >
          <div>
            <h3 className="font-black text-xl mb-1">Mutation A: Vol. Overload</h3>
            <p className="text-sm text-slate-400">Simulates patient volume doubling instantly.</p>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${mutation.isVolumeDoubled ? 'bg-red-500' : 'bg-slate-600'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${mutation.isVolumeDoubled ? 'left-7' : 'left-1'}`} />
          </div>
        </button>

        <button 
          onClick={() => handleMutationToggle('isStaffShortage')}
          className={`p-6 rounded-2xl border transition-all text-left flex justify-between items-center ${
            mutation.isStaffShortage ? 'bg-orange-500/10 border-orange-500 shadow-[0_0_20px_rgba(249,115,22,0.2)]' : 'bg-slate-800/50 border-slate-700'
          }`}
        >
          <div>
            <h3 className="font-black text-xl mb-1">Mutation B: Staff Drop</h3>
            <p className="text-sm text-slate-400">Simulates 40% reduction in staff availability.</p>
          </div>
          <div className={`w-12 h-6 rounded-full relative transition-colors ${mutation.isStaffShortage ? 'bg-orange-500' : 'bg-slate-600'}`}>
             <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${mutation.isStaffShortage ? 'left-7' : 'left-1'}`} />
          </div>
        </button>
      </div>

      {/* Alerts for Mutations */}
      {(mutation.isVolumeDoubled || mutation.isStaffShortage) && (
          <div className="bg-yellow-500/10 border border-yellow-500/50 p-4 rounded-xl mb-8 flex items-center gap-3 animate-pulse">
            <span className="text-2xl">⚠️</span>
            <div>
                <p className="font-bold text-yellow-500">SYSTEM ALERT: EMERGENCY RESOURCE REDEPLOYMENT</p>
                <p className="text-sm text-slate-300">Queue optimizer has shifted to "Maximum Throughput" mode. Triage scores weighted +20% for acute cases.</p>
            </div>
          </div>
      )}

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Total Patients</p>
           <p className="text-4xl font-black text-white">{stats.total}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Available Doctors</p>
           <p className="text-4xl font-black text-blue-500">{stats.activeStaff}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Critical Cases</p>
           <p className="text-4xl font-black text-red-500">{stats.critical}</p>
        </div>
        <div className="bg-slate-800 p-6 rounded-2xl border border-slate-700">
           <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Avg Wait Time</p>
           <p className="text-4xl font-black text-orange-400">{Math.round(stats.capacityRatio * 15)}m</p>
        </div>
      </div>

      {/* Analytics Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <h2 className="text-xl font-bold mb-8">Patient Severity Distribution</h2>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={pieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px', color: '#f1f5f9' }}
                  cursor={{ fill: 'transparent' }}
                />
                <Bar dataKey="value" radius={[10, 10, 0, 0]}>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-slate-800 rounded-3xl p-8 border border-slate-700 shadow-2xl">
          <h2 className="text-xl font-bold mb-8 text-center">Triage Breakdown</h2>
          <div className="h-[250px] mb-8">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={100} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="space-y-4">
             {pieData.map(item => (
                <div key={item.name} className="flex items-center justify-between text-sm">
                   <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{backgroundColor: item.color}}></div>
                      <span className="text-slate-400 font-medium">{item.name}</span>
                   </div>
                   <span className="font-bold">{item.value} patients</span>
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* Staff & Specialists List */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6">Staff & Specialist Directory</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {MOCK_DOCTORS.map(doc => (
             <div key={doc.id} className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
                <div className="flex justify-between items-start mb-4">
                   <div className="bg-blue-600/20 text-blue-400 text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded">On Duty</div>
                   <div className="text-yellow-500 font-bold">★ {doc.rating}</div>
                </div>
                <h3 className="text-lg font-bold text-white mb-1">{doc.name}</h3>
                <p className="text-blue-400 text-sm font-semibold mb-3">{doc.specialty}</p>
                <div className="grid grid-cols-2 gap-4 text-xs">
                   <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                      <p className="text-slate-500 mb-1">Experience</p>
                      <p className="font-bold">{doc.experience} Years</p>
                   </div>
                   <div className="bg-slate-900 p-3 rounded-xl border border-slate-700">
                      <p className="text-slate-500 mb-1">Education</p>
                      <p className="font-bold truncate" title={doc.education}>{doc.education.split('-')[0]}</p>
                   </div>
                </div>
             </div>
           ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;
