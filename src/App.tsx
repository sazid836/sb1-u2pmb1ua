import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from './store/useStore';
import { SplashScreen } from './components/SplashScreen';
import { LoginScreen } from './components/Auth/LoginScreen';
import { Dashboard } from './components/Dashboard/Dashboard';
import { PatientList } from './components/Patients/PatientList';
import { PatientForm } from './components/Patients/PatientForm';
import { DiagnosisScreen } from './components/Diagnosis/DiagnosisScreen';
import { PrescriptionScreen } from './components/Prescription/PrescriptionScreen';
import { CalendarScreen } from './components/Calendar/CalendarScreen';
import { SettingsScreen } from './components/Settings/SettingsScreen';
import { PrescriptionHistoryScreen } from './components/Prescription/PrescriptionHistoryScreen';
import { Header } from './components/Layout/Header';
import { Sidebar } from './components/Layout/Sidebar';
import { useState, useEffect } from 'react';

function App() {
  const { currentView, isAuthenticated, setCurrentView, initializeSampleData } = useStore();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initialize sample data on first load
  useEffect(() => {
    initializeSampleData();
  }, [initializeSampleData]);

  const handleEnterApp = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'splash':
        return <SplashScreen onEnterApp={handleEnterApp} />;
      case 'login':
        return <LoginScreen />;
      case 'dashboard':
        return <Dashboard />;
      case 'patients':
        return <PatientList />;
      case 'patient-form':
        return <PatientForm />;
      case 'diagnosis':
        return <DiagnosisScreen />;
      case 'prescription':
        return <PrescriptionScreen />;
      case 'prescriptions':
        return <div className="p-6"><h1 className="text-2xl font-bold">Prescriptions</h1><p>Prescription history will be shown here.</p></div>;
      case 'calendar':
        return <CalendarScreen />;
      case 'settings':
        return <SettingsScreen />;
      default:
        return <Dashboard />;
    }
  };

  if (currentView === 'splash' || currentView === 'login') {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentView}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          {renderCurrentView()}
        </motion.div>
      </AnimatePresence>
    );
  }

  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header onMenuClick={() => setSidebarOpen(true)} />
        
        <main className="flex-1 overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="h-full"
            >
              {renderCurrentView()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default App;