import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  User, 
  Phone, 
  Calendar,
  Filter,
  Stethoscope,
  FileText
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { Patient } from '../../types';

export const PatientList: React.FC = () => {
  const { patients, deletePatient, setCurrentView, setSelectedPatient, updateCurrentPrescription } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<string>('all');

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         patient.phone.includes(searchTerm);
    const matchesGender = filterGender === 'all' || patient.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  const handleEditPatient = (patient: Patient) => {
    setSelectedPatient(patient);
    setCurrentView('patient-form');
  };

  const handleDeletePatient = (patientId: string) => {
    if (window.confirm('Are you sure you want to delete this patient?')) {
      deletePatient(patientId);
    }
  };

  const handleAddNew = () => {
    setSelectedPatient(null);
    setCurrentView('patient-form');
  };

  const handleStartDiagnosis = (patient: Patient) => {
    setSelectedPatient(patient);
    updateCurrentPrescription({
      patientId: patient.id,
      patientName: patient.name
    });
    setCurrentView('diagnosis');
  };

  const handleWritePrescription = (patient: Patient) => {
    setSelectedPatient(patient);
    updateCurrentPrescription({
      patientId: patient.id,
      patientName: patient.name
    });
    setCurrentView('prescription');
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Patient Management</h1>
          <p className="text-gray-600 mt-1">Manage your patient records</p>
        </div>
        <motion.button
          onClick={handleAddNew}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center space-x-2 hover:bg-blue-700 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Plus className="w-5 h-5" />
          <span>Add Patient</span>
        </motion.button>
      </div>

      {/* Search and Filter */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search patients by name or phone..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={filterGender}
              onChange={(e) => setFilterGender(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
            >
              <option value="all">All Genders</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>
      </div>

      {/* Patient List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredPatients.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredPatients.map((patient, index) => (
              <motion.div
                key={patient.id}
                className="p-6 hover:bg-gray-50 transition-colors"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <User className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{patient.name}</h3>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span>{patient.age} years old</span>
                        <span>•</span>
                        <span>{patient.gender}</span>
                        <span>•</span>
                        <div className="flex items-center space-x-1">
                          <Phone className="w-4 h-4" />
                          <span>{patient.phone}</span>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-xs text-gray-500 mt-1">
                        <Calendar className="w-3 h-3" />
                        <span>Added {new Date(patient.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <motion.button
                      onClick={() => handleStartDiagnosis(patient)}
                      className="p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Start Diagnosis"
                    >
                      <Stethoscope className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleWritePrescription(patient)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Write Prescription"
                    >
                      <FileText className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleEditPatient(patient)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Edit Patient"
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDeletePatient(patient.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Delete Patient"
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No patients found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterGender !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'Get started by adding your first patient'
              }
            </p>
            {!searchTerm && filterGender === 'all' && (
              <motion.button
                onClick={handleAddNew}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Add Your First Patient
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Stats */}
      {patients.length > 0 && (
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-blue-600">{patients.length}</div>
            <div className="text-sm text-gray-600">Total Patients</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-green-600">
              {patients.filter(p => p.gender === 'Female').length}
            </div>
            <div className="text-sm text-gray-600">Female Patients</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
            <div className="text-2xl font-bold text-purple-600">
              {patients.filter(p => p.gender === 'Male').length}
            </div>
            <div className="text-sm text-gray-600">Male Patients</div>
          </div>
        </div>
      )}
    </div>
  );
};