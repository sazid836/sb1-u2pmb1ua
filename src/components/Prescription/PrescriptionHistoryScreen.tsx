import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Search, 
  Calendar, 
  User, 
  Download,
  Eye,
  Filter,
  Pill,
  TestTube
} from 'lucide-react';
import { useStore } from '../../store/useStore';

export const PrescriptionHistoryScreen: React.FC = () => {
  const { prescriptions } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<string | null>(null);

  const filteredPrescriptions = prescriptions.filter(prescription =>
    prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewPrescription = (prescriptionId: string) => {
    setSelectedPrescription(selectedPrescription === prescriptionId ? null : prescriptionId);
  };

  const handleDownloadPrescription = (prescription: any) => {
    const prescriptionContent = `
PRESCRIPTION

Clinic: Smart Clinic
Doctor: ${prescription.doctorName}
Date: ${new Date(prescription.createdAt).toLocaleDateString()}

Patient: ${prescription.patientName}
Diagnosis: ${prescription.diagnosis.name} (${prescription.diagnosis.code})

MEDICATIONS:
${prescription.drugs.map((drug: any, index: number) => 
  `${index + 1}. ${drug.name} (${drug.genericName})
     Dosage: ${drug.dosage}
     Frequency: ${drug.frequency}
     Duration: ${drug.duration}
     Instructions: ${drug.instructions}`
).join('\n\n')}

LAB TESTS:
${prescription.labTests.map((test: any, index: number) => 
  `${index + 1}. ${test.name} - ${test.description}`
).join('\n')}

NOTES:
${prescription.notes || 'No additional notes'}

Doctor's Signature: ${prescription.doctorName}
    `;
    
    const blob = new Blob([prescriptionContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${prescription.patientName}_${new Date(prescription.createdAt).toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Prescription History</h1>
        <p className="text-gray-600 mt-1">View and manage all prescriptions</p>
      </div>

      {/* Search and Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search prescriptions by patient, diagnosis, or doctor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-blue-600">{prescriptions.length}</div>
          <div className="text-sm text-gray-600">Total Prescriptions</div>
        </div>
        
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-100">
          <div className="text-2xl font-bold text-green-600">
            {prescriptions.filter(p => {
              const today = new Date();
              const presDate = new Date(p.createdAt);
              return presDate.toDateString() === today.toDateString();
            }).length}
          </div>
          <div className="text-sm text-gray-600">Today's Prescriptions</div>
        </div>
      </div>

      {/* Prescriptions List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100">
        {filteredPrescriptions.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredPrescriptions.map((prescription, index) => (
              <motion.div
                key={prescription.id}
                className="p-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800">{prescription.patientName}</h3>
                        <p className="text-sm text-gray-600">{prescription.diagnosis.name}</p>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-3">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(prescription.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Pill className="w-4 h-4" />
                        <span>{prescription.drugs.length} medications</span>
                      </div>
                      <div className="flex items-center space-x-2">
                            {drug.instructions && (
                              <p className="text-gray-500 italic">{drug.instructions}</p>
                            )}
                        <TestTube className="w-4 h-4" />
                        <span>{prescription.labTests.length} lab tests</span>
                        {prescription.drugs.length === 0 && (
                          <p className="text-sm text-gray-500">No medications prescribed</p>
                        )}
                      </div>
                    </div>

                    {/* Expanded Details */}
                    {selectedPrescription === prescription.id && (
                      <motion.div
                        className="mt-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Medications */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Medications:</h4>
                            <div className="space-y-2">
                              {prescription.drugs.map((drug, drugIndex) => (
                                <div key={drugIndex} className="text-sm">
                                  <p className="font-medium">{drug.name}</p>
                                  <p className="text-gray-600">{drug.dosage} - {drug.frequency}</p>
                                  <p className="text-gray-500">{drug.duration}</p>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Lab Tests */}
                          <div>
                            <h4 className="font-medium text-gray-800 mb-2">Lab Tests:</h4>
                            <div className="space-y-1">
                              {prescription.labTests.map((test, testIndex) => (
                                <p key={testIndex} className="text-sm text-gray-600">{test.name}</p>
                              ))}
                            </div>
                          </div>
                          {prescription.labTests.length === 0 && (
                            <p className="text-sm text-gray-500">No lab tests ordered</p>
                          )}
                        </div>

                        {prescription.notes && (
                          <div className="mt-4">
                            <h4 className="font-medium text-gray-800 mb-2">Notes:</h4>
                            <p className="text-sm text-gray-600">{prescription.notes}</p>
                          </div>
                        )}
                      </motion.div>
                    )}
                    
                    {/* Doctor Info */}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-sm font-medium text-gray-800">Prescribed by:</p>
                          <p className="text-sm text-gray-600">{prescription.doctorName}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-800">Date:</p>
                          <p className="text-sm text-gray-600">
                            {new Date(prescription.createdAt).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 ml-4">
                    <motion.button
                      onClick={() => handleViewPrescription(prescription.id)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="View Details"
                    >
                      <Eye className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={() => handleDownloadPrescription(prescription)}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      title="Download"
                    >
                      <Download className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-12 text-center">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">No prescriptions found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm 
                ? 'Try adjusting your search criteria'
                : 'Start creating prescriptions to see them here'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};