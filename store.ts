
import { Appointment, User, UserRole, MutationState, TriageLevel } from './types';

class Store {
  private users: User[] = [];
  private appointments: Appointment[] = [];
  private currentUser: User | null = null;
  private mutation: MutationState = { isVolumeDoubled: false, isStaffShortage: false };

  constructor() {
    const savedUsers = localStorage.getItem('clinic_users');
    const savedApps = localStorage.getItem('clinic_appointments');
    if (savedUsers) this.users = JSON.parse(savedUsers);
    if (savedApps) this.appointments = JSON.parse(savedApps);
  }

  save() {
    localStorage.setItem('clinic_users', JSON.stringify(this.users));
    localStorage.setItem('clinic_appointments', JSON.stringify(this.appointments));
  }

  registerUser(user: Omit<User, 'id' | 'role'>): User {
    const newUser: User = { ...user, id: Math.random().toString(36).substr(2, 9), role: UserRole.PATIENT };
    this.users.push(newUser);
    this.save();
    return newUser;
  }

  login(email: string, password?: string): User | null {
    const user = this.users.find(u => u.email === email);
    if (user) {
      this.currentUser = user;
      return user;
    }
    return null;
  }

  addAppointment(app: Omit<Appointment, 'id' | 'registeredAt'>): Appointment {
    const newApp: Appointment = {
      ...app,
      id: Math.random().toString(36).substr(2, 9),
      registeredAt: new Date().toISOString()
    };
    this.appointments.push(newApp);
    this.save();
    return newApp;
  }

  removeAppointment(id: string) {
    this.appointments = this.appointments.filter(app => app.id !== id);
    this.save();
  }

  getAppointments() {
    return this.appointments;
  }

  getSortedAppointments() {
    const weights = {
      [TriageLevel.EMERGENCY]: 4,
      [TriageLevel.CRITICAL]: 3,
      [TriageLevel.INTERMEDIATE]: 2,
      [TriageLevel.NORMAL]: 1,
    };

    return [...this.appointments].sort((a, b) => {
      // Primary sort: Triage Level weight
      const weightA = weights[a.triageLevel] || 0;
      const weightB = weights[b.triageLevel] || 0;
      
      if (weightB !== weightA) {
        return weightB - weightA;
      }
      
      // Secondary sort: Triage Score (granular AI score)
      if (b.triageScore !== a.triageScore) {
        return b.triageScore - a.triageScore;
      }

      // Tertiary sort: Arrival Time
      return new Date(a.registeredAt).getTime() - new Date(b.registeredAt).getTime();
    });
  }

  getCurrentUser() { return this.currentUser; }
  logout() { this.currentUser = null; }

  setMutation(m: Partial<MutationState>) {
    this.mutation = { ...this.mutation, ...m };
  }
  getMutation() { return this.mutation; }
}

export const clinicStore = new Store();
