
import { Doctor, UserRole } from './types';

export const MOCK_DOCTORS: Doctor[] = [
  {
    id: 'doc1',
    name: 'Dr. Sarah Wilson',
    specialty: 'General Physician',
    rating: 4.8,
    education: 'MD - Harvard Medical School',
    experience: 12,
    availability: {
      '2024-05-20': ['09:00', '10:00', '14:00'],
      '2024-05-21': ['11:00', '13:00', '15:00'],
      '2024-05-22': ['09:00', '16:00'],
    }
  },
  {
    id: 'doc2',
    name: 'Dr. James Chen',
    specialty: 'Emergency Specialist',
    rating: 4.9,
    education: 'MD - Johns Hopkins',
    experience: 15,
    availability: {
      '2024-05-20': ['08:00', '12:00'],
      '2024-05-21': ['09:00', '14:00', '17:00'],
      '2024-05-22': ['10:00', '11:00'],
    }
  },
  {
    id: 'doc3',
    name: 'Dr. Emily Blunt',
    specialty: 'Cardiologist',
    rating: 4.7,
    education: 'MD - Stanford University',
    experience: 10,
    availability: {
      '2024-05-20': ['10:30', '13:30'],
      '2024-05-21': ['08:30', '16:30'],
      '2024-05-22': ['12:30', '14:30'],
    }
  }
];

export const STAFF_CREDENTIALS = {
  email: 'staff@clinic.com',
  password: 'staffpassword'
};

export const DOCTOR_CREDENTIALS = {
  email: 'doctor@clinic.com',
  password: 'doctorpassword'
};
