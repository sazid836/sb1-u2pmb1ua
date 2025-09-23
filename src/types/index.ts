export interface Patient {
  id: string;
  name: string;
  age: number;
  gender: 'Male' | 'Female' | 'Other';
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Symptom {
  id: string;
  name: string;
  description: string;
}

export interface Diagnosis {
  id: string;
  code: string;
  name: string;
  description: string;
  symptoms: string[];
}

export interface Drug {
  id: string;
  name: string;
  genericName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
  category: string;
}

export interface LabTest {
  id: string;
  name: string;
  description: string;
  normalRange?: string;
  category: string;
}

export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  diagnosis: Diagnosis;
  drugs: Drug[];
  labTests: LabTest[];
  notes: string;
  createdAt: Date;
  doctorName: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  patientName: string;
  date: Date;
  time: string;
  duration: number;
  notes: string;
  status: 'scheduled' | 'completed' | 'cancelled';
}

export interface DoctorProfile {
  name: string;
  degree: string;
  specialization: string;
  clinicName: string;
  clinicAddress: string;
  phone: string;
  email: string;
  registrationNumber: string;
  signature?: string;
}

export interface AppState {
  isAuthenticated: boolean;
  currentView: string;
  selectedPatient: Patient | null;
  currentPrescription: Partial<Prescription>;
  doctorProfile: DoctorProfile;
  patients: Patient[];
  prescriptions: Prescription[];
  appointments: Appointment[];
}