import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  X, 
  Search, 
  FileText, 
  Download,
  Printer,
  Share2,
  Save,
  User,
  Calendar,
  Stethoscope
} from 'lucide-react';
import { useStore } from '../../store/useStore';
import { commonDrugs, labTests } from '../../data/medical-data';
import { Drug, LabTest } from '../../types';

export const PrescriptionScreen: React.FC = () => {
  const { 
    currentPrescription, 
    updateCurrentPrescription, 
    savePrescription,
    doctorProfile,
    setCurrentView,
    patients,
    setSelectedPatient,
    clearCurrentPrescription
  } = useStore();

  const [selectedDrugs, setSelectedDrugs] = useState<Drug[]>([]);
  const [selectedTests, setSelectedTests] = useState<LabTest[]>([]);
  const [drugSearch, setDrugSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  const [notes, setNotes] = useState('');
  const [showDrugForm, setShowDrugForm] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState('');
  const [manualDiagnosis, setManualDiagnosis] = useState('');
  const [customDrug, setCustomDrug] = useState({
    name: '',
    genericName: '',
    dosage: '',
    frequency: '',
    duration: '',
    instructions: '',
    category: 'Other'
  });

  useEffect(() => {
    // Initialize with current prescription data
    if (currentPrescription.patientId) {
      setSelectedPatientId(currentPrescription.patientId);
    }
    if (currentPrescription.drugs) {
      setSelectedDrugs(currentPrescription.drugs);
    }
    if (currentPrescription.labTests) {
      setSelectedTests(currentPrescription.labTests);
    }
    if (currentPrescription.notes) {
      setNotes(currentPrescription.notes);
    }
    if (currentPrescription.diagnosis) {
      setManualDiagnosis(currentPrescription.diagnosis.name);
    }
  }, [currentPrescription]);

  // Auto-fill prescription based on diagnosis
  useEffect(() => {
    if (currentPrescription.diagnosis && selectedDrugs.length === 0) {
      // Auto-suggest drugs based on diagnosis
      const diagnosisName = currentPrescription.diagnosis.name.toLowerCase();
      let suggestedDrugs: Drug[] = [];
      
      if (diagnosisName.includes('hypertension')) {
        suggestedDrugs = commonDrugs.filter(drug => 
          drug.category === 'Antihypertensive'
        ).slice(0, 2);
      } else if (diagnosisName.includes('diabetes')) {
        suggestedDrugs = commonDrugs.filter(drug => 
          drug.category === 'Antidiabetic'
        ).slice(0, 2);
      } else if (diagnosisName.includes('respiratory') || diagnosisName.includes('cold')) {
        suggestedDrugs = commonDrugs.filter(drug => 
          drug.category === 'Antibiotic' || drug.category === 'Analgesic'
        ).slice(0, 2);
      } else if (diagnosisName.includes('gastritis')) {
        suggestedDrugs = commonDrugs.filter(drug => 
          drug.category === 'Proton Pump Inhibitor'
        ).slice(0, 1);
      }
      
      if (suggestedDrugs.length > 0) {
        setSelectedDrugs(suggestedDrugs);
        updateCurrentPrescription({ drugs: suggestedDrugs });
      }
    }
  }, [currentPrescription.diagnosis]);

  const handlePatientChange = (patientId: string) => {
    setSelectedPatientId(patientId);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      setSelectedPatient(patient);
      updateCurrentPrescription({
        patientId: patient.id,
        patientName: patient.name
      });
    }
  };

  const filteredDrugs = commonDrugs.filter(drug =>
    drug.name.toLowerCase().includes(drugSearch.toLowerCase()) ||
    drug.genericName.toLowerCase().includes(drugSearch.toLowerCase())
  );

  const filteredTests = labTests.filter(test =>
    test.name.toLowerCase().includes(testSearch.toLowerCase()) ||
    test.category.toLowerCase().includes(testSearch.toLowerCase())
  );

  const handleAddDrug = (drug: Drug) => {
    if (!selectedDrugs.find(d => d.id === drug.id)) {
      const newDrugs = [...selectedDrugs, drug];
      setSelectedDrugs(newDrugs);
      updateCurrentPrescription({ drugs: newDrugs });
    }
    setDrugSearch('');
  };

  const handleRemoveDrug = (drugId: string) => {
    const newDrugs = selectedDrugs.filter(d => d.id !== drugId);
    setSelectedDrugs(newDrugs);
    updateCurrentPrescription({ drugs: newDrugs });
  };

  const handleAddCustomDrug = () => {
    if (customDrug.name && customDrug.dosage) {
      const newDrug: Drug = {
        ...customDrug,
        id: Date.now().toString()
      };
      const newDrugs = [...selectedDrugs, newDrug];
      setSelectedDrugs(newDrugs);
      updateCurrentPrescription({ drugs: newDrugs });
      setCustomDrug({
        name: '',
        genericName: '',
        dosage: '',
        frequency: '',
        duration: '',
        instructions: '',
        category: 'Other'
      });
      setShowDrugForm(false);
    }
  };

  const handleAddTest = (test: LabTest) => {
    if (!selectedTests.find(t => t.id === test.id)) {
      const newTests = [...selectedTests, test];
      setSelectedTests(newTests);
      updateCurrentPrescription({ labTests: newTests });
    }
    setTestSearch('');
  };

  const handleRemoveTest = (testId: string) => {
    const newTests = selectedTests.filter(t => t.id !== testId);
    setSelectedTests(newTests);
    updateCurrentPrescription({ labTests: newTests });
  };

  const handleSavePrescription = () => {
    const patient = patients.find(p => p.id === selectedPatientId);
    const diagnosis = currentPrescription.diagnosis || {
      id: 'manual',
      code: 'MANUAL',
      name: manualDiagnosis || 'Clinical Diagnosis',
      description: 'Manually entered diagnosis',
      symptoms: []
    };

    if (patient && (currentPrescription.diagnosis || manualDiagnosis)) {
      savePrescription({
        patientId: patient.id,
        patientName: patient.name,
        diagnosis: diagnosis,
        drugs: selectedDrugs,
        labTests: selectedTests,
        notes: notes,
        doctorName: doctorProfile.name
      });
      alert('Prescription saved successfully!');
      clearCurrentPrescription();
      setCurrentView('prescriptions');
    } else {
      alert('Please select a patient and enter a diagnosis.');
    }
  };

  const generatePDF = () => {
    if (!selectedPatientId || (!currentPrescription.diagnosis && !manualDiagnosis)) {
      alert('Please select a patient and enter a diagnosis first.');
      return;
    }
    
    // Create prescription content
    const patient = patients.find(p => p.id === selectedPatientId);
    const diagnosis = currentPrescription.diagnosis || { name: manualDiagnosis };
    
    const prescriptionContent = `
${doctorProfile.clinicName}
${doctorProfile.clinicAddress}

Dr. ${doctorProfile.name}
${doctorProfile.degree}
${doctorProfile.specialization}
Registration: ${doctorProfile.registrationNumber}

Date: ${new Date().toLocaleDateString()}

Patient: ${patient?.name}
Age: ${patient?.age} years
Gender: ${patient?.gender}

Diagnosis: ${diagnosis.name}

Medications:
${selectedDrugs.map((drug, index) => 
  `${index + 1}. ${drug.name} (${drug.genericName})
     Dosage: ${drug.dosage}
     Frequency: ${drug.frequency}
     Duration: ${drug.duration}
     Instructions: ${drug.instructions}`
).join('\n\n')}

Lab Tests:
${selectedTests.map((test, index) => 
  `${index + 1}. ${test.name}`
).join('\n')}

Additional Notes:
${notes}

Doctor's Signature: ${doctorProfile.name}
    `;
    
    // Create and download as text file (in a real app, this would be PDF)
    const blob = new Blob([prescriptionContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `prescription_${patient?.name}_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Prescription Writer</h1>
          {selectedPatientId && (
            <p className="text-gray-600">
              Patient: {patients.find(p => p.id === selectedPatientId)?.name} 
              {currentPrescription.diagnosis && ` | Diagnosis: ${currentPrescription.diagnosis.name}`}
            </p>
          )}
        </div>
        <div className="flex space-x-2">
          <motion.button
            onClick={generatePDF}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Download className="w-4 h-4" />
            <span>PDF</span>
          </motion.button>
          <motion.button
            onClick={handleSavePrescription}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </motion.button>
        </div>
      </div>

      {/* Patient and Diagnosis Selection */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Patient & Diagnosis</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Patient *
            </label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <select
                value={selectedPatientId}
                onChange={(e) => handlePatientChange(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                required
              >
                <option value="">Choose a patient...</option>
                {patients.map(patient => (
                  <option key={patient.id} value={patient.id}>
                    {patient.name} - {patient.age} years, {patient.gender}
                  </option>
                ))}
              </select>
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Diagnosis
            </label>
            {currentPrescription.diagnosis ? (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium text-blue-800">{currentPrescription.diagnosis.name}</p>
                    <p className="text-sm text-blue-600">({currentPrescription.diagnosis.code})</p>
                  </div>
                </div>
              </div>
            ) : (
              <input
                type="text"
                value={manualDiagnosis}
                onChange={(e) => setManualDiagnosis(e.target.value)}
                placeholder="Enter diagnosis manually..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            )}
            {!currentPrescription.diagnosis && (
              <motion.button
                onClick={() => setCurrentView('diagnosis')}
                className="mt-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
                whileHover={{ scale: 1.02 }}
              >
                Or start from diagnosis screen →
              </motion.button>
            )}
          </div>
        </div>
        
        {/* Auto-filled notification */}
        {currentPrescription.diagnosis && selectedDrugs.length > 0 && (
          <motion.div
            className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p className="text-sm text-green-800">
              ✅ Prescription auto-filled based on diagnosis: <strong>{currentPrescription.diagnosis.name}</strong>
            </p>
          </motion.div>
        )}
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Drug Selection */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Medications</h2>
            <motion.button
              onClick={() => setShowDrugForm(true)}
              className="text-blue-600 hover:bg-blue-50 p-2 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Plus className="w-5 h-5" />
            </motion.button>
          </div>

          {/* Drug Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={drugSearch}
              onChange={(e) => setDrugSearch(e.target.value)}
              placeholder="Search medications..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Drug Suggestions */}
          {drugSearch && filteredDrugs.length > 0 && (
            <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredDrugs.slice(0, 5).map(drug => (
                <button
                  key={drug.id}
                  onClick={() => handleAddDrug(drug)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{drug.name}</div>
                  <div className="text-sm text-gray-600">{drug.genericName} - {drug.dosage}</div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Drugs */}
          <div className="space-y-3">
            {selectedDrugs.map(drug => (
              <motion.div
                key={drug.id}
                className="p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{drug.name}</h4>
                    <p className="text-sm text-gray-600">{drug.genericName}</p>
                    <div className="text-sm text-gray-700 mt-1">
                      <p><strong>Dosage:</strong> {drug.dosage}</p>
                      <p><strong>Frequency:</strong> {drug.frequency}</p>
                      <p><strong>Duration:</strong> {drug.duration}</p>
                      {drug.instructions && (
                        <p><strong>Instructions:</strong> {drug.instructions}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemoveDrug(drug.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Custom Drug Form */}
          {showDrugForm && (
            <motion.div
              className="mt-4 p-4 border border-gray-200 rounded-lg"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
            >
              <h3 className="font-medium text-gray-800 mb-3">Add Custom Medication</h3>
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Drug name"
                  value={customDrug.name}
                  onChange={(e) => setCustomDrug(prev => ({ ...prev, name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Dosage"
                    value={customDrug.dosage}
                    onChange={(e) => setCustomDrug(prev => ({ ...prev, dosage: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    placeholder="Frequency"
                    value={customDrug.frequency}
                    onChange={(e) => setCustomDrug(prev => ({ ...prev, frequency: e.target.value }))}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <input
                  type="text"
                  placeholder="Duration"
                  value={customDrug.duration}
                  onChange={(e) => setCustomDrug(prev => ({ ...prev, duration: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <textarea
                  placeholder="Instructions"
                  value={customDrug.instructions}
                  onChange={(e) => setCustomDrug(prev => ({ ...prev, instructions: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={2}
                />
                <div className="flex space-x-2">
                  <button
                    onClick={handleAddCustomDrug}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors"
                  >
                    Add Drug
                  </button>
                  <button
                    onClick={() => setShowDrugForm(false)}
                    className="bg-gray-300 text-gray-700 px-4 py-2 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </motion.div>

        {/* Lab Tests Selection */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Lab Tests</h2>

          {/* Test Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={testSearch}
              onChange={(e) => setTestSearch(e.target.value)}
              placeholder="Search lab tests..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Test Suggestions */}
          {testSearch && filteredTests.length > 0 && (
            <div className="mb-4 max-h-40 overflow-y-auto border border-gray-200 rounded-lg">
              {filteredTests.slice(0, 5).map(test => (
                <button
                  key={test.id}
                  onClick={() => handleAddTest(test)}
                  className="w-full text-left px-4 py-2 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                >
                  <div className="font-medium">{test.name}</div>
                  <div className="text-sm text-gray-600">{test.description}</div>
                </button>
              ))}
            </div>
          )}

          {/* Selected Tests */}
          <div className="space-y-3">
            {selectedTests.map(test => (
              <motion.div
                key={test.id}
                className="p-3 bg-gray-50 rounded-lg"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{test.name}</h4>
                    <p className="text-sm text-gray-600">{test.description}</p>
                    <p className="text-sm text-gray-500">Category: {test.category}</p>
                    {test.normalRange && (
                      <p className="text-sm text-gray-500">Normal Range: {test.normalRange}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleRemoveTest(test.id)}
                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Notes */}
      <motion.div
        className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-gray-800 mb-4">Additional Notes</h2>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes or instructions for the patient..."
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={4}
        />
      </motion.div>
    </div>
  );
};