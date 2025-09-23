import React, { useState } from 'react';
import { Menu, Bell, User } from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motion, AnimatePresence } from 'framer-motion';

interface HeaderProps {
  onMenuClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { doctorProfile, appointments } = useStore();
  const [showProfilePopup, setShowProfilePopup] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString() && apt.status === 'scheduled';
  });

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-6 h-6 text-gray-600" />
          </button>
          
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Welcome Dr. {doctorProfile.name.split(' ').pop()}, making lives better today 💙
            </h1>
            <p className="text-sm text-gray-600">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Bell className="w-6 h-6 text-gray-600" />
              {todayAppointments.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  {todayAppointments.length}
                </span>
              )}
            </button>
            
            {/* Notifications Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-4 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Today's Appointments</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {todayAppointments.map(apt => (
                      <div key={apt.id} className="p-3 border-b border-gray-50 hover:bg-gray-50">
                        <p className="font-medium text-gray-800">{apt.patientName}</p>
                        <p className="text-sm text-gray-600">{apt.time} - {apt.duration} min</p>
                        <p className="text-xs text-gray-500">{apt.notes}</p>
                      </div>
                    ))}
                    {todayAppointments.length === 0 && (
                      <p className="p-4 text-gray-500 text-center">No appointments today</p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile */}
          <div className="relative">
            <button 
              onClick={() => setShowProfilePopup(!showProfilePopup)}
              className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium text-gray-800">{doctorProfile.name}</p>
                <p className="text-xs text-gray-600">{doctorProfile.specialization}</p>
              </div>
            </button>
            
            {/* Profile Popup */}
            <AnimatePresence>
              {showProfilePopup && (
                <motion.div
                  className="absolute right-0 top-12 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="p-6">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800">{doctorProfile.name}</h3>
                        <p className="text-sm text-gray-600">{doctorProfile.degree}</p>
                        <p className="text-sm text-gray-500">{doctorProfile.specialization}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium text-gray-700">Clinic:</span>
                        <p className="text-gray-600">{doctorProfile.clinicName}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Address:</span>
                        <p className="text-gray-600">{doctorProfile.clinicAddress}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Phone:</span>
                        <p className="text-gray-600">{doctorProfile.phone}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Email:</span>
                        <p className="text-gray-600">{doctorProfile.email}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Registration:</span>
                        <p className="text-gray-600">{doctorProfile.registrationNumber}</p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
      
      {/* Click outside to close popups */}
      {(showProfilePopup || showNotifications) && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => {
            setShowProfilePopup(false);
            setShowNotifications(false);
          }}
        />
      )}
    </header>
  );
};