import React from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  FileText, 
  Calendar, 
  Activity,
  TrendingUp,
  Clock,
  Heart,
  Coffee,
  Droplets,
  Plus,
  Eye
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { motivationalQuotes } from '../../data/medical-data';

export const Dashboard: React.FC = () => {
  const { patients, prescriptions, appointments, setCurrentView, setSelectedPatient } = useStore();
  
  const today = new Date();
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const thisWeekPrescriptions = prescriptions.filter(pres => {
    const presDate = new Date(pres.createdAt);
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    return presDate >= weekAgo;
  });

  const randomQuote = motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)];

  const stats = [
    {
      title: 'Total Patients',
      value: patients.length,
      icon: Users,
      color: 'bg-blue-500',
      change: '+12%'
    },
    {
      title: 'Today\'s Appointments',
      value: todayAppointments.length,
      icon: Calendar,
      color: 'bg-green-500',
      change: '+5%'
    },
    {
      title: 'Prescriptions (Week)',
      value: thisWeekPrescriptions.length,
      icon: FileText,
      color: 'bg-purple-500',
      change: '+8%'
    },
    {
      title: 'Active Cases',
      value: Math.floor(patients.length * 0.3),
      icon: Activity,
      color: 'bg-orange-500',
      change: '+3%'
    }
  ];

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) >= today && apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const recentPrescriptions = prescriptions
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const handleQuickAction = (action: string, patientId?: string) => {
    if (action === 'add-patient') {
      setSelectedPatient(null);
      setCurrentView('patient-form');
    } else if (action === 'add-appointment') {
      setCurrentView('calendar');
    } else if (action === 'diagnosis' && patientId) {
      const patient = patients.find(p => p.id === patientId);
      if (patient) {
        setSelectedPatient(patient);
        setCurrentView('diagnosis');
      }
    } else if (action === 'view-patients') {
      setCurrentView('patients');
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <motion.div
        className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 text-white relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Background decoration */}
        <div className="absolute top-0 right-0 opacity-10">
          <div className="text-8xl">🩺</div>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">Good {getTimeOfDay()}, Dr. Prapty! 👋</h2>
            <p className="text-blue-100 mb-4">Ready to make a difference today?</p>
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <Droplets className="w-4 h-4" />
                <span>Drink water 💧</span>
              </div>
              <div className="flex items-center space-x-1">
                <Coffee className="w-4 h-4" />
                <span>Take a break ☕</span>
              </div>
              <div className="flex items-center space-x-1">
                <Heart className="w-4 h-4" />
                <span>Stay healthy ❤️</span>
              </div>
            </div>
          </div>
          <div className="hidden md:flex space-x-2">
            <motion.button
              onClick={() => handleQuickAction('add-patient')}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Patient</span>
            </motion.button>
            <motion.button
              onClick={() => handleQuickAction('add-appointment')}
              className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -2, boxShadow: "0 10px 25px rgba(0,0,0,0.1)" }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className="flex items-center mt-2">
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                    <span className="text-sm text-green-600">{stat.change}</span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Quick Actions */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.button
            onClick={() => handleQuickAction('add-patient')}
            className="p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-blue-800">Add Patient</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleQuickAction('add-appointment')}
            className="p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Calendar className="w-8 h-8 text-green-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-green-800">Schedule</span>
          </motion.button>
          
          <motion.button
            onClick={() => setCurrentView('diagnosis')}
            className="p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Activity className="w-8 h-8 text-purple-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-purple-800">Diagnosis</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleQuickAction('view-patients')}
            className="p-4 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Eye className="w-8 h-8 text-orange-600 mx-auto mb-2" />
            <span className="text-sm font-medium text-orange-800">View All</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upcoming Appointments */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Upcoming Appointments</h3>
            <Calendar className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {upcomingAppointments.length > 0 ? (
              upcomingAppointments.map((appointment) => (
                <motion.div 
                  key={appointment.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setCurrentView('calendar')}
                >
                  <div>
                    <p className="font-medium text-gray-800">{appointment.patientName}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(appointment.date).toLocaleDateString()} at {appointment.time}
                    </p>
                  </div>
                  <div className="flex items-center text-sm text-gray-500">
                    <Clock className="w-4 h-4 mr-1" />
                    {appointment.duration}min
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No upcoming appointments</p>
                <motion.button
                  onClick={() => handleQuickAction('add-appointment')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Schedule Appointment
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>

        {/* Recent Prescriptions */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Recent Prescriptions</h3>
            <FileText className="w-5 h-5 text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentPrescriptions.length > 0 ? (
              recentPrescriptions.map((prescription) => (
                <motion.div 
                  key={prescription.id} 
                  className="flex items-center justify-between p-3 bg-gray-50 hover:bg-gray-100 rounded-lg cursor-pointer transition-colors"
                  whileHover={{ scale: 1.01 }}
                  onClick={() => setCurrentView('prescriptions')}
                >
                  <div>
                    <p className="font-medium text-gray-800">{prescription.patientName}</p>
                    <p className="text-sm text-gray-600">{prescription.diagnosis.name}</p>
                  </div>
                  <div className="text-sm text-gray-500">
                    {new Date(prescription.createdAt).toLocaleDateString()}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500 mb-4">No recent prescriptions</p>
                <motion.button
                  onClick={() => setCurrentView('diagnosis')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Start Diagnosis
                </motion.button>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Motivational Quote */}
      <motion.div
        className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl p-6 text-white"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
      >
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-3">Quote of the Day</h3>
          <p className="text-lg italic leading-relaxed">{randomQuote}</p>
        </div>
      </motion.div>
    </div>
  );
};

function getTimeOfDay(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Evening';
}