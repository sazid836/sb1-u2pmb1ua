import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { 
  Plus, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Edit, 
  Trash2,
  X
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Appointment } from '../../types';

const localizer = momentLocalizer(moment);

export const CalendarScreen: React.FC = () => {
  const { 
    appointments, 
    patients, 
    addAppointment, 
    updateAppointment, 
    deleteAppointment 
  } = useStore();
  
  const [showModal, setShowModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [formData, setFormData] = useState({
    patientId: '',
    date: '',
    time: '',
    duration: 30,
    notes: ''
  });

  const calendarEvents = appointments.map(appointment => ({
    id: appointment.id,
    title: `${appointment.patientName} (${appointment.duration}min)`,
    start: new Date(`${appointment.date}T${appointment.time}`),
    end: new Date(new Date(`${appointment.date}T${appointment.time}`).getTime() + appointment.duration * 60000),
    resource: appointment
  }));

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const dateStr = start.toISOString().split('T')[0];
    const timeStr = start.toTimeString().slice(0, 5);
    
    setFormData({
      patientId: '',
      date: dateStr,
      time: timeStr,
      duration: 30,
      notes: ''
    });
    setSelectedAppointment(null);
    setShowModal(true);
  };

  const handleSelectEvent = ({ resource }: { resource: Appointment }) => {
    setSelectedAppointment(resource);
    setFormData({
      patientId: resource.patientId,
      date: new Date(resource.date).toISOString().split('T')[0],
      time: resource.time,
      duration: resource.duration,
      notes: resource.notes
    });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient = patients.find(p => p.id === formData.patientId);
    if (!patient) return;

    const appointmentData = {
      patientId: formData.patientId,
      patientName: patient.name,
      date: new Date(formData.date),
      time: formData.time,
      duration: formData.duration,
      notes: formData.notes,
      status: 'scheduled' as const
    };

    if (selectedAppointment) {
      updateAppointment(selectedAppointment.id, appointmentData);
    } else {
      addAppointment(appointmentData);
    }

    setShowModal(false);
    resetForm();
  };

  const handleDelete = () => {
    if (selectedAppointment && window.confirm('Are you sure you want to delete this appointment?')) {
      deleteAppointment(selectedAppointment.id);
      setShowModal(false);
      resetForm();
    }
  };

  const resetForm = () => {
    setFormData({
      patientId: '',
      date: '',
      time: '',
      duration: 30,
      notes: ''
    });
    setSelectedAppointment(null);
  };

  const closeModal = () => {
    setShowModal(false);
    resetForm();
  };

  const eventStyleGetter = (event: any) => {
    const appointment = event.resource as Appointment;
    let backgroundColor = '#3174ad';
    
    switch (appointment.status) {
      case 'completed':
        backgroundColor = '#10b981';
        break;
      case 'cancelled':
        backgroundColor = '#ef4444';
        break;
      default:
        backgroundColor = '#3174ad';
    }

    return {
      style: {
        backgroundColor,
        borderRadius: '4px',
        opacity: 0.8,
        color: 'white',
        border: '0px',
        display: 'block'
      }
    };
  };

  const todayAppointments = appointments.filter(apt => {
    const today = new Date();
    const aptDate = new Date(apt.date);
    return aptDate.toDateString() === today.toDateString();
  });

  const upcomingAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date() && apt.status === 'scheduled')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Calendar & Appointments</h1>
          <p className="text-gray-600">Manage your schedule and appointments</p>
        </div>
        <motion.button
          onClick={() => {
            const now = new Date();
            setFormData({
              patientId: '',
              date: now.toISOString().split('T')[0],
              time: now.toTimeString().slice(0, 5),
              duration: 30,
              notes: ''
            });
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          <span>New Appointment</span>
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <CalendarIcon className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{todayAppointments.length}</div>
              <div className="text-sm text-gray-600">Today's Appointments</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{upcomingAppointments.length}</div>
              <div className="text-sm text-gray-600">Upcoming</div>
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-800">{appointments.length}</div>
              <div className="text-sm text-gray-600">Total Appointments</div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendar */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div style={{ height: '600px' }}>
          <Calendar
            localizer={localizer}
            events={calendarEvents}
            startAccessor="start"
            endAccessor="end"
            onSelectSlot={handleSelectSlot}
            onSelectEvent={handleSelectEvent}
            selectable
            eventPropGetter={eventStyleGetter}
            views={['month', 'week', 'day']}
            defaultView="week"
            step={15}
            timeslots={4}
            min={new Date(0, 0, 0, 8, 0, 0)}
            max={new Date(0, 0, 0, 20, 0, 0)}
          />
        </div>
      </motion.div>

      {/* Appointment Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-xl p-6 w-full max-w-md"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800">
                {selectedAppointment ? 'Edit Appointment' : 'New Appointment'}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Patient
                </label>
                <select
                  value={formData.patientId}
                  onChange={(e) => setFormData(prev => ({ ...prev, patientId: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Select a patient...</option>
                  {patients.map(patient => (
                    <option key={patient.id} value={patient.id}>
                      {patient.name} - {patient.age} years
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Time
                  </label>
                  <input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Duration (minutes)
                </label>
                <select
                  value={formData.duration}
                  onChange={(e) => setFormData(prev => ({ ...prev, duration: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={45}>45 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={90}>1.5 hours</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Notes
                </label>
                <textarea
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={3}
                  placeholder="Additional notes..."
                />
              </div>

              <div className="flex justify-between pt-4">
                <div>
                  {selectedAppointment && (
                    <motion.button
                      type="button"
                      onClick={handleDelete}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Trash2 className="w-4 h-4" />
                      <span>Delete</span>
                    </motion.button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <motion.button
                    type="submit"
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {selectedAppointment ? 'Update' : 'Create'}
                  </motion.button>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};