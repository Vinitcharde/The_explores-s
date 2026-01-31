
import React, { useState, useEffect } from 'react';
import { User, Appointment, TriageLevel } from '../types';
import { clinicStore } from '../store';
import { MOCK_DOCTORS } from '../constants';
import { analyzeTriage } from '../services/geminiService';

interface PatientDashboardProps {
  user: User;
  onLogout: () => void;
}

const PatientDashboard: React.FC<PatientDashboardProps> = ({ user, onLogout }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(clinicStore.getAppointments());
  const [showForm, setShowForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    age: 25,
    gender: 'Male',
    phone: '',
    symptoms: '',
    urgency: 5,
    doctorId: MOCK_DOCTORS[0].id,
    timeSlot: '10:00'
  });

  const userApp = appointments.find(a => a.patientId === user.id);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const triageResult = await analyzeTriage(formData.symptoms, formData.urgency);

    const newApp = clinicStore.addAppointment({
      patientId: user.id,
      patientName: user.name,
      age: formData.age,
      gender: formData.gender,
      phone: formData.phone,
      symptoms: formData.symptoms,
      urgencyScale: formData.urgency,
      triageLevel: triageResult.level,
      triageScore: triageResult.score,
      timeSlot: formData.timeSlot,
      doctorId: formData.doctorId,
      isOffline: false
    });

    setAppointments(clinicStore.getAppointments());
    setLoading(false);
    setShowForm(false);
  };

  // Stats calculation
  const totalInQueue = appointments.length;
  const avgWaitTime = totalInQueue * 12; // 12 mins per patient baseline
  const myQueuePosition = userApp ? clinicStore.getSortedAppointments().findIndex(a => a.id === userApp.id) + 1 : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <nav className="bg-white border-b px-8 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-xl font-bold text-blue-600">Q-Triage Portal</h1>
        <div className="flex items-center gap-4">
          <span className="text-slate-600 font-medium">Hello, {user.name}</span>
          <button onClick={onLogout} className="text-sm text-red-500 hover:bg-red-50 px-3 py-1 rounded transition-colors">Logout</button>
        </div>
      </nav>

      <main className="p-8 max-w-6xl mx-auto space-y-8">
        {/* Global Clinic Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm">Total Patient Volume</p>
            <p className="text-3xl font-bold text-slate-800">{totalInQueue}</p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-sm">Estimated General Wait</p>
            <p className="text-3xl font-bold text-slate-800">{avgWaitTime} min</p>
          </div>
          <div className="bg-blue-600 p-6 rounded-xl shadow-sm border border-blue-600 text-white">
            <p className="text-blue-100 text-sm">Clinic Status</p>
            <p className="text-3xl font-bold">Optimizing</p>
          </div>
        </div>

        {userApp ? (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="bg-blue-600 p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">Your Appointment is Confirmed</h2>
                <p className="text-blue-100">Priority Score: {userApp.triageScore}/100</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-80 uppercase tracking-widest font-semibold">Current Queue Pos.</p>
                <p className="text-4xl font-bold">#{myQueuePosition}</p>
              </div>
            </div>
            <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h3 className="font-semibold text-slate-800 border-b pb-2">Details</h3>
                <div className="flex justify-between">
                  <span className="text-slate-500">Triage Level:</span>
                  <span className={`font-bold ${userApp.triageLevel === TriageLevel.CRITICAL ? 'text-red-500' : 'text-green-500'}`}>{userApp.triageLevel}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Time Slot:</span>
                  <span className="font-medium text-slate-800">{userApp.timeSlot}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Selected Doctor:</span>
                  <span className="font-medium text-slate-800">{MOCK_DOCTORS.find(d => d.id === userApp.doctorId)?.name}</span>
                </div>
              </div>
              <div className="bg-slate-50 p-6 rounded-xl border border-slate-100">
                <h4 className="font-semibold mb-2">Wait List Insights</h4>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Our algorithm prioritizes urgent cases. You are currently scheduled for your slot, 
                  but our AI is monitoring volume to adjust your entry time for minimum delay.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Book Your Appointment</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Age</label>
                  <input type="number" className="w-full border rounded-lg p-2" value={formData.age} onChange={e => setFormData({...formData, age: +e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Gender</label>
                  <select className="w-full border rounded-lg p-2" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                    <option>Male</option>
                    <option>Female</option>
                    <option>Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Phone Number</label>
                <input required className="w-full border rounded-lg p-2" placeholder="+1..." value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Symptoms (Describe briefly)</label>
                <textarea required className="w-full border rounded-lg p-2 h-24" placeholder="e.g. Sharp chest pain, dizziness..." value={formData.symptoms} onChange={e => setFormData({...formData, symptoms: e.target.value})}></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Urgency Scale (1-10)</label>
                <input type="range" min="1" max="10" className="w-full" value={formData.urgency} onChange={e => setFormData({...formData, urgency: +e.target.value})} />
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Mild</span>
                  <span>Extreme</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Doctor</label>
                  <select className="w-full border rounded-lg p-2" value={formData.doctorId} onChange={e => setFormData({...formData, doctorId: e.target.value})}>
                    {MOCK_DOCTORS.map(d => <option key={d.id} value={d.id}>{d.name} ({d.specialty})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Preferred Slot</label>
                  <select className="w-full border rounded-lg p-2" value={formData.timeSlot} onChange={e => setFormData({...formData, timeSlot: e.target.value})}>
                    <option>09:00</option>
                    <option>10:00</option>
                    <option>11:00</option>
                    <option>13:00</option>
                    <option>14:00</option>
                    <option>15:00</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit" 
                disabled={loading}
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg mt-6 flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
              >
                {loading ? 'Analyzing Triage...' : 'Confirm Registration'}
              </button>
            </form>
          </div>
        )}

        {/* Doctor Recommendations */}
        <div className="space-y-6">
          <h2 className="text-xl font-bold text-slate-800">Available Specialists for the Next 3 Days</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {MOCK_DOCTORS.map(doc => (
              <div key={doc.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold">
                    {doc.name.charAt(4)}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">{doc.name}</h3>
                    <p className="text-xs text-blue-600 font-semibold">{doc.specialty}</p>
                  </div>
                </div>
                <div className="text-sm space-y-2 mb-4">
                  <div className="flex justify-between"><span className="text-slate-500">Experience:</span> <span>{doc.experience} Years</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Rating:</span> <span className="text-yellow-500 font-bold">★ {doc.rating}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">Degree:</span> <span className="text-slate-700 truncate">{doc.education}</span></div>
                </div>
                <div className="border-t pt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase mb-2">Availability</p>
                  <div className="flex gap-2">
                    {Object.keys(doc.availability).slice(0, 3).map(date => (
                      <div key={date} className="flex-1 bg-slate-50 p-2 rounded text-center border">
                        <p className="text-[10px] font-bold text-slate-500">{new Date(date).toLocaleDateString(undefined, {weekday: 'short'})}</p>
                        <p className="text-[10px] text-green-600 font-bold">{doc.availability[date].length} Slots</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PatientDashboard;
