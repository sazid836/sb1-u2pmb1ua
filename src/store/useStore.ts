import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AppState, Patient, Prescription, Appointment, DoctorProfile } from '../types';
import { diagnoses } from '../data/medical-data';

interface StoreState extends AppState {
  // Authentication
  login: (pin: string) => boolean;
  logout: () => void;
  
  // Navigation
  setCurrentView: (view: string) => void;
  setSelectedPatient: (patient: Patient | null) => void;
  
  // Patient Management
  addPatient: (patient: Omit<Patient, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updatePatient: (id: string, updates: Partial<Patient>) => void;
  deletePatient: (id: string) => void;
  
  // Prescription Management
  updateCurrentPrescription: (updates: Partial<Prescription>) => void;
  savePrescription: (prescription: Omit<Prescription, 'id' | 'createdAt'>) => void;
  clearCurrentPrescription: () => void;
  
  // Appointment Management
  addAppointment: (appointment: Omit<Appointment, 'id'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  deleteAppointment: (id: string) => void;
  
  // Doctor Profile
  updateDoctorProfile: (updates: Partial<DoctorProfile>) => void;
  
  // Initialize with sample data
  initializeSampleData: () => void;
}

const defaultDoctorProfile: DoctorProfile = {
  name: 'Dr. MAHJABIN PRAPTY',
  degree: 'MBBS, MD',
  specialization: 'Internal Medicine',
  clinicName: 'Smart Clinic',
  clinicAddress: '123 Medical Street, Healthcare City',
  phone: '+1234567890',
  email: 'dr.prapty@smartclinic.com',
  registrationNumber: 'REG123456'
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial State
      isAuthenticated: false,
      currentView: 'splash',
      selectedPatient: null,
      currentPrescription: {},
      doctorProfile: defaultDoctorProfile,
      patients: [],
      prescriptions: [],
      appointments: [],

      // Authentication
      login: (pin: string) => {
        if (pin === '1234') { // Simple PIN authentication
          set({ isAuthenticated: true, currentView: 'dashboard' });
          return true;
        }
        return false;
      },

      logout: () => {
        set({ isAuthenticated: false, currentView: 'login', selectedPatient: null });
      },

      // Navigation
      setCurrentView: (view: string) => {
        set({ currentView: view });
      },

      setSelectedPatient: (patient: Patient | null) => {
        set({ selectedPatient: patient });
      },

      // Patient Management
      addPatient: (patientData) => {
        const newPatient: Patient = {
          ...patientData,
          id: Date.now().toString(),
          createdAt: new Date(),
          updatedAt: new Date()
        };
        set(state => ({
          patients: [...state.patients, newPatient]
        }));
      },

      updatePatient: (id: string, updates: Partial<Patient>) => {
        set(state => ({
          patients: state.patients.map(patient =>
            patient.id === id
              ? { ...patient, ...updates, updatedAt: new Date() }
              : patient
          )
        }));
      },

      deletePatient: (id: string) => {
        set(state => ({
          patients: state.patients.filter(patient => patient.id !== id),
          selectedPatient: state.selectedPatient?.id === id ? null : state.selectedPatient
        }));
      },

      // Prescription Management
      updateCurrentPrescription: (updates: Partial<Prescription>) => {
        set(state => ({
          currentPrescription: { ...state.currentPrescription, ...updates }
        }));
      },

      savePrescription: (prescriptionData) => {
        const newPrescription: Prescription = {
          ...prescriptionData,
          id: Date.now().toString(),
          createdAt: new Date()
        };
        set(state => ({
          prescriptions: [...state.prescriptions, newPrescription],
          currentPrescription: {}
        }));
      },

      clearCurrentPrescription: () => {
        set({ currentPrescription: {} });
      },

      // Appointment Management
      addAppointment: (appointmentData) => {
        const newAppointment: Appointment = {
          ...appointmentData,
          id: Date.now().toString()
        };
        set(state => ({
          appointments: [...state.appointments, newAppointment]
        }));
      },

      updateAppointment: (id: string, updates: Partial<Appointment>) => {
        set(state => ({
          appointments: state.appointments.map(appointment =>
            appointment.id === id
              ? { ...appointment, ...updates }
              : appointment
          )
        }));
      },

      deleteAppointment: (id: string) => {
        set(state => ({
          appointments: state.appointments.filter(appointment => appointment.id !== id)
        }));
      },

      // Doctor Profile
      updateDoctorProfile: (updates: Partial<DoctorProfile>) => {
        set(state => ({
          doctorProfile: { ...state.doctorProfile, ...updates }
        }));
      },

      // Initialize with sample data for demo
      initializeSampleData: () => {
        const samplePatients: Patient[] = [
          {
            id: '1',
            name: 'John Smith',
            age: 45,
            gender: 'Male',
            phone: '+1234567890',
            createdAt: new Date(),
            updatedAt: new Date()
          },
          {
            id: '2',
            name: 'Sarah Johnson',
            age: 32,
            gender: 'Female',
            phone: '+1234567891',
            createdAt: new Date(),
            updatedAt: new Date()
          }
        ];

        const samplePrescriptions: Prescription[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'John Smith',
            diagnosis: diagnoses[0],
            drugs: [
              {
                id: 'amlodipine',
                name: 'Amlodipine',
                genericName: 'Amlodipine Besylate',
                dosage: '5mg',
                frequency: 'Once daily',
                duration: '30 days',
                instructions: 'Take with or without food',
                category: 'Antihypertensive'
              }
            ],
            labTests: [
              {
                id: 'cbc',
                name: 'Complete Blood Count',
                description: 'Comprehensive blood analysis',
                normalRange: 'Various parameters',
                category: 'Hematology'
              }
            ],
            notes: 'Follow up in 2 weeks',
            createdAt: new Date(),
            doctorName: 'Dr. MAHJABIN PRAPTY'
          }
        ];

        const sampleAppointments: Appointment[] = [
          {
            id: '1',
            patientId: '1',
            patientName: 'John Smith',
            date: new Date(),
            time: '10:00',
            duration: 30,
            notes: 'Regular checkup',
            status: 'scheduled'
          },
          {
            id: '2',
            patientId: '2',
            patientName: 'Sarah Johnson',
            date: new Date(Date.now() + 24 * 60 * 60 * 1000),
            time: '14:00',
            duration: 45,
            notes: 'Follow-up consultation',
            status: 'scheduled'
          }
        ];
        set(state => ({
          patients: state.patients.length === 0 ? samplePatients : state.patients,
          prescriptions: state.prescriptions.length === 0 ? samplePrescriptions : state.prescriptions,
          appointments: state.appointments.length === 0 ? sampleAppointments : state.appointments
        }));
      }
    }),
    {
      name: 'smart-clinic-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        doctorProfile: state.doctorProfile,
        patients: state.patients,
        prescriptions: state.prescriptions,
        appointments: state.appointments
      })
    }
  )
);